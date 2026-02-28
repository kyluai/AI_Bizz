// ============================================
// BOOKING FLOW — Schema-driven conversational engine
//
// Reads from window.BookingSchema (booking-schema.js) to drive
// every step.  Adding / removing a field from BookingSchema
// automatically updates the chatbot flow — no changes needed here.
//
// Exposes: window.BookingFlow.create(opts)
//          window.BookingFlow.detectIntent(message)
// ============================================

(function (window) {
    'use strict';

    // ---- Booking intent keywords ----
    var INTENT_KEYWORDS = [
        'book', 'schedule', 'appointment', 'consultation',
        'demo', 'availability', 'available', 'meeting',
        'call with', 'speak with', 'talk to', 'sign up',
        'get started', 'check availability', 'reserve',
        'set up a time', 'free call', 'free session'
    ];

    function detectIntent(message) {
        if (!message) return false;
        var lower = message.toLowerCase();
        return INTENT_KEYWORDS.some(function (kw) {
            return lower.indexOf(kw) !== -1;
        });
    }

    // ---------------------------------------------------------------
    // Helper: format an ISO date string to a readable display string
    // ---------------------------------------------------------------
    function formatDateDisplay(iso) {
        try {
            var p  = iso.split('-');
            var d  = new Date(+p[0], +p[1] - 1, +p[2]);
            var dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return dn[d.getDay()] + ', ' + mn[d.getMonth()] + ' ' + d.getDate();
        } catch (e) {
            return iso;
        }
    }

    /**
     * Create a booking flow instance.
     *
     * opts = {
     *   addBotMessage(text, extras)
     *       extras: { quickReplies: string[] }
     *
     *   addCalendarPicker(onDateTimeSelected)
     *       onDateTimeSelected(dateISO, timeLabel, timeValue)
     *
     *   addMultiSelectPicker(options, skipLabel, onSelected)
     *       onSelected(selectedArray)
     *
     *   addConfirmCard(data)
     *
     *   onConfirmed(data)   — optional; called after confirm() resets state
     * }
     */
    function create(opts) {
        var fieldIndex = 0;
        var data       = {};
        var active     = false;
        var step       = null;

        // ---- Access schema at call-time so any future changes are picked up ----
        function getFields() {
            return (window.BookingSchema && Array.isArray(window.BookingSchema.fields))
                ? window.BookingSchema.fields
                : [];
        }

        function currentField() {
            return getFields()[fieldIndex] || null;
        }

        // ---- Start ----
        function start(context) {
            active     = true;
            fieldIndex = 0;
            data       = {};
            step       = null;

            var fields = getFields();
            if (fields.length === 0) return;

            var first  = fields[0];
            step       = first.id;

            var prefix = context === 'direct'
                ? "I'd love to set up a demo for you — it only takes a minute!\n\n"
                : "Let me get you booked in — quick and easy!\n\n";

            var extras = {};
            if (!first.required && first.skipLabel) {
                extras.quickReplies = [first.skipLabel];
            }

            opts.addBotMessage(prefix + first.chatPrompt, extras);
        }

        // ---- Advance: ask the field at the current fieldIndex ----
        function askCurrentField() {
            var field = currentField();

            if (!field) {
                // All fields collected — show summary card
                step = 'confirm';
                setTimeout(function () {
                    opts.addBotMessage("Almost done! Here's your booking summary — everything look good?");
                    setTimeout(function () {
                        opts.addConfirmCard(Object.assign({}, data));
                    }, 350);
                }, 250);
                return;
            }

            step = field.id;

            if (field.type === 'calendar') {
                opts.addBotMessage(field.chatPrompt);
                setTimeout(function () {
                    opts.addCalendarPicker(function (dateISO, timeLabel, timeValue) {
                        data[field.id]          = dateISO;
                        data.meetingTime        = timeValue;
                        data.meetingTimeDisplay = timeLabel;
                        data.dateDisplay        = formatDateDisplay(dateISO);
                        fieldIndex++;
                        askCurrentField();
                    });
                }, 350);

            } else if (field.type === 'multiselect') {
                opts.addBotMessage(field.chatPrompt);
                setTimeout(function () {
                    opts.addMultiSelectPicker(
                        field.options,
                        field.skipLabel || null,
                        function (selected) {
                            data[field.id] = selected;
                            if (field.ack) {
                                var ackMsg = Array.isArray(selected) && selected.length > 0
                                    ? 'Great choices!'
                                    : "No problem!";
                                opts.addBotMessage(ackMsg);
                                setTimeout(function () { fieldIndex++; askCurrentField(); }, 350);
                            } else {
                                fieldIndex++;
                                askCurrentField();
                            }
                        }
                    );
                }, 200);

            } else if (field.type === 'select') {
                var labels = field.options.map(function (o) {
                    return typeof o === 'string' ? o : o.label;
                });
                opts.addBotMessage(field.chatPrompt, { quickReplies: labels });

            } else {
                // text / email / tel / textarea
                var extras = {};
                if (!field.required && field.skipLabel) {
                    extras.quickReplies = [field.skipLabel];
                }
                opts.addBotMessage(field.chatPrompt, extras);
            }
        }

        // ---- Process text input from the user ----
        function process(input) {
            if (!active) return false;
            if (step === 'confirm') return false;  // waiting on confirm card

            var field = currentField();
            if (!field) return false;

            // These types are driven by interactive widgets — consume text silently
            if (field.type === 'calendar' || field.type === 'multiselect') {
                return true;
            }

            var val = input.trim();

            // ---- Handle "Skip" for optional fields ----
            if (!field.required && field.skipLabel &&
                val.toLowerCase() === field.skipLabel.toLowerCase()) {
                data[field.id] = '';
                fieldIndex++;
                askCurrentField();
                return true;
            }

            // ---- Validate ----
            if (field.validate && !field.validate(val)) {
                opts.addBotMessage(
                    field.errorMessage || "That doesn't look right. Could you try again?"
                );
                return true;
            }

            // ---- Select fields: map display label → stored value ----
            if (field.type === 'select') {
                var matched = null;
                for (var i = 0; i < field.options.length; i++) {
                    var opt      = field.options[i];
                    var optLabel = typeof opt === 'string' ? opt : opt.label;
                    if (optLabel.toLowerCase() === val.toLowerCase()) {
                        matched = opt;
                        break;
                    }
                }
                if (!matched && field.required) {
                    var qr = field.options.map(function (o) {
                        return typeof o === 'string' ? o : o.label;
                    });
                    opts.addBotMessage("Please pick one of the options:", { quickReplies: qr });
                    return true;
                }
                data[field.id] = matched
                    ? (typeof matched === 'string' ? matched : matched.value)
                    : val;
            } else {
                data[field.id] = val;
            }

            // ---- Optional acknowledgement ----
            if (field.ack) {
                opts.addBotMessage(field.ack(val));
                setTimeout(function () { fieldIndex++; askCurrentField(); }, 350);
            } else {
                fieldIndex++;
                askCurrentField();
            }

            return true;
        }

        // ---- Confirm: resets state, fires onConfirmed ----
        function confirm() {
            active     = false;
            step       = null;
            fieldIndex = 0;
            var snapshot = Object.assign({}, data);
            data = {};
            if (opts.onConfirmed) opts.onConfirmed(snapshot);
        }

        // ---- Cancel ----
        function cancel() {
            active     = false;
            step       = null;
            fieldIndex = 0;
            data       = {};
            opts.addBotMessage(
                "No problem at all! Feel free to ask me anything, " +
                "or book a consultation whenever you're ready."
            );
        }

        function isActive()    { return active; }
        function currentStep() { return step;   }

        return {
            start:       start,
            process:     process,
            confirm:     confirm,
            cancel:      cancel,
            isActive:    isActive,
            currentStep: currentStep
        };
    }

    // ---- Expose globally ----
    window.BookingFlow = {
        create:       create,
        detectIntent: detectIntent
    };

})(window);

// ============================================
// BOOKING SCHEMA — Single source of truth
// Shared between the "Book a Demo" form and the chat booking flow.
//
// To change the form fields, only edit this file.
// Both the chatbot and the form page will automatically adapt.
//
// Exposes: window.BookingSchema
// ============================================

(function (window) {
    'use strict';

    window.BookingSchema = {

        // ---------------------------------------------------------------
        // Submission endpoint — identical to the Book a Demo form
        // ---------------------------------------------------------------
        endpoint: 'https://formspree.io/f/xkgpldpo',

        // localStorage key used for post-chat pre-fill handoff
        prefillKey: 'scaleMako_bookingPrefill',

        // ---------------------------------------------------------------
        // Field definitions
        //
        // Every entry maps 1-to-1 with a field in book-demo.html.
        //
        // Field shape:
        //   id           — key in the collected data object
        //   formId       — matches the <input id="..."> in the form
        //   label        — human label shown in the summary card
        //   type         — 'text' | 'email' | 'tel' | 'textarea' |
        //                  'select' | 'multiselect' | 'calendar'
        //   required     — boolean
        //   chatPrompt   — the question the chatbot asks
        //   options      — array of strings or {value, label} objects
        //                  (for 'select' and 'multiselect')
        //   skipLabel    — quick-reply label to skip optional fields
        //   validate(v)  — returns true if the raw string value is valid
        //   errorMessage — shown when validate() returns false
        //   ack(v)       — optional acknowledgement shown after the user answers
        // ---------------------------------------------------------------
        fields: [
            {
                id:           'fullName',
                formId:       'fullName',
                label:        'Full Name',
                type:         'text',
                required:     true,
                chatPrompt:   "What's your **full name**?",
                validate:     function (v) { return v.trim().length >= 2; },
                errorMessage: "Could you share your full name? (at least 2 characters)",
                ack:          function (v) { return 'Nice to meet you, **' + v.trim() + '**!'; }
            },
            {
                id:           'businessName',
                formId:       'businessName',
                label:        'Business Name',
                type:         'text',
                required:     false,
                chatPrompt:   "What's your **business name**?",
                validate:     function () { return true; },
                skipLabel:    'Skip',
                ack:          null
            },
            {
                id:           'email',
                formId:       'email',
                label:        'Email',
                type:         'email',
                required:     true,
                chatPrompt:   "Best **email address** to reach you?",
                validate:     function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
                },
                errorMessage: "That doesn't look right — could you double-check your email?",
                ack:          function () { return 'Got it.'; }
            },
            {
                id:           'phone',
                formId:       'phone',
                label:        'Phone',
                type:         'tel',
                required:     false,
                chatPrompt:   "And a **phone number**?",
                validate:     function (v) {
                    return !v.trim() || /[\d\s\-()+]{7,}/.test(v.trim());
                },
                errorMessage: "Could you share a valid number? (e.g. 555-123-4567)",
                skipLabel:    'Skip',
                ack:          null
            },
            {
                id:           'services',
                formId:       'services',
                label:        'Services Interested In',
                type:         'multiselect',
                required:     false,
                chatPrompt:   "Which **services** are you most interested in?",
                options:      [
                    'AI Websites',
                    'Chatbots',
                    'Voice Agents',
                    'Workflow Automations'
                ],
                skipLabel:    'Not sure yet',
                ack:          null
            },
            {
                id:           'message',
                formId:       'message',
                label:        'Notes',
                type:         'textarea',
                required:     false,
                chatPrompt:   "Anything specific you'd like us to prepare for the demo?",
                validate:     function () { return true; },
                skipLabel:    'Skip',
                ack:          null
            },
            {
                id:           'platform',
                formId:       'platform',
                label:        'Meeting Platform',
                type:         'select',
                required:     true,
                chatPrompt:   "Which **platform** works best for the call?",
                options: [
                    { value: 'google-meet', label: 'Google Meet'     },
                    { value: 'zoom',        label: 'Zoom'            },
                    { value: 'teams',       label: 'Microsoft Teams' }
                ],
                ack:          null
            },
            {
                id:           'meetingDate',
                formId:       'meetingDate',
                label:        'Date & Time',
                type:         'calendar',   // handled by the interactive calendar widget
                required:     true,
                chatPrompt:   "Almost there! Pick a **date and time** that works for you.",
                ack:          null
            }
        ],

        // ---------------------------------------------------------------
        // Build the Formspree-compatible payload from collected chat data.
        // Mirrors the exact field names the form POSTs.
        // ---------------------------------------------------------------
        buildPayload: function (data) {
            var payload  = { formType: 'Demo Booking' };
            var self     = this;
            this.fields.forEach(function (field) {
                if (field.type === 'calendar') {
                    // meetingDate is the ISO date; meetingTime is the 24h value
                    payload[field.formId || field.id] = data[field.id] || '';
                    payload.meetingTime               = data.meetingTime || '';
                } else {
                    var val = data[field.id];
                    if (val === undefined || val === null) return;
                    if (Array.isArray(val)) {
                        val = val.length > 0 ? val.join(', ') : '';
                    }
                    payload[field.formId || field.id] = String(val);
                }
            });
            return payload;
        },

        // ---------------------------------------------------------------
        // Submit the collected data to the same endpoint as the form.
        // Returns a Promise that resolves on success, rejects on failure.
        // ---------------------------------------------------------------
        submit: function (data) {
            var payload  = this.buildPayload(data);
            var endpoint = this.endpoint;
            console.log('[BookingSchema] Submitting payload:', payload);
            return fetch(endpoint, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json'
                },
                body:    JSON.stringify(payload)
            }).then(function (res) {
                if (!res.ok) {
                    return res.json().catch(function () { return {}; }).then(function (body) {
                        var msg = (body && body.error) ? body.error : ('HTTP ' + res.status);
                        console.error('[BookingSchema] Submission failed:', msg, body);
                        throw new Error('Submission failed — ' + msg);
                    });
                }
                console.log('[BookingSchema] Submission succeeded (HTTP ' + res.status + ')');
                return res;
            });
        }

    };

})(window);

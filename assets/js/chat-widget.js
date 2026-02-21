// ============================================
// FLOATING CHAT WIDGET FUNCTIONALITY
// ============================================
function initFloatingChatWidget() {
    // Guard: prevent double-initialization across static + dynamic load paths
    if (window._chatWidgetInitialized) return;
    window._chatWidgetInitialized = true;

    const widget          = document.getElementById('chatWidget');
    const widgetButton    = document.getElementById('floatingChatButton');
    const widgetClose     = document.getElementById('chatWidgetClose');
    const widgetFullscreen = document.getElementById('chatWidgetFullscreen');
    const widgetRefresh   = document.getElementById('chatWidgetRefresh');
    const widgetInput     = document.getElementById('chatWidgetInput');
    const widgetSend      = document.getElementById('chatWidgetSend');
    const widgetMessages  = document.getElementById('chatWidgetMessages');
    let   widgetWelcome   = document.getElementById('chatWidgetWelcome');
    const suggestionButtons = document.querySelectorAll('.chat-widget-suggestion');

    if (!widget || !widgetButton) return;

    // ── Logo: single source of truth via /api/config ──────────────────────
    // The static src="/assets/images/logo.png" is the fallback already set in
    // HTML. This fetch upgrades it to whatever the server considers authoritative.
    fetch('/api/config')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            const logoUrl = data?.brand?.logoUrl;
            if (!logoUrl) return;
            document.querySelectorAll('.chatbot-logo-img').forEach(img => {
                img.src = logoUrl;
            });
        })
        .catch(() => { /* fallback src already in place */ });
    // ──────────────────────────────────────────────────────────────────────

    let isWidgetOpen = false;

    // Storage keys
    const STORAGE_KEY_HISTORY = 'scaleMako_chatHistory';
    const STORAGE_KEY_THREAD  = 'scaleMako_threadId';

    let currentThreadId    = null;
    let rawMessageHistory  = [];

    // ---- Booking flow state ----
    let booking      = null;   // BookingFlow instance — created after init
    let nudgeShown   = false;  // Only nudge once per session
    let idleTimer    = null;

    // ============================================
    // WELCOME HTML TEMPLATE
    // ============================================
    function buildWelcomeHTML() {
        return `
            <div id="chatWidgetWelcome" class="chat-widget-welcome">
                <div class="text-center mb-5">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 mako-icon"
                         style="background: linear-gradient(135deg, #00C6FF, #0072FF); box-shadow: 0 4px 14px rgba(0,114,255,0.25);">
                        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 16 L27 11 L20 7 L18 2 L14 9 L8 9 L2 4 L6 16 L2 28 L8 23 L15 26 L18 30 L22 24 L27 21 Z" fill="white"/>
                            <circle cx="25" cy="13" r="2" fill="rgba(0,40,140,0.22)"/>
                            <path d="M16 9 L14 23" stroke="rgba(0,40,140,0.18)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                        </svg>
                    </div>
                    <h3 class="text-sm font-semibold text-gray-900 mb-1 tracking-tight">Hi, I&rsquo;m Mako <span style="color:#0072FF;">AI</span></h3>
                    <p class="text-xs text-gray-400 leading-relaxed">Your AI guide to automating your business</p>
                </div>
                <div class="space-y-2">
                    <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.1em] mb-2">Quick start</p>
                    <button class="chat-widget-suggestion" data-query="book">
                        <span>Book a Consultation</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="pricing">
                        <span>Pricing &amp; Plans</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="services">
                        <span>Our Services</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="how it works">
                        <span>How It Works</span>
                    </button>
                </div>
            </div>
        `;
    }

    // ============================================
    // STORAGE HELPERS
    // ============================================
    function renderWelcomeState() {
        widgetWelcome = document.getElementById('chatWidgetWelcome');
        if (rawMessageHistory.length === 0 && widgetWelcome) {
            widgetWelcome.style.display = 'block';
        } else if (widgetWelcome) {
            widgetWelcome.style.display = 'none';
        }
    }

    function loadFromStorage() {
        if (typeof Storage === 'undefined') { renderWelcomeState(); return; }
        try {
            const savedHistory  = localStorage.getItem(STORAGE_KEY_HISTORY);
            const savedThreadId = localStorage.getItem(STORAGE_KEY_THREAD);
            if (savedThreadId) currentThreadId = savedThreadId;
            if (savedHistory) {
                const history = JSON.parse(savedHistory);
                if (Array.isArray(history) && history.length > 0) {
                    const cleaned = cleanLegacyHTML(history);
                    rawMessageHistory = cleaned;
                    renderHistory(cleaned);
                    if (widgetWelcome) widgetWelcome.style.display = 'none';
                } else {
                    renderWelcomeState();
                }
            } else {
                renderWelcomeState();
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            renderWelcomeState();
        }
    }

    function cleanLegacyHTML(history) {
        return history.map(msg => {
            let text = msg.text || '';
            if (text.includes('<')) {
                const tmp = document.createElement('div');
                tmp.innerHTML = text;
                text = tmp.textContent || tmp.innerText || '';
            }
            return { sender: msg.sender, text: text.trim() };
        }).filter(msg => msg.text.length > 0);
    }

    function saveToStorage(messageHistory) {
        if (typeof Storage === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(messageHistory));
            if (currentThreadId) localStorage.setItem(STORAGE_KEY_THREAD, currentThreadId);
        } catch (e) { console.error('Error saving to localStorage:', e); }
    }

    function clearStorage() {
        if (typeof Storage === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY_HISTORY);
        localStorage.removeItem(STORAGE_KEY_THREAD);
        currentThreadId   = null;
        rawMessageHistory = [];
    }

    function getMessageHistory() { return rawMessageHistory; }

    function addToRawHistory(text, isUser) {
        rawMessageHistory.push({ sender: isUser ? 'user' : 'ai', text: text.trim() });
        if (rawMessageHistory.length > 100) rawMessageHistory = rawMessageHistory.slice(-100);
    }

    function renderHistory(history) {
        widgetMessages.innerHTML = '';
        widgetMessages.insertAdjacentHTML('beforeend', buildWelcomeHTML());

        const welcomeDiv = document.getElementById('chatWidgetWelcome');
        if (welcomeDiv) welcomeDiv.style.display = 'none';

        attachWelcomeListeners(widgetMessages);

        history.forEach(msg => {
            addMessage(msg.text, msg.sender === 'user', false);
        });
        scrollToBottom();
    }

    // ============================================
    // WIDGET OPEN / CLOSE
    // ============================================
    function toggleWidget() {
        isWidgetOpen = !isWidgetOpen;
        if (isWidgetOpen) {
            widget.classList.remove('hidden');
            loadFromStorage();
            renderWelcomeState();
            resetIdleTimer();
            setTimeout(() => widgetInput?.focus(), 100);
        } else {
            widget.classList.add('hidden');
            clearIdleTimer();
        }
    }

    function closeWidget() {
        isWidgetOpen = false;
        widget.classList.add('hidden');
        clearIdleTimer();
    }

    function openFullScreen() {
        closeWidget();
        if (window.openChatModal) window.openChatModal();
    }

    // ============================================
    // IDLE TIMER
    // ============================================
    function resetIdleTimer() {
        clearIdleTimer();
        if (nudgeShown || (booking && booking.isActive())) return;
        idleTimer = setTimeout(() => {
            if (!nudgeShown && isWidgetOpen && rawMessageHistory.length === 0) {
                showIdleNudge();
            }
        }, 90000); // 90 seconds idle
    }

    function clearIdleTimer() {
        if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
    }

    function showIdleNudge() {
        nudgeShown = true;
        const nudgeDiv = document.createElement('div');
        nudgeDiv.className = 'booking-nudge';
        nudgeDiv.innerHTML = `
            <span class="booking-nudge-text">Would you like to schedule a free consultation?</span>
            <div class="booking-quick-replies" style="margin-top:0.625rem;">
                <button class="booking-quick-reply-btn" id="nudgeYes">Book a time</button>
                <button class="booking-quick-reply-btn booking-quick-reply-btn--ghost" id="nudgeNo">Maybe later</button>
            </div>
        `;
        // Hide welcome, show nudge
        widgetWelcome = document.getElementById('chatWidgetWelcome');
        if (widgetWelcome) widgetWelcome.style.display = 'none';
        widgetMessages.appendChild(nudgeDiv);
        scrollToBottom();

        nudgeDiv.querySelector('#nudgeYes')?.addEventListener('click', () => {
            nudgeDiv.remove();
            booking.start('nudge');
        });
        nudgeDiv.querySelector('#nudgeNo')?.addEventListener('click', () => {
            nudgeDiv.remove();
        });
    }

    // ============================================
    // REFRESH
    // ============================================
    function refreshChat() {
        if (confirm('Start a new conversation?')) {
            clearStorage();
            widgetMessages.innerHTML = '';
            widgetMessages.insertAdjacentHTML('beforeend', buildWelcomeHTML());
            attachWelcomeListeners(widgetMessages);
            rawMessageHistory = [];
            currentThreadId   = null;
            nudgeShown        = false;
            renderWelcomeState();
            resetIdleTimer();
            window.dispatchEvent(new CustomEvent('chatRefreshed'));
        }
    }

    // ============================================
    // TYPING INDICATOR
    // ============================================
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'widget-typing-indicator';
        typingDiv.className = 'chat-widget-typing';
        typingDiv.innerHTML = `
            <div class="chat-widget-typing-dot"></div>
            <div class="chat-widget-typing-dot"></div>
            <div class="chat-widget-typing-dot"></div>
        `;
        widgetMessages.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }

    function removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) typingDiv.parentNode.removeChild(typingDiv);
    }

    // ============================================
    // FORMATTING
    // ============================================
    function formatAIResponse(text) {
        if (!text) return '';
        if (typeof marked !== 'undefined') {
            try {
                let f = marked.parse(text);
                f = f.replace(/【[^】]*†[^】]*】/g, '').replace(/【[^】]*】/g, '');
                return f;
            } catch (e) { /* fall through */ }
        }

        let f = escapeHtml(text);
        f = f.replace(/【[^】]*†[^】]*】/g, '').replace(/【[^】]*】/g, '');
        f = f.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, lt, url) => {
            const ext = url.startsWith('http');
            return `<a href="${url}" class="text-blue-600 hover:text-blue-700 underline font-medium"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${lt}</a>`;
        });
        f = f.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        f = f.replace(/\*(.*?)\*/g, '<em>$1</em>');
        f = f.replace(/^[-•]\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
        f = f.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
        f = f.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, m => '<ul class="list-disc ml-6 my-2 space-y-1">' + m + '</ul>');
        f = f.replace(/\n/g, '<br>');
        f = f.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">$1</a>');
        return f;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // ADD MESSAGE
    // ============================================
    function addMessage(text, isUser = false, saveToStorage = true) {
        widgetWelcome = document.getElementById('chatWidgetWelcome');
        if (widgetWelcome && isUser) widgetWelcome.style.display = 'none';

        if (saveToStorage) addToRawHistory(text, isUser);

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-widget-message ${isUser ? 'user' : 'bot'}`;

        if (isUser) {
            messageDiv.textContent = text;
        } else {
            messageDiv.innerHTML = formatAIResponse(text);
        }

        widgetMessages.appendChild(messageDiv);
        scrollToBottom();

        if (saveToStorage) {
            setTimeout(() => {
                const history = getMessageHistory();
                if (typeof Storage !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
                    if (currentThreadId) localStorage.setItem(STORAGE_KEY_THREAD, currentThreadId);
                }
            }, 0);
        }
    }

    // ============================================
    // BOOKING UI HELPERS
    // ============================================

    // Append quick-reply pill buttons below the last message
    function appendQuickReplies(labels) {
        const row = document.createElement('div');
        row.className = 'booking-quick-replies';
        labels.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'booking-quick-reply-btn';
            btn.textContent = label;
            btn.addEventListener('click', () => {
                row.remove();
                handleUserInput(label);
            });
            row.appendChild(btn);
        });
        widgetMessages.appendChild(row);
        scrollToBottom();
    }

    // ============================================
    // MULTI-SELECT PICKER (e.g. Services)
    // ============================================
    function appendMultiSelectPicker(options, skipLabel, onSelected) {
        const container = document.createElement('div');
        container.className = 'chat-multiselect-widget';
        const selected = new Set();

        function render() {
            let html = '<div class="chat-multiselect-options">';
            options.forEach(opt => {
                const isSel = selected.has(opt);
                html += `<button class="chat-multiselect-option${isSel ? ' selected' : ''}" data-value="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`;
            });
            html += '</div><div class="chat-multiselect-footer">';
            if (skipLabel) {
                html += `<button class="chat-multiselect-skip">${escapeHtml(skipLabel)}</button>`;
            }
            const count = selected.size;
            html += `<button class="chat-multiselect-done" ${count === 0 ? 'disabled' : ''}>
                ${count > 0 ? `Done (${count} selected)` : 'Done'}
            </button>`;
            html += '</div>';
            container.innerHTML = html;
            attachMSEvents();
        }

        function attachMSEvents() {
            container.querySelectorAll('.chat-multiselect-option[data-value]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const v = btn.dataset.value;
                    selected.has(v) ? selected.delete(v) : selected.add(v);
                    render(); scrollToBottom();
                });
            });
            container.querySelector('.chat-multiselect-skip')?.addEventListener('click', () => {
                container.remove();
                onSelected([]);
            });
            container.querySelector('.chat-multiselect-done')?.addEventListener('click', () => {
                if (selected.size === 0) return;
                container.remove();
                onSelected(Array.from(selected));
            });
        }

        render();
        widgetMessages.appendChild(container);
        scrollToBottom();
    }

    // ============================================
    // BOOKING CONFIRMATION CARD (schema-driven)
    // ============================================
    function buildCardRows(data) {
        const fields = (window.BookingSchema && Array.isArray(window.BookingSchema.fields))
            ? window.BookingSchema.fields : [];
        let rows = '';
        fields.forEach(field => {
            if (field.type === 'calendar') {
                const dv = data.dateDisplay || data[field.id] || '';
                const tv = data.meetingTimeDisplay || data.meetingTime || '';
                if (dv) rows += `<div class="booking-detail-row"><span class="booking-detail-label">Date</span><span class="booking-detail-value">${escapeHtml(dv)}</span></div>`;
                if (tv) rows += `<div class="booking-detail-row"><span class="booking-detail-label">Time</span><span class="booking-detail-value">${escapeHtml(tv)}</span></div>`;
            } else {
                let val = data[field.id];
                if (val === undefined || val === null || val === '') return;
                if (Array.isArray(val)) {
                    if (val.length === 0) return;
                    val = val.join(', ');
                }
                // Resolve select value → display label
                if (field.type === 'select' && field.options) {
                    const opt = field.options.find(o =>
                        (typeof o === 'string' ? o : o.value) === val
                    );
                    if (opt) val = typeof opt === 'string' ? opt : opt.label;
                }
                rows += `<div class="booking-detail-row"><span class="booking-detail-label">${escapeHtml(field.label)}</span><span class="booking-detail-value">${escapeHtml(String(val))}</span></div>`;
            }
        });
        return rows;
    }

    function addBookingCard(data) {
        const card = document.createElement('div');
        card.className = 'booking-confirm-card';
        card.innerHTML = `
            <div class="booking-confirm-header">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Booking Summary
            </div>
            <div class="booking-confirm-details">${buildCardRows(data)}</div>
            <button class="booking-confirm-btn" id="widgetConfirmBtn">Confirm Booking</button>
            <button class="booking-cancel-link" id="widgetCancelBtn">Cancel</button>
        `;
        widgetMessages.appendChild(card);
        scrollToBottom();

        card.querySelector('#widgetConfirmBtn')?.addEventListener('click', async () => {
            const btn       = card.querySelector('#widgetConfirmBtn');
            const cancelBtn = card.querySelector('#widgetCancelBtn');
            btn.disabled    = true;
            btn.textContent = 'Booking...';
            if (cancelBtn) cancelBtn.style.display = 'none';

            try {
                // Submit to the same Formspree endpoint as the Book a Demo form
                if (window.BookingSchema?.submit) {
                    await window.BookingSchema.submit(data);
                }

                // Save for pre-fill on the booking confirmation page
                try {
                    const key = window.BookingSchema?.prefillKey || 'scaleMako_bookingPrefill';
                    localStorage.setItem(key, JSON.stringify(
                        Object.assign({}, data, { chatSubmitted: true })
                    ));
                } catch (e) { /* storage unavailable */ }

                btn.textContent = 'Confirmed ✓';
                booking.confirm(); // reset flow state

                addMessage(
                    `You're all set, **${data.fullName || data.name}**! 🎉\n\nWe'll send a confirmation to **${data.email}**.\n\nTaking you to your booking page...`,
                    false, true
                );
                setTimeout(() => { window.location.href = '/book-demo'; }, 2200);

            } catch (err) {
                console.error('Booking submission error:', err);
                btn.disabled    = false;
                btn.textContent = 'Confirm Booking';
                if (cancelBtn) cancelBtn.style.display = 'block';
                addMessage(
                    "Something went wrong submitting. Please try again or email us at hello@scalemako.ai",
                    false
                );
            }
        });

        card.querySelector('#widgetCancelBtn')?.addEventListener('click', () => {
            card.remove();
            booking.cancel();
        });
    }

    // Soft post-answer nudge (shown once after the first AI response)
    function maybeNudgeBooking() {
        if (nudgeShown || (booking && booking.isActive())) return;
        nudgeShown = true;
        setTimeout(() => {
            if (booking && booking.isActive()) return;
            const nudge = document.createElement('div');
            nudge.className = 'booking-nudge';
            nudge.innerHTML = `
                <span class="booking-nudge-text">Would you like me to schedule a free consultation?</span>
                <div class="booking-quick-replies" style="margin-top:0.5rem;">
                    <button class="booking-quick-reply-btn" id="softNudgeYes">Book a time</button>
                    <button class="booking-quick-reply-btn booking-quick-reply-btn--ghost" id="softNudgeNo">Not now</button>
                </div>
            `;
            widgetMessages.appendChild(nudge);
            scrollToBottom();

            nudge.querySelector('#softNudgeYes')?.addEventListener('click', () => {
                nudge.remove();
                booking.start('nudge');
            });
            nudge.querySelector('#softNudgeNo')?.addEventListener('click', () => {
                nudge.remove();
            });
        }, 1400);
    }

    // ============================================
    // AI RESPONSE & FALLBACK
    // ============================================
    async function getAIResponse(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, threadId: currentThreadId })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.threadId) {
                currentThreadId = data.threadId;
                if (typeof Storage !== 'undefined') localStorage.setItem(STORAGE_KEY_THREAD, currentThreadId);
            }

            return data.response || getFallbackResponse(userMessage);

        } catch (error) {
            console.error('Error getting AI response:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                return "I'm having trouble connecting. Please make sure the server is running and try again.";
            }
            return getFallbackResponse(userMessage);
        }
    }

    function getFallbackResponse(userMessage) {
        const lower = userMessage.toLowerCase();
        if (lower.includes('pricing') || lower.includes('price') || lower.includes('cost')) {
            return "Our pricing starts at **$99/month** for Voice Agents, **$199/month** for Voice + Chatbot, and **$299/month** for full AI Websites. All plans include unlimited conversations.\n\nWould you like me to schedule a free consultation so we can find the right fit for your business?";
        }
        if (lower.includes('service') || lower.includes('what do you') || lower.includes('offer')) {
            return "We offer **AI Voice Agents**, **Chat Assistants**, **Custom SEO Websites**, and **Workflow Automations** — all custom-built for your business.\n\nWould you like to book a free consultation to see which service fits your needs?";
        }
        if (lower.includes('how it works') || lower.includes('how does')) {
            return "Here's how it works:\n\n1. **Discovery & Strategy** — We analyze your workflow\n2. **Custom Build** — We build your AI solution\n3. **Deploy & Scale** — You go live in under 2 weeks\n\nWant to book a free demo to see it in action?";
        }
        return "I'm here to help! I can answer questions about our services, pricing, or how it works — or I can help you schedule a free consultation with our team.";
    }

    // ============================================
    // BOOKING INTENT DETECTION (inline — no external dep needed)
    // ============================================
    const BOOKING_KEYWORDS = [
        'book', 'schedule', 'appointment', 'consultation',
        'demo', 'availability', 'available', 'meeting',
        'call with', 'speak with', 'talk to', 'sign up',
        'get started', 'reserve', 'free call', 'free session'
    ];

    function isBookingIntent(message) {
        const lower = message.toLowerCase();
        return BOOKING_KEYWORDS.some(kw => lower.indexOf(kw) !== -1);
    }

    // Ensure booking instance exists (lazy init fallback)
    function ensureBooking() {
        if (!booking) initBookingFlow();
        return booking;
    }

    // ============================================
    // CORE INPUT HANDLER
    // ============================================
    async function handleUserInput(message) {
        if (!message) return;

        // Clear any open quick-reply rows
        widgetMessages.querySelectorAll('.booking-quick-replies').forEach(el => el.remove());

        // Show the user's message in the chat
        addMessage(message, true);

        // --- 1. Booking flow active: hand off directly ---
        const b = ensureBooking();
        if (b && b.isActive()) {
            b.process(message);
            return;
        }

        // --- 2. Booking intent detected: start the flow ---
        if (b && isBookingIntent(message)) {
            const typingDiv = showTypingIndicator();
            await new Promise(r => setTimeout(r, 600));
            removeTypingIndicator(typingDiv);
            b.start('intent');
            return;
        }

        // --- 3. Normal AI flow ---
        const typingDiv = showTypingIndicator();
        try {
            const response = await getAIResponse(message);
            removeTypingIndicator(typingDiv);
            addMessage(response, false);
            maybeNudgeBooking();
        } catch (error) {
            console.error('Error in handleUserInput:', error);
            removeTypingIndicator(typingDiv);
            addMessage("I'm sorry, I encountered an error. Please try again.", false);
        }
    }

    // ============================================
    // SEND & SUGGESTION ENTRY POINTS
    // ============================================
    async function sendMessage() {
        const message = widgetInput?.value.trim();
        if (!message) return;
        widgetInput.value = '';
        if (widgetInput) widgetInput.style.height = 'auto';
        clearIdleTimer();
        await handleUserInput(message);
        resetIdleTimer();
    }

    async function simulateUserTyping(message) {
        clearIdleTimer();
        await handleUserInput(message);
        resetIdleTimer();
    }

    // ============================================
    // SCROLL
    // ============================================
    function scrollToBottom() {
        if (widgetMessages) {
            requestAnimationFrame(() => { widgetMessages.scrollTop = widgetMessages.scrollHeight; });
            setTimeout(() => { if (widgetMessages) widgetMessages.scrollTop = widgetMessages.scrollHeight; }, 50);
        }
    }

    // ============================================
    // WELCOME SUGGESTION LISTENERS
    // ============================================
    function attachWelcomeListeners(container) {
        container.querySelectorAll('.chat-widget-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                if (!query) return;

                // "book" directly starts the booking flow
                if (query === 'book') {
                    widgetWelcome = document.getElementById('chatWidgetWelcome');
                    if (widgetWelcome) widgetWelcome.style.display = 'none';
                    if (booking) {
                        booking.start('direct');
                    } else {
                        simulateUserTyping('I would like to book a consultation');
                    }
                    return;
                }

                simulateUserTyping(query);
            });
        });
    }

    // ============================================
    // LISTEN FOR chatRefreshed EVENT
    // ============================================
    window.addEventListener('chatRefreshed', () => {
        widgetMessages.innerHTML = '';
        widgetMessages.insertAdjacentHTML('beforeend', buildWelcomeHTML());
        attachWelcomeListeners(widgetMessages);
        rawMessageHistory = [];
        currentThreadId   = null;
        nudgeShown        = false;
        loadFromStorage();
        renderWelcomeState();
    });

    // ============================================
    // CHAT CALENDAR PICKER
    // ============================================
    function appendCalendarPicker(onDateTimeSelected) {
        const TIMES = [
            { value: '09:00', label: '9:00 AM'  },
            { value: '10:00', label: '10:00 AM' },
            { value: '11:00', label: '11:00 AM' },
            { value: '13:00', label: '1:00 PM'  },
            { value: '14:00', label: '2:00 PM'  },
            { value: '15:00', label: '3:00 PM'  },
            { value: '16:00', label: '4:00 PM'  }
        ];
        const MONTH_NAMES = ['January','February','March','April','May','June',
                             'July','August','September','October','November','December'];
        const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

        let selDate = null;   // 'YYYY-MM-DD'
        let selTime = null;   // { value, label }
        let viewYear, viewMonth;
        const now = new Date();
        viewYear  = now.getFullYear();
        viewMonth = now.getMonth();

        const container = document.createElement('div');
        container.className = 'chat-calendar-widget';

        function toISO(d) {
            return d.getFullYear() + '-' +
                   String(d.getMonth() + 1).padStart(2, '0') + '-' +
                   String(d.getDate()).padStart(2, '0');
        }

        function isPast(iso) {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const parts = iso.split('-');
            const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
            return d <= today;
        }

        function formatDisplay(iso) {
            const parts = iso.split('-');
            const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
            const dn = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            return dn[d.getDay()] + ', ' + mn[d.getMonth()] + ' ' + d.getDate();
        }

        function render() {
            const firstDay = new Date(viewYear, viewMonth, 1);
            const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
            const startDow = firstDay.getDay();
            const todayISO = toISO(new Date());
            const isPrevDisabled = viewYear === now.getFullYear() && viewMonth <= now.getMonth();

            let html = `<div class="chat-cal-header">
                <button class="chat-cal-nav chat-cal-prev" ${isPrevDisabled ? 'disabled' : ''}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span class="chat-cal-month-label">${MONTH_NAMES[viewMonth]} ${viewYear}</span>
                <button class="chat-cal-nav chat-cal-next">
                    <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            </div>`;

            html += '<div class="chat-cal-grid">';
            DAY_NAMES.forEach(d => { html += `<div class="chat-cal-dayname">${d}</div>`; });
            for (let i = 0; i < startDow; i++) {
                html += '<div class="chat-cal-day empty"></div>';
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const iso = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const past     = isPast(iso);
                const isToday  = iso === todayISO;
                const isSel    = iso === selDate;
                let cls = 'chat-cal-day';
                if (past)    cls += ' disabled';
                if (isToday && !past) cls += ' today';
                if (isSel)   cls += ' selected';
                html += `<div class="${cls}" data-date="${iso}">${day}</div>`;
            }
            html += '</div>';

            // Time slots — only shown after date is selected
            if (selDate) {
                html += '<div class="chat-cal-divider"></div>';
                html += '<div class="chat-cal-section-label">Available Times</div>';
                html += '<div class="chat-cal-times">';
                TIMES.forEach(t => {
                    const isSel = selTime && selTime.value === t.value;
                    html += `<div class="chat-cal-time${isSel ? ' selected' : ''}" data-value="${t.value}" data-label="${t.label}">${t.label}</div>`;
                });
                html += '</div>';
            }

            // Confirm button
            const isReady = selDate && selTime;
            const btnLabel = isReady
                ? `Continue — ${formatDisplay(selDate)} at ${selTime.label}`
                : 'Select a date & time';
            html += `<button class="chat-cal-confirm-btn" id="chatCalConfirmBtn" ${isReady ? '' : 'disabled'}>${btnLabel}</button>`;

            container.innerHTML = html;
            attachCalEvents();
        }

        function attachCalEvents() {
            container.querySelector('.chat-cal-prev')?.addEventListener('click', () => {
                viewMonth--;
                if (viewMonth < 0) { viewMonth = 11; viewYear--; }
                render(); scrollToBottom();
            });
            container.querySelector('.chat-cal-next')?.addEventListener('click', () => {
                viewMonth++;
                if (viewMonth > 11) { viewMonth = 0; viewYear++; }
                render(); scrollToBottom();
            });
            container.querySelectorAll('.chat-cal-day[data-date]').forEach(cell => {
                cell.addEventListener('click', () => {
                    if (cell.classList.contains('disabled')) return;
                    selDate = cell.dataset.date;
                    selTime = null;
                    render(); scrollToBottom();
                });
            });
            container.querySelectorAll('.chat-cal-time[data-value]').forEach(btn => {
                btn.addEventListener('click', () => {
                    selTime = { value: btn.dataset.value, label: btn.dataset.label };
                    render(); scrollToBottom();
                });
            });
            container.querySelector('#chatCalConfirmBtn')?.addEventListener('click', () => {
                if (!selDate || !selTime) return;
                container.remove();
                onDateTimeSelected(selDate, selTime.label, selTime.value);
            });
        }

        render();
        widgetMessages.appendChild(container);
        scrollToBottom();
    }

    // ============================================
    // INIT BOOKING FLOW INSTANCE
    // ============================================
    function initBookingFlow() {
        if (!window.BookingFlow) return;
        booking = window.BookingFlow.create({
            addBotMessage: (text, extras) => {
                addMessage(text, false, true);
                if (extras && extras.quickReplies) {
                    setTimeout(() => appendQuickReplies(extras.quickReplies), 80);
                }
            },
            addCalendarPicker: (onDateTimeSelected) => {
                setTimeout(() => appendCalendarPicker(onDateTimeSelected), 80);
            },
            addMultiSelectPicker: (options, skipLabel, onSelected) => {
                setTimeout(() => appendMultiSelectPicker(options, skipLabel, onSelected), 80);
            },
            addConfirmCard: (data) => {
                setTimeout(() => addBookingCard(data), 150);
            },
            onConfirmed: () => {
                // Submission + redirect are handled by the confirm button in addBookingCard.
                // This callback is kept as a lifecycle hook (state was already reset by confirm()).
            }
        });
    }

    // ============================================
    // INITIAL LOAD
    // ============================================
    loadFromStorage();
    renderWelcomeState();
    initBookingFlow();

    // ============================================
    // EVENT LISTENERS
    // ============================================
    widgetButton?.addEventListener('click', toggleWidget);
    widgetClose?.addEventListener('click', closeWidget);
    widgetFullscreen?.addEventListener('click', openFullScreen);
    widgetRefresh?.addEventListener('click', refreshChat);
    widgetSend?.addEventListener('click', sendMessage);

    // Auto-resize textarea
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    }

    if (widgetInput) {
        widgetInput.addEventListener('input', () => {
            autoResizeTextarea(widgetInput);
            resetIdleTimer();
        });
        widgetInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Static suggestion buttons (initial load, before any JS-generated welcome)
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const query = button.getAttribute('data-query');
            if (!query) return;
            if (query === 'book') {
                widgetWelcome = document.getElementById('chatWidgetWelcome');
                if (widgetWelcome) widgetWelcome.style.display = 'none';
                if (booking) { booking.start('direct'); } else { simulateUserTyping('I would like to book a consultation'); }
                return;
            }
            simulateUserTyping(query);
        });
    });

    // Close widget when clicking outside.
    // IMPORTANT: Use e.composedPath() instead of widget.contains(e.target).
    // Many interactive elements inside the widget (quick replies, multiselect
    // options, calendar cells, nav buttons) call .remove() on themselves during
    // their click handler, BEFORE the click event finishes bubbling to document.
    // Once removed from the DOM, widget.contains(removedNode) returns false,
    // so the old check incorrectly fired closeWidget() on every internal click.
    // composedPath() captures the full propagation path at dispatch time and
    // survives DOM mutations that happen during event propagation.
    document.addEventListener('click', e => {
        if (!isWidgetOpen) return;
        const path = e.composedPath ? e.composedPath() : [];
        if (path.includes(widget) || path.includes(widgetButton)) return;
        const modal = document.getElementById('chatModal');
        if (modal && path.includes(modal)) return;
        closeWidget();
    });
}

// ─── Auto-initialize when loaded (static script tag OR dynamic injection) ─
// footer.js loads this file dynamically on all pages; script.js loads it
// statically on index.html. Both paths work because of the guard inside
// initFloatingChatWidget() that prevents double-initialization.
(function () {
    function tryInit() {
        if (document.getElementById('floatingChatButton') && !window._chatWidgetInitialized) {
            initFloatingChatWidget();
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
})();

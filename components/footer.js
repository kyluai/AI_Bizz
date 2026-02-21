class CustomFooter extends HTMLElement {
    connectedCallback() {
        this._render('/assets/images/logo.png');
        this._loadLogo();
        this._injectChatWidget();
    }

    // ─── Logo: dynamically sourced from /api/config ────────────────────────
    async _loadLogo() {
        try {
            const res = await fetch('/api/config');
            if (!res.ok) return;
            const data = await res.json();
            const logoUrl = data?.brand?.logoUrl;
            if (!logoUrl) return;
            // Update footer logo + all chatbot logo images
            document.querySelectorAll('.footer-logo, .chatbot-logo-img').forEach(img => {
                img.src = logoUrl;
            });
        } catch (_) {
            // Fallback src already set in _render / _injectChatWidget
        }
    }

    // ─── Footer HTML ───────────────────────────────────────────────────────
    _render(fallbackLogo) {
        this.innerHTML = `
            <footer class="bg-gray-50 border-t border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        <!-- Logo & Bio -->
                        <div class="lg:col-span-1">
                            <a href="/" class="flex items-center mb-4">
                                <img src="${fallbackLogo}" alt="ScaleMako Logo" class="footer-logo h-14 w-auto object-contain">
                            </a>
                            <p class="text-gray-400 text-sm font-sans leading-relaxed mt-4">
                                Your AI partner for smarter business growth. We build custom automation solutions that save time and boost revenue.
                            </p>
                        </div>

                        <!-- Platform -->
                        <div>
                            <h4 class="text-gray-900 font-display font-semibold mb-4">Platform</h4>
                            <ul class="space-y-3">
                                <li><a href="index.html#demos" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Demos</a></li>
                                <li><a href="index.html#pricing" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Pricing</a></li>
                                <li><a href="book-demo.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Book Demo</a></li>
                                <li><a href="index.html#how-it-works" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">How It Works</a></li>
                            </ul>
                        </div>

                        <!-- Company -->
                        <div>
                            <h4 class="text-gray-900 font-display font-semibold mb-4">Company</h4>
                            <ul class="space-y-3">
                                <li><a href="about.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">About Us</a></li>
                                <li><a href="faq.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">FAQ</a></li>
                                <li><a href="mailto:hello@scalemako.ai" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Contact</a></li>
                                <li><a href="privacy.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Privacy Policy</a></li>
                                <li><a href="terms.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Terms of Service</a></li>
                            </ul>
                        </div>

                        <!-- Contact -->
                        <div>
                            <h4 class="text-gray-900 font-display font-semibold mb-4">Contact Us</h4>
                            <div class="space-y-3">
                                <a href="mailto:hello@scalemako.ai" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm inline-block">
                                    hello@scalemako.ai
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Copyright -->
                <div class="border-t border-gray-200">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p class="text-gray-600 text-sm font-sans">
                                © ${new Date().getFullYear()} ScaleMako. All rights reserved.
                            </p>
                            <div class="flex items-center gap-6">
                                <a href="privacy.html" class="text-gray-600 hover:text-[#0072FF] transition-colors text-sm font-sans">Privacy</a>
                                <a href="terms.html" class="text-gray-600 hover:text-[#0072FF] transition-colors text-sm font-sans">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        if (typeof feather !== 'undefined') feather.replace();
    }

    // ─── Global chat widget — mounted once, persists across all pages ──────
    _injectChatWidget() {
        // Guard: widget already in DOM (e.g. navigating back to index.html)
        if (document.getElementById('floatingChatButton')) return;

        const container = document.createElement('div');
        container.className = 'fixed bottom-6 right-6 z-50';
        // Logo URL: relative path works on localhost and production
        const logoUrl = 'assets/images/logo.png';
        container.innerHTML = `
            <button id="floatingChatButton" class="relative w-14 h-14 rounded-full bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,114,255,0.32)] hover:shadow-[0_8px_32px_rgba(0,114,255,0.45)] transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 p-1" aria-label="Open chat">
                <img class="chatbot-logo-img w-full h-full object-contain rounded-full absolute inset-0" src="${logoUrl}" alt="Chat" draggable="false" onerror="this.style.display='none';" onload="this.nextElementSibling && (this.nextElementSibling.style.setProperty('display','none'));">
                <svg class="chatbot-icon-fallback w-7 h-7 text-[#0072FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </button>

            <div id="chatWidget" class="chat-widget-container hidden">
                <div class="chat-widget-header">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-[0_2px_10px_rgba(0,114,255,0.12)] p-1">
                            <img class="chatbot-logo-img w-full h-full object-contain" src="/assets/images/logo.png" alt="ScaleMako" draggable="false">
                        </div>
                        <div>
                            <p class="text-gray-900 font-semibold text-sm leading-tight tracking-tight">Mako <span class="text-[#0072FF]">AI</span></p>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="relative flex h-1.5 w-1.5">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                <span class="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-0.5">
                        <button id="chatWidgetRefresh" class="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[#0072FF] transition-all duration-200" title="Start New Conversation">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </button>
                        <button id="chatWidgetFullscreen" class="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[#0072FF] transition-all duration-200" title="Go Full Screen">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                        </button>
                        <button id="chatWidgetClose" class="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-all duration-200 group">
                            <svg class="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                <div id="chatWidgetMessages" class="chat-widget-messages">
                    <div id="chatWidgetWelcome" class="chat-widget-welcome">
                        <div class="text-center mb-5">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center mx-auto mb-3 shadow-[0_4px_14px_rgba(0,114,255,0.25)] mako-icon">
                                <svg class="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30 16 L27 11 L20 7 L18 2 L14 9 L8 9 L2 4 L6 16 L2 28 L8 23 L15 26 L18 30 L22 24 L27 21 Z" fill="white"/>
                                    <circle cx="25" cy="13" r="2" fill="rgba(0,40,140,0.22)"/>
                                    <path d="M16 9 L14 23" stroke="rgba(0,40,140,0.18)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                                </svg>
                            </div>
                            <h3 class="text-sm font-semibold text-gray-900 mb-1 tracking-tight">Hi, I'm Mako <span class="text-[#0072FF]">AI</span></h3>
                            <p class="text-xs text-gray-400 leading-relaxed">Your AI guide to automating your business</p>
                        </div>
                        <div class="space-y-2">
                            <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.1em] mb-2">Quick start</p>
                            <button class="chat-widget-suggestion" data-query="book"><span>Book a Consultation</span></button>
                            <button class="chat-widget-suggestion" data-query="pricing"><span>Pricing &amp; Plans</span></button>
                            <button class="chat-widget-suggestion" data-query="services"><span>Our Services</span></button>
                            <button class="chat-widget-suggestion" data-query="how it works"><span>How It Works</span></button>
                        </div>
                    </div>
                </div>

                <div class="chat-widget-input-area">
                    <div class="relative flex items-center">
                        <textarea id="chatWidgetInput" placeholder="Ask Mako anything..." class="chat-widget-input" rows="1"></textarea>
                        <button id="chatWidgetSend" class="chat-widget-send-btn">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Load widget scripts sequentially, skip any already present
        this._loadWidgetScripts([
            '/assets/js/booking-schema.js',
            '/assets/js/booking-flow.js',
            '/assets/js/chat-widget.js'
        ]);
    }

    _loadWidgetScripts(scripts) {
        const isLoaded = src => !!document.querySelector(
            `script[src$="${src.split('/').pop()}"]`
        );

        const loadNext = (i) => {
            if (i >= scripts.length) return; // chat-widget.js auto-inits itself
            if (isLoaded(scripts[i])) { loadNext(i + 1); return; }
            const s = document.createElement('script');
            s.src = scripts[i];
            s.onload = () => loadNext(i + 1);
            document.body.appendChild(s);
        };

        loadNext(0);
    }
}

customElements.define('custom-footer', CustomFooter);

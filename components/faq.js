class FAQComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section class="py-24 bg-gray-50">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl md:text-4xl font-display font-bold text-gray-900">
                            Frequently Asked <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#00E0FF] to-[#0072FF]">Questions</span>
                        </h2>
                        <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                            Everything you need to know about ScaleMako
                        </p>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="faq-item bg-white rounded-2xl border-2 border-gray-200 hover:border-[#00C6FF] hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                            <button class="faq-question w-full text-left px-8 py-6 flex items-center justify-between group" aria-expanded="false">
                                <span class="text-xl font-display font-semibold text-gray-900 pr-4">How long does setup take?</span>
                                <i data-feather="chevron-down" class="w-6 h-6 text-[#00C6FF] transform transition-transform duration-300 flex-shrink-0 group-aria-expanded:rotate-180"></i>
                            </button>
                            <div class="faq-answer hidden px-8 pb-6">
                                <p class="text-gray-600 font-sans leading-relaxed">
                                    Setup typically takes 7-14 days from your initial demo. This includes configuration, testing, and training your AI agents. For more complex automations or custom integrations, we'll provide a detailed timeline during your discovery call.
                                </p>
                            </div>
                        </div>
                        
                        <div class="faq-item bg-white rounded-2xl border-2 border-gray-200 hover:border-[#00C6FF] hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                            <button class="faq-question w-full text-left px-8 py-6 flex items-center justify-between group" aria-expanded="false">
                                <span class="text-xl font-display font-semibold text-gray-900 pr-4">Is my data secure? Do you comply with GDPR?</span>
                                <i data-feather="chevron-down" class="w-6 h-6 text-[#00C6FF] transform transition-transform duration-300 flex-shrink-0 group-aria-expanded:rotate-180"></i>
                            </button>
                            <div class="faq-answer hidden px-8 pb-6">
                                <p class="text-gray-600 font-sans leading-relaxed">
                                    Yes, we take data security seriously. All data is encrypted in transit and at rest. We are GDPR compliant and follow industry best practices for data protection. Your customer data is never shared with third parties, and you maintain full ownership of all information collected through our systems.
                                </p>
                            </div>
                        </div>
                        
                        <div class="faq-item bg-white rounded-2xl border-2 border-gray-200 hover:border-[#00C6FF] hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                            <button class="faq-question w-full text-left px-8 py-6 flex items-center justify-between group" aria-expanded="false">
                                <span class="text-xl font-display font-semibold text-gray-900 pr-4">Which CRM systems do you integrate with?</span>
                                <i data-feather="chevron-down" class="w-6 h-6 text-[#00C6FF] transform transition-transform duration-300 flex-shrink-0 group-aria-expanded:rotate-180"></i>
                            </button>
                            <div class="faq-answer hidden px-8 pb-6">
                                <p class="text-gray-600 font-sans leading-relaxed">
                                    We integrate with all major CRM platforms through Zapier, Make (Integromat), and direct API connections. This includes HubSpot, Salesforce, Pipedrive, Monday.com, and many others. If you use a custom CRM, we can build a custom integration as part of our Automation package.
                                </p>
                            </div>
                        </div>
                        
                        <div class="faq-item bg-white rounded-2xl border-2 border-gray-200 hover:border-[#00C6FF] hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                            <button class="faq-question w-full text-left px-8 py-6 flex items-center justify-between group" aria-expanded="false">
                                <span class="text-xl font-display font-semibold text-gray-900 pr-4">Do I need to know how to code?</span>
                                <i data-feather="chevron-down" class="w-6 h-6 text-[#00C6FF] transform transition-transform duration-300 flex-shrink-0 group-aria-expanded:rotate-180"></i>
                            </button>
                            <div class="faq-answer hidden px-8 pb-6">
                                <p class="text-gray-600 font-sans leading-relaxed">
                                    No coding required! ScaleMako is built for business owners, not developers. We handle all the technical setup, configuration, and maintenance. You simply provide your business requirements, and we build everything for you. Once live, everything runs automatically.
                                </p>
                            </div>
                        </div>
                        
                        <div class="faq-item bg-white rounded-2xl border-2 border-gray-200 hover:border-[#00C6FF] hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                            <button class="faq-question w-full text-left px-8 py-6 flex items-center justify-between group" aria-expanded="false">
                                <span class="text-xl font-display font-semibold text-gray-900 pr-4">How does the voice agent sound? Will customers know it's AI?</span>
                                <i data-feather="chevron-down" class="w-6 h-6 text-[#00C6FF] transform transition-transform duration-300 flex-shrink-0 group-aria-expanded:rotate-180"></i>
                            </button>
                            <div class="faq-answer hidden px-8 pb-6">
                                <p class="text-gray-600 font-sans leading-relaxed">
                                    Our AI voice agents use advanced neural voice technology that sounds natural and human-like. Most customers can't tell the difference. The voice can be customized to match your brand tone, and it handles natural conversation flow, interruptions, and context switching just like a human receptionist would.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Initialize FAQ interactions
        this.initFAQ();
    }
    
    initFAQ() {
        const faqItems = this.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const button = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('i[data-feather]');
            
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherButton = otherItem.querySelector('.faq-question');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('i[data-feather]');
                        
                        otherButton.setAttribute('aria-expanded', 'false');
                        otherAnswer.classList.add('hidden');
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    button.setAttribute('aria-expanded', 'false');
                    answer.classList.add('hidden');
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                } else {
                    button.setAttribute('aria-expanded', 'true');
                    answer.classList.remove('hidden');
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                }
                
                // Reinitialize Feather icons if needed
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            });
        });
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

customElements.define('faq-section', FAQComponent);


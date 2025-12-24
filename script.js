
// Typing animation for AI Agent section
let globalTypingTimeout = null;

function initAIAgentTyping() {
    const messageText = document.querySelector('.typing-text');
if (!messageText) return;
    
    // Clear any existing timeout
    if (globalTypingTimeout) {
        clearTimeout(globalTypingTimeout);
    }
    
    const phrases = [
        "🚀 Your business is about to scale like never before...",
        "⚡ 24/7 AI agents working while you sleep = more revenue",
        "💼 Imagine never missing a lead or call again",
        "🎯 We build custom AI that converts visitors into customers",
        "🤖 Our AI handles your calls, chats, and bookings automatically",
        "📈 Save 10+ hours/week while closing 20% more leads",
        "✨ Enterprise-grade AI. Built for small businesses.",
        "🔥 Your competition doesn't have this. You will."
    ];
let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;
    const dots = '<span class="typing-dots">.</span><span class="typing-dots" style="animation-delay:0.2s">.</span><span class="typing-dots" style="animation-delay:0.4s">.</span>';
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            messageText.innerHTML = currentPhrase.substring(0, charIndex - 1) + dots;
            charIndex--;
        } else {
            messageText.innerHTML = currentPhrase.substring(0, charIndex + 1) + dots;
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingTimeout = setTimeout(() => {
                isDeleting = true;
                type();
            }, 1500); // Longer pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            // Show dots while waiting for next phrase
            messageText.innerHTML = dots;
            typingTimeout = setTimeout(type, 800);
} else {
            const speed = isDeleting ? 50 : 100;
            typingTimeout = setTimeout(type, speed);
        }
    }
    // Add dots animation styles
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: inline-block;
            color: #A88BFF;
            opacity: 0;
            animation: dots 1.2s infinite;
        }
        @keyframes dots {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
`;
document.head.appendChild(style);

    // Start typing
    typingTimeout = setTimeout(type, 1000);
    globalTypingTimeout = typingTimeout;

    // Clean up on page leave
    window.addEventListener('beforeunload', () => {
        clearTimeout(typingTimeout);
    });
    
    // Expose clear function
    window.clearAITyping = function() {
        if (globalTypingTimeout) {
            clearTimeout(globalTypingTimeout);
            globalTypingTimeout = null;
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    initAIAgentTyping();
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        // Initial state
        mainNav.classList.add('nav-transparent');
        
        const handleNavScroll = () => {
            if (window.scrollY > 50) {
                mainNav.classList.remove('nav-transparent');
                mainNav.classList.add('nav-scrolled');
            } else {
                mainNav.classList.remove('nav-scrolled');
                mainNav.classList.add('nav-transparent');
            }
        };
        
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll(); // Check initial state
    }
    
    // ============================================
    // GEMINI-STYLE CHAT MODAL
    // ============================================
    initChatModal();
    
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Video modal functionality
    const videoButtons = document.querySelectorAll('[data-video]');
    videoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video');
            // In a real implementation, you would open a modal with the video embed
            console.log('Opening video:', videoId);
        });
    });

    // Chat widget toggle
    const chatButton = document.querySelector('.fixed.bottom-6.right-6 button');
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            // In a real implementation, this would open a chat widget
            console.log('Opening chat widget');
        });
    }

    // Demo form submission
    const demoForms = document.querySelectorAll('[data-demo-form]');
    demoForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, this would submit to your backend
            console.log('Form submitted');
            alert('Thank you! We will contact you shortly to schedule your demo.');
            form.reset();
        });
    });

    // Intersection Observer for animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.scroll-animate');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    animateOnScroll();
    
    // Staggered fade-in for Services and Pricing cards
    const initStaggeredAnimations = () => {
        // Services section cards
        const servicesGrid = document.getElementById('services-grid');
        if (servicesGrid) {
            const serviceCards = servicesGrid.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.classList.add('animate-fade-in-up');
            });
            
            const servicesObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const cards = entry.target.querySelectorAll('.service-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                        servicesObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            servicesObserver.observe(servicesGrid);
        }
        
        // Pricing section cards
        const pricingGrid = document.getElementById('pricing-grid');
        if (pricingGrid) {
            const pricingCards = pricingGrid.querySelectorAll('.pricing-card');
            pricingCards.forEach(card => {
                card.classList.add('animate-fade-in-up');
            });
            
            const pricingObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const cards = entry.target.querySelectorAll('.pricing-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                        pricingObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            pricingObserver.observe(pricingGrid);
        }
    };
    
    // Initialize staggered animations
    initStaggeredAnimations();
});

// OLD Chatbot functionality - DEPRECATED (replaced by initChatModal)
// This function is kept for backwards compatibility but does nothing
function initChatbot() {
    // This function is deprecated - the new modal system uses initChatModal()
    // Do nothing - all functionality moved to initChatModal()
    return;
}

// The rest of the old initChatbot code has been removed - it's no longer needed
// All chatbot functionality is now handled by initChatModal()

function _oldInitChatbotCodeRemoved() {
    // This function is a placeholder - old code removed
    if (false) {
        console.error('demoMode not found!');
        return;
    }
    
    if (!chatMode) {
        console.error('chatMode not found!');
        return;
    }
    
    // Set initial state - ensure chatMode is hidden
    chatMode.style.display = 'none';
    chatMode.classList.add('hidden');
    demoMode.style.display = 'block';
    demoMode.classList.remove('hidden');
    
    // Ensure button is clickable
    chatToggleBtn.style.pointerEvents = 'auto';
    chatToggleBtn.style.cursor = 'pointer';
    chatToggleBtn.style.zIndex = '50';
    
    // Add click handler with multiple methods
    function handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isChatMode = !isChatMode;
        
        if (isChatMode) {
            // Switch to chat mode
            demoMode.style.display = 'none';
            demoMode.classList.add('hidden');
            chatMode.style.display = 'block';
            chatMode.classList.remove('hidden');
            
            if (toggleBtnText) {
                toggleBtnText.textContent = 'Back to Demo';
            }
            
            // Stop typing animation
            if (typeof window.clearAITyping === 'function') {
                window.clearAITyping();
            }
            
            // Focus input after a short delay
            setTimeout(() => {
                if (chatInput) {
                    chatInput.focus();
                }
            }, 100);
        } else {
            // Switch to demo mode
            chatMode.style.display = 'none';
            chatMode.classList.add('hidden');
            demoMode.style.display = 'block';
            demoMode.classList.remove('hidden');
            
            if (toggleBtnText) {
                toggleBtnText.textContent = 'Try Live Chat';
            }
            
            // Restart typing animation
            initAIAgentTyping();
        }
    }
    
    // Add multiple event handlers to ensure it works
    chatToggleBtn.addEventListener('click', handleToggle);
    chatToggleBtn.addEventListener('mousedown', handleToggle);
    chatToggleBtn.onclick = handleToggle;
    
    // Button hover effects
    chatToggleBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    chatToggleBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get AI response
        setTimeout(() => {
            hideTypingIndicator();
            const response = getAIResponse(message);
            addMessage(response, 'ai');
        }, 800);
    }
    
    // Format text with basic markdown and links
    function formatMessage(text) {
        let formatted = escapeHtml(text);
        
        // Handle links - process markdown links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, linkText, url) {
            if (url.startsWith('#')) {
                // Anchor link - use smooth scroll
                return `<a href="${url}" class="text-primary-400 hover:text-primary-300 underline cursor-pointer" onclick="event.preventDefault(); event.stopPropagation(); const el = document.querySelector('${url}'); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); return false;">${linkText}</a>`;
            } else {
                // External or page link
                return `<a href="${url}" class="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            }
        });
        
        // Handle bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-400">$1</strong>');
        
        // Handle line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-2 justify-end">
                    <div class="flex-1 bg-primary-500/20 rounded-lg rounded-tr-none p-3 border border-primary-500/30 max-w-[80%] ml-auto">
                        <p class="text-white text-sm leading-relaxed">${escapeHtml(text)}</p>
                    </div>
                    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-2">
                    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 bg-dark-800/50 rounded-lg rounded-tl-none p-3 border border-primary-500/20">
                        <p class="text-gray-100 text-sm leading-relaxed">${formatMessage(text)}</p>
                    </div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message ai-message';
        typingDiv.innerHTML = `
            <div class="flex items-start space-x-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <div class="flex-1 bg-dark-800/50 rounded-lg rounded-tl-none p-3 border border-primary-500/20">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                        <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 0.2s"></div>
                        <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 0.4s"></div>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Website knowledge base - what the bot knows about
    const websiteKnowledge = {
        pages: {
            'home': { url: 'index.html', description: 'Main homepage' },
            'book demo': { url: 'book-demo.html', description: 'Book a demo page' },
            'demo': { url: 'book-demo.html', description: 'Book a demo page' }
        },
        sections: {
            'demos': { anchor: '#demos', description: 'Demo videos section' },
            'pricing': { anchor: '#book-demo', description: 'Pricing information' }
        },
        services: ['AI Websites', 'Chat Assistants', 'Workflow Automations', 'Voice Receptionists'],
        topics: ['services', 'pricing', 'demos', 'testimonials', 'features', 'setup', 'contact', 'booking']
    };

    // Check if question is ambiguous
    function isAmbiguous(message) {
        const ambiguousPatterns = [
            /\b(it|that|this|they|them)\b/i,
            /\b(what|which|how)\s+(is|are|do|does|can)\s+\w{1,3}\?/i,
            /^\w{1,5}\?$/,
            /\b(more|details?|info|information)\b/i
        ];
        
        const words = message.toLowerCase().split(/\s+/);
        if (words.length < 3) return true;
        
        return ambiguousPatterns.some(pattern => pattern.test(message));
    }

    // Check if question is outside knowledge base
    function isOutsideKnowledge(message) {
        const lowerMessage = message.toLowerCase();
        const unrelatedTopics = [
            'weather', 'sports', 'politics', 'news', 'recipe', 'cooking',
            'movie', 'music', 'game', 'joke', 'funny', 'personal', 'your',
            'other company', 'competitor', 'weather forecast'
        ];
        
        // Check if it's asking about unrelated topics
        if (unrelatedTopics.some(topic => lowerMessage.includes(topic))) {
            return true;
        }
        
        // Check if it's asking about things not on the website
        const websiteTopics = [
            'service', 'price', 'pricing', 'cost', 'website', 'chatbot',
            'voice', 'call', 'automation', 'workflow', 'demo', 'book',
            'schedule', 'contact', 'email', 'setup', 'how', 'what', 'where',
            'when', 'why', 'navigation', 'page', 'section', 'demos', 'testimonial'
        ];
        
        // If message doesn't contain any website-related keywords and is a question
        if (!websiteTopics.some(topic => lowerMessage.includes(topic)) && 
            (lowerMessage.includes('?') || lowerMessage.startsWith('what') || 
             lowerMessage.startsWith('how') || lowerMessage.startsWith('where') ||
             lowerMessage.startsWith('when') || lowerMessage.startsWith('why'))) {
            return true;
        }
        
        return false;
    }

    // Get AI response based on user input
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // Normalize common typos and casual language
        const normalizedMessage = lowerMessage
            .replace(/\b(ur|u|yu|ya)\b/g, 'you')
            .replace(/\b(pls|plz|pleez)\b/g, 'please')
            .replace(/\b(thx|thanx|tks)\b/g, 'thanks')
            .replace(/\b(yea|yeah|yep|yup)\b/g, 'yes')
            .replace(/\b(nah|nope|na)\b/g, 'no')
            .replace(/\b(wut|wat)\b/g, 'what')
            .replace(/\b(how much|how much does|how much do|cost|price|pricing)\b/g, 'pricing');
        
        // Check for ambiguous questions
        if (isAmbiguous(message) && !normalizedMessage.match(/^(hi|hello|hey|thanks|thank you)/)) {
            return "I'd be happy to help! Could you clarify what you'd like to know? For example:\n\n• \"What services do you offer?\"\n• \"How do I book a demo?\"\n• \"Where can I see pricing?\"\n\nWhat specific information can I help you with?";
        }
        
        // Check if question is outside knowledge base
        if (isOutsideKnowledge(message)) {
            return "I don't have information about that topic. I'm here to help with:\n\n• **Navigation** - Finding pages and sections on our website\n• **Services** - Our AI solutions (websites, chatbots, voice agents, automations)\n• **Pricing** - Our plans and pricing\n• **Booking** - How to schedule a demo\n\nWhat would you like to know about ScaleBuddy?";
        }
        
        // Enhanced Pricing Questions - Monthly vs Yearly, Free Trials, Discounts
        if (normalizedMessage.includes('pricing') || normalizedMessage.includes('price') || normalizedMessage.includes('cost') || 
            normalizedMessage.includes('how much') || normalizedMessage.includes('monthly') || normalizedMessage.includes('yearly') ||
            normalizedMessage.includes('annual') || normalizedMessage.includes('free trial') || 
            normalizedMessage.includes('discount') || normalizedMessage.includes('trial')) {
            
            // Monthly vs Yearly plans
            if ((normalizedMessage.includes('monthly') && normalizedMessage.includes('yearly')) || 
                (normalizedMessage.includes('monthly') && normalizedMessage.includes('annual'))) {
                return "We currently offer **monthly plans** only. All plans are billed monthly:\n\n• **Starter** - $99/month + $499 one-time setup\n• **Growth** - $199/month + $999 one-time setup\n• **Scale** - $299/month + $1,499 one-time setup\n• **Automation** - $750 per project (one-time)\n\n[View full pricing details](#book-demo) or [book a demo](book-demo.html) to discuss annual payment options.";
            }
            
            // Free trial questions
            if (normalizedMessage.includes('free trial') || normalizedMessage.includes('trial') || 
                (normalizedMessage.includes('free') && normalizedMessage.includes('try'))) {
                return "We offer a **free demo** (not a free trial) where we show you exactly how our AI solutions work for your business.\n\nThe demo is:\n• **100% free** - No cost, no obligation\n• **30 minutes** - Quick overview of our services\n• **Personalized** - Tailored to your business needs\n\n[Book your free demo](book-demo.html) to see our AI in action!";
            }
            
            // Discount questions
            if (normalizedMessage.includes('discount') || normalizedMessage.includes('promo') || 
                normalizedMessage.includes('coupon') || normalizedMessage.includes('deal')) {
                return "We don't currently offer discounts or promo codes. Our pricing is transparent and all-inclusive.\n\nHowever, you can:\n• [Book a free demo](book-demo.html) to see if our services fit your needs\n• Discuss custom pricing for enterprise needs during your demo\n\n[View our pricing](#book-demo) to see all plans.";
            }
            
            // General pricing question
            return "Our pricing plans:\n\n**Starter** - $99/month + $499 setup\n• AI Voice Agent, 100 calls/month, Basic Scheduling\n\n**Growth** (Most Popular) - $199/month + $999 setup\n• Voice + Chatbot, 250 calls/month, Advanced Scheduling, Lead Capture\n\n**Scale** - $299/month + $1,499 setup\n• Full AI Website, Built-in Chatbot, SEO Optimized, 1 Year Hosting\n\n**Automation** - $750/project (one-time)\n• Workflow Setup, CRM Integration, Email/SMS Notifications\n\nAll plans are **monthly billing**. [View full details](#book-demo) or [book a demo](book-demo.html) to discuss which plan fits you.";
        }
        
        // Enhanced Service Questions - Which plan includes what, services not offered
        if (normalizedMessage.includes('service') || normalizedMessage.includes('offer') || normalizedMessage.includes('what do you') ||
            normalizedMessage.includes('which plan') || normalizedMessage.includes('what plan') || normalizedMessage.includes('plan include')) {
            
            // Which plan includes specific feature
            if (normalizedMessage.includes('which plan') || normalizedMessage.includes('what plan') || normalizedMessage.includes('plan include')) {
                if (normalizedMessage.includes('website') || normalizedMessage.includes('web')) {
                    return "**AI Websites** are included in the **Scale** plan ($299/month + $1,499 setup).\n\nThis includes:\n• Full AI-powered website\n• Built-in chatbot\n• SEO optimization\n• 1 year hosting\n\n[View Scale plan details](#book-demo) or [book a demo](book-demo.html) to see it in action.";
                }
                if (normalizedMessage.includes('chatbot') || normalizedMessage.includes('chat assistant')) {
                    return "**Chat Assistants** are included in:\n\n• **Growth** plan ($199/month) - Chatbot + Voice Agent\n• **Scale** plan ($299/month) - Built into the AI Website\n\n[View pricing](#book-demo) or [book a demo](book-demo.html) to learn more.";
                }
                if (normalizedMessage.includes('voice') || normalizedMessage.includes('receptionist') || normalizedMessage.includes('call')) {
                    return "**Voice Receptionists** are included in:\n\n• **Starter** plan ($99/month) - Voice Agent only\n• **Growth** plan ($199/month) - Voice + Chatbot\n\n[View pricing details](#book-demo) or [book a demo](book-demo.html).";
                }
                if (normalizedMessage.includes('automation') || normalizedMessage.includes('workflow')) {
                    return "**Workflow Automations** are available as a separate **Automation** project ($750 one-time).\n\nThis can be added to any plan and includes:\n• Forms → CRM integration\n• Email/SMS notifications\n• Zapier/Make automation\n\n[Book a demo](book-demo.html) to discuss your automation needs.";
                }
                return "Here's which plan includes what:\n\n• **Starter** - Voice Agent only\n• **Growth** - Voice + Chatbot\n• **Scale** - Full AI Website with chatbot\n• **Automation** - Workflow automation (add-on)\n\n[View full pricing](#book-demo) or ask about a specific feature.";
            }
            
            // Check for services not offered
            const notOfferedKeywords = ['social media', 'seo service', 'graphic design', 'content writing', 'advertising', 
                                       'ppc', 'google ads', 'facebook ads', 'email marketing', 'consulting', 'training'];
            
            if (notOfferedKeywords.some(keyword => normalizedMessage.includes(keyword))) {
                return "We don't offer that service. We specialize in:\n\n• **AI Websites** - Conversion-driven sites with built-in AI\n• **Chat Assistants** - 24/7 automated support\n• **Voice Receptionists** - AI phone agents\n• **Workflow Automations** - Tool integrations\n\n[View our services](#demos) or [book a demo](book-demo.html) to see what we can do for your business.";
            }
            
            // General service question
            return "We offer 4 main services:\n\n1. **AI Websites** - Sites with built-in AI chat and automated booking (Scale plan)\n2. **Chat Assistants** - 24/7 automated support (Growth & Scale plans)\n3. **Voice Receptionists** - AI phone agents (Starter & Growth plans)\n4. **Workflow Automations** - Connect your tools (Separate project)\n\n[View demos](#demos) or ask which plan includes a specific service.";
        }
        
        // Enhanced Booking Demo Questions - Free confirmation, scheduling, rescheduling
        if (normalizedMessage.includes('book') || normalizedMessage.includes('demo') || normalizedMessage.includes('schedule') ||
            normalizedMessage.includes('appointment') || normalizedMessage.includes('meeting') || normalizedMessage.includes('next week') ||
            normalizedMessage.includes('reschedule') || normalizedMessage.includes('cancel')) {
            
            // Is demo free?
            if (normalizedMessage.includes('free') && (normalizedMessage.includes('demo') || normalizedMessage.includes('book'))) {
                return "Yes! The demo is **completely free** with no obligation.\n\n**What to expect:**\n• 30-minute personalized demo\n• See our AI solutions in action\n• Discuss your business needs\n• Get a custom recommendation\n\n[Book your free demo](book-demo.html) now!";
            }
            
            // Scheduling for specific time (next week, etc.)
            if (normalizedMessage.includes('next week') || normalizedMessage.includes('tomorrow') || normalizedMessage.includes('today') ||
                normalizedMessage.includes('when can') || normalizedMessage.includes('available')) {
                return "To schedule a demo:\n\n**Step 1:** [Visit book-demo.html](book-demo.html)\n**Step 2:** Fill out the form with your preferred date/time\n**Step 3:** We'll confirm your appointment via email\n\nWe typically schedule demos within 1-2 business days. [Book now](book-demo.html) and mention your preferred time in the form!";
            }
            
            // Rescheduling
            if (normalizedMessage.includes('reschedule') || normalizedMessage.includes('change') || normalizedMessage.includes('move')) {
                return "To reschedule your demo:\n\n**Option 1:** Reply to your confirmation email\n**Option 2:** Email us at hello@scalebuddy.ai\n**Option 3:** [Book a new demo](book-demo.html) and mention it's a reschedule\n\nWe're happy to find a time that works better for you!";
            }
            
            // Canceling
            if (normalizedMessage.includes('cancel')) {
                return "To cancel your demo:\n\n• Reply to your confirmation email\n• Or email us at hello@scalebuddy.ai\n\nNo problem at all! You can always [book again](book-demo.html) when you're ready.";
            }
            
            // General booking question
            return "Here's how to book a demo:\n\n**Step 1:** Click \"Book Demo\" in the navigation (top right)\n**Step 2:** Or [visit book-demo.html](book-demo.html) directly\n**Step 3:** Fill out the form with your information\n**Step 4:** We'll contact you within 1-2 business days to schedule\n\n**The demo is:**\n• ✅ **100% free** - No cost, no obligation\n• ⏱️ **30 minutes** - Quick and informative\n• 🎯 **Personalized** - Tailored to your business\n\n[Book your free demo](book-demo.html) now!";
        }
        
        // Navigation questions
        if (normalizedMessage.includes('where') && (normalizedMessage.includes('find') || normalizedMessage.includes('see') || normalizedMessage.includes('go') || normalizedMessage.includes('navigate'))) {
            if (normalizedMessage.includes('pricing') || normalizedMessage.includes('price')) {
                return "You can find pricing information in two ways:\n\n1. Scroll down to the **Pricing** section on this page\n2. Click the \"Pricing\" link in the navigation bar\n\nOr [view pricing section](#book-demo) directly.";
            }
            if (normalizedMessage.includes('demo') || normalizedMessage.includes('demos')) {
                return "You can view demos here:\n\n1. Scroll to the **Demos** section on this page\n2. Click \"Demos\" in the navigation bar\n3. Visit [book-demo.html](book-demo.html) to schedule a demo\n\nOr [view demos section](#demos) directly.";
            }
            if (normalizedMessage.includes('service')) {
                return "Our services are listed in the **Services** section on this page. Scroll down from the top to view them.\n\nWe offer: AI Websites, Chat Assistants, Workflow Automations, and Voice Receptionists.\n\nYou can also [view demos](#demos) to see them in action.";
            }
            if (normalizedMessage.includes('testimonial') || normalizedMessage.includes('review')) {
                return "Testimonials are in the **Testimonials** section. Scroll down on this page to read client reviews.";
            }
            return "Here's how to navigate our site:\n\n• **Services** - Scroll down or use navigation\n• **Demos** - [View demos section](#demos)\n• **Pricing** - [View pricing section](#book-demo)\n• **Book Demo** - [Visit book-demo.html](book-demo.html)\n\nWhat section would you like to find?";
        }
        
        // How to do something - step-by-step guidance
        if (normalizedMessage.includes('how') && (normalizedMessage.includes('do') || normalizedMessage.includes('can') || normalizedMessage.includes('to'))) {
            if (normalizedMessage.includes('contact') || normalizedMessage.includes('reach')) {
                return "Here's how to contact us:\n\n**Step 1:** Book a demo using the \"Book Demo\" button\n**Step 2:** Or use this chat to ask questions\n**Step 3:** Email us at hello@scalebuddy.ai\n\nWe're here to help! What do you need?";
            }
            if (normalizedMessage.includes('get started') || normalizedMessage.includes('start')) {
                return "Getting started is simple:\n\n**Step 1:** [Book a free demo](book-demo.html) (30 minutes)\n**Step 2:** We'll discuss your business needs\n**Step 3:** We build your custom AI solution\n**Step 4:** Launch in 1-3 weeks\n\nNo coding required! Ready to start?";
            }
        }
        
        // AI Websites
        if (normalizedMessage.includes('website') || normalizedMessage.includes('web')) {
            return "**AI Websites** are included in the **Scale** plan ($299/month).\n\n**Features:**\n• Built-in AI chat\n• Automated booking\n• SEO optimized\n• Fully responsive\n• 1 year hosting included\n\n[View demos](#demos) or [book a demo](book-demo.html) to see it in action.";
        }
        
        // Chatbots
        if (normalizedMessage.includes('chatbot') || normalizedMessage.includes('chat assistant') || normalizedMessage.includes('chat bot')) {
            return "**Chat Assistants** are available in:\n\n• **Growth** plan ($199/month) - Standalone chatbot\n• **Scale** plan ($299/month) - Built into AI Website\n\n**Features:**\n• 24/7 automated support\n• Instant answers\n• Lead qualification\n• Appointment booking\n\n[See chatbot demo](#demos) or [view pricing](#book-demo).";
        }
        
        // Voice Agents
        if (normalizedMessage.includes('voice') || normalizedMessage.includes('receptionist') || (normalizedMessage.includes('call') && normalizedMessage.includes('ai'))) {
            return "**Voice Receptionists** are available in:\n\n• **Starter** plan ($99/month) - Voice Agent only\n• **Growth** plan ($199/month) - Voice + Chatbot\n\n**Features:**\n• Answer calls 24/7\n• Qualify leads automatically\n• Schedule appointments\n• Never miss a call\n\n[View voice agent demo](#demos) or [see pricing](#book-demo).";
        }
        
        // Automation
        if (normalizedMessage.includes('automation') || normalizedMessage.includes('workflow') || normalizedMessage.includes('integrat')) {
            return "**Workflow Automations** are available as a separate project ($750 one-time).\n\n**Features:**\n• Forms → CRM integration\n• Email/SMS notifications\n• Zapier/Make connections\n• Seamless tool integration\n\nCan be added to any plan. [See automation demo](#demos) or [book a demo](book-demo.html) to discuss your needs.";
        }
        
        // Benefits/Why choose - shorter
        if (normalizedMessage.includes('benefit') || normalizedMessage.includes('why') || normalizedMessage.includes('advantage')) {
            return "Key benefits:\n\n• Save 10+ hours/week\n• Close 20% more leads\n• Reduce overhead costs\n• Scale 24/7\n\nScroll down to read testimonials from our clients.";
        }
        
        // Setup/How it works - step-by-step
        if (normalizedMessage.includes('setup') || (normalizedMessage.includes('how') && normalizedMessage.includes('work'))) {
            return "Setup process:\n\n**Step 1:** [Book a free demo](book-demo.html)\n**Step 2:** We understand your needs\n**Step 3:** Custom solution built\n**Step 4:** Launch in 1-3 weeks\n\nNo coding required!";
        }
        
        // Contact - concise
        if (normalizedMessage.includes('contact') || normalizedMessage.includes('email') || normalizedMessage.includes('reach')) {
            return "Contact us:\n\n• **Book Demo:** [book-demo.html](book-demo.html)\n• **Email:** hello@scalebuddy.ai\n• **Chat:** Right here!\n\nWhat can I help you with?";
        }
        
        // Time/When - shorter
        if (normalizedMessage.includes('time') || normalizedMessage.includes('when') || normalizedMessage.includes('how long')) {
            return "Setup times:\n\n• Chatbots/Voice: 1-2 weeks\n• Websites: 2-3 weeks\n• Automations: 1-2 weeks\n\nResults start immediately after launch!";
        }
        
        // Technology - concise
        if (normalizedMessage.includes('tech') || normalizedMessage.includes('built') || normalizedMessage.includes('openai') || normalizedMessage.includes('gpt')) {
            return "We use:\n\n• OpenAI GPT-4\n• Custom code\n• Enterprise security\n• < 100ms response times\n\nWe build custom AI solutions, not basic chatbots.";
        }
        
        // Greetings - friendly
        if (normalizedMessage.match(/^(hi|hello|hey|greetings)/)) {
            return "Hi! 👋 I'm here to help you navigate our website and learn about ScaleBuddy's AI services.\n\nI can help with:\n• Finding pages and sections\n• Service information\n• Pricing details\n• Booking a demo\n\nWhat would you like to know?";
        }
        
        // Default fallback - helpful
        return "I can help you with:\n\n• **Navigation** - Finding sections like [demos](#demos) or [pricing](#book-demo)\n• **Services** - AI Websites, Chatbots, Voice Agents, Automations\n• **Pricing** - Our plans starting at $99/mo\n• **Booking** - [Book a demo](book-demo.html)\n\nWhat specific question can I answer?";
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Send button click
    if (sendBtn) {
        sendBtn.addEventListener('click', () => sendMessage());
    }
    
    // Enter key to send
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Make sendMessage accessible
    window.sendChatMessage = sendMessage;
}

// Form handling for newsletter
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    
    // In a real implementation, you would send this to your backend
    console.log('Submitting email:', email);
    
    alert('Thank you for subscribing!');
    event.target.reset();
}

// ============================================
// GEMINI-STYLE CHAT MODAL FUNCTIONALITY
// ============================================
function initChatModal() {
    // Elements
    const modal = document.getElementById('chatModal');
    const backdrop = document.getElementById('chatBackdrop');
    const closeBtn = document.getElementById('closeModalBtn');
    const startChatBtn = document.getElementById('startChatBtn');
    const agentTeaser = document.getElementById('agentTeaser');
    const chatInput = document.getElementById('modalChatInput');
    const sendBtn = document.getElementById('modalSendBtn');
    const welcomeState = document.getElementById('welcomeState');
    const conversationState = document.getElementById('conversationState');
    const chatMessages = document.getElementById('modalChatMessages');
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    
    if (!modal) {
        console.error('Chat modal element not found!');
        return;
    }
    
    console.log('Chat modal initialized successfully', { modal });
    
    let isChatOpen = false;
    let hasStartedConversation = false;
    
    // Pre-written responses
    const responses = {
        services: "We offer three main AI-powered services:\n\n**1. AI Voice Agents** — Answer calls 24/7, qualify leads, and book appointments automatically.\n\n**2. Chat Assistants** — Handle website chat, answer questions instantly, and capture leads.\n\n**3. Workflow Automations** — Connect your CRM, email, and tools seamlessly.\n\nAll solutions are custom-built for your business. Would you like details on any specific service?",
        qualify: "Our AI agents work around the clock to qualify your leads:\n\n✅ **Instant Response** — Engage visitors within seconds, not hours\n✅ **Smart Questions** — Ask qualifying questions to identify hot leads\n✅ **Auto-Booking** — Schedule appointments directly on your calendar\n✅ **CRM Sync** — Push qualified leads to your existing tools\n\nBusinesses using our AI see an average **20% increase in qualified leads**. Want to see it in action?",
        cost: "Our pricing is transparent and scales with your needs:\n\n• **Starter** — $99/mo + $499 setup (Voice Agent)\n• **Growth** — $199/mo + $999 setup (Voice + Chatbot)\n• **Scale** — $299/mo + $1,499 setup (Full AI Website)\n• **Automations** — $750 one-time per project\n\nAll plans include unlimited conversations. [Book a free demo](book-demo.html) to discuss which plan fits your business!",
        demo: "I'd love to set you up with a free demo! Here's what to expect:\n\n📅 **30 minutes** — Quick but comprehensive\n🎯 **Personalized** — Tailored to your specific business\n💰 **No obligation** — Just learning and questions\n\n**How to book:**\n1. Click 'Book a Free Demo' in the navigation\n2. Or visit [book-demo.html](book-demo.html)\n3. Pick a time that works for you\n\nWe'll contact you within 1 business day to confirm!"
    };
    
    // Open Modal
    function openModal() {
        console.log('Opening chat modal...', modal);
        if (!modal) {
            console.error('Modal element not found!');
            return;
        }
        
        isChatOpen = true;
        
        // Remove inline display:none style to allow CSS to take over
        modal.style.removeProperty('display');
        if (backdrop) backdrop.style.removeProperty('opacity');
        
        // Force a reflow, then add active class
        void modal.offsetHeight;
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus input after a short delay
        setTimeout(() => {
            if (chatInput) {
                chatInput.focus();
                console.log('Input focused');
            }
        }, 100);
    }
    
    // Close Modal
    function closeModal() {
        console.log('Closing chat modal...');
        isChatOpen = false;
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // After animation, restore inline styles to ensure it stays hidden
        setTimeout(() => {
            modal.style.setProperty('display', 'none', 'important');
            if (backdrop) backdrop.style.setProperty('opacity', '0', 'important');
            resetToWelcome();
        }, 300);
    }
    
    // Expose to global scope for inline onclick and debugging
    window.openChatModal = openModal;
    window.closeChatModal = closeModal;
    
    // Test function for debugging
    window.testModal = function() {
        console.log('Testing modal...');
        console.log('Modal element:', modal);
        console.log('Button element:', startChatBtn);
        console.log('Modal classes:', modal ? modal.className : 'N/A');
        console.log('Modal display style:', modal ? modal.style.display : 'N/A');
        openModal();
    };
    
    // Switch to conversation mode
    function startConversation() {
        if (hasStartedConversation) return;
        hasStartedConversation = true;
        
        welcomeState.classList.add('hidden');
        conversationState.classList.remove('hidden');
        
        // Add initial AI greeting
        addAIMessage("Hello! I'm ScaleBuddy's virtual assistant. I can show you how we automate sales, explain our services, or help you book a demo. What would you like to know?");
    }
    
    // Reset to welcome state
    function resetToWelcome() {
        hasStartedConversation = false;
        welcomeState.classList.remove('hidden');
        conversationState.classList.add('hidden');
        if (chatMessages) chatMessages.innerHTML = '';
    }
    
    // Add user message
    function addUserMessage(text) {
        if (!hasStartedConversation) startConversation();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 justify-end chat-message-animate';
        messageDiv.innerHTML = `
            <div class="flex-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-2xl rounded-tr-none p-4 max-w-[80%] ml-auto shadow-lg shadow-indigo-500/10">
                <p class="text-white text-base leading-relaxed font-sans">${escapeHtml(text)}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Add AI message
    function addAIMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-4 chat-message-animate';
        messageDiv.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </div>
            <div class="flex-1 bg-slate-800/60 rounded-2xl rounded-tl-none p-5 border border-slate-700/50 max-w-[85%]">
                <p class="text-gray-100 text-base leading-relaxed font-sans whitespace-pre-line">${formatMessage(text)}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Add typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'modal-typing-indicator';
        typingDiv.className = 'flex items-start space-x-4 chat-message-animate';
        typingDiv.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </div>
            <div class="bg-slate-800/60 rounded-2xl rounded-tl-none px-5 py-4 border border-slate-700/50">
                <div class="flex space-x-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-indigo-400 typing-dot"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-indigo-400 typing-dot"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-indigo-400 typing-dot"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const indicator = document.getElementById('modal-typing-indicator');
        if (indicator) indicator.remove();
    }
    
    // Handle question (from cards or input)
    function handleQuestion(questionKey) {
        const questionTexts = {
            services: "What AI services do you offer?",
            qualify: "How can you help qualify my leads?",
            cost: "What are your pricing plans?",
            demo: "I'd like to book a demo"
        };
        
        const questionText = questionTexts[questionKey] || questionKey;
        addUserMessage(questionText);
        
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const response = responses[questionKey] || "I'd be happy to help with that! For more specific questions, I'd recommend booking a free demo where our team can give you personalized answers.";
            addAIMessage(response);
        }, 1200 + Math.random() * 800);
    }
    
    // Handle send
    function handleSend() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        if (!hasStartedConversation) startConversation();
        
        addUserMessage(message);
        chatInput.value = '';
        
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            
            const lowerMessage = message.toLowerCase();
            let response = "Thanks for your question! I can help with information about our AI services, pricing, or booking a demo. For more specific business questions, our team would love to chat with you during a free demo call.";
            
            if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you')) {
                response = responses.services;
            } else if (lowerMessage.includes('qualify') || lowerMessage.includes('lead') || lowerMessage.includes('24/7')) {
                response = responses.qualify;
            } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('how much') || lowerMessage.includes('pricing')) {
                response = responses.cost;
            } else if (lowerMessage.includes('demo') || lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
                response = responses.demo;
            } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                response = "Hello! 👋 Great to meet you. I'm here to help you learn about ScaleBuddy's AI solutions. What would you like to know about?";
            }
            
            addAIMessage(response);
        }, 1200 + Math.random() * 800);
    }
    
    // Format message with markdown-like syntax
    function formatMessage(text) {
        let formatted = escapeHtml(text);
        // Handle markdown links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
            return `<a href="${url}" class="text-indigo-400 hover:text-indigo-300 underline font-medium" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`;
        });
        // Handle bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        return formatted;
    }
    
    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Scroll to bottom
    function scrollToBottom() {
        setTimeout(() => {
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
    
    // Event Listeners
    
    // Open modal from hero button ONLY (not the entire card)
    // Use document delegation or find button at runtime
    const attachButtonListener = () => {
        const btn = document.getElementById('startChatBtn');
        if (btn) {
            console.log('Button found, attaching click listener...', btn);
            
            // Remove any existing listener by using once or removing and re-adding
            const clickHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked! Opening modal...');
                openModal();
                return false;
            };
            
            btn.addEventListener('click', clickHandler, false);
            console.log('Button click listener attached');
        } else {
            console.warn('startChatBtn not found yet, will retry...');
        }
    };
    
    // Try attaching immediately
    attachButtonListener();
    
    // Also try after a delay in case DOM isn't fully ready
    setTimeout(attachButtonListener, 100);
    setTimeout(attachButtonListener, 500);
    
    // Close modal button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on backdrop click
    if (backdrop) {
        backdrop.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isChatOpen) {
            closeModal();
        }
    });
    
    // Suggestion cards
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const question = card.getAttribute('data-question');
            handleQuestion(question);
        });
    });
    
    // Send button
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }
    
    // Enter to send
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }
    
}
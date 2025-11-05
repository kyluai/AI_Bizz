
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
    
    // Initialize chatbot
    initChatbot();
});

// Chatbot functionality
function initChatbot() {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const toggleBtnText = document.getElementById('toggleBtnText');
    const demoMode = document.getElementById('demoMode');
    const chatMode = document.getElementById('chatMode');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    // Debug: Check if elements are found
    console.log('Chatbot elements:', {
        chatToggleBtn: !!chatToggleBtn,
        toggleBtnText: !!toggleBtnText,
        demoMode: !!demoMode,
        chatMode: !!chatMode,
        chatInput: !!chatInput,
        sendBtn: !!sendBtn,
        chatMessages: !!chatMessages
    });
    
    let isChatMode = false;
    let typingTimeout = null;
    
    // Toggle between demo and chat mode
    console.log('Initializing chatbot...', {
        chatToggleBtn: !!chatToggleBtn,
        demoMode: !!demoMode,
        chatMode: !!chatMode
    });
    
    if (!chatToggleBtn) {
        console.error('chatToggleBtn not found!');
        return;
    }
    
    if (!demoMode) {
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
        console.log('✅ Button clicked! Current mode:', isChatMode);
        
        isChatMode = !isChatMode;
        
        if (isChatMode) {
            // Switch to chat mode
            console.log('Switching to CHAT mode');
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
                    console.log('Chat input focused');
                }
            }, 100);
        } else {
            // Switch to demo mode
            console.log('Switching to DEMO mode');
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
    
    // Test if button is clickable
    chatToggleBtn.addEventListener('mouseenter', function() {
        console.log('Button hover detected!');
        this.style.transform = 'scale(1.05)';
    });
    
    chatToggleBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    console.log('✅ Chat toggle button setup complete! Button is ready.');
    
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
    
    // Format text with basic markdown
    function formatMessage(text) {
        return escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-400">$1</strong>')
            .replace(/\n/g, '<br>');
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
    
    // Get AI response based on user input
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Service questions
        if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you')) {
            return "We offer 4 main services:\n\n1️⃣ **AI Websites** - Conversion-driven sites with built-in AI chat and automated booking\n2️⃣ **Chatbots** - 24/7 automated support that answers questions and captures leads\n3️⃣ **Voice Agents** - AI receptionists that never miss a call and schedule appointments\n4️⃣ **Workflow Automations** - Seamlessly connect calls, chats, and calendars\n\nWhich service interests you most?";
        }
        
        // Pricing questions
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('pricing')) {
            return "Our pricing tiers:\n\n💰 **Starter** - $99/mo + $499 setup\n   • AI Voice Agent, 100 calls/month\n\n🚀 **Growth** (Most Popular) - $199/mo + $999 setup\n   • Voice + Chatbot, 250 calls/month, Advanced Scheduling\n\n📈 **Scale** - $299/mo + $1,499 setup\n   • Full AI Website, Built-in Chatbot, SEO Optimized, 1 Year Hosting\n\n⚙️ **Automation** - $750/project\n   • Business Workflow Setup, CRM Integration, Notifications\n\nWant to book a free demo to see which plan fits your business?";
        }
        
        // AI Websites
        if (lowerMessage.includes('website') || lowerMessage.includes('web')) {
            return "Our **AI Websites** are conversion-driven sites with:\n\n✨ Built-in AI chat that engages visitors\n📅 Automated booking systems\n🎯 SEO optimized for better rankings\n📱 Fully responsive design\n\nTurn visitors into customers automatically. Want to see a demo?";
        }
        
        // Chatbots
        if (lowerMessage.includes('chatbot') || lowerMessage.includes('chat bot')) {
            return "Our **Chatbots** provide:\n\n🤖 24/7 automated customer support\n💬 Answers questions instantly\n📋 Qualifies leads automatically\n📞 Books appointments while you sleep\n\nNever miss a lead again! Our chatbots handle everything automatically.";
        }
        
        // Voice Agents
        if (lowerMessage.includes('voice') || lowerMessage.includes('call') || lowerMessage.includes('receptionist') || lowerMessage.includes('phone')) {
            return "Our **Voice Agents** (AI Receptionists):\n\n📞 Answer calls 24/7\n✅ Qualify leads automatically\n📅 Schedule appointments\n💼 Never miss a call\n\nImagine never missing a lead because your AI picks up every call, even at 2 AM!";
        }
        
        // Automation
        if (lowerMessage.includes('automation') || lowerMessage.includes('workflow') || lowerMessage.includes('integrat')) {
            return "Our **Workflow Automations** connect everything:\n\n🔗 Forms → CRM integration\n📧 Email/SMS notifications\n⚡ Zapier/Make automation\n🔄 Seamless tool connections\n\nEverything runs automatically in the background. What used to take hours now happens instantly!";
        }
        
        // Benefits/Why choose
        if (lowerMessage.includes('benefit') || lowerMessage.includes('why') || lowerMessage.includes('advantage') || lowerMessage.includes('help')) {
            return "Here's how ScaleBuddy helps your business:\n\n⏰ **Save 10+ hours/week** - AI handles routine tasks\n📈 **Close 20% more leads** - Never miss an opportunity\n💰 **Reduce overhead** - No need to hire 24/7 staff\n🚀 **Scale faster** - AI works while you sleep\n\nOur clients see results immediately. Want to learn more?";
        }
        
        // Setup/How it works
        if (lowerMessage.includes('setup') || lowerMessage.includes('how') || lowerMessage.includes('work') || lowerMessage.includes('get started')) {
            return "Getting started is easy:\n\n1️⃣ Book a free demo (takes 30 minutes)\n2️⃣ We understand your business needs\n3️⃣ Custom AI solution built for you\n4️⃣ Launch in days, not weeks\n\nNo coding required! We handle everything. Ready to book your demo?";
        }
        
        // Demo/Book
        if (lowerMessage.includes('demo') || lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
            return "Great! You can book a free demo right now:\n\n📅 Click the 'Book Demo' button on our site\n📞 Or visit: book-demo.html\n\nWe'll show you exactly how our AI can help your business grow. The demo takes about 30 minutes and you'll see live examples of our AI in action!";
        }
        
        // Contact
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return "You can reach us at:\n\n📧 **Email:** hello@scalebuddy.ai\n📅 **Book Demo:** Click 'Book Demo' on our site\n💬 **Live Chat:** Right here! 😊\n\nWe're here to help! What else would you like to know?";
        }
        
        // Time/When
        if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('how long') || lowerMessage.includes('fast')) {
            return "Setup times vary by service:\n\n⚡ **Chatbots/Voice Agents** - 1-2 weeks\n🌐 **AI Websites** - 2-3 weeks\n⚙️ **Automations** - 1-2 weeks\n\nBut results start showing immediately after launch! Our AI works 24/7 from day one.";
        }
        
        // Technology/How it's built
        if (lowerMessage.includes('tech') || lowerMessage.includes('built') || lowerMessage.includes('openai') || lowerMessage.includes('gpt')) {
            return "We use cutting-edge AI technology:\n\n🤖 **OpenAI GPT-4** - Latest AI models\n💻 **Custom Code** - Built specifically for your business\n🔒 **Secure** - Enterprise-grade security\n⚡ **Fast** - < 100ms response times\n\nWe're developers who build custom AI solutions, not just basic chatbots!";
        }
        
        // Default/General
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hi! 👋 I'm here to help you learn about ScaleBuddy's AI services. You can ask me about:\n\n• Our services (websites, chatbots, voice agents, automations)\n• Pricing\n• How it works\n• Booking a demo\n\nWhat would you like to know?";
        }
        
        // Default fallback
        return "Great question! I can help you with:\n\n• **Services** - AI Websites, Chatbots, Voice Agents, Automations\n• **Pricing** - Plans starting at $99/mo\n• **Features** - What each service includes\n• **Demo** - Book a free live demo\n• **Setup** - How we get you started\n\nWhat specific question can I answer?";
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
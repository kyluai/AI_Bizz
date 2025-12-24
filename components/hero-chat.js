// Interactive Hero Chat Component
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('heroChatMessages');
    const chatInput = document.getElementById('heroChatInput');
    const sendBtn = document.getElementById('heroSendBtn');
    const typingIndicator = document.getElementById('heroTypingIndicator');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    
    if (!chatMessages || !chatInput || !sendBtn) return;
    
    // Pre-written responses
    const responses = {
        services: "We offer three main services:\n\n1. **AI Voice Agents** - Answer calls 24/7, qualify leads, and book appointments automatically\n2. **Chat Assistants** - Handle website chat, answer questions, and capture leads\n3. **Workflow Automations** - Connect your CRM, tools, and systems seamlessly\n\nAll solutions are custom-built for your business. Would you like details on any specific service?",
        cost: "Our pricing starts at **$99/month** for the Starter plan (Voice Agent only).\n\n• **Growth Plan** ($199/mo) - Voice + Chatbot\n• **Scale Plan** ($299/mo) - Full AI Website with built-in chatbot\n• **Automation Projects** - $750 one-time for workflow setup\n\nEach plan includes a setup fee. All demos are free with no obligation! [Book a demo](book-demo.html) to see which plan fits your business.",
        demo: "Great! I can help you book a demo. You can:\n\n1. Click the \"Book a Free Demo\" button above\n2. Visit [book-demo.html](book-demo.html) directly\n3. Fill out the form and we'll contact you within 1-2 business days\n\nThe demo is 30 minutes, completely free, and personalized to your business needs. We'll show you exactly how our AI can help scale your operations!"
    };
    
    // Add user message
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 justify-end';
        messageDiv.innerHTML = `
            <div class="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl rounded-tr-none p-4 max-w-[80%] ml-auto">
                <p class="text-white text-sm leading-relaxed font-sans">${escapeHtml(text)}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        messageDiv.className = 'flex items-start space-x-3';
        messageDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
            </div>
            <div class="flex-1 bg-slate-800/60 rounded-2xl rounded-tl-none p-4 border border-slate-700/50">
                <p class="text-gray-100 text-sm leading-relaxed font-sans whitespace-pre-line">${formatMessage(text)}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Show typing indicator
    function showTyping() {
        typingIndicator.classList.remove('hidden');
        scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTyping() {
        typingIndicator.classList.add('hidden');
    }
    
    // Handle suggestion chip click
    function handleSuggestionClick(question) {
        const questionTexts = {
            services: "What services do you offer?",
            cost: "How much does it cost?",
            demo: "Book a demo for me"
        };
        
        const questionText = questionTexts[question] || question;
        addUserMessage(questionText);
        
        // Show typing indicator
        showTyping();
        
        // Simulate typing delay (1.5s)
        setTimeout(() => {
            hideTyping();
            const response = responses[question] || "I'd be happy to help with that! Could you provide more details?";
            addAIMessage(response);
        }, 1500);
    }
    
    // Handle send button click
    function handleSend() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        chatInput.value = '';
        
        // Show typing indicator
        showTyping();
        
        // Simple response logic
        setTimeout(() => {
            hideTyping();
            let response = "Thanks for your message! For detailed questions, I'd recommend booking a demo with our team. They can provide personalized answers based on your specific business needs.";
            
            const lowerMessage = message.toLowerCase();
            if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
                response = responses.services;
            } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('how much')) {
                response = responses.cost;
            } else if (lowerMessage.includes('demo') || lowerMessage.includes('book')) {
                response = responses.demo;
            }
            
            addAIMessage(response);
        }, 1500);
    }
    
    // Format message (handle links)
    function formatMessage(text) {
        let formatted = escapeHtml(text);
        // Handle markdown links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, linkText, url) {
            return `<a href="${url}" class="text-indigo-400 hover:text-indigo-300 underline" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`;
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
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
    
    // Event listeners
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-question');
            handleSuggestionClick(question);
        });
    });
    
    sendBtn.addEventListener('click', handleSend);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});


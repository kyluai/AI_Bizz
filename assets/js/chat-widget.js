// ============================================
// FLOATING CHAT WIDGET FUNCTIONALITY
// ============================================
function initFloatingChatWidget() {
    const widget = document.getElementById('chatWidget');
    const widgetButton = document.getElementById('floatingChatButton');
    const widgetClose = document.getElementById('chatWidgetClose');
    const widgetFullscreen = document.getElementById('chatWidgetFullscreen');
    const widgetRefresh = document.getElementById('chatWidgetRefresh');
    const widgetInput = document.getElementById('chatWidgetInput');
    const widgetSend = document.getElementById('chatWidgetSend');
    const widgetMessages = document.getElementById('chatWidgetMessages');
    let widgetWelcome = document.getElementById('chatWidgetWelcome');
    const suggestionButtons = document.querySelectorAll('.chat-widget-suggestion');
    
    if (!widget || !widgetButton) return;
    
    let isWidgetOpen = false;
    
    // Storage keys
    const STORAGE_KEY_HISTORY = 'scaleMako_chatHistory';
    const STORAGE_KEY_THREAD = 'scaleMako_threadId';
    
    // Thread ID storage (persists conversation across messages)
    let currentThreadId = null;
    
    // Raw message history (stores only plain text, no HTML)
    let rawMessageHistory = [];
    
    // Render Welcome State (shows when chat is empty)
    function renderWelcomeState() {
        // Re-get the welcome element in case it was recreated
        widgetWelcome = document.getElementById('chatWidgetWelcome');
        
        // Only show welcome if there's no history
        if (rawMessageHistory.length === 0 && widgetWelcome) {
            widgetWelcome.style.display = 'block';
        } else if (widgetWelcome) {
            widgetWelcome.style.display = 'none';
        }
    }
    
    // Load from localStorage on init
    function loadFromStorage() {
        if (typeof Storage === 'undefined') {
            // If no storage, show welcome
            renderWelcomeState();
            return;
        }
        
        try {
            const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
            const savedThreadId = localStorage.getItem(STORAGE_KEY_THREAD);
            
            if (savedThreadId) {
                currentThreadId = savedThreadId;
            }
            
            if (savedHistory) {
                const history = JSON.parse(savedHistory);
                if (Array.isArray(history) && history.length > 0) {
                    // Auto-clean legacy HTML data
                    const cleanedHistory = cleanLegacyHTML(history);
                    rawMessageHistory = cleanedHistory;
                    
                    // Render existing messages (using raw text)
                    renderHistory(cleanedHistory);
                    // Hide welcome state if there's history
                    if (widgetWelcome) {
                        widgetWelcome.style.display = 'none';
                    }
                } else {
                    // Empty history - show welcome
                    renderWelcomeState();
                }
            } else {
                // No history saved - show welcome
                renderWelcomeState();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            // On error, show welcome
            renderWelcomeState();
        }
    }
    
    // Clean legacy HTML data from old localStorage entries
    function cleanLegacyHTML(history) {
        return history.map(msg => {
            let text = msg.text || '';
            // If text contains HTML tags, strip them
            if (text.includes('<')) {
                const tmp = document.createElement('div');
                tmp.innerHTML = text;
                text = tmp.textContent || tmp.innerText || '';
            }
            return {
                sender: msg.sender,
                text: text.trim()
            };
        }).filter(msg => msg.text.length > 0); // Remove empty messages
    }
    
    // Save to localStorage
    function saveToStorage(messageHistory) {
        if (typeof Storage === 'undefined') return;
        
        try {
            localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(messageHistory));
            if (currentThreadId) {
                localStorage.setItem(STORAGE_KEY_THREAD, currentThreadId);
            }
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    
    // Clear storage
    function clearStorage() {
        if (typeof Storage === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY_HISTORY);
        localStorage.removeItem(STORAGE_KEY_THREAD);
        currentThreadId = null;
        rawMessageHistory = []; // Clear in-memory history too
    }
    
    // Get current message history from raw storage (not DOM)
    function getMessageHistory() {
        // Return the raw message history array (plain text only)
        return rawMessageHistory;
    }
    
    // Add message to raw history (stores only plain text)
    function addToRawHistory(text, isUser) {
        rawMessageHistory.push({
            sender: isUser ? 'user' : 'ai',
            text: text.trim() // Store only raw text, no HTML
        });
        // Keep history limited to last 100 messages
        if (rawMessageHistory.length > 100) {
            rawMessageHistory = rawMessageHistory.slice(-100);
        }
    }
    
    // Render history from storage (raw text only)
    function renderHistory(history) {
        widgetMessages.innerHTML = '';
        
        // Re-add welcome div (will be hidden if there's history)
        const welcomeHTML = `
            <div id="chatWidgetWelcome" class="chat-widget-welcome">
                <div class="text-center mb-4">
                    <h3 class="text-sm font-display font-semibold text-gray-900 mb-1">Hello! I'm Mako</h3>
                    <p class="text-xs text-gray-600">Your AI guide to automating your business</p>
                </div>
                <div class="space-y-2">
                    <p class="text-xs text-gray-600 font-medium mb-2">I can help you with:</p>
                    <button class="chat-widget-suggestion" data-query="pricing">
                        <span>💰 Pricing & Plans</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="how it works">
                        <span>⚙️ How It Works</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="services">
                        <span>🚀 Our Services</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="demo">
                        <span>📅 Book a Demo</span>
                    </button>
                </div>
            </div>
        `;
        widgetMessages.innerHTML = welcomeHTML;
        
        // Hide welcome state when rendering history
        const welcomeDiv = document.getElementById('chatWidgetWelcome');
        if (welcomeDiv) {
            welcomeDiv.style.display = 'none';
        }
        
        // Re-attach event listeners to suggestion buttons
        const suggestionButtons = widgetMessages.querySelectorAll('.chat-widget-suggestion');
        suggestionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = btn.getAttribute('data-query');
                if (query) {
                    simulateUserTyping(query);
                }
            });
        });
        
        history.forEach(msg => {
            // Pass raw text to addMessage - it will format it fresh
            addMessage(msg.text, msg.sender === 'user', false); // false = don't save to storage (already in rawMessageHistory)
        });
        scrollToBottom();
    }
    
    // Toggle Widget
    function toggleWidget() {
        isWidgetOpen = !isWidgetOpen;
        if (isWidgetOpen) {
            widget.classList.remove('hidden');
            // Always reload from storage when opening to sync with modal
            loadFromStorage();
            // Ensure welcome state is shown if no history
            renderWelcomeState();
            setTimeout(() => {
                widgetInput?.focus();
            }, 100);
        } else {
            widget.classList.add('hidden');
        }
    }
    
    // Close Widget
    function closeWidget() {
        isWidgetOpen = false;
        widget.classList.add('hidden');
    }
    
    // Open Full Screen Modal
    function openFullScreen() {
        closeWidget();
        if (window.openChatModal) {
            window.openChatModal();
        }
    }
    
    // Refresh Chat (Start New Conversation)
    function refreshChat() {
        if (confirm('Start a new conversation?')) {
            clearStorage();
            
            // Clear all messages and recreate welcome div
            const welcomeHTML = `
                <div id="chatWidgetWelcome" class="chat-widget-welcome">
                    <div class="text-center mb-4">
                        <h3 class="text-sm font-display font-semibold text-gray-900 mb-1">Hello! I'm Mako</h3>
                        <p class="text-xs text-gray-600">Your AI guide to automating your business</p>
                    </div>
                    <div class="space-y-2">
                        <p class="text-xs text-gray-600 font-medium mb-2">I can help you with:</p>
                        <button class="chat-widget-suggestion" data-query="pricing">
                            <span>💰 Pricing & Plans</span>
                        </button>
                        <button class="chat-widget-suggestion" data-query="how it works">
                            <span>⚙️ How It Works</span>
                        </button>
                        <button class="chat-widget-suggestion" data-query="services">
                            <span>🚀 Our Services</span>
                        </button>
                        <button class="chat-widget-suggestion" data-query="demo">
                            <span>📅 Book a Demo</span>
                        </button>
                    </div>
                </div>
            `;
            widgetMessages.innerHTML = welcomeHTML;
            
            // Re-attach event listeners to suggestion buttons
            const newSuggestionButtons = widgetMessages.querySelectorAll('.chat-widget-suggestion');
            newSuggestionButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const query = btn.getAttribute('data-query');
                    if (query) {
                        simulateUserTyping(query);
                    }
                });
            });
            
            rawMessageHistory = [];
            currentThreadId = null;
            
            // Show welcome state
            renderWelcomeState();
            
            // Notify modal that chat was refreshed
            window.dispatchEvent(new CustomEvent('chatRefreshed'));
        }
    }
    
    // Show Typing Indicator
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
    
    // Remove Typing Indicator
    function removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }
    }
    
    // Format AI Response - Shared function for markdown parsing
    function formatAIResponse(text) {
        if (!text) return '';
        
        // Check if marked.js is available (if user added the CDN)
        if (typeof marked !== 'undefined') {
            try {
                // Use marked.js for proper markdown parsing
                let formatted = marked.parse(text);
                // Strip citations (OpenAI format: 【...†source】 or 【...】)
                formatted = formatted.replace(/【[^】]*†[^】]*】/g, '').replace(/【[^】]*】/g, '');
                return formatted;
            } catch (error) {
                console.warn('Error using marked.js, falling back to regex:', error);
            }
        }
        
        // Fallback: Custom regex-based formatting
        let formatted = escapeHtml(text);
        
        // Strip citations first (OpenAI format: 【...†source】 or 【...】)
        formatted = formatted.replace(/【[^】]*†[^】]*】/g, '').replace(/【[^】]*】/g, '');
        
        // Handle markdown links [text](url)
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
            const isExternal = url.startsWith('http');
            return `<a href="${url}" class="text-blue-600 hover:text-blue-700 underline font-medium" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`;
        });
        
        // Handle bold **text**
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        
        // Handle italic *text*
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle lists (lines starting with - or 1. 2. etc.)
        formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
        formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
        
        // Wrap consecutive list items in <ul>
        formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, (match) => {
            return '<ul class="list-disc ml-6 my-2 space-y-1">' + match + '</ul>';
        });
        
        // Handle line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Auto-link URLs
        formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return formatted;
    }
    
    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Add Message to Widget
    // text: Raw text content (no HTML)
    // isUser: Whether this is a user message
    // saveToStorage: Whether to save to localStorage
    function addMessage(text, isUser = false, saveToStorage = true) {
        // Re-get the welcome element in case it was recreated
        widgetWelcome = document.getElementById('chatWidgetWelcome');
        
        // Hide welcome state after first message
        if (widgetWelcome && isUser) {
            widgetWelcome.style.display = 'none';
        }
        
        // Add to raw history BEFORE formatting (store only plain text)
        if (saveToStorage) {
            addToRawHistory(text, isUser);
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-widget-message ${isUser ? 'user' : 'bot'}`;
        
        // Apply formatting ONLY when rendering (not when storing)
        if (isUser) {
            messageDiv.textContent = text; // User messages are plain text
        } else {
            messageDiv.innerHTML = formatAIResponse(text); // Bot messages: format markdown to HTML on render
        }
        
        widgetMessages.appendChild(messageDiv);
        scrollToBottom();
        
        // Save raw history to localStorage
        if (saveToStorage) {
            setTimeout(() => {
                const history = getMessageHistory(); // Returns rawMessageHistory (plain text only)
                if (typeof Storage !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
                    if (currentThreadId) {
                        localStorage.setItem(STORAGE_KEY_THREAD, currentThreadId);
                    }
                }
            }, 0);
        }
    }
    
    // Scroll to Bottom
    function scrollToBottom() {
        if (widgetMessages) {
            requestAnimationFrame(() => {
                widgetMessages.scrollTop = widgetMessages.scrollHeight;
            });
            setTimeout(() => {
                widgetMessages.scrollTop = widgetMessages.scrollHeight;
            }, 50);
        }
    }
    
    // Get AI Response (Backend API Integration)
    async function getAIResponse(userMessage) {
        try {
            // console.log('Sending message to API:', userMessage, 'Thread ID:', currentThreadId);
            
            // Call backend API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    threadId: currentThreadId // Send existing thread ID to maintain conversation
                })
            });

            // console.log('API Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // console.log('API Response data:', data);
            
            // Update thread ID if we got a new one or if this is the first message
            if (data.threadId) {
                currentThreadId = data.threadId;
                // Save to localStorage
                if (typeof Storage !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY_THREAD, currentThreadId);
                }
            }
            
            return data.response || getFallbackResponse(userMessage);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            // If it's a network error, show a helpful message
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                return "I'm having trouble connecting to the server. Please make sure the server is running (npm start) and try again.";
            }
            
            return getFallbackResponse(userMessage);
        }
    }
    
    // Fallback Response (when API not configured)
    function getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('pricing') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return "Our pricing starts at $99/month for Voice Agents, $199/month for Voice + Chatbot, and $299/month for full AI Websites. All plans include unlimited conversations. Would you like to see a custom quote?";
        }
        
        if (lowerMessage.includes('service') || lowerMessage.includes('what do you') || lowerMessage.includes('offer')) {
            return "We offer AI Voice Agents, Chat Assistants, Custom SEO Websites, and Workflow Automations. All solutions are custom-built for your business. Which service interests you most?";
        }
        
        if (lowerMessage.includes('how it works') || lowerMessage.includes('how does')) {
            return "Here's how it works: 1) Discovery & Strategy - We analyze your workflow, 2) Custom Build - We build your AI solution, 3) Deploy & Scale - You go live in under 2 weeks. Would you like to book a free demo to see it in action?";
        }
        
        if (lowerMessage.includes('demo') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
            return "I'd love to set you up with a free demo! Visit our Book Demo page or click the 'Go Full Screen' button above for more detailed assistance. The demo takes 30 minutes and is completely personalized.";
        }
        
        return "I'm here to help! I can answer questions about our services, pricing, how it works, or help you book a demo. What would you like to know?";
    }
    
    // Simulate user typing (for chips)
    async function simulateUserTyping(message) {
        try {
            // Add user message with typing effect
            addMessage(message, true);
            
            // Show typing indicator
            const typingDiv = showTypingIndicator();
            
            // Get AI response (don't wait for artificial delay - let the API call take its time)
            const response = await getAIResponse(message);
            
            // Remove typing indicator
            removeTypingIndicator(typingDiv);
            
            // Add bot response
            addMessage(response, false);
        } catch (error) {
            console.error('Error in simulateUserTyping:', error);
            // Remove typing indicator if it exists
            const typingDiv = document.getElementById('widget-typing-indicator');
            if (typingDiv) removeTypingIndicator(typingDiv);
            // Show error message
            addMessage("I'm sorry, I encountered an error. Please try again.", false);
        }
    }
    
    // Send Message
    async function sendMessage() {
        const message = widgetInput?.value.trim();
        if (!message) return;
        
        // Clear input immediately
        widgetInput.value = '';
        // Reset textarea height after sending
        if (widgetInput) {
            widgetInput.style.height = 'auto';
        }
        
        try {
            // Add user message
            addMessage(message, true);
            
            // Show typing indicator immediately
            const typingDiv = showTypingIndicator();
            
            // Get AI response
            const response = await getAIResponse(message);
            
            // Remove typing indicator
            removeTypingIndicator(typingDiv);
            
            // Add bot response
            addMessage(response, false);
        } catch (error) {
            console.error('Error in sendMessage:', error);
            // Remove typing indicator if it exists
            const typingDiv = document.getElementById('widget-typing-indicator');
            if (typingDiv) removeTypingIndicator(typingDiv);
            // Show error message
            addMessage("I'm sorry, I encountered an error. Please try again.", false);
        }
    }
    
    // Listen for chat refresh events from modal
    window.addEventListener('chatRefreshed', () => {
        // Modal was refreshed - clear widget and reload
        widgetMessages.innerHTML = '';
        
        // Re-add welcome div
        const welcomeHTML = `
            <div id="chatWidgetWelcome" class="chat-widget-welcome">
                <div class="text-center mb-4">
                    <h3 class="text-sm font-display font-semibold text-gray-900 mb-1">Hello! I'm Mako</h3>
                    <p class="text-xs text-gray-600">Your AI guide to automating your business</p>
                </div>
                <div class="space-y-2">
                    <p class="text-xs text-gray-600 font-medium mb-2">I can help you with:</p>
                    <button class="chat-widget-suggestion" data-query="pricing">
                        <span>💰 Pricing & Plans</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="how it works">
                        <span>⚙️ How It Works</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="services">
                        <span>🚀 Our Services</span>
                    </button>
                    <button class="chat-widget-suggestion" data-query="demo">
                        <span>📅 Book a Demo</span>
                    </button>
                </div>
            </div>
        `;
        widgetMessages.innerHTML = welcomeHTML;
        
        // Re-attach event listeners to suggestion buttons
        const newSuggestionButtons = widgetMessages.querySelectorAll('.chat-widget-suggestion');
        newSuggestionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = btn.getAttribute('data-query');
                if (query) {
                    simulateUserTyping(query);
                }
            });
        });
        
        rawMessageHistory = [];
        currentThreadId = null;
        loadFromStorage();
        renderWelcomeState();
    });
    
    // Load history on init
    loadFromStorage();
    
    // Ensure welcome state is visible on initial load if no history
    renderWelcomeState();
    
    // Event Listeners
    widgetButton?.addEventListener('click', toggleWidget);
    widgetClose?.addEventListener('click', closeWidget);
    widgetFullscreen?.addEventListener('click', openFullScreen);
    widgetRefresh?.addEventListener('click', refreshChat);
    widgetSend?.addEventListener('click', sendMessage);
    
    // Auto-resize textarea
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'; // Max 8rem (128px)
    }
    
    // Initialize auto-resize for widget input
    if (widgetInput) {
        widgetInput.addEventListener('input', () => {
            autoResizeTextarea(widgetInput);
        });
        
        // Handle Enter key (send on Enter, new line on Shift+Enter)
        widgetInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Suggestion buttons - simulate typing
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const query = button.getAttribute('data-query');
            if (query) {
                simulateUserTyping(query);
            }
        });
    });
    
    // Close widget when clicking outside
    document.addEventListener('click', (e) => {
        if (isWidgetOpen && widget && !widget.contains(e.target) && !widgetButton.contains(e.target)) {
            // Don't close if clicking on modal
            const modal = document.getElementById('chatModal');
            if (modal && modal.contains(e.target)) return;
            closeWidget();
        }
    });
}

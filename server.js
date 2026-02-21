require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (recommended for rate limit + deployments behind reverse proxies)
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Needed for Tailwind config inline script
                "'unsafe-eval'", // Needed for Tailwind CDN to work
                "https://cdn.tailwindcss.com",
                "https://unpkg.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'", // Needed for inline styles
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:"
            ],
            connectSrc: [
                "'self'",
                "https://api.openai.com",
                "https://formspree.io"
            ]
        }
    }
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files from root directory (must be before route handlers)
app.use(express.static(__dirname, {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html', 'css', 'js', 'json', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'],
    index: false, // Don't serve index.html automatically, let routes handle it
    maxAge: '1d',
    redirect: false,
    setHeaders: (res, path) => {
        // Set proper MIME types
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Rate limiting (API only)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max requests per IP per window
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', apiLimiter);

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
});

// Store thread IDs in memory (in production, use a database)
const threadStore = new Map();

// ============================================
// STATIC FILE SERVING
// ============================================
// Express automatically serves index.html, assets/, components/, etc. from root

// ============================================
// API ROUTE: Chat Endpoint
// ============================================
app.post('/api/chat', async (req, res) => {
    try {
        const { message, threadId } = req.body;

        // Validate input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Message is required and must be a non-empty string' 
            });
        }

        // Check if OpenAI is configured
        if (!process.env.OPENAI_API_KEY || !process.env.ASSISTANT_ID) {
            console.warn('OpenAI API key or Assistant ID not configured. Using fallback response.');
            return res.json({
                response: "I'm here to help! To enable AI responses, please configure your OpenAI API key and Assistant ID in the .env file. What can I help you with today?",
                threadId: null
            });
        }

        let currentThreadId = threadId;

        // Create a new thread if one doesn't exist
        if (!currentThreadId || !threadStore.has(currentThreadId)) {
            try {
                const thread = await openai.beta.threads.create();
                currentThreadId = thread.id;
                threadStore.set(currentThreadId, {
                    createdAt: new Date(),
                    messageCount: 0
                });
            } catch (error) {
                console.error('Error creating thread:', error);
                return res.status(500).json({ 
                    error: 'Failed to create conversation thread',
                    details: error.message 
                });
            }
        }

        // Add message to thread
        try {
            await openai.beta.threads.messages.create(currentThreadId, {
                role: 'user',
                content: message.trim()
            });

            // Update thread metadata
            const threadMeta = threadStore.get(currentThreadId);
            threadMeta.messageCount += 1;

        } catch (error) {
            console.error('Error adding message to thread:', error);
            return res.status(500).json({ 
                error: 'Failed to add message to thread',
                details: error.message 
            });
        }

        // Run the assistant
        let run;
        try {
            run = await openai.beta.threads.runs.create(currentThreadId, {
                assistant_id: process.env.ASSISTANT_ID
            });
        } catch (error) {
            console.error('Error running assistant:', error);
            return res.status(500).json({ 
                error: 'Failed to run assistant',
                details: error.message 
            });
        }

        // Poll for completion (with timeout)
        const MAX_POLL_ATTEMPTS = 60; // 60 seconds max
        let pollAttempts = 0;
        let completed = false;
        let runStatus;

        while (!completed && pollAttempts < MAX_POLL_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            pollAttempts++;

            try {
                runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);

                if (runStatus.status === 'completed') {
                    completed = true;
                } else if (runStatus.status === 'failed') {
                    throw new Error(`Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
                } else if (runStatus.status === 'cancelled' || runStatus.status === 'expired') {
                    throw new Error(`Assistant run was ${runStatus.status}`);
                }
                // Continue polling for: queued, in_progress, requires_action
            } catch (error) {
                console.error('Error polling run status:', error);
                // If it's a network error, continue polling; if it's a fatal error, throw
                if (error.message.includes('failed') || error.message.includes('cancelled') || error.message.includes('expired')) {
                    throw error;
                }
            }
        }

        if (!completed) {
            return res.status(504).json({ 
                error: 'Assistant response timed out. Please try again.',
                threadId: currentThreadId
            });
        }

        // Get the assistant's response
        let messages;
        try {
            messages = await openai.beta.threads.messages.list(currentThreadId, {
                limit: 1,
                order: 'desc'
            });
        } catch (error) {
            console.error('Error retrieving messages:', error);
            return res.status(500).json({ 
                error: 'Failed to retrieve assistant response',
                details: error.message,
                threadId: currentThreadId
            });
        }

        // Extract the assistant's message
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        
        if (!assistantMessage || !assistantMessage.content || assistantMessage.content.length === 0) {
            return res.json({
                response: "I apologize, but I couldn't generate a response. Please try again.",
                threadId: currentThreadId
            });
        }

        // Handle different content types (text, image, etc.)
        const textContent = assistantMessage.content.find(item => item.type === 'text');
        
        if (textContent && textContent.text) {
            return res.json({
                response: textContent.text.value,
                threadId: currentThreadId
            });
        }

        return res.json({
            response: "I apologize, but I couldn't generate a text response. Please try again.",
            threadId: currentThreadId
        });

    } catch (error) {
        console.error('Chat API error:', error);
        
        // Don't expose internal error details to client
        const errorMessage = error.message || 'An unexpected error occurred';
        
        return res.status(500).json({
            error: 'Failed to process chat message',
            details: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
            threadId: req.body.threadId || null
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime()
    });
});

// Brand config endpoint — source of truth for logo and brand assets
app.get('/api/config', (req, res) => {
    res.json({
        brand: {
            name: 'ScaleMako',
            logoUrl: '/assets/images/logo.png',
            email: 'hello@scalemako.ai'
        }
    });
});

// Mock email confirmation endpoint (prepare for future Nodemailer integration)
app.post('/api/send-confirmation', (req, res) => {
    // Accept form data and respond success (no-op for now)
    const payload = req.body || {};
    return res.status(200).json({
        success: true,
        message: 'Confirmation request received.',
        received: {
            email: payload.email || null,
            fullName: payload.fullName || null,
            type: payload.type || null
        }
    });
});

// ============================================
// CLEAN URL ROUTES FOR MAIN PAGES
// ============================================

// Home
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'index.html'));
});

// Marketing / content pages
app.get('/about', (req, res) => {
    return res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/faq', (req, res) => {
    return res.sendFile(path.join(__dirname, 'faq.html'));
});

app.get('/privacy', (req, res) => {
    return res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/terms', (req, res) => {
    return res.sendFile(path.join(__dirname, 'terms.html'));
});

// Funnel / conversion pages
app.get('/careers', (req, res) => {
    return res.sendFile(path.join(__dirname, 'careers.html'));
});

app.get('/book-demo', (req, res) => {
    return res.sendFile(path.join(__dirname, 'book-demo.html'));
});

app.get('/request-quote', (req, res) => {
    return res.sendFile(path.join(__dirname, 'request-quote.html'));
});

// ============================================
// 404 HANDLING (API)
// ============================================
app.use('/api', (req, res) => {
    return res.status(404).json({ error: 'Not found' });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    if (res.headersSent) return next(err);
    return res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// 404 HANDLING (SITE) - keep last
// ============================================
app.use((req, res) => {
    return res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(PORT, () => {
    // Intentionally quiet in production. Uncomment for local debugging.
    // console.log('\n✅ ScaleMako Server Running');
    // console.log(`📍 URL: http://localhost:${PORT}`);
    // console.log(`📁 Serving static files from: ${__dirname}`);
    // if (process.env.OPENAI_API_KEY && process.env.ASSISTANT_ID) {
    //     console.log('🤖 OpenAI Chatbot: Configured ✓');
    // } else {
    //     console.log('⚠️  OpenAI Chatbot: Not configured (add OPENAI_API_KEY and ASSISTANT_ID to .env)');
    // }
    // console.log(`\nPress Ctrl+C to stop the server\n`);
});

# Chatbot Setup Guide - OpenAI Assistant API with Knowledge Base

This guide will walk you through setting up your ScaleMako chatbots to use OpenAI's Assistant API with your own Knowledge Base, powered by AI credits.

## Overview

Your site has two chatbot implementations:
1. **Floating Chat Widget** (`assets/js/chat-widget.js`) - Mini widget in bottom right
2. **Full-Screen Chat Modal** (`assets/js/script.js` - `initChatModal()`) - Full-page chat interface

Both can be configured to use OpenAI's Assistant API with Knowledge Base integration.

---

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the API key (you'll only see it once!)
6. Store it securely

---

## Step 2: Create an Assistant with Knowledge Base

### Option A: Using OpenAI Platform (Recommended)

1. Go to [OpenAI Platform > Assistants](https://platform.openai.com/assistants)
2. Click **"Create Assistant"**
3. Configure your assistant:
   - **Name**: "ScaleMako Support Assistant"
   - **Instructions**: 
     ```
     You are Mako, the AI guide for ScaleMako - an AI automation company. 
     You help business owners understand how AI can automate their business.
     Be friendly, helpful, and focus on ROI and time savings.
     Always encourage booking a demo when relevant.
     ```
   - **Model**: Choose `gpt-4o-mini` (cheaper) or `gpt-4o` (more capable)
   - **Knowledge**: Click **"Add"** and upload your knowledge base files (PDFs, TXT, DOCX, etc.)
4. Copy your **Assistant ID** (starts with `asst_`)

### Option B: Using API (Programmatic)

You can create assistants programmatically using the API. See OpenAI's documentation for details.

---

## Step 3: Create a Knowledge Base (Optional but Recommended)

### What is a Knowledge Base?

A Knowledge Base lets your assistant answer questions using your own documents (pricing, FAQ, service details, etc.).

### How to Add Knowledge Base:

1. In the Assistant configuration, go to **"Knowledge"** section
2. Upload files:
   - Pricing sheets
   - FAQ documents
   - Service descriptions
   - Company information
   - Common questions and answers
3. Supported formats: `.txt`, `.md`, `.pdf`, `.docx`, `.csv`
4. The assistant will automatically use these files to answer questions

---

## Step 4: Configure the Floating Chat Widget

1. Open `assets/js/chat-widget.js`
2. Find these lines (around line 20-23):
   ```javascript
   const OPENAI_API_KEY = ''; // User needs to add their API key
   const ASSISTANT_ID = ''; // User needs to add their Assistant ID
   const KNOWLEDGE_BASE_ID = ''; // Optional: Knowledge Base ID
   ```
3. Add your credentials:
   ```javascript
   const OPENAI_API_KEY = 'sk-proj-your-api-key-here';
   const ASSISTANT_ID = 'asst_your-assistant-id-here';
   const KNOWLEDGE_BASE_ID = ''; // Usually not needed if using Assistant's built-in knowledge
   ```

**Important**: Never commit API keys to public repositories! Consider using environment variables or a backend proxy.

---

## Step 5: Configure the Full-Screen Chat Modal

The full-screen modal currently uses pre-written responses. To enable OpenAI integration:

1. Open `assets/js/script.js`
2. Find the `initChatModal()` function (around line 759)
3. Look for the `responses` object that contains pre-written answers
4. Replace the response logic with OpenAI API calls (similar to `chat-widget.js`)

---

## Step 6: Understanding AI Credits & Costs

### OpenAI Pricing (as of 2024):

- **GPT-4o-mini**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- **GPT-4o**: ~$5.00 per 1M input tokens, $15.00 per 1M output tokens
- **Knowledge Base retrieval**: Additional costs apply

### Estimated Costs:

- **Small business** (< 1000 chats/month): ~$5-20/month
- **Medium business** (1000-5000 chats/month): ~$20-100/month
- **Large business** (5000+ chats/month): ~$100-500/month

**Tip**: Start with `gpt-4o-mini` to test and minimize costs. Upgrade to `gpt-4o` if you need better responses.

---

## Step 7: Security Best Practices

### DO NOT:
- ❌ Commit API keys to Git
- ❌ Expose API keys in client-side JavaScript (they'll be visible to users)
- ❌ Use production keys in development

### DO:
- ✅ Use a backend proxy/API route to handle OpenAI calls
- ✅ Store API keys in environment variables
- ✅ Use separate keys for development/production
- ✅ Set usage limits in OpenAI dashboard
- ✅ Monitor usage regularly

---

## Step 8: Backend Proxy Setup (Recommended)

Since exposing API keys in client-side JavaScript is a security risk, use a backend proxy:

### Example: Node.js/Express Backend

```javascript
// server.js (Node.js/Express)
const express = require('express');
const OpenAI = require('openai');
const app = express();

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Store in .env file
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, threadId } = req.body;
    
    // Create thread if doesn't exist
    let thread = threadId ? { id: threadId } : await openai.beta.threads.create();
    
    // Add message
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message
    });
    
    // Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID
    });
    
    // Poll for completion
    let completed = false;
    while (!completed) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (status.status === 'completed') completed = true;
      if (status.status === 'failed') throw new Error('Run failed');
    }
    
    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    
    res.json({
      response: assistantMessage.content[0].text.value,
      threadId: thread.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Update Frontend to Use Proxy:

In `assets/js/chat-widget.js`, replace the OpenAI API calls with:

```javascript
async function getAIResponse(userMessage) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        threadId: conversationHistory.threadId || null
      })
    });
    
    const data = await response.json();
    conversationHistory.threadId = data.threadId;
    return data.response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return getFallbackResponse(userMessage);
  }
}
```

---

## Step 9: Testing Your Setup

1. **Test the Floating Widget**:
   - Click the floating button in bottom right
   - Send a test message
   - Verify response comes from OpenAI

2. **Test Knowledge Base**:
   - Ask questions about your pricing
   - Ask about services mentioned in your knowledge base
   - Verify accurate responses

3. **Monitor Usage**:
   - Check OpenAI dashboard for usage stats
   - Monitor costs
   - Adjust model or usage limits as needed

---

## Step 10: Optimize Costs

1. **Use GPT-4o-mini** for most queries (much cheaper)
2. **Set usage limits** in OpenAI dashboard
3. **Cache common responses** for frequently asked questions
4. **Use streaming** for better UX (responses appear as they generate)
5. **Implement rate limiting** to prevent abuse
6. **Monitor token usage** and optimize prompts

---

## Troubleshooting

### Widget not responding?
- Check browser console for errors
- Verify API key is correct
- Check OpenAI dashboard for API status
- Verify Assistant ID is correct

### Responses not using Knowledge Base?
- Ensure files are uploaded to Assistant
- Check file formats are supported
- Wait a few minutes for files to be processed
- Verify Assistant has knowledge retrieval enabled

### High costs?
- Switch to GPT-4o-mini
- Reduce message length
- Implement caching
- Set usage limits

---

## Additional Resources

- [OpenAI Assistants Documentation](https://platform.openai.com/docs/assistants)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Pricing](https://openai.com/pricing)
- [Best Practices for AI Assistants](https://platform.openai.com/docs/guides/assistants)

---

## Need Help?

For ScaleMako-specific setup questions, contact: hello@scalemako.ai

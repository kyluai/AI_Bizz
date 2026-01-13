# ScaleMako Website

A modern, responsive website for ScaleMako - AI-powered business automation solutions with secure chatbot backend.

## Project Structure

```
AI_Bizz/
├── assets/              # Static assets
│   ├── css/            # Stylesheets
│   │   └── style.css   # Main stylesheet
│   ├── js/             # JavaScript files
│   │   ├── script.js   # Main JavaScript
│   │   └── chat-widget.js # Chatbot frontend (uses backend API)
│   └── images/         # Image assets
├── components/          # Reusable web components
│   ├── faq.js          # FAQ accordion component
│   ├── footer.js       # Footer component
│   ├── hero-chat.js    # Hero chat component
│   └── navbar.js       # Navigation bar component
├── docs/               # Documentation
│   ├── CHATBOT_REVIEW.md
│   ├── CHATBOT_SETUP_GUIDE.md
│   ├── DESIGN_SYSTEM_ANALYSIS.md
│   └── IMPLEMENTATION_SUMMARY.md
├── server.js           # Express server (serves static files + API)
├── package.json        # Node.js dependencies
├── .env                # Environment variables (API keys - not in git)
├── .gitignore          # Git ignore rules
├── about.html          # About page
├── book-demo.html      # Demo booking page
├── careers.html        # Careers page
├── faq.html            # FAQ page
├── index.html          # Homepage
├── privacy.html        # Privacy policy
└── terms.html          # Terms of service
```

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Web Components**: Modular, reusable components
- **Modern UI**: Clean, professional design with smooth animations
- **SEO Friendly**: Semantic HTML structure
- **Secure Chatbot**: Backend API integration with OpenAI (API keys never exposed to client)

## Technologies

- **Frontend**: HTML5, CSS3 (with Tailwind CSS), Vanilla JavaScript (ES6+), Web Components API
- **Backend**: Node.js, Express.js, OpenAI API
- **Security**: Environment variables, backend API proxy

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenAI API key and Assistant ID (optional, for chatbot functionality)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy `.env` and add your OpenAI credentials:
   ```bash
   # .env
   OPENAI_API_KEY=your_api_key_here
   ASSISTANT_ID=asst_your_assistant_id_here
   ```
   
   > **Get your OpenAI API Key**: https://platform.openai.com/api-keys
   > 
   > **Create an Assistant**: https://platform.openai.com/assistants
   > 
   > See `docs/CHATBOT_SETUP_GUIDE.md` for detailed instructions.

3. **Start the Server**
   ```bash
   npm start
   ```
   
   The site will be available at: **http://localhost:3000**

### Development

- Server runs on port 3000 by default (configurable via `PORT` in `.env`)
- Static files (HTML, CSS, JS, images) are automatically served from the root directory
- Chatbot API endpoint: `POST /api/chat`
- Health check endpoint: `GET /api/health`

### Chatbot Setup

1. Create an OpenAI Assistant at https://platform.openai.com/assistants
2. Upload your knowledge base (see `ScaleMako_Knowledge_Base.md`)
3. Copy the Assistant ID
4. Add both to your `.env` file
5. Restart the server

The chatbot will automatically use the backend API, keeping your API keys secure.

Then navigate to `http://localhost:8000` in your browser.

## File Organization Standards

This project follows industry-standard file organization:

- **Assets** are organized by type (CSS, JS, images)
- **Components** are modular and reusable
- **Documentation** is kept separate from code
- **HTML pages** remain in root for easy access

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 ScaleMako. All rights reserved.


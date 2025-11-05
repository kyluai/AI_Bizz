class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background-color: rgba(15, 15, 21, 0.95);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    padding: 1rem 2rem;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }
                .navbar.scrolled {
                    background-color: rgba(15, 15, 21, 0.95);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                .navbar-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                    color: white;
                }
                .logo-container:hover {
                    opacity: 0.9;
                }
                .logo-svg {
                    width: 45px;
                    height: 45px;
                    flex-shrink: 0;
                }
                .logo-text {
                    font-size: 1.5rem;
                    font-weight: 700;
                    font-family: 'Space Grotesk', sans-serif;
                    background: linear-gradient(to right, #6E45E2, #88D3CE);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    white-space: nowrap;
                }
                .nav-links {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }
                .nav-link {
                    position: relative;
                    color: #e5e7eb;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: color 0.3s ease;
                }
                .nav-link:hover {
                    color: #8A2BE2;
                }
                .nav-link:after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -2px;
                    left: 0;
                    background-color: #8A2BE2;
                    transition: width 0.3s ease;
                }
                .nav-link:hover:after {
                    width: 100%;
                }
                .cta-button {
                    padding: 0.5rem 1.5rem;
                    background: linear-gradient(to right, #7D5BDE, #88D3CE);
                    color: white;
                    border-radius: 9999px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .cta-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(125, 91, 222, 0.4);
                }
                @media (max-width: 768px) {
                    .nav-links {
                        gap: 1rem;
                    }
                    .logo-text {
                        font-size: 1rem;
                    }
                }
            </style>
            <nav class="navbar">
                <div class="navbar-container">
                    <a href="/" class="logo-container">
                        <svg class="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#6E45E2;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#88D3CE;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.2"/>
                            <path d="M30 50 L45 35 L70 35 L70 50 L45 50 Z" fill="url(#logoGradient)"/>
                            <path d="M30 65 L45 50 L70 50 L70 65 L45 65 Z" fill="url(#logoGradient)"/>
                            <circle cx="50" cy="50" r="3" fill="white"/>
                        </svg>
                        <span class="logo-text">ScaleBuddy</span>
                    </a>
                    <div class="nav-links">
                        <a href="#demos" class="nav-link">Demos</a>
                        <a href="#book-demo" class="nav-link">Pricing</a>
                        <a href="#book-demo" class="cta-button">Book Demo</a>
                    </div>
                </div>
            </nav>
        `;

        // Handle scroll effect
        const navbar = this.shadowRoot.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // Handle smooth scroll for anchor links
        this.shadowRoot.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    }
}

customElements.define('custom-navbar', CustomNavbar);

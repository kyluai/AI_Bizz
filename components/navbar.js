class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                .promo-banner {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 2000;
                    background: linear-gradient(135deg, #1e3a8a 0%, #7c2d12 100%);
                    color: white;
                    padding: 0.625rem 1rem;
                    text-align: center;
                    font-size: 0.875rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    box-sizing: border-box;
                    height: 40px;
                }
                
                .promo-banner.hidden {
                    display: none;
                }
                
                .promo-banner-content {
                    flex: 1;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .promo-banner-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    transition: background-color 0.2s;
                    font-size: 1.25rem;
                    line-height: 1;
                }
                
                .promo-banner-close:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 1999;
                    background-color: white;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    padding: 0.5rem 0;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    height: auto;
                    box-sizing: border-box;
                }
                
                .navbar.with-banner {
                    top: 40px;
                }
                
                @media (max-width: 768px) {
                    .promo-banner {
                        font-size: 0.7rem;
                        padding: 0.5rem 0.75rem;
                        height: 44px;
                    }
                    .promo-banner-content {
                        line-height: 1.3;
                    }
                    .navbar.with-banner {
                        top: 44px;
                    }
                }
                
                .navbar.scrolled {
                    background-color: white;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                
                .navbar-container {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0;
                }
                
                .logo-container {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    margin-left: 1rem;
                    flex-shrink: 0;
                }
                
                .logo-img {
                    height: 48px;
                    width: 280px;
                    object-fit: contain;
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: auto;
                    -ms-interpolation-mode: bicubic;
                    display: block;
                }

                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    margin-right: 1rem;
                }
                
                .nav-link {
                    position: relative;
                    color: #1f2937;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: color 0.3s ease;
                    white-space: nowrap;
                }
                
                .nav-link:hover {
                    color: #0072FF;
                }
                
                .nav-link:after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -2px;
                    left: 0;
                    background-color: #0072FF;
                    transition: width 0.3s ease;
                }
                
                .nav-link:hover:after {
                    width: 100%;
                }
                
                .phone-container {
                    position: relative;
                }
                
                .phone-icon-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    border-radius: 50%;
                }
                
                .phone-icon-btn:hover {
                    background-color: rgba(0, 114, 255, 0.1);
                }
                
                .phone-icon {
                    width: 20px;
                    height: 20px;
                    stroke: #4B5563;
                    transition: stroke 0.3s ease;
                }
                
                .phone-icon-btn:hover .phone-icon {
                    stroke: #0072FF;
                }
                
                .phone-dropdown {
                    position: absolute;
                    top: calc(100% + 0.75rem);
                    right: 0;
                    background: white;
                    border-radius: 1rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    padding: 1.5rem;
                    min-width: 280px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 1001;
                }
                
                .phone-dropdown.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .phone-dropdown::before {
                    content: '';
                    position: absolute;
                    top: -6px;
                    right: 20px;
                    width: 12px;
                    height: 12px;
                    background: white;
                    transform: rotate(45deg);
                    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.05);
                }
                
                .dropdown-label {
                    font-size: 0.75rem;
                    color: #6B7280;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 0.5rem;
                }
                
                .dropdown-phone-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 1rem;
                    letter-spacing: -0.5px;
                }
                
                .call-now-btn {
                    width: 100%;
                    padding: 0.625rem 1rem;
                    background: linear-gradient(to right, #00C6FF, #0072FF);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 198, 255, 0.3);
                }
                
                .call-now-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 198, 255, 0.4);
                }
                
                .cta-button {
                    padding: 0.5rem 1.25rem;
                    background: linear-gradient(to right, #00C6FF, #0072FF);
                    color: white;
                    border-radius: 9999px;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 198, 255, 0.3);
                    white-space: nowrap;
                }
                
                .cta-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 20px rgba(0, 198, 255, 0.5);
                }
                
                @media (max-width: 768px) {
                    .logo-img {
                        height: 40px;
                        width: 240px;
                    }
                    .nav-links {
                        gap: 1rem;
                    }
                    .nav-link {
                        font-size: 0.75rem;
                    }
                    .cta-button {
                        padding: 0.4rem 1rem;
                        font-size: 0.75rem;
                    }
                    .phone-dropdown {
                        min-width: 240px;
                        right: -20px;
                    }
                }
            </style>
            <div id="promoBanner" class="promo-banner">
                <div class="promo-banner-content">
                    🎉 New Year, New Business Growth. Commit to your resolution and automate your workflow. Get 15% OFF your custom quote until Jan 30th.
                </div>
                <button class="promo-banner-close" id="promoBannerClose" aria-label="Close banner">×</button>
            </div>
            <nav class="navbar" id="mainNavbar">
                <div class="navbar-container">
                    <a href="/" class="logo-container">
                        <img src="assets/images/image copy 3.png" alt="ScaleMako Logo" class="logo-img">
                    </a>
                    <div class="nav-links">
                        <a href="index.html#demos" class="nav-link">Demos</a>
                        <a href="index.html#book-demo" class="nav-link">Pricing</a>
                        <a href="careers.html" class="nav-link">Careers</a>
                        <div class="phone-container">
                            <button class="phone-icon-btn" id="phoneBtn" aria-label="Test Voice Agent">
                                <svg class="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                            </button>
                            <div class="phone-dropdown" id="phoneDropdown">
                                <div class="dropdown-label">Give us a call</div>
                                <div class="dropdown-phone-number">+1 (555) 123-4567</div>
                                <button class="call-now-btn" onclick="window.location.href='tel:+15551234567'">
                                    Call Now
                                </button>
                            </div>
                        </div>
                        <a href="book-demo.html" class="cta-button">Book Demo</a>
                    </div>
                </div>
            </nav>
        `;

        // Handle promo banner - Always show on page load (for testing)
        const promoBanner = this.shadowRoot.getElementById('promoBanner');
        const promoBannerClose = this.shadowRoot.getElementById('promoBannerClose');
        const mainNavbar = this.shadowRoot.getElementById('mainNavbar');
        
        // Always show banner on page load (removed localStorage check for testing)
        mainNavbar.classList.add('with-banner');
        
        promoBannerClose.addEventListener('click', () => {
            promoBanner.classList.add('hidden');
            mainNavbar.classList.remove('with-banner');
            // Removed localStorage persistence - banner will reappear on refresh
        });

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

        // Phone dropdown toggle
        const phoneBtn = this.shadowRoot.getElementById('phoneBtn');
        const phoneDropdown = this.shadowRoot.getElementById('phoneDropdown');
        
        phoneBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            phoneDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!phoneDropdown.contains(e.target) && e.target !== phoneBtn) {
                phoneDropdown.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        phoneDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

customElements.define('custom-navbar', CustomNavbar);
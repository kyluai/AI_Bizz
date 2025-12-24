class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-dark-900 border-t border-gray-800">
                <!-- Main Footer Content -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        <!-- Logo & Bio -->
                        <div class="lg:col-span-1">
                            <a href="/" class="flex items-center gap-3 mb-4">
                                <svg class="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="50" cy="50" r="45" fill="url(#footerLogoGradient)" opacity="0.2"/>
                                    <path d="M30 50 L45 35 L70 35 L70 50 L45 50 Z" fill="url(#footerLogoGradient)"/>
                                    <path d="M30 65 L45 50 L70 50 L70 65 L45 65 Z" fill="url(#footerLogoGradient)"/>
                                    <circle cx="50" cy="50" r="3" fill="white"/>
                                </svg>
                                <span class="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">ScaleBuddy</span>
                            </a>
                            <p class="text-gray-400 text-sm font-sans leading-relaxed mt-4">
                                Your AI partner for smarter business growth. We build custom automation solutions that save time and boost revenue.
                            </p>
                        </div>
                        
                        <!-- Platform -->
                        <div>
                            <h4 class="text-white font-display font-semibold mb-4">Platform</h4>
                            <ul class="space-y-3">
                                <li><a href="#demos" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">Demos</a></li>
                                <li><a href="#book-demo" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">Pricing</a></li>
                                <li><a href="book-demo.html" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">Book Demo</a></li>
                                <li><a href="#how-it-works" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">How It Works</a></li>
                            </ul>
                        </div>
                        
                        <!-- Company -->
                        <div>
                            <h4 class="text-white font-display font-semibold mb-4">Company</h4>
                            <ul class="space-y-3">
                                <li><a href="#about" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">About Us</a></li>
                                <li><a href="#faq" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">FAQ</a></li>
                                <li><a href="#contact" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">Contact</a></li>
                                <li><a href="#privacy" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">Privacy Policy</a></li>
                                <li><a href="#terms" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">Terms of Service</a></li>
                            </ul>
                        </div>
                        
                        <!-- Social -->
                        <div>
                            <h4 class="text-white font-display font-semibold mb-4">Connect</h4>
                            <ul class="space-y-3">
                                <li><a href="mailto:hello@scalebuddy.ai" class="text-gray-400 hover:text-primary-400 transition-colors font-sans text-sm">hello@scalebuddy.ai</a></li>
                                <li class="flex items-center gap-4 mt-6">
                                    <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                                        <i data-feather="linkedin" class="w-5 h-5"></i>
                                    </a>
                                    <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Twitter">
                                        <i data-feather="twitter" class="w-5 h-5"></i>
                                    </a>
                                    <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Facebook">
                                        <i data-feather="facebook" class="w-5 h-5"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Sub-footer CTA -->
                <div class="border-t border-gray-800">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div class="text-center">
                            <h3 class="text-2xl font-display font-bold text-white mb-2">Ready to scale?</h3>
                            <p class="text-gray-400 font-sans mb-6">Let's build your automation system today</p>
                            <a href="book-demo.html" class="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-500/30">
                                Book Demo
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Copyright -->
                <div class="border-t border-gray-800">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p class="text-gray-500 text-sm font-sans">
                                © ${new Date().getFullYear()} ScaleBuddy. All rights reserved.
                            </p>
                            <div class="flex items-center gap-6">
                                <a href="#privacy" class="text-gray-500 hover:text-primary-400 transition-colors text-sm font-sans">Privacy</a>
                                <a href="#terms" class="text-gray-500 hover:text-primary-400 transition-colors text-sm font-sans">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

customElements.define('custom-footer', CustomFooter);


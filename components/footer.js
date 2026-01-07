class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-gray-50 border-t border-gray-200">
                <!-- Main Footer Content -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        <!-- Logo & Bio -->
                        <div class="lg:col-span-1">
                            <a href="/" class="flex items-center mb-4">
                                <img src="assets/images/image copy 3.png" alt="ScaleMako Logo" class="h-14 w-auto object-contain">
                            </a>
                            <p class="text-gray-400 text-sm font-sans leading-relaxed mt-4">
                                Your AI partner for smarter business growth. We build custom automation solutions that save time and boost revenue.
                            </p>
                        </div>
                        
                        <!-- Platform -->
                        <div>
                            <h4 class="text-gray-900 font-display font-semibold mb-4">Platform</h4>
                            <ul class="space-y-3">
                                <li><a href="#demos" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Demos</a></li>
                                <li><a href="#book-demo" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Pricing</a></li>
                                <li><a href="book-demo.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Book Demo</a></li>
                                <li><a href="#how-it-works" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">How It Works</a></li>
                            </ul>
                        </div>
                        
                        <!-- Company -->
                        <div>
                            <h4 class="text-gray-900 font-display font-semibold mb-4">Company</h4>
                            <ul class="space-y-3">
                                <li><a href="about.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">About Us</a></li>
                                <li><a href="faq.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">FAQ</a></li>
                                <li><a href="#contact" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Contact</a></li>
                                <li><a href="privacy.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Privacy Policy</a></li>
                                <li><a href="terms.html" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">Terms of Service</a></li>
                            </ul>
                        </div>
                        
                        <!-- Social -->
                        <div>
                            <h4 class="text-gray-900 font-display font-semibold mb-4">Connect</h4>
                            <ul class="space-y-3">
                                <li><a href="mailto:hello@scalemako.ai" class="text-gray-600 hover:text-[#0072FF] transition-colors font-sans text-sm">hello@scalemako.ai</a></li>
                                <li class="flex items-center gap-4 mt-6">
                                    <a href="#" class="text-gray-600 hover:text-[#0072FF] transition-colors" aria-label="LinkedIn">
                                        <i data-feather="linkedin" class="w-5 h-5"></i>
                                    </a>
                                    <a href="#" class="text-gray-600 hover:text-[#0072FF] transition-colors" aria-label="Twitter">
                                        <i data-feather="twitter" class="w-5 h-5"></i>
                                    </a>
                                    <a href="#" class="text-gray-600 hover:text-[#0072FF] transition-colors" aria-label="Facebook">
                                        <i data-feather="facebook" class="w-5 h-5"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Copyright -->
                <div class="border-t border-gray-200">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p class="text-gray-600 text-sm font-sans">
                                © ${new Date().getFullYear()} ScaleMako. All rights reserved.
                            </p>
                            <div class="flex items-center gap-6">
                                <a href="privacy.html" class="text-gray-600 hover:text-[#0072FF] transition-colors text-sm font-sans">Privacy</a>
                                <a href="terms.html" class="text-gray-600 hover:text-[#0072FF] transition-colors text-sm font-sans">Terms</a>
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


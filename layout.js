/**
 * AlphaPulse Layout Manager v2 - Full Stack Open Inspired
 * Clean, minimal, educational design with dark/light theme support
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        pages: [
            { path: 'index.html', name: 'Home', title: 'AlphaPulse' },
            { path: 'index-v3.html', name: 'Home', title: 'AlphaPulse Daily' },
            { path: 'develop.html', name: 'Develop', title: 'Develop - AlphaPulse' },
            { path: 'replay.html', name: 'Replay', title: 'Replay - AlphaPulse' },
            { path: 'research.html', name: 'Research', title: 'Research - AlphaPulse' },
            { path: 'deploy.html', name: 'Deploy', title: 'Deploy - AlphaPulse' }
        ],
        themes: {
            light: 'light',
            dark: 'dark'
        }
    };

    // State management
    const state = {
        isMobileMenuOpen: false,
        currentPage: null,
        currentTheme: 'light',
        user: null
    };

    /**
     * Initialize layout on page load
     */
    function init() {
        // Load saved theme
        loadTheme();
        
        // Detect current page
        detectCurrentPage();
        
        // Inject header
        injectHeader();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize mobile state
        initializeMobileState();
        
        // Check authentication
        checkAuthentication();
        
        // Add page load animation
        document.body.classList.add('animate-fadeIn');
    }

    /**
     * Load saved theme preference
     */
    function loadTheme() {
        const savedTheme = localStorage.getItem('alphapulse_theme') || 'light';
        state.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    /**
     * Toggle theme between light and dark
     */
    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', state.currentTheme);
        localStorage.setItem('alphapulse_theme', state.currentTheme);
        updateThemeIcon();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('alphapulse:themechange', { 
            detail: { theme: state.currentTheme } 
        }));
    }

    /**
     * Update theme toggle icon
     */
    function updateThemeIcon() {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.innerHTML = state.currentTheme === 'light' 
                ? getSunIcon() 
                : getMoonIcon();
        }
    }

    /**
     * Detect which page we're currently on
     */
    function detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        state.currentPage = config.pages.find(page => 
            page.path === filename || 
            (filename === '' && page.path === 'index.html')
        );
        
        // Update page title
        if (state.currentPage) {
            document.title = state.currentPage.title;
        }
    }

    /**
     * Inject header HTML into the page
     */
    function injectHeader() {
        const headerHTML = `
            <header class="header" id="main-header">
                <div class="header-content">
                    <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
                        ${getMenuIcon()}
                    </button>
                    <a href="index.html" class="logo">AlphaPulse</a>
                    <nav class="nav ${state.isMobileMenuOpen ? 'mobile-open' : ''}" id="main-nav">
                        <div class="nav-links">
                            ${generateNavLinks()}
                        </div>
                        <div class="nav-actions">
                            <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                                ${state.currentTheme === 'light' ? getSunIcon() : getMoonIcon()}
                            </button>
                            <a href="#" class="btn btn-ghost btn-sm" id="login-link">
                                ${state.user ? state.user.name : 'Login'}
                            </a>
                        </div>
                    </nav>
                </div>
            </header>
        `;

        // Find the app container or body
        const appContainer = document.querySelector('.app-container') || 
                           document.querySelector('#app') || 
                           document.body;

        // If there's already a header, replace it
        const existingHeader = document.querySelector('.header');
        if (existingHeader) {
            existingHeader.outerHTML = headerHTML;
        } else {
            // Otherwise, insert at the beginning
            appContainer.insertAdjacentHTML('afterbegin', headerHTML);
        }

        // Add app-container class if it doesn't exist
        if (!document.querySelector('.app-container')) {
            document.body.classList.add('app-container');
        }
    }

    /**
     * Generate navigation links with active state
     */
    function generateNavLinks() {
        return config.pages
            .filter(page => !page.path.startsWith('index')) // Skip home pages in nav
            .map(page => {
                const isActive = state.currentPage && state.currentPage.path === page.path;
                const activeClass = isActive ? 'active' : '';
                return `<a href="${page.path}" class="${activeClass}">${page.name}</a>`;
            })
            .join('');
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Mobile menu toggle
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Theme toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', toggleTheme);
        }

        // Login link
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', handleLogin);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.getElementById('main-nav');
            const menuBtn = document.getElementById('mobile-menu-btn');
            
            if (state.isMobileMenuOpen && 
                nav && !nav.contains(e.target) && 
                menuBtn && !menuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', handleResize);

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMobileMenuOpen) {
                closeMobileMenu();
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        if (state.isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        const nav = document.getElementById('main-nav');
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (nav) {
            nav.classList.add('mobile-open');
            state.isMobileMenuOpen = true;
            
            // Update menu icon
            if (menuBtn) {
                menuBtn.innerHTML = getCloseIcon();
            }
            
            // Prevent body scroll on mobile
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        const nav = document.getElementById('main-nav');
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (nav) {
            nav.classList.remove('mobile-open');
            state.isMobileMenuOpen = false;
            
            // Update menu icon
            if (menuBtn) {
                menuBtn.innerHTML = getMenuIcon();
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    /**
     * Initialize mobile state based on viewport
     */
    function initializeMobileState() {
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        if (window.innerWidth > 768 && state.isMobileMenuOpen) {
            closeMobileMenu();
        }
    }

    /**
     * Handle login/logout
     */
    function handleLogin(e) {
        e.preventDefault();
        
        if (state.user) {
            // Logout
            logout();
        } else {
            // Show login modal or redirect
            // For now, just simulate login
            login({ name: 'Demo User', id: 'demo123' });
        }
    }

    /**
     * Check authentication status
     */
    function checkAuthentication() {
        const savedUser = localStorage.getItem('alphapulse_user');
        if (savedUser) {
            try {
                state.user = JSON.parse(savedUser);
                updateLoginLink();
            } catch (e) {
                console.error('Failed to parse saved user:', e);
            }
        }
    }

    /**
     * Login user
     */
    function login(user) {
        state.user = user;
        localStorage.setItem('alphapulse_user', JSON.stringify(user));
        updateLoginLink();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('alphapulse:login', { detail: user }));
    }

    /**
     * Logout user
     */
    function logout() {
        state.user = null;
        localStorage.removeItem('alphapulse_user');
        updateLoginLink();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('alphapulse:logout'));
    }

    /**
     * Update login link text
     */
    function updateLoginLink() {
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.textContent = state.user ? state.user.name : 'Login';
        }
    }

    /**
     * SVG Icons
     */
    function getMenuIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>`;
    }

    function getCloseIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
    }

    function getSunIcon() {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
    }

    function getMoonIcon() {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
    }

    /**
     * Public API
     */
    window.AlphaPulseLayout = {
        init,
        toggleMobileMenu,
        closeMobileMenu,
        toggleTheme,
        login,
        logout,
        getUser: () => state.user,
        getCurrentPage: () => state.currentPage,
        getTheme: () => state.currentTheme
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
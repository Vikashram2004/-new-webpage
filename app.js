// ===========================
// COGMART E-COMMERCE NAVIGATION
// TypeScript Module for Angular Integration
// ===========================
/**
 * CogMart Navigation Controller Class
 * Handles all navigation interactions and state management
 * Designed for Angular component integration without direct DOM manipulation
 */
class CogMartNavigation {
    /**
     * Constructor - Initializes navigation state and event system
     */
    constructor() {
        // Initialize navigation state with default values
        this.state = {
            isSidebarOpen: false,
            isSearchFocused: false,
            cartItemCount: 3, // Default cart count for demo
            currentBreakpoint: this.getCurrentBreakpoint()
        };
        // Initialize event callback system for component communication
        this.eventCallbacks = new Map();
        // Setup initial event listeners
        this.initializeEventListeners();
        // Setup responsive breakpoint detection
        this.setupResponsiveDetection();
    }
    /**
     * Initializes all event listeners for navigation interactions
     * Uses event delegation for better performance and Angular compatibility
     */
    initializeEventListeners() {
        // Wait for DOM to be ready before setting up listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        }
        else {
            this.setupEventListeners();
        }
    }
    /**
     * Sets up actual event listeners after DOM is ready
     * Handles hamburger button clicks, overlay clicks, and keyboard events
     */
    setupEventListeners() {
        // Hamburger button event listeners (both mobile and desktop)
        const hamburgerButtons = document.querySelectorAll('#sidebarToggle, #sidebarToggleDesktop');
        hamburgerButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleSidebar('hamburger');
            });
        });
        // Sidebar close button event listener
        const closeButton = document.querySelector('#sidebarClose');
        if (closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.closeSidebar('close-button');
            });
        }
        // Overlay click to close sidebar
        const overlay = document.querySelector('#sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeSidebar('overlay');
            });
        }
        // Keyboard event listeners for accessibility
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardEvents(event);
        });
        // Search input focus/blur tracking
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.updateSearchFocus(true);
            });
            input.addEventListener('blur', () => {
                this.updateSearchFocus(false);
            });
        });
        // Category item click tracking
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', (event) => {
                var _a;
                this.handleCategoryClick(event, ((_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '');
            });
        });
    }
    /**
     * Handles keyboard events for navigation accessibility
     * Supports ESC key to close sidebar and other keyboard shortcuts
     */
    handleKeyboardEvents(event) {
        var _a;
        switch (event.key) {
            case 'Escape':
                if (this.state.isSidebarOpen) {
                    event.preventDefault();
                    this.closeSidebar('escape-key');
                }
                break;
            case 'ArrowDown':
                if (this.state.isSearchFocused) {
                    // Handle search suggestions navigation (future implementation)
                    event.preventDefault();
                }
                break;
            case 'Enter':
                // Handle search or category selection
                const activeElement = document.activeElement;
                if (activeElement === null || activeElement === void 0 ? void 0 : activeElement.classList.contains('category-item')) {
                    event.preventDefault();
                    this.handleCategoryClick(event, ((_a = activeElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '');
                }
                break;
        }
    }
    /**
     * Toggles sidebar open/closed state
     * Emits events for Angular component to handle UI updates
     */
    toggleSidebar(trigger) {
        const newState = !this.state.isSidebarOpen;
        if (newState) {
            this.openSidebar(trigger);
        }
        else {
            this.closeSidebar(trigger);
        }
    }
    /**
     * Opens the sidebar and updates application state
     * Handles overlay display and body scroll prevention
     */
    openSidebar(trigger) {
        if (this.state.isSidebarOpen)
            return;
        // Update internal state
        this.state.isSidebarOpen = true;
        // Apply UI changes
        this.applySidebarState();
        // Emit sidebar event for Angular component
        this.emitSidebarEvent({
            type: 'open',
            timestamp: Date.now(),
            trigger
        });
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
        // Focus management for accessibility
        setTimeout(() => {
            const firstCategoryItem = document.querySelector('.category-item');
            if (firstCategoryItem) {
                firstCategoryItem.focus();
            }
        }, 300); // Wait for sidebar animation to complete
    }
    /**
     * Closes the sidebar and updates application state
     * Restores body scroll and clears overlay
     */
    closeSidebar(trigger) {
        if (!this.state.isSidebarOpen)
            return;
        // Update internal state
        this.state.isSidebarOpen = false;
        // Apply UI changes
        this.applySidebarState();
        // Emit sidebar event for Angular component
        this.emitSidebarEvent({
            type: 'close',
            timestamp: Date.now(),
            trigger
        });
        // Restore body scroll
        document.body.style.overflow = '';
        // Return focus to hamburger button for accessibility
        setTimeout(() => {
            const hamburgerButton = document.querySelector('#sidebarToggle, #sidebarToggleDesktop');
            if (hamburgerButton) {
                hamburgerButton.focus();
            }
        }, 100);
    }
    /**
     * Applies sidebar state changes to DOM elements
     * Adds/removes active classes for CSS transitions
     */
    applySidebarState() {
        const sidebar = document.querySelector('#sidebarMenu');
        const overlay = document.querySelector('#sidebarOverlay');
        if (sidebar && overlay) {
            if (this.state.isSidebarOpen) {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            }
            else {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    }
    /**
     * Handles category item clicks
     * Emits events for Angular routing and analytics
     */
    handleCategoryClick(event, categoryName) {
        event.preventDefault();
        // Emit category selection event for Angular component
        this.emitEvent('categorySelected', {
            category: categoryName,
            timestamp: Date.now(),
            source: 'sidebar'
        });
        // Close sidebar after category selection on mobile
        if (this.state.currentBreakpoint === 'mobile') {
            this.closeSidebar('hamburger');
        }
        // Log for analytics (in real app, this would go to analytics service)
        console.log(`Category selected: ${categoryName}`);
    }
    /**
     * Updates search focus state for UI enhancements
     * Can be used to show/hide search suggestions
     */
    updateSearchFocus(focused) {
        this.state.isSearchFocused = focused;
        // Emit search focus event for Angular component
        this.emitEvent('searchFocusChanged', {
            focused,
            timestamp: Date.now()
        });
    }
    /**
     * Sets up responsive breakpoint detection
     * Monitors window resize events to update current breakpoint
     */
    setupResponsiveDetection() {
        // Initial breakpoint detection
        this.updateBreakpoint();
        // Listen for window resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize events for better performance
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                this.updateBreakpoint();
            }, 150);
        });
    }
    /**
     * Determines current responsive breakpoint based on window width
     * Returns breakpoint string for state management
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < 768) {
            return 'mobile';
        }
        else if (width < 992) {
            return 'tablet';
        }
        else {
            return 'desktop';
        }
    }
    /**
     * Updates current breakpoint and emits change events
     * Handles responsive behavior changes
     */
    updateBreakpoint() {
        const newBreakpoint = this.getCurrentBreakpoint();
        const previousBreakpoint = this.state.currentBreakpoint;
        if (newBreakpoint !== previousBreakpoint) {
            this.state.currentBreakpoint = newBreakpoint;
            // Emit breakpoint change event for Angular component
            this.emitEvent('breakpointChanged', {
                previous: previousBreakpoint,
                current: newBreakpoint,
                timestamp: Date.now()
            });
            // Close sidebar when switching to desktop if it's open
            if (newBreakpoint === 'desktop' && this.state.isSidebarOpen) {
                this.closeSidebar('hamburger');
            }
        }
    }
    /**
     * Emits sidebar-specific events with proper typing
     * Used for Angular component communication
     */
    emitSidebarEvent(event) {
        this.emitEvent('sidebarEvent', event);
    }
    /**
     * Generic event emission system for Angular integration
     * Allows components to subscribe to navigation events
     */
    emitEvent(eventName, data) {
        const callbacks = this.eventCallbacks.get(eventName);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                }
                catch (error) {
                    console.error(`Error in event callback for ${eventName}:`, error);
                }
            });
        }
        // Also dispatch custom DOM event for broader compatibility
        const customEvent = new CustomEvent(`cogmart:${eventName}`, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(customEvent);
    }
    /**
     * Allows Angular components to subscribe to navigation events
     * Returns unsubscribe function for cleanup
     */
    addEventListener(eventName, callback) {
        if (!this.eventCallbacks.has(eventName)) {
            this.eventCallbacks.set(eventName, []);
        }
        const callbacks = this.eventCallbacks.get(eventName);
        callbacks.push(callback);
        // Return unsubscribe function
        return () => {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    /**
     * Public getter for current navigation state
     * Allows Angular components to access state without direct manipulation
     */
    getState() {
        return Object.assign({}, this.state);
    }
    /**
     * Updates cart item count
     * Used by Angular shopping cart service
     */
    updateCartCount(count) {
        const previousCount = this.state.cartItemCount;
        this.state.cartItemCount = Math.max(0, count);
        // Update cart badge in DOM
        const cartBadges = document.querySelectorAll('.cart-badge');
        cartBadges.forEach(badge => {
            badge.textContent = this.state.cartItemCount.toString();
            // Hide badge if count is 0
            if (this.state.cartItemCount === 0) {
                badge.style.display = 'none';
            }
            else {
                badge.style.display = 'flex';
            }
        });
        // Emit cart count change event
        this.emitEvent('cartCountChanged', {
            previous: previousCount,
            current: this.state.cartItemCount,
            timestamp: Date.now()
        });
    }
    /**
     * Performs search operation
     * Emits search events for Angular search service
     */
    performSearch(query) {
        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0) {
            return;
        }
        // Emit search event for Angular component
        this.emitEvent('searchPerformed', {
            query: trimmedQuery,
            timestamp: Date.now(),
            source: this.state.currentBreakpoint
        });
        // Log for analytics
        console.log(`Search performed: "${trimmedQuery}"`);
    }
    /**
     * Cleanup method for component destruction
     * Removes event listeners and clears state
     */
    destroy() {
        // Clear all event callbacks
        this.eventCallbacks.clear();
        // Remove any applied body styles
        document.body.style.overflow = '';
        // Close sidebar if open
        if (this.state.isSidebarOpen) {
            this.closeSidebar('hamburger');
        }
        console.log('CogMart Navigation destroyed');
    }
}
// ===========================
// GLOBAL INITIALIZATION
// ===========================
// Global navigation instance for immediate use
let cogMartNavigation;
/**
 * Initialize navigation when DOM is ready
 * Creates global instance accessible to Angular components
 */
function initializeCogMartNavigation() {
    cogMartNavigation = new CogMartNavigation();
    // Make available globally for Angular integration
    window.cogMartNavigation = cogMartNavigation;
    // Setup search form submission handlers
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        const form = input.closest('form') || input.parentElement;
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const searchValue = input.value;
                cogMartNavigation.performSearch(searchValue);
            });
        }
    });
    // Setup search button click handlers
    const searchButtons = document.querySelectorAll('.search-btn');
    searchButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            var _a;
            event.preventDefault();
            const searchInput = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.search-input');
            if (searchInput) {
                cogMartNavigation.performSearch(searchInput.value);
            }
        });
    });
    console.log('CogMart Navigation initialized successfully');
}
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCogMartNavigation);
}
else {
    initializeCogMartNavigation();
}
// Export for module usage in Angular
export { CogMartNavigation };

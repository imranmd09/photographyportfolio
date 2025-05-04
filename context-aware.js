/**
 * Context-Aware Elements for Lens & Lore Photography
 * Detects background colors and adjusts UI elements accordingly
 */

document.addEventListener('DOMContentLoaded', function() {
    initContextAwareCursor();
    initContextAwareNavigation();
});

/**
 * Initialize the context-aware cursor
 */
function initContextAwareCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;
    
    // Add cursor-active class to body
    document.body.classList.add('cursor-active');
    
    // Update cursor position
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add active class on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, input, textarea, select, .nav-toggle');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('active');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('active');
        });
    });
    
    // Show/hide cursor when entering/leaving the window
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    // Initial state
    cursor.style.opacity = '1';
}

/**
 * Initialize context-aware navigation that changes color based on background
 */
function initContextAwareNavigation() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // Create an observer for the header
    const headerObserver = new IntersectionObserver(
        (entries) => {
            // This will be used for scrolling behavior
        },
        { threshold: 0.1 }
    );
    
    headerObserver.observe(header);
    
    // Function to check if a point is over a dark background
    function isOverDarkBackground(element) {
        if (!element) return false;
        
        // Get element's position
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Create a temporary canvas to analyze the pixel
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Draw the current view to the canvas
        context.drawWindow(window, 0, 0, window.innerWidth, window.innerHeight, 'rgb(255,255,255)');
        
        // Get the pixel data
        const pixelData = context.getImageData(x, y, 1, 1).data;
        
        // Calculate perceived brightness
        // Formula: (0.299*R + 0.587*G + 0.114*B)
        const brightness = (0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2]) / 255;
        
        // Clean up
        canvas.remove();
        
        // Return true if background is dark (brightness < 0.5)
        return brightness < 0.5;
    }
    
    // Alternative approach using scroll position and predefined sections
    function updateHeaderBasedOnSection() {
        const darkSections = document.querySelectorAll('.dark-background, .hero, .cta-section');
        const headerRect = header.getBoundingClientRect();
        const headerMiddleY = headerRect.top + headerRect.height / 2;
        
        let isOverDark = false;
        
        darkSections.forEach(section => {
            const sectionRect = section.getBoundingClientRect();
            
            // Check if header overlaps with this dark section
            if (headerMiddleY >= sectionRect.top && headerMiddleY <= sectionRect.bottom) {
                isOverDark = true;
            }
        });
        
        // Update header class based on background
        if (isOverDark) {
            header.classList.add('over-dark');
        } else {
            header.classList.remove('over-dark');
        }
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateHeaderBasedOnSection);
    
    // Initial check
    updateHeaderBasedOnSection();
    
    // Add dark-background class to sections that need it
    const potentialDarkSections = document.querySelectorAll('.hero, .cta-section');
    potentialDarkSections.forEach(section => {
        section.classList.add('dark-background');
    });
}

/**
 * Fallback for browsers that don't support canvas.drawWindow
 * This uses a simpler approach based on section classes
 */
function initSimpleContextAware() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // Define sections that are known to have dark backgrounds
    const darkSections = [
        { selector: '.hero', threshold: 0.6 },
        { selector: '.cta-section', threshold: 0.3 }
    ];
    
    // Create observers for each dark section
    darkSections.forEach(section => {
        const elements = document.querySelectorAll(section.selector);
        
        elements.forEach(element => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && entry.intersectionRatio > section.threshold) {
                            header.classList.add('over-dark');
                        } else {
                            header.classList.remove('over-dark');
                        }
                    });
                },
                { threshold: [0, section.threshold, 1] }
            );
            
            observer.observe(element);
        });
    });
}

// Check if drawWindow is supported, otherwise use the simple approach
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (context && typeof context.drawWindow === 'function') {
        // Advanced context-aware is supported
        initContextAwareNavigation();
    } else {
        // Use simple approach
        initSimpleContextAware();
    }
});
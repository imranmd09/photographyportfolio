/**
 * Context-Aware Elements - Enhanced Version
 * Adaptive UI elements that respond to their background context
 */

document.addEventListener('DOMContentLoaded', function() {
    initContextAwareCursor();
    initContextAwareHeader();
    initHeaderTransparency();
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
 * Initialize context-aware header that changes based on background
 */
function initContextAwareHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // Add dark-background class to sections that should have light text
    const darkBackgroundSections = [
        '.hero',
        '.cta-section',
        '.testimonials-section.dark',
        '.portfolio-header.dark',
        '.dark-background'
    ];
    
    darkBackgroundSections.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element.classList.contains('dark-background')) {
                element.classList.add('dark-background');
            }
        });
    });
    
    // Function to check header position against dark sections
    function updateHeaderContext() {
        const darkSections = document.querySelectorAll('.dark-background');
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
        
        // Update context-aware buttons
        updateContextAwareButtons();
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateHeaderContext);
    
    // Initial check
    updateHeaderContext();
    
    // Also update on window resize
    window.addEventListener('resize', updateHeaderContext);
}

/**
 * Initialize header transparency effect
 */
function initHeaderTransparency() {
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero');
    
    if (!header || !hero) return;
    
    // Add transparent class to body to enable transparent header styling
    document.body.classList.add('header-transparent');
    
    // Make header transparent initially
    header.classList.add('transparent');
    
    // Function to update header transparency based on scroll position
    function updateHeaderTransparency() {
        const scrollPosition = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const headerHeight = header.offsetHeight;
        
        // Calculate when header should become solid
        // Transition starts when we're 2/3 through the hero section
        const transitionPoint = heroHeight * 0.66;
        
        if (scrollPosition > transitionPoint) {
            // Past the hero section, make header solid
            header.classList.remove('transparent');
        } else {
            // Still in hero section, keep header transparent
            header.classList.add('transparent');
        }
        
        // Add scrolled class for subtle styling changes
        if (scrollPosition > headerHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateHeaderTransparency);
    
    // Initial check
    updateHeaderTransparency();
}

/**
 * Update context-aware buttons based on their background
 */
function updateContextAwareButtons() {
    const contextAwareButtons = document.querySelectorAll('.context-aware-btn');
    
    contextAwareButtons.forEach(button => {
        // Find the closest parent section
        const parentSection = button.closest('section');
        
        if (parentSection && parentSection.classList.contains('dark-background')) {
            // Button is in a dark section
            button.classList.add('over-dark');
        } else {
            // Button is in a light section
            button.classList.remove('over-dark');
        }
    });
}

/**
 * Helper function to get the brightness of a color
 * @param {string} color - CSS color value
 * @returns {number} - Brightness value between 0 and 1
 */
function getColorBrightness(color) {
    // Create a temporary element to compute the color
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    tempElement.style.display = 'none';
    document.body.appendChild(tempElement);
    
    // Get computed color
    const computedColor = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    
    // Extract RGB values
    const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        
        // Calculate perceived brightness
        // Formula: (0.299*R + 0.587*G + 0.114*B) / 255
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
    
    return 0.5; // Default to middle brightness if can't determine
}
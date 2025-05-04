/**
 * Performance Optimizations for Lens & Lore Photography
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance optimizations
    optimizeImageLoading();
    optimizeAnimations();
    initIntersectionObserver();
});

/**
 * Optimize image loading
 */
function optimizeImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        // Add native lazy loading attribute
        img.setAttribute('loading', 'lazy');
        
        // Add error handling
        img.onerror = function() {
            console.warn('Failed to load image:', img.dataset.src);
            // Try to reload the image with a different extension
            if (img.src.includes('.jpeg')) {
                this.src = img.src.replace('.jpeg', '.jpg');
            } else if (img.src.includes('.jpg')) {
                this.src = img.src.replace('.jpg', '.jpeg');
            }
        };
    });
}

/**
 * Optimize animations to reduce layout thrashing
 */
function optimizeAnimations() {
    // Reduce the number of animated elements for better performance
    const allAnimatedElements = document.querySelectorAll('[class*="fade-"], [class*="delay-"]');
    if (allAnimatedElements.length > 20) {
        // If there are too many animated elements, limit animations to important ones
        const lessImportantElements = document.querySelectorAll('.gallery-item:nth-child(n+6) [class*="fade-"], .gallery-item:nth-child(n+6) [class*="delay-"]');
        lessImportantElements.forEach(el => {
            el.classList.remove('fade-in', 'delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5');
        });
    }
}

/**
 * Use Intersection Observer for better performance
 */
function initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        // Options for the observer
        const options = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1
        };
        
        // Create the observer
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Handle image loading
                    if (element.tagName === 'IMG' && element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    // Handle animation classes
                    if (element.classList.contains('fade-in') && !element.classList.contains('visible')) {
                        element.classList.add('visible');
                    }
                    
                    // Stop observing after handling
                    observer.unobserve(element);
                }
            });
        }, options);
        
        // Observe images
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
        
        // Observe animated elements
        document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
            observer.observe(el);
        });
    }
}

// Fix image loading issues
setTimeout(function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
            // Try to reload the image
            const currentSrc = img.src;
            img.src = currentSrc + '?v=' + new Date().getTime(); // Add cache-busting parameter
        }
    });
}, 2000);
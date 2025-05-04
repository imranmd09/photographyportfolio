/**
 * Image Loading Fix for Lens & Lore Photography
 * This script specifically addresses image loading issues
 */

// Execute immediately
(function() {
    // Try to fix image paths
    fixImagePaths();
    
    // Add event listener for when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Try again after DOM is loaded
        fixImagePaths();
        
        // Add fallback for images
        addImageFallbacks();
        
        // Try one more time after a delay
        setTimeout(fixImagePaths, 1000);
    });
    
    // Also try after window load event
    window.addEventListener('load', function() {
        fixImagePaths();
        checkAllImages();
    });
})();

/**
 * Fix image paths by trying both .jpg and .jpeg extensions
 */
function fixImagePaths() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Skip images that are already loaded correctly
        if (img.complete && img.naturalHeight > 0) {
            return;
        }
        
        // Try to fix the path
        const currentSrc = img.src || '';
        const dataSrc = img.getAttribute('data-src') || '';
        
        // Check if we need to try a different extension
        if (currentSrc.includes('.jpeg')) {
            tryAlternateExtension(img, currentSrc, '.jpeg', '.jpg');
        } else if (currentSrc.includes('.jpg')) {
            tryAlternateExtension(img, currentSrc, '.jpg', '.jpeg');
        }
        
        // Also check data-src attribute
        if (dataSrc.includes('.jpeg')) {
            img.setAttribute('data-src', dataSrc.replace('.jpeg', '.jpg'));
        } else if (dataSrc.includes('.jpg')) {
            img.setAttribute('data-src', dataSrc.replace('.jpg', '.jpeg'));
        }
    });
}

/**
 * Try loading an image with an alternate file extension
 */
function tryAlternateExtension(imgElement, currentSrc, currentExt, newExt) {
    // Create a new image to test the alternate extension
    const testImg = new Image();
    
    // Set up load and error handlers
    testImg.onload = function() {
        // If the alternate extension works, update the original image
        imgElement.src = currentSrc.replace(currentExt, newExt);
    };
    
    // Try the alternate extension
    testImg.src = currentSrc.replace(currentExt, newExt);
}

/**
 * Add fallback mechanisms for images
 */
function addImageFallbacks() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add error handler to each image
        img.onerror = function() {
            // Try the alternate extension first
            const currentSrc = this.src || '';
            
            if (currentSrc.includes('.jpeg')) {
                this.src = currentSrc.replace('.jpeg', '.jpg');
            } else if (currentSrc.includes('.jpg')) {
                this.src = currentSrc.replace('.jpg', '.jpeg');
            } else {
                // If that doesn't work, use a placeholder
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
                this.classList.add('image-load-error');
            }
        };
    });
}

/**
 * Check if all images have loaded correctly
 */
function checkAllImages() {
    const images = document.querySelectorAll('img');
    let failedImages = 0;
    
    images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
            failedImages++;
            console.warn('Image failed to load:', img.src);
            
            // Try one more time with cache-busting
            img.src = img.src + '?v=' + new Date().getTime();
        }
    });
    
    if (failedImages > 0) {
        console.warn(`${failedImages} images failed to load properly.`);
    }
}
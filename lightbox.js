// Lightbox Gallery Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    
    const lightboxCaption = document.createElement('div');
    lightboxCaption.className = 'lightbox-caption';
    
    const lightboxClose = document.createElement('div');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.innerHTML = '&times;';
    
    const lightboxPrev = document.createElement('div');
    lightboxPrev.className = 'lightbox-prev';
    lightboxPrev.innerHTML = '&#10094;';
    
    const lightboxNext = document.createElement('div');
    lightboxNext.className = 'lightbox-next';
    lightboxNext.innerHTML = '&#10095;';
    
    // Append elements to the DOM
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(lightboxCaption);
    lightbox.appendChild(lightboxContent);
    lightbox.appendChild(lightboxClose);
    lightbox.appendChild(lightboxPrev);
    lightbox.appendChild(lightboxNext);
    document.body.appendChild(lightbox);
    
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    let currentIndex = 0;
    let images = [];
    
    // Collect all images and their captions
    galleryImages.forEach((img, index) => {
        images.push({
            src: img.src,
            alt: img.alt,
            caption: img.dataset.caption || img.alt
        });
        
        // Add click event to open lightbox
        img.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Open lightbox function
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Update lightbox content
    function updateLightboxContent() {
        const image = images[currentIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = image.caption;
        
        // Preload adjacent images for smoother navigation
        if (currentIndex > 0) {
            const prevImg = new Image();
            prevImg.src = images[currentIndex - 1].src;
        }
        
        if (currentIndex < images.length - 1) {
            const nextImg = new Image();
            nextImg.src = images[currentIndex + 1].src;
        }
    }
    
    // Navigate to previous image
    function prevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightboxContent();
        }
    }
    
    // Navigate to next image
    function nextImage() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateLightboxContent();
        }
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
});

// Lazy Loading Implementation
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(function() {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
        lazyLoad();
    }
});

// Page Transitions
document.addEventListener('DOMContentLoaded', function() {
    // Create page transition element
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);
    
    // Add fade-in classes to main elements
    const mainSections = document.querySelectorAll('main > section');
    mainSections.forEach((section, index) => {
        section.classList.add('fade-in', `delay-${index + 1}`);
    });
    
    // Handle page navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip for external links or anchor links
            if (this.hostname !== window.location.hostname || this.getAttribute('href').startsWith('#')) {
                return;
            }
            
            if (this.getAttribute('href') === window.location.pathname) {
                e.preventDefault();
                return;
            }
            
            e.preventDefault();
            const targetHref = this.getAttribute('href');
            
            // Activate transition
            pageTransition.classList.add('active');
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = targetHref;
            }, 500);
        });
    });
    
    // Hide transition on page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            pageTransition.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                pageTransition.style.transform = '';
                pageTransition.style.display = 'none';
            }, 500);
        }, 100);
    });
});
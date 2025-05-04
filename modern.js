/**
 * Lens & Lore Photography - Modern JavaScript
 * A comprehensive script for enhanced user experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initCustomCursor();
    initLightbox();
    initLazyLoading();
    initTestimonialSlider();
    initPortfolioFilters();
    initPageTransitions();
    initContactForm();
});

/**
 * Modern Navigation
 */
function initNavigation() {
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav.classList.contains('active') && 
            !event.target.closest('.main-nav') && 
            !event.target.closest('.nav-toggle')) {
            navToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile nav if open
                if (mainNav.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - header.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.fade-in:not(.visible)');
    
    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run once on page load
    revealOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Parallax effect for hero section
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            heroBackground.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        });
    }
}

/**
 * Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
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
    }
}

/**
 * Modern Lightbox
 */
function initLightbox() {
    const lightbox = document.querySelector('.modern-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (!lightbox) return;
    
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    let galleryImages = [];
    
    // Collect all images and their data
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title')?.textContent || '';
        const category = item.querySelector('.gallery-item-category')?.textContent || '';
        const caption = img.dataset.caption || '';
        
        galleryImages.push({
            src: img.src,
            alt: img.alt,
            title: title,
            category: category,
            caption: caption
        });
        
        // Add click event to open lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Update lightbox content
    function updateLightboxContent() {
        const image = galleryImages[currentIndex];
        
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.caption;
        
        // Preload adjacent images
        if (currentIndex > 0) {
            const prevImg = new Image();
            prevImg.src = galleryImages[currentIndex - 1].src;
        }
        
        if (currentIndex < galleryImages.length - 1) {
            const nextImg = new Image();
            nextImg.src = galleryImages[currentIndex + 1].src;
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
        if (currentIndex < galleryImages.length - 1) {
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
    
    // Close when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

/**
 * Lazy Loading
 */
function initLazyLoading() {
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
        }, {
            rootMargin: '50px 0px'
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
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (!testimonialSlider) return;
    
    const testimonials = [
        {
            content: "Working with this photographer was a revelation. They captured exactly what I wanted before I even knew how to express it. The results exceeded all my expectations.",
            author: "Jane Doe",
            title: "Portrait Client"
        },
        {
            content: "The way they find beauty in ordinary scenes transformed how I see my surroundings. Truly an artist with unique vision and technical mastery.",
            author: "John Smith",
            title: "Gallery Owner"
        },
        {
            content: "Our corporate event photography exceeded all expectations. Professional, unobtrusive, and the results were stunning. Will definitely hire again.",
            author: "Sarah Johnson",
            title: "Event Director"
        }
    ];
    
    let currentTestimonial = 0;
    
    // Create testimonial navigation
    const testimonialNav = document.createElement('div');
    testimonialNav.className = 'testimonial-nav';
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'testimonial-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
        testimonialNav.appendChild(dot);
    });
    
    testimonialSlider.appendChild(testimonialNav);
    
    // Show testimonial function
    function showTestimonial(index) {
        const testimonialItem = testimonialSlider.querySelector('.testimonial-item');
        const dots = testimonialSlider.querySelectorAll('.testimonial-dot');
        
        // Update active dot
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Fade out current testimonial
        testimonialItem.style.opacity = '0';
        
        // After fade out, update content and fade in
        setTimeout(() => {
            const testimonial = testimonials[index];
            testimonialItem.innerHTML = `
                <div class="testimonial-content">
                    <p>"${testimonial.content}"</p>
                    <div class="testimonial-author">
                        <span class="author-name">${testimonial.author}</span>
                        <span class="author-title">${testimonial.title}</span>
                    </div>
                </div>
            `;
            testimonialItem.style.opacity = '1';
        }, 300);
        
        currentTestimonial = index;
    }
    
    // Auto rotate testimonials
    setInterval(() => {
        const nextIndex = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }, 6000);
}

/**
 * Portfolio Filters
 */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.portfolio-filter button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterButtons.length || !portfolioItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    }, 300);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Page Transitions
 */
function initPageTransitions() {
    // Create page transition element if it doesn't exist
    if (!document.querySelector('.page-transition')) {
        const pageTransition = document.createElement('div');
        pageTransition.className = 'page-transition';
        document.body.appendChild(pageTransition);
    }
    
    const pageTransition = document.querySelector('.page-transition');
    
    // Handle internal links
    document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target]), a[href^="http://' + window.location.host + '"]:not([target]), a[href^="https://' + window.location.host + '"]:not([target]), a[href^="' + window.location.origin + '"]:not([target])').forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip for anchor links
            if (this.getAttribute('href').includes('#')) return;
            
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
}

/**
 * Contact Form
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Add error message elements to each form group
    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        if (!group.querySelector('.error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            group.appendChild(errorMessage);
        }
    });
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Validate name
        const nameInput = document.getElementById('name');
        if (nameInput && !nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else if (nameInput) {
            clearError(nameInput);
        }
        
        // Validate email
        const emailInput = document.getElementById('email');
        if (emailInput && !emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (emailInput && !isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else if (emailInput) {
            clearError(emailInput);
        }
        
        // Validate subject
        const subjectInput = document.getElementById('subject');
        if (subjectInput && !subjectInput.value.trim()) {
            showError(subjectInput, 'Subject is required');
            isValid = false;
        } else if (subjectInput) {
            clearError(subjectInput);
        }
        
        // Validate message
        const messageInput = document.getElementById('message');
        if (messageInput && !messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else if (messageInput && messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            isValid = false;
        } else if (messageInput) {
            clearError(messageInput);
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }
    
    // Clear error message
    function clearError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = '';
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Real-time validation on input
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (input.id === 'name') {
                if (!input.value.trim()) {
                    showError(input, 'Name is required');
                } else {
                    clearError(input);
                }
            }
            
            if (input.id === 'email') {
                if (!input.value.trim()) {
                    showError(input, 'Email is required');
                } else if (!isValidEmail(input.value)) {
                    showError(input, 'Please enter a valid email address');
                } else {
                    clearError(input);
                }
            }
            
            if (input.id === 'subject') {
                if (!input.value.trim()) {
                    showError(input, 'Subject is required');
                } else {
                    clearError(input);
                }
            }
            
            if (input.id === 'message') {
                if (!input.value.trim()) {
                    showError(input, 'Message is required');
                } else if (input.value.trim().length < 10) {
                    showError(input, 'Message must be at least 10 characters');
                } else {
                    clearError(input);
                }
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show success message
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Message Sent!</h3>
                <p>Thank you, ${name}! Your message has been received.</p>
                <p>I'll get back to you as soon as possible.</p>
            `;
            
            // Replace form with success message
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.parentNode.replaceChild(successMessage, contactForm);
                successMessage.style.opacity = '0';
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                }, 50);
            }, 300);
        }
    });
}
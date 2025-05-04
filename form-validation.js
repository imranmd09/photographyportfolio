// Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add error message elements to each form group
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            group.appendChild(errorMessage);
        });
        
        // Form validation function
        function validateForm() {
            let isValid = true;
            
            // Validate name
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                clearError(nameInput);
            }
            
            // Validate email
            const emailInput = document.getElementById('email');
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            // Validate subject
            const subjectInput = document.getElementById('subject');
            if (!subjectInput.value.trim()) {
                showError(subjectInput, 'Subject is required');
                isValid = false;
            } else {
                clearError(subjectInput);
            }
            
            // Validate message
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            } else {
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
                const email = formData.get('email');
                
                // In a real implementation, you would send this data to a server
                // For now, we'll just show a success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = `Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`;
                successMessage.style.color = '#28a745';
                successMessage.style.padding = '15px';
                successMessage.style.marginTop = '20px';
                successMessage.style.backgroundColor = '#d4edda';
                successMessage.style.border = '1px solid #c3e6cb';
                successMessage.style.borderRadius = '4px';
                
                // Insert success message after the form
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Reset the form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 500);
                }, 5000);
            }
        });
    }
});
import auth from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (auth.isUserAuthenticated()) {
        window.location.href = 'dashboard-html.html';
    }

    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Initialize multi-step form
    initMultiStepForm();
    
    // Add form validation
    addFormValidation();
    
    // Handle form submission
    signupForm.addEventListener('submit', handleFormSubmission);
});

async function handleFormSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const birthDate = document.getElementById('birth-date').value;
    const location = document.getElementById('location').value;
    
    // Get selected goals
    const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Get experience level
    const experience = document.querySelector('input[name="experience"]:checked').value;
    
    // Create user data object
    const userData = {
        email,
        password,
        firstName,
        lastName,
        birthDate,
        location,
        goals,
        experience,
        createdAt: new Date().toISOString()
    };
    
    try {
        const result = await auth.signup(userData);
        
        if (result.success) {
            showSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard-html.html';
            }, 1500);
        } else {
            showError(result.error || 'Failed to create account');
        }
    } catch (error) {
        showError('An error occurred during signup');
    }
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function initMultiStepForm() {
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    
    let currentStep = 0;
    
    function updateProgress() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
            } else if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        currentStep = stepIndex;
        updateProgress();
    }
    
    nextButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                showStep(currentStep + 1);
            }
        });
    });
    
    backButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            showStep(currentStep - 1);
        });
    });
}

function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step:nth-child(${step + 1})`);
    const inputs = currentStepElement.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            showError(input.id, 'This field is required');
            isValid = false;
        } else {
            hideError(input.id);
        }
        
        if (input.type === 'email' && !validateEmail(input.value)) {
            showError(input.id, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (input.type === 'password' && !validatePassword(input.value)) {
            showError(input.id, 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
            isValid = false;
        }
    });
    
    return isValid;
}

function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(inputId) {
    const errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function addFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (!validateEmail(emailInput.value)) {
                showError('email', 'Please enter a valid email address');
            } else {
                hideError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            if (!validatePassword(passwordInput.value)) {
                showError('password', 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
            } else {
                hideError('password');
            }
        });
    }
    
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('blur', () => {
            if (confirmPasswordInput.value !== passwordInput.value) {
                showError('confirm-password', 'Passwords do not match');
            } else {
                hideError('confirm-password');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
} 
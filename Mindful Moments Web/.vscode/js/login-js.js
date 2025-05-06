import auth from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (auth.isUserAuthenticated()) {
        window.location.href = 'dashboard-html.html';
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    try {
        const result = await auth.login(email, password);
        
        if (result.success) {
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard-html.html';
            }, 1500);
        } else {
            showError(result.error || 'Invalid credentials');
        }
    } catch (error) {
        showError('An error occurred during login');
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
} 
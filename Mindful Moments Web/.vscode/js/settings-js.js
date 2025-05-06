document.addEventListener('DOMContentLoaded', function() {
    // Initialize the settings page functionality
    initSettings();
    
    // Mobile menu functionality from dashboard.js
    initMobileMenu();
});

function initSettings() {
    // Navigation between settings sections
    initSettingsNav();
    
    // Profile form handling
    initProfileForm();
    
    // Password form handling
    initPasswordForm();
    
    // Notification settings handling
    initNotificationSettings();
    
    // Preferences handling
    initPreferences();
    
    // Privacy settings handling
    initPrivacySettings();
    
    // Danger zone handling
    initDangerZone();
    
    // Device management
    initDeviceManagement();
}

// Settings navigation
function initSettingsNav() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all navigation items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to the clicked item
            this.classList.add('active');
            
            // Get the section to show
            const sectionId = this.dataset.section + '-section';
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show the selected section
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Profile form handling
function initProfileForm() {
    const profileForm = document.getElementById('profile-form');
    const cancelBtn = document.getElementById('cancel-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const avatarInput = document.getElementById('avatar-input');
    const avatarInitials = document.getElementById('avatar-initials');
    
    // Handle avatar upload
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Create an image element to preview the avatar
                    const avatarPreview = document.querySelector('.avatar-preview');
                    
                    // Check if an image already exists
                    let img = avatarPreview.querySelector('img');
                    
                    if (!img) {
                        img = document.createElement('img');
                        avatarPreview.appendChild(img);
                    }
                    
                    // Set the image source
                    img.src = e.target.result;
                    
                    // Hide initials
                    avatarInitials.style.display = 'none';
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle form submission
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const displayName = document.getElementById('display-name').value;
            const bio = document.getElementById('bio').value;
            const email = document.getElementById('email').value;
            
            // Validate form
            if (!firstName || !lastName || !email) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // In a real app, you would send this data to the server
            console.log('Saving profile:', { firstName, lastName, displayName, bio, email });
            
            // Show success message
            showNotification('Profile updated successfully');
        });
    }
    
    // Handle cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // In a real app, you would reset the form to the original values
            // For this demo, we'll just reload the page
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.reload();
            }
        });
    }
}

// Password form handling
function initPasswordForm() {
    const passwordForm = document.getElementById('password-form');
    const cancelBtn = document.getElementById('cancel-password-btn');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate form
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('Please fill in all password fields', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }
            
            // In a real app, you would send this data to the server
            console.log('Updating password');
            
            // Clear the form
            passwordForm.reset();
            
            // Show success message
            showNotification('Password updated successfully');
        });
    }
    
    // Handle cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // Just reset the form
            passwordForm.reset();
        });
    }
}

// Notification settings handling
function initNotificationSettings() {
    const saveBtn = document.getElementById('save-notifications-btn');
    const cancelBtn = document.getElementById('cancel-notifications-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Get all notification settings
            const emailNotifications = document.querySelector('.switch-container:nth-child(1) input').checked;
            const pushNotifications = document.querySelector('.switch-container:nth-child(2) input').checked;
            
            const reminderDaily = document.getElementById('reminder-daily').checked;
            const reminderMissed = document.getElementById('reminder-missed').checked;
            
            const notifReplies = document.getElementById('notif-replies').checked;
            const notifLikes = document.getElementById('notif-likes').checked;
            const notifMentions = document.getElementById('notif-mentions').checked;
            
            const notifUpdates = document.getElementById('notif-updates').checked;
            const notifNewContent = document.getElementById('notif-new-content').checked;
            
            // In a real app, you would send this data to the server
            console.log('Saving notification settings:', {
                emailNotifications,
                pushNotifications,
                reminderDaily,
                reminderMissed,
                notifReplies,
                notifLikes,
                notifMentions,
                notifUpdates,
                notifNewContent
            });
            
            // Show success message
            showNotification('Notification settings updated successfully');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // In a real app, you would reset to original values
            // For this demo, we'll just reload the page
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.reload();
            }
        });
    }
}

// Preferences handling
function initPreferences() {
    const saveBtn = document.getElementById('save-preferences-btn');
    const cancelBtn = document.getElementById('cancel-preferences-btn');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all theme options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to the selected theme
            this.classList.add('active');
            
            // Get the selected theme
            const theme = this.dataset.theme;
            
            // In a real app, you would apply the theme here
            console.log('Selected theme:', theme);
        });
    });
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Get selected theme
            const selectedTheme = document.querySelector('.theme-option.active').dataset.theme;
            
            // Get meditation duration preference
            const meditationDuration = document.querySelector('input[name="meditation-duration"]:checked').value;
            
            // Get background sound preference
            const backgroundSound = document.querySelector('input[name="background-sound"]:checked').value;
            
            // Get language preference
            const language = document.querySelector('select').value;
            
            // In a real app, you would send this data to the server
            console.log('Saving preferences:', {
                theme: selectedTheme,
                meditationDuration,
                backgroundSound,
                language
            });
            
            // Show success message
            showNotification('Preferences updated successfully');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // In a real app, you would reset to original values
            // For this demo, we'll just reload the page
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.reload();
            }
        });
    }
}

// Privacy settings handling
function initPrivacySettings() {
    const saveBtn = document.getElementById('save-privacy-btn');
    const downloadBtn = document.getElementById('download-data-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Get privacy settings
            const profileVisibility = document.querySelector('.switch-container:nth-child(1) input').checked;
            const anonymousPosting = document.querySelector('.switch-container:nth-child(2) input').checked;
            const dataAnalytics = document.getElementById('data-analytics').checked;
            const dataPersonalization = document.getElementById('data-personalization').checked;
            
            // In a real app, you would send this data to the server
            console.log('Saving privacy settings:', {
                profileVisibility,
                anonymousPosting,
                dataAnalytics,
                dataPersonalization
            });
            
            // Show success message
            showNotification('Privacy settings updated successfully');
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // In a real app, this would trigger a data download
            console.log('Downloading user data');
            
            // Show a notification
            showNotification('Your data is being prepared for download. You will receive an email when it is ready.');
        });
    }
}

// Danger zone handling
function initDangerZone() {
    const deleteBtn = document.getElementById('delete-account-btn');
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            // Show a confirmation dialog
            const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.');
            
            if (confirmed) {
                // Ask for confirmation one more time
                const confirmAgain = confirm('Please confirm once more that you want to permanently delete your account. This action cannot be reversed.');
                
                if (confirmAgain) {
                    // In a real app, this would send a request to delete the account
                    console.log('Deleting account');
                    
                    // Show a notification
                    showNotification('Your account has been scheduled for deletion. You will receive a confirmation email.');
                    
                    // Redirect to login page after a delay
                    setTimeout(() => {
                        window.location.href = 'welcome-page.html';
                    }, 3000);
                }
            }
        });
    }
}

// Device management
function initDeviceManagement() {
    const logoutButtons = document.querySelectorAll('.device-action.logout');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the device name
            const deviceName = this.closest('.device-item').querySelector('.device-name').textContent;
            
            // Show a confirmation dialog
            const confirmed = confirm(`Are you sure you want to log out from ${deviceName}?`);
            
            if (confirmed) {
                // In a real app, this would send a request to log out the device
                console.log(`Logging out from device: ${deviceName}`);
                
                // Remove the device from the UI
                this.closest('.device-item').remove();
                
                // Show a notification
                showNotification(`Successfully logged out from ${deviceName}`);
            }
        });
    });
}

// Show a notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? 'var(--color-purple)' : 'var(--color-red)';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = 'var(--border-radius-md)';
    notification.style.boxShadow = 'var(--shadow-md)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile menu functionality from dashboard.js
function initMobileMenu() {
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuTrigger && sidebar) {
        mobileMenuTrigger.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                !mobileMenuTrigger.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Load user settings
function loadUserSettings(userId) {
    return db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                
                // Fill profile form
                document.getElementById('first-name').value = userData.firstName || '';
                document.getElementById('last-name').value = userData.lastName || '';
                document.getElementById('display-name').value = userData.displayName || '';
                document.getElementById('bio').value = userData.bio || '';
                document.getElementById('email').value = userData.email || '';
                
                // Load avatar if exists
                if (userData.avatarUrl) {
                    const avatarPreview = document.querySelector('.avatar-preview');
                    let img = avatarPreview.querySelector('img');
                    
                    if (!img) {
                        img = document.createElement('img');
                        avatarPreview.appendChild(img);
                    }
                    
                    img.src = userData.avatarUrl;
                    document.getElementById('avatar-initials').style.display = 'none';
                }
                
                // Load notification preferences
                document.querySelector('.switch-container:nth-child(1) input').checked = 
                    userData.preferences?.emailNotifications ?? true;
                document.querySelector('.switch-container:nth-child(2) input').checked = 
                    userData.preferences?.pushNotifications ?? true;
                
                // Load other preferences
            }
        });
}

// Save profile
function saveProfile(userId, profileData) {
    return db.collection('users').doc(userId).update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        displayName: profileData.displayName,
        bio: profileData.bio,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Save notification preferences
function saveNotificationPreferences(userId, preferences) {
    return db.collection('users').doc(userId).update({
        'preferences.emailNotifications': preferences.emailNotifications,
        'preferences.pushNotifications': preferences.pushNotifications,
        'preferences.reminderDaily': preferences.reminderDaily,
        'preferences.reminderMissed': preferences.reminderMissed,
        'preferences.notifReplies': preferences.notifReplies,
        'preferences.notifLikes': preferences.notifLikes,
        'preferences.notifMentions': preferences.notifMentions,
        'preferences.notifUpdates': preferences.notifUpdates,
        'preferences.notifNewContent': preferences.notifNewContent,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}
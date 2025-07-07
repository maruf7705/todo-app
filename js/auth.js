// Auth functions
function showAuthModal() {
    if (isLoginMode) {
        authModalTitle.textContent = 'Login';
        submitAuthBtn.textContent = 'Login';
        authToggleText.textContent = 'Don\'t have an account? ';
        authToggleBtn.textContent = 'Sign up';
        nameField.classList.add('hidden');
        passwordConfirmField.classList.add('hidden');
    } else {
        authModalTitle.textContent = 'Sign Up';
        submitAuthBtn.textContent = 'Sign Up';
        authToggleText.textContent = 'Already have an account? ';
        authToggleBtn.textContent = 'Login';
        nameField.classList.remove('hidden');
        passwordConfirmField.classList.remove('hidden');
    }
    
    authName.value = '';
    authEmail.value = '';
    authPassword.value = '';
    authPasswordConfirm.value = '';
    
    authModal.classList.remove('hidden');
}

function hideAuthModal() {
    authModal.classList.add('hidden');
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    showAuthModal();
}

function handleAuthSubmit() {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    
    if (!email || !password) {
        showToast('Please fill in all fields');
        return;
    }
    
    if (!isLoginMode) {
        const name = authName.value.trim();
        const passwordConfirm = authPasswordConfirm.value.trim();
        
        if (!name) {
            showToast('Please enter your name');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters');
            return;
        }
        
        if (password !== passwordConfirm) {
            showToast('Passwords do not match');
            return;
        }
        
        setTimeout(() => {
            showToast('Account created successfully');
            hideAuthModal();
            simulateUserLogin({ email, name });
        }, 1000);
    } else {
        setTimeout(() => {
            showToast('Logged in successfully');
            hideAuthModal();
            simulateUserLogin({ email, name: 'User' });
        }, 1000);
    }
}

function handleGoogleAuth() {
    setTimeout(() => {
        showToast('Logged in with Google');
        hideAuthModal();
        simulateUserLogin({ email: 'user@gmail.com', name: 'Google User' });
    }, 1000);
}

function handleLogout() {
    showToast('Logged out successfully');
    simulateUserLogout();
}

function simulateUserLogin(user) {
    userProfile.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    signupBtn.classList.add('hidden');
    
    userName.textContent = user.name;
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=indigo&color=white`;
}

function simulateUserLogout() {
    userProfile.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    signupBtn.classList.remove('hidden');
}

// Event listeners for auth
document.addEventListener('DOMContentLoaded', () => {
    if (loginBtn) loginBtn.addEventListener('click', () => {
        isLoginMode = true;
        showAuthModal();
    });
    
    if (signupBtn) signupBtn.addEventListener('click', () => {
        isLoginMode = false;
        showAuthModal();
    });
    
    if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', hideAuthModal);
    if (authToggleBtn) authToggleBtn.addEventListener('click', toggleAuthMode);
    if (submitAuthBtn) submitAuthBtn.addEventListener('click', handleAuthSubmit);
    if (googleAuthBtn) googleAuthBtn.addEventListener('click', handleGoogleAuth);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
});
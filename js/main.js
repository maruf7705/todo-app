// App State (shared across modules)
let tasks = [];
let timeBlocks = [];
let currentFilter = 'all';
let pendingAction = null;
let isLoginMode = true;

// DOM Elements (shared across modules)
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

const confirmModal = document.getElementById('confirmModal');
const modalMessage = document.getElementById('modalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmModalBtn = document.getElementById('confirmModalBtn');

const authModal = document.getElementById('authModal');
const authModalTitle = document.getElementById('authModalTitle');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const authForm = document.getElementById('authForm');
const authName = document.getElementById('authName');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authPasswordConfirm = document.getElementById('authPasswordConfirm');
const nameField = document.getElementById('nameField');
const passwordConfirmField = document.getElementById('passwordConfirmField');
const submitAuthBtn = document.getElementById('submitAuthBtn');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const authToggleBtn = document.getElementById('authToggleBtn');
const authToggleText = document.getElementById('authToggleText');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const closeToastBtn = document.getElementById('closeToastBtn');

// General utility functions (modals, toasts, data persistence)
function showConfirmModal(message, action) {
    modalMessage.textContent = message;
    pendingAction = action;
    confirmModal.classList.remove('hidden');
}

function hideConfirmModal() {
    confirmModal.classList.add('hidden');
    pendingAction = null;
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(hideToast, 3000);
}

function hideToast() {
    toast.classList.add('translate-y-10', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
}

function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('timeBlocks', JSON.stringify(timeBlocks));
}

function loadData() {
    const savedTasks = localStorage.getItem('tasks');
    const savedTimeBlocks = localStorage.getItem('timeBlocks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    
    if (savedTimeBlocks) {
        timeBlocks = JSON.parse(savedTimeBlocks);
    }
}

// Event listeners for shared elements
function setupSharedEventListeners() {
    closeModalBtn.addEventListener('click', hideConfirmModal);
    cancelModalBtn.addEventListener('click', hideConfirmModal);
    confirmModalBtn.addEventListener('click', () => {
        if (pendingAction) pendingAction();
        hideConfirmModal();
    });

    closeToastBtn.addEventListener('click', hideToast);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupSharedEventListeners();
    // Specific page initialization will be called from their respective JS files
});

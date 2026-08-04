// UI Interactions & Theme Management
let isDarkMode = false;
let currentAuthMode = 'password';

function initTheme() {
    const currentHour = new Date().getHours();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (currentHour >= 19 || currentHour < 6 || prefersDark) {
        setTheme(true);
    } else {
        setTheme(false);
    }
}

function setTheme(dark) {
    isDarkMode = dark;
    const themeSunIcon = document.getElementById('themeSunIcon');
    const themeMoonIcon = document.getElementById('themeMoonIcon');
    
    if (dark) {
        document.documentElement.classList.add('dark');
        if (themeSunIcon) themeSunIcon.classList.remove('hidden');
        if (themeMoonIcon) themeMoonIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        if (themeSunIcon) themeSunIcon.classList.add('hidden');
        if (themeMoonIcon) themeMoonIcon.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTheme(!isDarkMode);
        });
    }
});

function switchTab(type) {
    currentAuthMode = type;
    const tabPassword = document.getElementById('tabPassword');
    const tabCode = document.getElementById('tabCode');
    const passwordContainer = document.getElementById('passwordContainer');
    const codeContainer = document.getElementById('codeContainer');
    const submitBtnText = document.getElementById('submitBtnText');

    if (type === 'password') {
        tabPassword.className = "text-lg font-bold text-slate-900 dark:text-white border-b-2 border-cyan-500 pb-1 transition-all";
        tabCode.className = "text-lg font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pb-1 transition-all";
        passwordContainer.style.display = 'block';
        if (codeContainer) codeContainer.style.display = 'none';
        if (submitBtnText) submitBtnText.textContent = "密码登录";
    } else {
        tabCode.className = "text-lg font-bold text-slate-900 dark:text-white border-b-2 border-cyan-500 pb-1 transition-all";
        tabPassword.className = "text-lg font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pb-1 transition-all";
        passwordContainer.style.display = 'none';
        if (codeContainer) codeContainer.style.display = 'block';
        if (submitBtnText) submitBtnText.textContent = "验证码登录 / 注册";
        showToast("已切换至邮箱验证码快捷登录");
    }
}

function togglePasswordVisibility() {
    const pwdInput = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eyeIcon');
    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.className = 'fa-regular fa-eye text-sm text-cyan-500';
    } else {
        pwdInput.type = 'password';
        eyeIcon.className = 'fa-regular fa-eye-slash text-sm';
    }
}

function showToast(text, duration = 3500) {
    const toast = document.getElementById('toastMessage');
    const toastText = document.getElementById('toastText');
    if (!toast || !toastText) return;
    toastText.textContent = text;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

function openModal(text) {
    const modal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) return;
    modalContent.textContent = text;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    if (modal.children[0]) {
        modal.children[0].classList.remove('scale-95');
        modal.children[0].classList.add('scale-100');
    }
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    if (modal.children[0]) {
        modal.children[0].classList.remove('scale-100');
        modal.children[0].classList.add('scale-95');
    }
}

function triggerQrUpload() {
    const fileInput = document.getElementById('qrFileInput');
    if (fileInput) fileInput.click();
}

function handleQrChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const container = document.getElementById('qrImageContainer');
            container.innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover rounded-lg" alt="自定义二维码"/>`;
            showToast("二维码更换成功！");
        };
        reader.readAsDataURL(file);
    }
}

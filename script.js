(function() {
    'use strict';

    // ============================================
    // ELEMENTOS DO DOM
    // ============================================
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailWrapper = document.getElementById('emailWrapper');
    const passwordWrapper = document.getElementById('passwordWrapper');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Regex para validação de email
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ============================================
    // FUNÇÕES DE VALIDAÇÃO
    // ============================================
    function validateEmail(email) {
        return EMAIL_REGEX.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(wrapper, errorElement, message) {
        wrapper.classList.add('error');
        if (message) {
            const span = errorElement.querySelector('span');
            if (span) span.textContent = message;
        }
        errorElement.classList.add('show');
    }

    function clearError(wrapper, errorElement) {
        wrapper.classList.remove('error');
        errorElement.classList.remove('show');
    }

    function clearAllErrors() {
        clearError(emailWrapper, emailError);
        clearError(passwordWrapper, passwordError);
    }

    // ============================================
    // VALIDAÇÃO EM TEMPO REAL
    // ============================================
    emailInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            if (validateEmail(this.value.trim())) {
                clearError(emailWrapper, emailError);
            } else {
                showError(emailWrapper, emailError, 'Por favor, insira um e-mail válido.');
            }
        } else {
            clearError(emailWrapper, emailError);
        }
    });

    emailInput.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value === '') {
            showError(emailWrapper, emailError, 'O e-mail é obrigatório.');
        } else if (!validateEmail(value)) {
            showError(emailWrapper, emailError, 'Por favor, insira um e-mail válido.');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            if (validatePassword(this.value)) {
                clearError(passwordWrapper, passwordError);
            } else {
                showError(passwordWrapper, passwordError, 'A senha deve ter pelo menos 6 caracteres.');
            }
        } else {
            clearError(passwordWrapper, passwordError);
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (this.value === '') {
            showError(passwordWrapper, passwordError, 'A senha é obrigatória.');
        } else if (!validatePassword(this.value)) {
            showError(passwordWrapper, passwordError, 'A senha deve ter pelo menos 6 caracteres.');
        }
    });

    // ============================================
    // TOGGLE DE SENHA (MOSTRAR/OCULTAR)
    // ============================================
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.className = 'fas fa-eye';
            this.setAttribute('aria-label', 'Mostrar senha');
        } else {
            icon.className = 'fas fa-eye-slash';
            this.setAttribute('aria-label', 'Ocultar senha');
        }
    });

    // ============================================
    // TOAST
    // ============================================
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ============================================
    // SUBMIT DO FORMULÁRIO
    // ============================================
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        clearAllErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let isValid = true;

        if (!email) {
            showError(emailWrapper, emailError, 'O e-mail é obrigatório.');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailWrapper, emailError, 'Por favor, insira um e-mail válido.');
            isValid = false;
        }

        if (!password) {
            showError(passwordWrapper, passwordError, 'A senha é obrigatória.');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(passwordWrapper, passwordError, 'A senha deve ter pelo menos 6 caracteres.');
            isValid = false;
        }

        if (!isValid) return;

        // Salvar email se "Lembrar-me" estiver marcado
        const rememberMe = document.getElementById('rememberMe').checked;
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        // Simular requisição de login
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        // 🔁 SUBSTITUA POR UMA CHAMADA REAL À API:
        // fetch('/api/login', { method: 'POST', ... })
        setTimeout(() => {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;

            showToast('Login realizado com sucesso! Redirecionando...');

            // Exemplo: redirecionar após 1.5s
            // setTimeout(() => {
            //     window.location.href = '/dashboard';
            // }, 1500);

            console.log('Login bem-sucedido para:', email);
        }, 1500);
    });

    // ============================================
    // ACESSIBILIDADE: FECHAR TOAST COM ESC
    // ============================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && toast.classList.contains('show')) {
            toast.classList.remove('show');
        }
    });

    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    emailInput.focus();

    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
})();
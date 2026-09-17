(function() {
    'use strict';

    // ============================================
    // HERO CARROSSEL (auto-play + setas + dots)
    // ============================================
    const slides = document.querySelectorAll('.hero__slide');
    const dotsContainer = document.getElementById('heroDots');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    let currentSlide = 0;
    let autoPlayInterval;

    if (dotsContainer && slides.length) {
        // Criar bolinhas dinamicamente
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            if (i === 0) dot.classList.add('is-active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('is-active');
            dots[currentSlide].classList.remove('is-active');
            
            currentSlide = (index + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('is-active');
            dots[currentSlide].classList.add('is-active');
            
            resetAutoPlay();
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        // Pausar autoplay ao passar o mouse
        const heroEl = document.querySelector('.hero');
        heroEl?.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        heroEl?.addEventListener('mouseleave', startAutoPlay);

        // Suporte a swipe (mobile)
        let touchStartX = 0;
        heroEl?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        heroEl?.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        });

        startAutoPlay();
    }

    // ============================================
    // HEADER: mudar estilo ao rolar
    // ============================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('is-scrolled', window.scrollY > 50);
    });

    // ============================================
    // MENU MOBILE
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        const icon = menuToggle.querySelector('i');
        icon.className = navMenu.classList.contains('is-open') 
            ? 'fas fa-times' 
            : 'fas fa-bars';
    });

    // Fechar menu ao clicar em um link
    navMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 968) {
                navMenu.classList.remove('is-open');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    });

    // ============================================
    // MODO NOTURNO
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('triplex-theme');

    function updateThemeControl() {
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.setAttribute('aria-label', isDark ? 'Desativar modo noturno' : 'Ativar modo noturno');
        themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    if (themeToggle) {
        if (savedTheme === 'dark') document.body.classList.add('dark-mode');
        updateThemeControl();
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('triplex-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateThemeControl();
        });
    }

    // ============================================
    // LOGIN E CADASTRO
    // ============================================
    const authButtons = document.querySelectorAll('[data-auth-action]');

    if (authButtons.length) {
        const authModal = document.createElement('div');
        authModal.className = 'auth-modal';
        authModal.setAttribute('aria-hidden', 'true');
        authModal.innerHTML = `
            <div class="auth-modal__backdrop" data-auth-close></div>
            <section class="auth-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="authTitle">
                <button class="auth-modal__close" type="button" aria-label="Fechar" data-auth-close>
                    <i class="fas fa-xmark" aria-hidden="true"></i>
                </button>
                <div class="auth-modal__intro">
                    <p class="about-kicker">TRIPLEX CLUB</p>
                    <h2 id="authTitle"></h2>
                    <p id="authDescription"></p>
                </div>
                <form class="auth-form" id="authForm">
                    <div class="auth-form__register-field">
                        <label for="authCpf">CPF</label>
                        <input id="authCpf" name="cpf" type="text" inputmode="numeric" autocomplete="off" placeholder="000.000.000-00" required>
                    </div>
                    <div class="auth-form__register-field">
                        <label for="authName">Nome</label>
                        <input id="authName" name="name" type="text" autocomplete="name" placeholder="Seu nome" required>
                    </div>
                    <div class="auth-form__register-field">
                        <label for="authAge">Idade</label>
                        <input id="authAge" name="age" type="number" min="1" max="120" inputmode="numeric" placeholder="Sua idade" required>
                    </div>
                    <div>
                        <label for="authEmail">E-mail</label>
                        <input id="authEmail" name="email" type="email" autocomplete="email" placeholder="voce@email.com" required>
                    </div>
                    <div>
                        <label for="authPassword">Senha</label>
                        <input id="authPassword" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required>
                    </div>
                    <div class="auth-form__register-field">
                        <label for="authPasswordConfirm">Confirmar senha</label>
                        <input id="authPasswordConfirm" name="passwordConfirm" type="password" autocomplete="new-password" placeholder="Repita sua senha" required>
                    </div>
                    <button class="btn btn--primary auth-form__submit" type="submit" id="authSubmit"></button>
                    <p class="auth-form__feedback" id="authFeedback" role="status"></p>
                </form>
                <p class="auth-modal__switch" id="authSwitch"></p>
            </section>`;
        document.body.appendChild(authModal);

        const authForm = authModal.querySelector('#authForm');
        const authCpf = authModal.querySelector('#authCpf');
        const authName = authModal.querySelector('#authName');
        const authAge = authModal.querySelector('#authAge');
        const authPassword = authModal.querySelector('#authPassword');
        const authPasswordConfirm = authModal.querySelector('#authPasswordConfirm');
        const authTitle = authModal.querySelector('#authTitle');
        const authDescription = authModal.querySelector('#authDescription');
        const authSubmit = authModal.querySelector('#authSubmit');
        const authFeedback = authModal.querySelector('#authFeedback');
        const authSwitch = authModal.querySelector('#authSwitch');
        let authMode = 'login';

        function renderAuthMode(mode) {
            authMode = mode;
            const isLogin = mode === 'login';
            authTitle.textContent = isLogin ? 'Bom ter você de volta.' : 'Entre para a comunidade.';
            authDescription.textContent = isLogin
                ? 'Acesse sua conta e continue no seu ritmo.'
                : 'Crie sua conta e acompanhe tudo que move o Triplex.';
            authSubmit.textContent = isLogin ? 'Entrar na conta' : 'Criar minha conta';
            authModal.querySelectorAll('.auth-form__register-field').forEach(field => {
                field.hidden = isLogin;
                field.querySelector('input').required = !isLogin;
            });
            authName.required = !isLogin;
            authPassword.autocomplete = isLogin ? 'current-password' : 'new-password';
            authPasswordConfirm.required = !isLogin;
            authSwitch.innerHTML = isLogin
                ? 'Ainda não tem uma conta? <button type="button" data-auth-switch="register">Registre-se</button>'
                : 'Já tem uma conta? <button type="button" data-auth-switch="login">Entrar</button>';
            authFeedback.textContent = '';
        }

        function openAuth(mode) {
            renderAuthMode(mode);
            authModal.classList.add('is-open');
            authModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('auth-is-open');
            (authMode === 'login' ? authModal.querySelector('#authEmail') : authName).focus();
        }

        function closeAuth() {
            authModal.classList.remove('is-open');
            authModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('auth-is-open');
        }

        authButtons.forEach(button => button.addEventListener('click', () => openAuth(button.dataset.authAction)));
        authModal.querySelectorAll('[data-auth-close]').forEach(button => button.addEventListener('click', closeAuth));
        authSwitch.addEventListener('click', event => {
            const switchButton = event.target.closest('[data-auth-switch]');
            if (switchButton) renderAuthMode(switchButton.dataset.authSwitch);
        });
        authForm.addEventListener('submit', event => {
            event.preventDefault();
            if (authMode === 'register' && authPassword.value !== authPasswordConfirm.value) {
                authFeedback.textContent = 'As senhas precisam ser iguais.';
                authPasswordConfirm.focus();
                return;
            }
            authFeedback.textContent = authMode === 'login'
                ? 'Login pronto para ser conectado ao seu servidor.'
                : 'Cadastro pronto para ser conectado ao seu servidor.';
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && authModal.classList.contains('is-open')) closeAuth();
        });
        renderAuthMode('login');
    }

    // ============================================
    // SCROLL SUAVE
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // ANIMAÇÃO DE ENTRADA (Intersection Observer)
    // ============================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.card, .card-big, .brands__item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });

})();
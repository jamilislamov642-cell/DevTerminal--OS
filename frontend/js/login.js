// Login page functionality
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetForm = btn.dataset.tab;
            
            // Remove active class
            tabButtons.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class
            btn.classList.add('active');
            document.querySelector(`[data-form="${targetForm}"]`).classList.add('active');
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            try {
                const result = await API.login(username, password);
                
                if (result.success || result.token) {
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Login failed: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Login error: ' + error.message);
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                const result = await API.register(username, email, password);
                
                if (result.success) {
                    alert('Registration successful! Please login.');
                    document.querySelector('[data-tab="login"]').click();
                    document.getElementById('login-username').value = username;
                } else {
                    alert('Registration failed: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Registration error: ' + error.message);
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            API.logout();
        });
    }

    // Check if already logged in
    if (window.location.pathname.includes('login.html')) {
        const token = API.getToken();
        if (token) {
            window.location.href = 'dashboard.html';
        }
    }

    // Particle background effect
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = '#00ff41';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = Math.random() * 0.5;
            particle.style.pointerEvents = 'none';
            particlesContainer.appendChild(particle);
        }
    }
});

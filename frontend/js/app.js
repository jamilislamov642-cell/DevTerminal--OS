// Main app functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!API.getToken()) {
        window.location.href = 'login.html';
        return;
    }

    // Navigation setup
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const usernameEl = document.getElementById('username');
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    // Set username
    const user = API.getUser();
    if (usernameEl && user) {
        usernameEl.textContent = user.username || 'User';
    }

    // Navigation handler
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.dataset.page;
            
            // Remove active classes
            navItems.forEach(i => i.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // Add active class
            item.classList.add('active');
            const targetPage = document.querySelector(`[data-page="${pageName}"]`);
            if (targetPage) {
                targetPage.classList.add('active');
                document.getElementById('pageTitle').textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
            }
        });
    });

    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                API.logout();
            }
        });
    }

    // Show dashboard by default
    const dashboardPage = document.querySelector('[data-page="dashboard"]');
    if (dashboardPage) {
        dashboardPage.classList.add('active');
        navItems[0].classList.add('active');
    }
});

// Theme management
class Theme {
    static themes = {
        dracula: { primary: '#00ff41', secondary: '#0051ba', accent: '#00ffff' },
        nord: { primary: '#88c0d0', secondary: '#2e3440', accent: '#81a1c1' },
        ubuntu: { primary: '#dd4814', secondary: '#111111', accent: '#f26522' },
        cyberpunk: { primary: '#00ff41', secondary: '#0a0e27', accent: '#ff006e' }
    };

    static apply(themeName) {
        const theme = this.themes[themeName] || this.themes.dracula;
        const root = document.documentElement;
        
        Object.keys(theme).forEach(key => {
            root.style.setProperty(`--${key}`, theme[key]);
        });
        
        localStorage.setItem('theme', themeName);
    }

    static load() {
        const savedTheme = localStorage.getItem('theme') || 'dracula';
        this.apply(savedTheme);
    }
}

// Load theme on page load
Theme.load();

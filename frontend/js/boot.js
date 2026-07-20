// Boot animation
window.addEventListener('load', () => {
    const bootLogs = document.querySelectorAll('.boot-log');
    const lastLog = bootLogs[bootLogs.length - 1];
    
    if (lastLog) {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3500);
    }
});

// Add glow effect to boot logo
const bootLogo = document.querySelector('.boot-logo');
if (bootLogo) {
    setInterval(() => {
        bootLogo.style.textShadow = `0 0 ${Math.random() * 30 + 10}px #00ff41`;
    }, 500);
}

// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('dashboard.html')) return;

    const cpuValue = document.getElementById('cpuValue');
    const ramValue = document.getElementById('ramValue');
    const diskValue = document.getElementById('diskValue');
    const cpuBar = document.getElementById('cpuBar');
    const ramBar = document.getElementById('ramBar');
    const diskBar = document.getElementById('diskBar');
    const systemTime = document.getElementById('systemTime');
    const systemDate = document.getElementById('systemDate');
    const uptime = document.getElementById('uptime');

    // Update time
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (systemTime) systemTime.textContent = `${hours}:${minutes}:${seconds}`;
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        if (systemDate) systemDate.textContent = now.toLocaleDateString('en-US', options);
    }

    // Update system stats
    async function updateStats() {
        try {
            const stats = await API.getSystemStats();
            
            if (stats.cpu !== undefined) {
                const cpuPercent = Math.round(stats.cpu);
                if (cpuValue) cpuValue.textContent = cpuPercent + '%';
                if (cpuBar) cpuBar.style.width = cpuPercent + '%';
            }
            
            if (stats.ram !== undefined) {
                const ramPercent = Math.round(stats.ram);
                if (ramValue) ramValue.textContent = ramPercent + '%';
                if (ramBar) ramBar.style.width = ramPercent + '%';
            }
            
            if (stats.disk !== undefined) {
                const diskPercent = Math.round(stats.disk);
                if (diskValue) diskValue.textContent = diskPercent + '%';
                if (diskBar) diskBar.style.width = diskPercent + '%';
            }
        } catch (error) {
            console.error('Failed to update stats:', error);
            // Use mock data for demo
            if (cpuValue) cpuValue.textContent = Math.round(Math.random() * 80) + '%';
            if (ramValue) ramValue.textContent = Math.round(Math.random() * 60) + '%';
            if (diskValue) diskValue.textContent = Math.round(Math.random() * 50) + '%';
        }
    }

    // Initialize
    updateTime();
    updateStats();

    // Update every second
    setInterval(updateTime, 1000);
    setInterval(updateStats, 3000);
});

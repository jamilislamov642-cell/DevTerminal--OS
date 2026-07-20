// File Explorer functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('explorer.html')) return;

    const fileList = document.getElementById('fileList');
    const breadcrumb = document.getElementById('breadcrumb');
    const backBtn = document.getElementById('backBtn');
    const newFileBtn = document.getElementById('newFileBtn');
    const newFolderBtn = document.getElementById('newFolderBtn');
    const contextMenu = document.getElementById('contextMenu');

    let currentPath = '/home';
    let selectedFile = null;

    // Update breadcrumb
    function updateBreadcrumb() {
        breadcrumb.innerHTML = '';
        const parts = currentPath.split('/').filter(p => p);
        
        const home = document.createElement('span');
        home.className = 'breadcrumb-item';
        home.textContent = 'Home';
        home.addEventListener('click', () => navigate('/home'));
        breadcrumb.appendChild(home);
        
        parts.forEach((part, i) => {
            const sep = document.createElement('span');
            sep.className = 'breadcrumb-separator';
            sep.textContent = ' / ';
            breadcrumb.appendChild(sep);
            
            const item = document.createElement('span');
            item.className = 'breadcrumb-item';
            item.textContent = part;
            const path = '/' + parts.slice(0, i + 1).join('/');
            item.addEventListener('click', () => navigate(path));
            breadcrumb.appendChild(item);
        });
    }

    // Navigate to directory
    function navigate(path) {
        currentPath = path;
        loadFiles();
        updateBreadcrumb();
    }

    // Load files
    async function loadFiles() {
        fileList.innerHTML = '<div style="color: var(--text-secondary); padding: 2rem; text-align: center;">Loading files...</div>';
        
        try {
            const result = await API.listFiles(currentPath);
            fileList.innerHTML = '';
            
            if (result.files && result.files.length > 0) {
                result.files.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
                        <div class="file-icon">${file.type === 'folder' ? '📁' : '📄'}</div>
                        <div class="file-name">${file.name}</div>
                        ${file.size ? `<div class="file-size">${(file.size / 1024).toFixed(2)} KB</div>` : ''}
                    `;
                    
                    fileItem.addEventListener('click', () => {
                        if (file.type === 'folder') {
                            navigate(`${currentPath}/${file.name}`);
                        } else {
                            selectedFile = file;
                            document.querySelectorAll('.file-item').forEach(f => f.classList.remove('selected'));
                            fileItem.classList.add('selected');
                        }
                    });
                    
                    fileItem.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        showContextMenu(e.clientX, e.clientY);
                    });
                    
                    fileList.appendChild(fileItem);
                });
            } else {
                fileList.innerHTML = '<div style="color: var(--text-secondary); padding: 2rem; text-align: center;">No files in this directory</div>';
            }
        } catch (error) {
            console.error('Error loading files:', error);
            fileList.innerHTML = '<div style="color: var(--danger); padding: 2rem; text-align: center;">Error loading files</div>';
        }
    }

    // Show context menu
    function showContextMenu(x, y) {
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('active');
    }

    // Hide context menu
    document.addEventListener('click', () => {
        contextMenu.classList.remove('active');
    });

    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const parts = currentPath.split('/').filter(p => p);
            if (parts.length > 1) {
                parts.pop();
                navigate('/' + parts.join('/'));
            }
        });
    }

    // New file button
    if (newFileBtn) {
        newFileBtn.addEventListener('click', async () => {
            const filename = prompt('Enter filename:');
            if (filename) {
                const result = await API.createFile(currentPath, filename);
                if (result.success) {
                    loadFiles();
                } else {
                    alert('Error creating file: ' + result.error);
                }
            }
        });
    }

    // New folder button
    if (newFolderBtn) {
        newFolderBtn.addEventListener('click', async () => {
            const foldername = prompt('Enter folder name:');
            if (foldername) {
                const result = await API.createFile(currentPath, foldername, null);
                if (result.success) {
                    loadFiles();
                } else {
                    alert('Error creating folder: ' + result.error);
                }
            }
        });
    }

    // Initialize
    loadFiles();
    updateBreadcrumb();
});

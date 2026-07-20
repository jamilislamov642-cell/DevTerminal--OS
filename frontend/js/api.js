// API base URL
const API_URL = 'http://localhost:8080/api';

class API {
    // Authentication
    static async register(username, email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    }

    static async login(username, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    static async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Terminal
    static async executeCommand(command) {
        try {
            const response = await fetch(`${API_URL}/terminal/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ command })
            });
            return await response.json();
        } catch (error) {
            console.error('Command error:', error);
            return { output: 'Error executing command', error: true };
        }
    }

    static async getCommandHistory() {
        try {
            const response = await fetch(`${API_URL}/terminal/history`, {
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            return await response.json();
        } catch (error) {
            console.error('History error:', error);
            return [];
        }
    }

    // File System
    static async listFiles(path = '/') {
        try {
            const response = await fetch(`${API_URL}/filesystem/list?path=${path}`, {
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            return await response.json();
        } catch (error) {
            console.error('List files error:', error);
            return [];
        }
    }

    static async createFile(path, filename, content = '') {
        try {
            const response = await fetch(`${API_URL}/filesystem/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ path, filename, content })
            });
            return await response.json();
        } catch (error) {
            console.error('Create file error:', error);
            return { success: false, error: error.message };
        }
    }

    static async readFile(path) {
        try {
            const response = await fetch(`${API_URL}/filesystem/read/${path}`, {
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Read file error:', error);
            return { content: '', error: true };
        }
    }

    static async updateFile(path, content) {
        try {
            const response = await fetch(`${API_URL}/filesystem/update/${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ content })
            });
            return await response.json();
        } catch (error) {
            console.error('Update file error:', error);
            return { success: false, error: error.message };
        }
    }

    static async deleteFile(path) {
        try {
            const response = await fetch(`${API_URL}/filesystem/delete/${path}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Delete file error:', error);
            return { success: false, error: error.message };
        }
    }

    // Dashboard
    static async getSystemStats() {
        try {
            const response = await fetch(`${API_URL}/system/stats`, {
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Stats error:', error);
            return {};
        }
    }

    static async getProfile() {
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${this.getToken()}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Profile error:', error);
            return null;
        }
    }
}

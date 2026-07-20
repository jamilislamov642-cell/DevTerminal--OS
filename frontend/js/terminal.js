// Terminal functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('terminal.html')) return;

    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');
    const historyList = document.getElementById('historyList');

    if (!terminalInput) return;

    // Available commands
    const commands = {
        help: () => 'Available commands: help, clear, echo, pwd, ls, whoami, date, time, uptime',
        clear: () => {
            terminalBody.innerHTML = '';
            return '';
        },
        echo: (args) => args.join(' '),
        pwd: () => '/home/devterminal',
        ls: () => 'Documents\nDownloads\nDesktop\nProjects\nWorkspace',
        whoami: () => 'devterminal',
        date: () => new Date().toLocaleDateString(),
        time: () => new Date().toLocaleTimeString(),
        uptime: () => Math.floor(Math.random() * 1000) + ' hours',
        mkdir: (args) => `Created directory: ${args.join(' ')}`,
        touch: (args) => `Created file: ${args.join(' ')}`,
        cat: (args) => `Content of ${args[0] || 'file'}`,
    };

    // Command execution
    function executeCommand(cmd) {
        const [command, ...args] = cmd.trim().split(/\s+/);
        const handler = commands[command];
        const output = handler ? handler(args) : `Command not found: ${command}`;
        return output;
    }

    // Add line to terminal
    function addLine(prompt, command, output = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const promptEl = document.createElement('span');
        promptEl.className = 'prompt';
        promptEl.textContent = prompt;
        
        const cmdEl = document.createElement('span');
        cmdEl.className = 'command';
        cmdEl.textContent = command;
        
        line.appendChild(promptEl);
        line.appendChild(cmdEl);
        terminalBody.appendChild(line);
        
        if (output) {
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-line';
            const outputEl = document.createElement('span');
            outputEl.className = 'output';
            outputEl.textContent = output;
            outputLine.appendChild(outputEl);
            terminalBody.appendChild(outputLine);
        }
        
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Handle input
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value;
            if (cmd.trim()) {
                addLine('devterminal@localhost:~$ ', cmd);
                const output = executeCommand(cmd);
                if (output) {
                    addLine('', output);
                }
                terminalInput.value = '';
                
                // Add to history
                if (historyList) {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.textContent = cmd;
                    historyItem.addEventListener('click', () => {
                        terminalInput.value = cmd;
                        terminalInput.focus();
                    });
                    historyList.insertBefore(historyItem, historyList.firstChild);
                }
            }
        }
    });

    // Focus input
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    // Initial focus
    terminalInput.focus();
});

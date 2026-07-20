# DevTerminal OS

A modern Linux-inspired web operating system built with a professional frontend, a high-performance C++ backend, and a real database. Combines a futuristic hacker-style interface with realistic operating system functionality.

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6)
- Tailwind CSS
- xterm.js (Terminal Emulation)
- Monaco Editor (Code Editor)
- GSAP Animations

### Backend
- C++ (Crow Framework)
- REST API
- WebSockets
- JWT Authentication

### Database
- SQLite (Development)
- PostgreSQL (Production)

### DevOps
- Docker
- CMake
- Git

## Features

✅ **Login & Registration** - JWT Authentication, Password Hashing, Remember Me
✅ **Linux Terminal** - 40+ Commands (ls, cd, mkdir, rm, cat, nano, etc.)
✅ **Virtual File System** - Create, Edit, Delete, Move, Copy, Search files
✅ **Dashboard** - CPU, RAM, Disk Usage, Network, System Monitoring
✅ **Applications** - Terminal, Editor, Explorer, Calculator, Calendar, Notes
✅ **10+ Themes** - Ubuntu, Dracula, Nord, Cyberpunk, Matrix, Classic Hacker
✅ **Monaco Code Editor** - Syntax Highlighting, Auto-save, Dark Mode
✅ **Visual Effects** - Glassmorphism, Blur, Glow, CRT Effect, Particle Background

## Getting Started

### Backend Setup
```bash
cd backend
mkdir build
cd build
cmake ..
make
./devterminal-server
```

### Frontend Setup
```bash
cd frontend
python -m http.server 8000
# Visit http://localhost:8000
```

## Security

- Password Hashing (bcrypt)
- JWT Token Authentication
- Input Validation
- Rate Limiting
- Protected Routes

## License

MIT License

---

**"Not just a fake terminal. A complete browser-based operating system."** 🚀
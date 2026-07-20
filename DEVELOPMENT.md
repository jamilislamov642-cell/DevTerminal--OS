# DevTerminal OS - Development Guide

## Setup

### Prerequisites
- C++ 17 or higher
- CMake 3.10+
- SQLite3
- CURL library

### Backend Setup

```bash
cd backend
mkdir build
cd build
cmake ..
make
./devterminal-server
```

Server will run on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
python -m http.server 8000
# or
npx http-server
```

Frontend will be available at `http://localhost:8000`

## Project Structure

```
DevTerminal-OS/
├── backend/          # C++ backend
├── frontend/         # Web interface
├── database/         # Database schema
├── docker/           # Docker configuration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Terminal
- `POST /api/terminal/command` - Execute command
- `GET /api/terminal/history` - Get command history

### Filesystem
- `GET /api/filesystem/list` - List files/folders
- `POST /api/filesystem/create` - Create file/folder
- `GET /api/filesystem/read/:path` - Read file
- `PUT /api/filesystem/update/:path` - Update file
- `DELETE /api/filesystem/delete/:path` - Delete file

### System
- `GET /api/system/stats` - Get system statistics
- `GET /api/system/processes` - Get processes

## Database Schema

See `database/schema.sql`

## Development Commands

### Build Backend
```bash
cd backend/build
cmake ..
make
```

### Clean Build
```bash
cd backend/build
make clean
cmake ..
make
```

### Run Tests
```bash
# To be implemented
```

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### CMake Not Found
```bash
sudo apt install cmake
# or
brew install cmake
```

### SQLite Not Found
```bash
sudo apt install libsqlite3-dev
# or
brew install sqlite
```

## Next Steps

- [ ] Implement JWT authentication
- [ ] Complete database operations
- [ ] Implement WebSocket support
- [ ] Add file upload/download
- [ ] Implement process management
- [ ] Add plugin system
- [ ] Create admin dashboard
- [ ] Add user settings persistence
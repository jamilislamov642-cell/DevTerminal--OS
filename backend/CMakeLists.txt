cmake_minimum_required(VERSION 3.10)
project(DevTerminal)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(CURL REQUIRED)
find_package(SQLite3 REQUIRED)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/third_party/crow/include)
include_directories(${SQLITE3_INCLUDE_DIRS})

# Source files
set(SOURCES
    src/main.cpp
    src/database.cpp
    src/auth.cpp
    src/filesystem.cpp
    src/terminal.cpp
    src/monitor.cpp
    src/utils.cpp
)

# Create executable
add_executable(devterminal-server ${SOURCES})

# Link libraries
target_link_libraries(devterminal-server 
    PRIVATE 
    CURL::libcurl
    SQLite::SQLite3
)

# Compiler flags
if(MSVC)
    target_compile_options(devterminal-server PRIVATE /W4)
else()
    target_compile_options(devterminal-server PRIVATE -Wall -Wextra -Wpedantic)
endif()
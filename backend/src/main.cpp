#include <crow_all.h>
#include <sqlite3.h>
#include <string>
#include <vector>
#include <map>
#include <jwt.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class DevTerminalServer {
private:
    crow::SimpleApp app;
    sqlite3* db;
    std::string db_path = "devterminal.db";

public:
    DevTerminalServer() : db(nullptr) {}

    bool init() {
        // Initialize database
        int rc = sqlite3_open(db_path.c_str(), &db);
        if (rc != SQLITE_OK) {
            std::cerr << "Cannot open database: " << sqlite3_errmsg(db) << std::endl;
            return false;
        }

        // Load schema
        loadSchema();

        // Setup routes
        setupAuthRoutes();
        setupTerminalRoutes();
        setupFileSystemRoutes();
        setupSystemRoutes();

        return true;
    }

    void run(int port = 8080) {
        app.port(port).multithreaded().run();
    }

private:
    void loadSchema() {
        const char* schema = R"(
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                path TEXT NOT NULL,
                filename TEXT NOT NULL,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                command TEXT NOT NULL,
                output TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        )";

        char* err = nullptr;
        if (sqlite3_exec(db, schema, nullptr, nullptr, &err) != SQLITE_OK) {
            std::cerr << "SQL error: " << err << std::endl;
            sqlite3_free(err);
        }
    }

    void setupAuthRoutes() {
        // Register
        CROW_ROUTE(app, "/api/auth/register").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            
            std::string username = body["username"].s();
            std::string email = body["email"].s();
            std::string password = body["password"].s(); // In production, hash this!
            
            const char* sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            sqlite3_stmt* stmt;
            
            if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
                sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);
                sqlite3_bind_text(stmt, 2, email.c_str(), -1, SQLITE_STATIC);
                sqlite3_bind_text(stmt, 3, password.c_str(), -1, SQLITE_STATIC);
                
                if (sqlite3_step(stmt) == SQLITE_DONE) {
                    sqlite3_finalize(stmt);
                    auto response = crow::response{crow::status::created};
                    response.set_header("Content-Type", "application/json");
                    response.body = json{{
                        {"success", true},
                        {"message", "User registered successfully"}
                    }}.dump();
                    return response;
                }
            }
            sqlite3_finalize(stmt);
            
            auto response = crow::response{crow::status::bad_request};
            response.set_header("Content-Type", "application/json");
            response.body = json{{
                {"success", false},
                {"error", "Registration failed"}
            }}.dump();
            return response;
        });

        // Login
        CROW_ROUTE(app, "/api/auth/login").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            
            std::string username = body["username"].s();
            std::string password = body["password"].s();
            
            const char* sql = "SELECT id, username, email FROM users WHERE username = ? AND password = ?";
            sqlite3_stmt* stmt;
            
            if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
                sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);
                sqlite3_bind_text(stmt, 2, password.c_str(), -1, SQLITE_STATIC);
                
                if (sqlite3_step(stmt) == SQLITE_ROW) {
                    int user_id = sqlite3_column_int(stmt, 0);
                    const char* db_username = (const char*)sqlite3_column_text(stmt, 1);
                    const char* db_email = (const char*)sqlite3_column_text(stmt, 2);
                    
                    // Generate JWT token (simplified)
                    std::string token = "token_" + std::to_string(user_id);
                    
                    sqlite3_finalize(stmt);
                    
                    auto response = crow::response{crow::status::ok};
                    response.set_header("Content-Type", "application/json");
                    response.body = json{{
                        {"success", true},
                        {"token", token},
                        {"user", json{{
                            {"id", user_id},
                            {"username", db_username},
                            {"email", db_email}
                        }}}
                    }}.dump();
                    return response;
                }
            }
            sqlite3_finalize(stmt);
            
            auto response = crow::response{crow::status::unauthorized};
            response.set_header("Content-Type", "application/json");
            response.body = json{{
                {"success", false},
                {"error", "Invalid credentials"}
            }}.dump();
            return response;
        });

        // Profile
        CROW_ROUTE(app, "/api/auth/profile")
        ([this](const crow::request& req) {
            auto token = req.get_header_value("Authorization");
            
            if (token.empty()) {
                auto response = crow::response{crow::status::unauthorized};
                response.set_header("Content-Type", "application/json");
                response.body = json{{"error", "No token provided"}}.dump();
                return response;
            }
            
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json{{
                {"id", 1},
                {"username", "devterminal"},
                {"email", "user@example.com"}
            }}.dump();
            return response;
        });
    }

    void setupTerminalRoutes() {
        // Execute command
        CROW_ROUTE(app, "/api/terminal/command").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            std::string command = body["command"].s();
            
            // Execute command and get output
            std::string output = "Command: " + command + " executed successfully";
            
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json{{
                {"success", true},
                {"output", output},
                {"status", 0}
            }}.dump();
            return response;
        });

        // Command history
        CROW_ROUTE(app, "/api/terminal/history")
        ([this](const crow::request& req) {
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json::array({{{{"command", "ls"}, {"output", "file1 file2 file3"}}}}).dump();
            return response;
        });
    }

    void setupFileSystemRoutes() {
        // List files
        CROW_ROUTE(app, "/api/filesystem/list")
        ([this](const crow::request& req) {
            auto path = req.url_params.get("path");
            
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json{{
                {"files", json::array({{
                    json{{"name", "document.txt"}, {"type", "file"}, {"size", 1024}},
                    json{{"name", "folder"}, {"type", "folder"}}
                }}}}
            }}.dump();
            return response;
        });

        // Create file
        CROW_ROUTE(app, "/api/filesystem/create").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            
            auto response = crow::response{crow::status::created};
            response.set_header("Content-Type", "application/json");
            response.body = json{{"success", true}, {"message", "File created"}}.dump();
            return response;
        });

        // Read file
        CROW_ROUTE(app, "/api/filesystem/read/<string>")
        ([this](const crow::request& req, std::string path) {
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json{{"content", "File content here"}}.dump();
            return response;
        });

        // Update file
        CROW_ROUTE(app, "/api/filesystem/update/<string>").methods("PUT"_method)
        ([this](const crow::request& req, std::string path) {
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json{{"success", true}}.dump();
            return response;
        });

        // Delete file
        CROW_ROUTE(app, "/api/filesystem/delete/<string>").methods("DELETE"_method)
        ([this](const crow::request& req, std::string path) {
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json{{"success", true}}.dump();
            return response;
        });
    }

    void setupSystemRoutes() {
        // System stats
        CROW_ROUTE(app, "/api/system/stats")
        ([this](const crow::request& req) {
            auto response = crow::response{crow::status::ok};
            response.set_header("Content-Type", "application/json");
            response.body = json{{
                {"cpu", 25 + (rand() % 50)},
                {"ram", 40 + (rand() % 40)},
                {"disk", 60 + (rand() % 30)},
                {"network", "Connected"}
            }}.dump();
            return response;
        });
    }
};

int main() {
    DevTerminalServer server;
    
    if (!server.init()) {
        std::cerr << "Failed to initialize server" << std::endl;
        return 1;
    }
    
    std::cout << "DevTerminal Server running on http://localhost:8080" << std::endl;
    server.run(8080);
    
    return 0;
}

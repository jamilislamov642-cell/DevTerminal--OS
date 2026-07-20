#include <sqlite3.h>
#include <string>
#include <vector>
#include <map>

class Database {
private:
    sqlite3* db;
    std::string db_path;

public:
    Database(const std::string& path = "devterminal.db") : db(nullptr), db_path(path) {}

    ~Database() {
        if (db) {
            sqlite3_close(db);
        }
    }

    bool connect() {
        int rc = sqlite3_open(db_path.c_str(), &db);
        return rc == SQLITE_OK;
    }

    bool createUser(const std::string& username, const std::string& email, const std::string& password) {
        const char* sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        sqlite3_stmt* stmt;
        
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return false;
        }
        
        sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, email.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 3, password.c_str(), -1, SQLITE_STATIC);
        
        bool result = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        return result;
    }

    bool getUserByUsername(const std::string& username, std::map<std::string, std::string>& user) {
        const char* sql = "SELECT id, username, email FROM users WHERE username = ?";
        sqlite3_stmt* stmt;
        
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return false;
        }
        
        sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);
        
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            user["id"] = std::to_string(sqlite3_column_int(stmt, 0));
            user["username"] = (const char*)sqlite3_column_text(stmt, 1);
            user["email"] = (const char*)sqlite3_column_text(stmt, 2);
            sqlite3_finalize(stmt);
            return true;
        }
        
        sqlite3_finalize(stmt);
        return false;
    }

    bool createFile(int user_id, const std::string& path, const std::string& filename, const std::string& content) {
        const char* sql = "INSERT INTO files (user_id, path, filename, content) VALUES (?, ?, ?, ?)";
        sqlite3_stmt* stmt;
        
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return false;
        }
        
        sqlite3_bind_int(stmt, 1, user_id);
        sqlite3_bind_text(stmt, 2, path.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 3, filename.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 4, content.c_str(), -1, SQLITE_STATIC);
        
        bool result = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        return result;
    }

    bool addHistory(int user_id, const std::string& command, const std::string& output) {
        const char* sql = "INSERT INTO history (user_id, command, output) VALUES (?, ?, ?)";
        sqlite3_stmt* stmt;
        
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) {
            return false;
        }
        
        sqlite3_bind_int(stmt, 1, user_id);
        sqlite3_bind_text(stmt, 2, command.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 3, output.c_str(), -1, SQLITE_STATIC);
        
        bool result = sqlite3_step(stmt) == SQLITE_DONE;
        sqlite3_finalize(stmt);
        return result;
    }
};

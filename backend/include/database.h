#ifndef DATABASE_H
#define DATABASE_H

#include <sqlite3.h>
#include <string>
#include <vector>
#include <map>
#include <memory>

class Database {
private:
    sqlite3* db;
    std::string db_path;

public:
    Database(const std::string& path = "devterminal.db");
    ~Database();

    bool init();
    bool connect();
    void disconnect();

    // User operations
    bool createUser(const std::string& username, const std::string& email, const std::string& password);
    bool getUserByUsername(const std::string& username, std::map<std::string, std::string>& user);
    bool getUserById(int user_id, std::map<std::string, std::string>& user);
    bool updateLastLogin(int user_id);

    // File operations
    bool createFile(int user_id, const std::string& path, const std::string& filename, const std::string& content);
    bool readFile(int user_id, const std::string& path, std::string& content);
    bool updateFile(int user_id, const std::string& path, const std::string& content);
    bool deleteFile(int user_id, const std::string& path);
    bool listFiles(int user_id, const std::string& path, std::vector<std::map<std::string, std::string>>& files);

    // Folder operations
    bool createFolder(int user_id, const std::string& path, const std::string& folder_name);
    bool deleteFolder(int user_id, const std::string& path);
    bool listFolders(int user_id, const std::string& path, std::vector<std::map<std::string, std::string>>& folders);

    // History operations
    bool addHistory(int user_id, const std::string& command, const std::string& output, int status);
    bool getHistory(int user_id, std::vector<std::map<std::string, std::string>>& history);
    bool clearHistory(int user_id);

    // Settings operations
    bool getSettings(int user_id, std::map<std::string, std::string>& settings);
    bool updateSettings(int user_id, const std::map<std::string, std::string>& settings);

    // Notifications
    bool addNotification(int user_id, const std::string& title, const std::string& message, const std::string& type);
    bool getNotifications(int user_id, std::vector<std::map<std::string, std::string>>& notifications);

    // Session management
    bool createSession(int user_id, const std::string& token, int expires_in);
    bool getSession(const std::string& token, int& user_id);
    bool deleteSession(const std::string& token);

private:
    bool executeSQL(const std::string& sql);
    std::vector<std::map<std::string, std::string>> querySQL(const std::string& sql);
};

#endif
#include <string>
#include <map>

class Auth {
public:
    static std::string generateToken(int user_id) {
        return "token_" + std::to_string(user_id);
    }

    static bool verifyToken(const std::string& token) {
        return !token.empty() && token.substr(0, 6) == "token_";
    }

    static int getUserIdFromToken(const std::string& token) {
        if (token.substr(0, 6) == "token_") {
            return std::stoi(token.substr(6));
        }
        return -1;
    }

    static std::string hashPassword(const std::string& password) {
        // In production, use bcrypt or similar
        return password; // Placeholder
    }

    static bool verifyPassword(const std::string& password, const std::string& hash) {
        // In production, use bcrypt verification
        return password == hash; // Placeholder
    }
};

#include <string>

class Terminal {
public:
    static std::string executeCommand(const std::string& command) {
        FILE* pipe = popen(command.c_str(), "r");
        if (!pipe) return "Error executing command";
        
        std::string result;
        char buffer[256];
        while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
            result += buffer;
        }
        pclose(pipe);
        return result;
    }

    static bool isValidCommand(const std::string& command) {
        // Whitelist of allowed commands for security
        const std::vector<std::string> allowed = {
            "ls", "pwd", "echo", "whoami", "date", "uptime",
            "mkdir", "touch", "rm", "cp", "mv", "cat", "grep"
        };
        
        for (const auto& cmd : allowed) {
            if (command.find(cmd) == 0) {
                return true;
            }
        }
        return false;
    }
};

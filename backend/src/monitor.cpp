#include <string>
#include <map>

class SystemMonitor {
public:
    static int getCPUUsage() {
        // Implementation would read from /proc/stat on Linux
        return 25;
    }

    static int getRAMUsage() {
        // Implementation would read from /proc/meminfo on Linux
        return 40;
    }

    static int getDiskUsage() {
        // Implementation would use statvfs on Linux
        return 60;
    }

    static std::map<std::string, std::string> getSystemInfo() {
        std::map<std::string, std::string> info;
        info["os"] = "Linux";
        info["kernel"] = "5.10.0";
        info["hostname"] = "devterminal";
        return info;
    }

    static std::string getNetworkStatus() {
        return "Connected";
    }
};

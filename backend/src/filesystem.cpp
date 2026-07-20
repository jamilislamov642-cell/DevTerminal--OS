#include <string>
#include <vector>
#include <filesystem>

class FileSystem {
public:
    static std::string normalizePath(const std::string& path) {
        // Remove trailing slashes and normalize
        std::string normalized = path;
        while (normalized.back() == '/') {
            normalized.pop_back();
        }
        return normalized.empty() ? "/" : normalized;
    }

    static std::vector<std::string> listDirectory(const std::string& path) {
        std::vector<std::string> files;
        try {
            for (const auto& entry : std::filesystem::directory_iterator(path)) {
                files.push_back(entry.path().filename().string());
            }
        } catch (const std::exception& e) {
            // Directory doesn't exist
        }
        return files;
    }

    static bool createFile(const std::string& path) {
        try {
            std::filesystem::create_directories(path);
            return true;
        } catch (const std::exception& e) {
            return false;
        }
    }

    static bool deleteFile(const std::string& path) {
        try {
            std::filesystem::remove_all(path);
            return true;
        } catch (const std::exception& e) {
            return false;
        }
    }
};

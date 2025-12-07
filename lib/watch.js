const fs = require('fs');
const path = require('path');

/**
 * Watch a file for changes and execute a callback
 * @param {string} filePath - Path to the file to watch
 * @param {Object} options - Watch options
 * @param {Function} options.onChange - Callback function when file changes
 * @param {number} options.debounce - Debounce delay in ms (default 100)
 * @returns {Object} Watcher object with stop() method
 */
module.exports.watchFile = (filePath, { onChange, debounce = 100 } = {}) => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }

    if (typeof onChange !== 'function') {
        throw new Error('onChange callback is required');
    }

    let timeout;
    let lastMtime = fs.statSync(filePath).mtimeMs;

    const watcher = fs.watch(filePath, (eventType, filename) => {
        if (eventType === 'change') {
            clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                try {
                    const stats = fs.statSync(filePath);
                    
                    // Only trigger if modification time actually changed
                    if (stats.mtimeMs !== lastMtime) {
                        lastMtime = stats.mtimeMs;
                        onChange(filePath, eventType);
                    }
                } catch (err) {
                    // File might be temporarily unavailable during write
                }
            }, debounce);
        }
    });

    return {
        stop: () => {
            clearTimeout(timeout);
            watcher.close();
        }
    };
};

/**
 * Watch a directory for changes
 * @param {string} dirPath - Path to the directory to watch
 * @param {Object} options - Watch options
 * @param {Function} options.onChange - Callback function when files change
 * @param {boolean} options.recursive - Watch subdirectories (default true)
 * @param {number} options.debounce - Debounce delay in ms (default 100)
 * @returns {Object} Watcher object with stop() method
 */
module.exports.watchDirectory = (dirPath, { onChange, recursive = true, debounce = 100 } = {}) => {
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Directory does not exist: ${dirPath}`);
    }

    if (typeof onChange !== 'function') {
        throw new Error('onChange callback is required');
    }

    const timeouts = new Map();

    const watcher = fs.watch(dirPath, { recursive }, (eventType, filename) => {
        if (filename) {
            const fullPath = path.join(dirPath, filename);
            
            if (timeouts.has(fullPath)) {
                clearTimeout(timeouts.get(fullPath));
            }

            const timeout = setTimeout(() => {
                onChange(fullPath, eventType);
                timeouts.delete(fullPath);
            }, debounce);

            timeouts.set(fullPath, timeout);
        }
    });

    return {
        stop: () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
            timeouts.clear();
            watcher.close();
        }
    };
};

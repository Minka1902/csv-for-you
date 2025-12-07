const fs = require('fs');
const path = require('path');

const CONFIG_FILENAMES = ['.csvfyrc.json', '.csvfyrc', 'csvfy.config.json'];

/**
 * Load configuration from file
 * @param {string} startDir - Directory to start searching for config
 * @returns {Object|null} Configuration object or null if not found
 */
module.exports.loadConfig = (startDir = process.cwd()) => {
    let currentDir = startDir;
    
    // Search up the directory tree
    while (currentDir !== path.dirname(currentDir)) {
        for (const filename of CONFIG_FILENAMES) {
            const configPath = path.join(currentDir, filename);
            
            if (fs.existsSync(configPath)) {
                try {
                    const content = fs.readFileSync(configPath, 'utf8');
                    return JSON.parse(content);
                } catch (err) {
                    console.warn(`Warning: Failed to parse config file ${configPath}: ${err.message}`);
                }
            }
        }
        
        currentDir = path.dirname(currentDir);
    }
    
    return null;
};

/**
 * Merge configuration with options
 * @param {Object} config - Configuration from file
 * @param {Object} options - Options from command/function call
 * @returns {Object} Merged options
 */
module.exports.mergeConfig = (config, options) => {
    if (!config) return options;
    
    return {
        ...config,
        ...options
    };
};

/**
 * Get default configuration
 * @returns {Object} Default configuration
 */
module.exports.getDefaultConfig = () => {
    return {
        arraySeparator: ';',
        objectSeparator: ';',
        lineAsArray: true,
        fileAsArray: true,
        depth: 3,
        showHidden: false
    };
};

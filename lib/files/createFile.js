const fs = require('fs');
const path = require('path');

module.exports.createFile = (filePath, { content = '', overwrite = false } = {}) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath) && !overwrite) {
            return reject(new Error(`File already exists: ${filePath}. Use overwrite option to replace.`));
        }

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                return reject(new Error(`Error creating file: ${err.message}`));
            }
            resolve({ success: true, message: `File created: ${filePath}` });
        });
    });
};

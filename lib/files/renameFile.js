const fs = require('fs');
const path = require('path');

module.exports.renameFile = (oldPath, newPath, { overwrite = false } = {}) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(oldPath)) {
            return reject(new Error(`Source file does not exist: ${oldPath}`));
        }

        if (fs.existsSync(newPath) && !overwrite) {
            return reject(new Error(`Destination file already exists: ${newPath}. Use overwrite option to replace.`));
        }

        const destDir = path.dirname(newPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                return reject(new Error(`Error renaming file: ${err.message}`));
            }
            resolve({ success: true, message: `File renamed from ${oldPath} to ${newPath}` });
        });
    });
};

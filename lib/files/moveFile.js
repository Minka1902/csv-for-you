const fs = require('fs');
const path = require('path');
const NoFileError = require('../../errors/NoFileError');

module.exports.moveFile = (sourcePath, destinationPath, { overwrite = false } = {}) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(sourcePath)) {
            return reject(new NoFileError(`Source file does not exist: ${sourcePath}`));
        }

        const destDir = path.dirname(destinationPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        if (fs.existsSync(destinationPath) && !overwrite) {
            return reject(new Error(`Destination file already exists: ${destinationPath}. Use overwrite option to replace.`));
        }

        fs.rename(sourcePath, destinationPath, (err) => {
            if (err) {
                return reject(new Error(`Error moving file: ${err.message}`));
            }
            resolve({ success: true, message: `File moved from ${sourcePath} to ${destinationPath}` });
        });
    });
};

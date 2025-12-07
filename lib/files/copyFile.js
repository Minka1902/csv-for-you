const fs = require('fs');
const path = require('path');

module.exports.copyFile = (sourcePath, destinationPath, { overwrite = false } = {}) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(sourcePath)) {
            return reject(new Error(`Source file does not exist: ${sourcePath}`));
        }

        if (fs.existsSync(destinationPath) && !overwrite) {
            return reject(new Error(`Destination file already exists: ${destinationPath}. Use overwrite option to replace.`));
        }

        const destDir = path.dirname(destinationPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFile(sourcePath, destinationPath, overwrite ? 0 : fs.constants.COPYFILE_EXCL, (err) => {
            if (err) {
                return reject(new Error(`Error copying file: ${err.message}`));
            }
            resolve({ success: true, message: `File copied from ${sourcePath} to ${destinationPath}` });
        });
    });
};

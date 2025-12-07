const fs = require('fs');

module.exports.deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File does not exist: ${filePath}`));
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(new Error(`Error deleting file: ${err.message}`));
            }
            resolve({ success: true, message: `File deleted: ${filePath}` });
        });
    });
};

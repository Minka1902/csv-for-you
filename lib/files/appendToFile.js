const fs = require('fs');
const path = require('path');

module.exports.appendToFile = (filePath, content) => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.appendFile(filePath, content, 'utf8', (err) => {
            if (err) {
                return reject(new Error(`Error appending to file: ${err.message}`));
            }
            resolve({ success: true, message: `Content appended to ${filePath}` });
        });
    });
};

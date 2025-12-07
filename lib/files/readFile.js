const fs = require('fs');

module.exports.readFile = (filePath, { encoding = 'utf8' } = {}) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File does not exist: ${filePath}`));
        }

        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                return reject(new Error(`Error reading file: ${err.message}`));
            }
            resolve(data);
        });
    });
};

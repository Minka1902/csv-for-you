const fs = require('fs');
const NoFileError = require('../errors/NoFileError');

module.exports.getHeaders = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, fileData) => {
            if (err) {
                reject(new NoFileError(`Error reading file: ${filePath}\nError: ${err}`));
            }

            if (fileData.length > 0) {
                const headers = fileData.split('\n')[0].split(',');
                resolve(headers);
            }
        });
    })
}

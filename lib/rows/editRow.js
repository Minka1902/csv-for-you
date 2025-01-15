const fs = require('fs');
const InvalidLineNumberError = require('../../errors/InvalidLineNumber');
const InvalidRequestError = require('../../errors/InvalidDataError');
const NoFileError = require('../../errors/NoFileError');

// ! data must be an object with the same properties as the original line

module.exports.editRow = (filePath, { data, lineNumber }) => {
    if (!fs.existsSync(filePath)) {
        throw new NoFileError(`File does not exist: ${filePath}`);
    }

    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            return new Error(`Error reading file: ${err.message}`);
        }

        let lines;
        if (fileData.indexOf('\r\n') !== -1) {
            lines = fileData.split('\r\n');
        } else lines = fileData.split('\n');

        if (lineNumber < 1 || lineNumber >= lines.length) {
            return new InvalidLineNumberError(`Invalid line number: ${lineNumber}`);
        }

        const headers = lines[0].split(',');
        const dataKeys = Object.keys(data);

        for (const header of headers) {
            if (!dataKeys.includes(header)) {
                return new InvalidRequestError(`Missing property "${header}" in data`);
            }
        }

        const updatedLine = headers.map((header) => data[header]).join(',');
        lines[lineNumber] = updatedLine;

        fs.writeFile(filePath, lines.join('\n'), (err) => {
            if (err) {
                throw new Error(`Error writing to file: ${err.message}`);
            }
            console.log(`Line ${lineNumber} updated successfully.`);
        });
    });
}

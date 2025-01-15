const fs = require('fs');
const NoFileError = require('../../errors/NoFileError');

module.exports.addRow = (
    filePath,
    dataObject,
    tempOptions = { lineNumber: 0 },
) => {
    const objectToCSVRow = (data, props) => {
        let tempRow = '';

        for (let i = 0; i <= props.length - 2; i++) {
            tempRow += `${data[props[i]]},`;
        }

        tempRow += `${data[props[props.length - 1]]}\n`;

        return tempRow;
    };

    return fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            NoFileError(`Error reading file: ${filePath}\nError: ${err}`);
            return;
        }

        const lines = fileData.split('\n');

        const newRow = objectToCSVRow(dataObject, lines[0].split(','));

        if (tempOptions.lineNumber !== 0) {
            if (tempOptions.lineNumber >= 0 && tempOptions.lineNumber < lines.length) {
                lines.splice(tempOptions.lineNumber, 0, newRow.trim());
            } else {
                lines.push(newRow.trim());
            }

            const updatedFileData = lines.join('\n');

            return fs.writeFile(filePath, updatedFileData, (err) => {
                if (err) {
                    return 'Error writing to file:', err;
                } else {
                    return `Row added to CSV file successfully to line ${tempOptions.lineNumber}`;
                }
            });
        } else {
            return fs.appendFile(filePath, newRow, (err) => {
                if (err) {
                    return 'Error appending to CSV file:', err;
                }
                return `Row added to CSV file successfully`;
            });
        }
    });
};

const fs = require('fs');
const InvalidRequestError = require('../../errors/InvalidDataError');

export function deleteRowInLine(filePath, { rowNumber = -1, rowsToDelete = 1 }) {
    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`);
        return;
    }

    return fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const lines = fileData.split('\n');

        if (rowNumber === -1) {
            if (rowsToDelete !== 1) myArray.splice(-rowsToDelete);
            else lines.pop()
        } else if (rowNumber === 0 || rowNumber >= lines.length) {
            InvalidRequestError(`Can't delete row: ${rowNumber}`);
            return;
        } else lines.splice(rowNumber, rowsToDelete);

        const updatedFileData = lines.join('\n');

        // Write the updated content back to the file
        fs.writeFile(filePath, updatedFileData, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log(`Row at line ${rowNumber} deleted successfully.`);
            }
        });
    });
}

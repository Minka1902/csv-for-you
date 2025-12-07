const fs = require('fs');
const InvalidRequestError = require('../../errors/InvalidDataError');

module.exports.deleteRows = (filePath, { rowNumber = -1, rowsToDelete = 1, reportToConsole = true }) => {
    if (!fs.existsSync(filePath)) {
        reportToConsole && console.error(`File does not exist: ${filePath}`);
        return;
    }

    return fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            reportToConsole && console.error('Error reading file:', err);
            return { success: false, message: `Error reading file: ${err}` };
        }

        const lines = fileData.indexOf('\r\n') !== -1 ? fileData.split('\r\n') : fileData.split('\n');

        if (rowNumber === -1) {
            if (rowsToDelete !== 1) lines.splice(-rowsToDelete);
            else lines.pop();
        } else if (rowNumber < 1 || rowNumber >= lines.length) {
            new InvalidRequestError(`Can't delete row: ${rowNumber}`);
            return;
        } else lines.splice(rowNumber, rowsToDelete);

        const updatedFileData = lines.join('\n');

        // Write the updated content back to the file
        fs.writeFile(filePath, updatedFileData, (err) => {
            if (err) {
                reportToConsole && console.error('Error updating the file:', err);
                return { success: false, message: `Error updating the file: ${err}` }
            } else {
                reportToConsole && console.log(`Row at line ${rowNumber} deleted successfully.`);
                return { success: true, message: `Row at line ${rowNumber} deleted successfully.` };
            }
        });
    });
}

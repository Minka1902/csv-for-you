const fs = require('fs');

/**
 * Validates a CSV file structure
 * @param {string} filePath - Path to the CSV file
 * @param {Object} options - Validation options
 * @param {boolean} options.checkHeaders - Whether to check for header row
 * @param {boolean} options.checkTypes - Whether to validate data types consistency
 * @param {boolean} options.checkColumns - Whether to validate column count consistency
 * @param {string[]} options.expectedHeaders - Expected header names
 * @returns {Promise<Object>} Validation result
 */
module.exports.validateCSV = (filePath, { 
    checkHeaders = true, 
    checkTypes = false, 
    checkColumns = true,
    expectedHeaders = null 
} = {}) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File does not exist: ${filePath}`));
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error(`Error reading file: ${err.message}`));
            }

            const lines = data.trim().split('\n');
            const errors = [];
            const warnings = [];
            
            if (lines.length === 0) {
                errors.push('File is empty');
                return resolve({ valid: false, errors, warnings });
            }

            const headers = lines[0].split(',').map(h => h.trim());
            
            // Check headers
            if (checkHeaders && lines.length === 1) {
                warnings.push('File contains only headers, no data rows');
            }

            // Check expected headers
            if (expectedHeaders && expectedHeaders.length > 0) {
                const missing = expectedHeaders.filter(h => !headers.includes(h));
                if (missing.length > 0) {
                    errors.push(`Missing expected headers: ${missing.join(', ')}`);
                }
            }

            // Check column count consistency
            if (checkColumns && lines.length > 1) {
                const expectedColumns = headers.length;
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',');
                    if (cols.length !== expectedColumns) {
                        errors.push(`Line ${i + 1}: Expected ${expectedColumns} columns, got ${cols.length}`);
                    }
                }
            }

            // Check data types consistency
            if (checkTypes && lines.length > 1) {
                const columnTypes = {};
                
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    
                    values.forEach((value, colIndex) => {
                        if (!columnTypes[colIndex]) {
                            columnTypes[colIndex] = { types: new Set(), header: headers[colIndex] };
                        }
                        
                        if (value === '' || value.toLowerCase() === 'null') {
                            columnTypes[colIndex].types.add('null');
                        } else if (!isNaN(value) && !isNaN(parseFloat(value))) {
                            columnTypes[colIndex].types.add('number');
                        } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                            columnTypes[colIndex].types.add('boolean');
                        } else {
                            columnTypes[colIndex].types.add('string');
                        }
                    });
                }

                Object.entries(columnTypes).forEach(([colIndex, info]) => {
                    if (info.types.size > 2 || (info.types.size === 2 && !info.types.has('null'))) {
                        warnings.push(`Column "${info.header}" has mixed types: ${Array.from(info.types).join(', ')}`);
                    }
                });
            }

            const result = {
                valid: errors.length === 0,
                errors,
                warnings,
                stats: {
                    totalRows: lines.length - 1,
                    totalColumns: headers.length,
                    headers
                }
            };

            resolve(result);
        });
    });
};

const fs = require('fs');

const parse = (
    filePath,
    tempCallbacks = { lineCallback: '', fileCallback: '', arrayCallback: '', objectCallback: '', numberCallback: '', stringCallback: '' },
    tempOptions = { arraySeparator: ';', objectSeparator: ';', lineAsArray: true, fileAsArray: true, returnAsString: [] },
) => {
    let remaining = '', fileData, props;
    const callbacks = updateObjects({ lineCallback: '', fileCallback: '', arrayCallback: '', objectCallback: '', numberCallback: '', stringCallback: '' }, tempCallbacks);
    const options = updateObjects({ arraySeparator: ';', objectSeparator: ';', innerSeparator: '@', lineAsArray: true, fileAsArray: true, returnAsString: [] }, tempOptions);
    if (options.fileAsArray) fileData = []
    else fileData = {};

    const hasLetters = (variable) => /[a-zA-Z]/.test(variable);

    const hasNumbersOnly = (variable, ignore = '') => {
        if (variable !== '') {
            const numbers = "1234567890. ";
            for (let char of variable) {
                if (!numbers.includes(char) && !ignore.includes(char)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    const parseObject = (str) => {
        str = str.slice(1, -1);
        let obj = {};
        let value = '';
        let stack = [];
        let currentObj = obj;
        let currentKey = '';
        let isReadingKey = true;
        const findClosingBracket = (str, startIndex, openBracket, closeBracket) => {
            let depth = 0;
            for (let i = startIndex; i < str.length; i++) {
                if (str[i] === openBracket) depth++;
                if (str[i] === closeBracket) depth--;
                if (depth === 0) return i;
            }
            return -1; // If no matching bracket is found
        };

        for (let i = 0; i < str.length; i++) {
            const char = str[i];

            if (char === '{') {
                stack.push(currentObj);
                currentObj[currentKey.trim()] = {};
                currentObj = currentObj[currentKey.trim()];
                currentKey = '';
                isReadingKey = true;
            } else if (char === '}') {
                if (currentKey) {
                    currentObj[currentKey.trim()] = hasNumbersOnly(value) ? Number(value.trim()) : value.trim();
                    currentKey = '';
                    value = '';
                }
                currentObj = stack.pop();
            } else if (char === '[') {
                let arrayEndIndex = findClosingBracket(str, i, '[', ']');
                let arrayString = str.slice(i, arrayEndIndex + 1);
                currentObj[currentKey.trim()] = parseArray(arrayString);
                i = arrayEndIndex;
                currentKey = '';
                value = '';
                isReadingKey = true;
            } else if (char === ':') {
                isReadingKey = false;
            } else if (char === ';') {
                if (currentKey) {
                    currentObj[currentKey.trim()] = hasNumbersOnly(value) ? Number(value.trim()) : value.trim();
                    currentKey = '';
                    value = '';
                }
                isReadingKey = true;
            } else {
                if (isReadingKey) {
                    currentKey += char;
                } else {
                    value += char;
                }
            }
        }

        if (currentKey) {
            currentObj[currentKey.trim()] = hasNumbersOnly(value) ? Number(value.trim()) : value.trim();
        }

        return obj;
    };

    const parseArray = (str) => {
        str = str.slice(1, -1);

        const result = [];
        let temp = '';
        let nestedLevel = 0;

        for (let char of str) {
            if (char === '[' || char === '{') {
                nestedLevel++;
                temp += char;
            } else if (char === ']' || char === '}') {
                nestedLevel--;
                temp += char;
            } else if (char === ';' && nestedLevel === 0) {
                result.push(temp);
                temp = '';
            } else {
                temp += char;
            }
        }

        if (temp) result.push(temp);

        return result.map((item) => {
            if (item.startsWith('[') && item.endsWith(']')) return parseArray(item)
            else if (item.startsWith('{') && item.endsWith('}')) return parseObject(item)
            else if (hasNumbersOnly(item)) return Number(item)
            else if (hasLetters(item)) return item
        });
    };

    const processLine = (line, isObject = false) => {
        let temp = options.lineAsArray ? [] : {};
        for (let i = 0; i < line.length; i++) {
            if (!isObject) {
                const prop = props[i];
                const value = line[i];
                if (options.returnAsString.includes(prop)) {
                    temp[options.lineAsArray ? temp.length : prop] = value;
                } else if (value.startsWith('{') && value.endsWith('}')) {
                    temp[options.lineAsArray ? temp.length : prop] = parseObject(value);
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    temp[options.lineAsArray ? temp.length : prop] = parseArray(value);
                } else if (hasLetters(value)) {
                    temp[options.lineAsArray ? temp.length : prop] = value;
                } else if (hasNumbersOnly(value)) {
                    if (typeof callbacks.numberCallback === 'function')
                        temp[options.lineAsArray ? temp.length : prop] = callbacks.numberCallback(Number(value));
                    else temp[options.lineAsArray ? temp.length : prop] = Number(value);
                } else if (value === '') {
                    temp[options.lineAsArray ? temp.length : prop] = null;
                }
            } else {
                if (line.startsWith('{') && line.endsWith('}')) {
                    return parseObject(line);
                } else if (line.startsWith('[') && line.endsWith(']')) {
                    return parseArray(line, options.innerSeparator);
                } else if (hasLetters(line)) {
                    return line;
                } else if (hasNumbersOnly(line)) {
                    return Number(line);
                } else if (!line) {
                    return null;
                }
            }
        }
        return temp;
    };

    function updateObjects(options, update) {
        if (Object.keys(update).length > 0) {
            const keys = Object.keys(update);
            for (let key of keys) {
                if (options[key] !== update[key]) {
                    options[key] = update[key];
                }
            }
        }
        return options;
    };

    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) return resolve('File not found.');

            const fileStream = fs.createReadStream(filePath, 'utf8');
            fileStream.on('data', (chunk) => {
                remaining += chunk;
                props = remaining.substring(0, remaining.indexOf('\n')).replace('\r', '').split(',');
                let last = remaining.indexOf('\n') + 1;
                let index = remaining.indexOf('\n', last);

                while (index > -1) {
                    const line = remaining.substring(last, index).replace('\r', '').split(',');
                    last = index + 1;
                    let temp = processLine(line);

                    if (options.fileAsArray) fileData.push(temp);
                    index = remaining.indexOf('\n', last);
                }

                remaining = remaining.substring(last);
            });

            fileStream.on('end', () => {
                if (remaining !== '') {
                    remaining = remaining.split(',');
                    const temp = processLine(remaining);
                    if (options.fileAsArray) fileData.push(temp)
                    else fileData.push(temp);
                }
                resolve(fileData);
            });

            fileStream.on('error', (err) => {
                reject(err);
            });
        });
    });
};

const addRow = (
    filePath,
    dataObject,
    tempOptions = { lineNumber: 0 },
) => {
    const options = updateObjects({ lineNumber: 0 }, tempOptions)

    const objectToCSVRow = (data, props) => {
        const values = Object.values(data);
        return values.map(value => `${value}`).join(',') + '\n';
    };

    function updateObjects(options, update) {
        if (Object.keys(update).length > 0) {
            const keys = Object.keys(update);
            for (let key of keys) {
                if (options[key] !== update[key]) {
                    options[key] = update[key];
                }
            }
        }
        return options;
    };

    return fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const lines = fileData.split('\n');
        const newRow = objectToCSVRow(dataObject, lines[0].split(','));
        if (options.lineNumber !== 0) {
            if (options.lineNumber >= 0 && options.lineNumber < lines.length) {
                lines.splice(options.lineNumber, 0, newRow.trim());
            } else {
                lines.push(newRow.trim());
            }

            const updatedFileData = lines.join('\n');
            fs.writeFile(filePath, updatedFileData, (err) => {
                if (err) {
                    return 'Error writing to file:', err;
                }
            });
        } else {
            const csvRow = objectToCSVRow(dataObject);
            return fs.appendFile(filePath, csvRow, (err) => {
                if (err) {
                    return 'Error appending to CSV file:', err;
                }
            });
        }
    });
};

module.exports = { parse, addRow };

const fs = require('fs');

module.exports.parseCsv = (filePath, tempOptions = { arraySeparator: ';', objectSeparator: ';', arrayOfArrays: true, returnArray: true, returnAsString: [] }) => {
    const options = updateOptions({ arraySeparator: ';', objectSeparator: ';', innerSeparator: '@', arrayOfArrays: true, returnArray: true, returnAsString: [] }, tempOptions);
    let remaining = '';
    let fileData;
    if (options.returnArray) fileData = []
    else fileData = {};
    let props;

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

    function parseArrayFromString(str, separator = '') {
        const parts = str.slice(1, -1).split(separator || options.arraySeparator);
        let tempArr = [];
        for (let part of parts) {
            tempArr.push(processLine(part, true));
        }

        return tempArr;
    };

    function parseObjectFromString(str) {
        let tempObj = {};
        const parts = str.slice(1, -1).split(options.objectSeparator);
        for (let part of parts) {
            const property = part.slice(0, part.indexOf(':'));
            let value = part.slice(part.indexOf(':') + 1, str.length - 1);
            tempObj[property] = processLine(value, true);
        }
        return tempObj;
    };

    const processLine = (line, isObject = false) => {
        let temp = options.arrayOfArrays ? [] : {};
        for (let i = 0; i < line.length; i++) {
            if (!isObject) {
                const prop = props[i];
                const value = line[i];
                if (options.returnAsString.includes(prop)) {
                    temp[options.arrayOfArrays ? temp.length : prop] = value;
                } else if (value.startsWith('{') && value.endsWith('}')) {
                    temp[options.arrayOfArrays ? temp.length : prop] = parseObjectFromString(value);
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    temp[options.arrayOfArrays ? temp.length : prop] = parseArrayFromString(value);
                } else if (hasLetters(value)) {
                    temp[options.arrayOfArrays ? temp.length : prop] = value;
                } else if (hasNumbersOnly(value)) {
                    temp[options.arrayOfArrays ? temp.length : prop] = Number(value);
                } else if (value === '') {
                    temp[options.arrayOfArrays ? temp.length : prop] = null;
                }
            } else {
                if (line.startsWith('{') && line.endsWith('}')) {
                    return parseObjectFromString(line);
                } else if (line.startsWith('[') && line.endsWith(']')) {
                    return parseArrayFromString(line, options.innerSeparator);
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

    function updateOptions(options, update) {
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
                    const temp = processLine(line);

                    if (options.returnArray) fileData.push(temp);
                    index = remaining.indexOf('\n', last);
                }

                remaining = remaining.substring(last);
            });

            fileStream.on('end', () => {
                if (remaining !== '') {
                    remaining = remaining.split(',');
                    const temp = processLine(remaining);
                    if (options.returnArray) fileData.push(temp)
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

const fs = require('fs');

// const parse = (
//     filePath,
//     tempOptions = { arraySeparator: ';', objectSeparator: ';', lineAsArray: true, fileAsArray: true, returnAsString: [], inCallbacks: true },
//     tempCallbacks = { lineCallback: '', fileCallback: '', arrayCallback: '', objectCallback: '', numberCallback: '', stringCallback: '' },
// ) => {
//     let remaining = '', fileData, props, lineCounter = 1;
//     const callbacks = updateObjects({ lineCallback: '', fileCallback: '', arrayCallback: '', objectCallback: '', numberCallback: '', stringCallback: '' }, tempCallbacks);
//     const options = updateObjects({ arraySeparator: ';', objectSeparator: ';', lineAsArray: true, fileAsArray: true, returnAsString: [], inCallbacks: true }, tempOptions, true);
//     if (options.fileAsArray) fileData = []
//     else fileData = {};

//     const hasLetters = (variable) => /[a-zA-Z]/.test(variable);

//     const hasNumbersOnly = (variable, ignore = '') => {
//         if (variable !== '') {
//             const numbers = "1234567890. ";
//             for (let char of variable) {
//                 if (!numbers.includes(char) && !ignore.includes(char)) {
//                     return false;
//                 }
//             }
//             return true;
//         }
//         return false;
//     };

//     const parseObject = (str) => {
//         str = str.slice(1, -1);
//         let obj = {};
//         let value = '';
//         let stack = [];
//         let currentObj = obj;
//         let currentKey = '';
//         let isReadingKey = true;
//         const findClosingBracket = (str, startIndex, openBracket, closeBracket) => {
//             let depth = 0;
//             for (let i = startIndex; i < str.length; i++) {
//                 if (str[i] === openBracket) depth++;
//                 if (str[i] === closeBracket) depth--;
//                 if (depth === 0) return i;
//             }
//             return -1; // If no matching bracket is found
//         };

//         for (let i = 0; i < str.length; i++) {
//             const char = str[i];

//             if (char === '{') {
//                 stack.push(currentObj);
//                 currentObj[currentKey.trim()] = {};
//                 currentObj = currentObj[currentKey.trim()];
//                 currentKey = '';
//                 isReadingKey = true;
//             } else if (char === '}') {
//                 if (currentKey) {
//                     currentObj[currentKey.trim()] = hasNumbersOnly(value) ? Number(value.trim()) : value.trim();
//                     currentKey = '';
//                     value = '';
//                 }
//                 currentObj = stack.pop();
//             } else if (char === '[') {
//                 let arrayEndIndex = findClosingBracket(str, i, '[', ']');
//                 let arrayString = str.slice(i, arrayEndIndex + 1);
//                 currentObj[currentKey.trim()] = parseArray(arrayString);
//                 i = arrayEndIndex;
//                 currentKey = '';
//                 value = '';
//                 isReadingKey = true;
//             } else if (char === ':') {
//                 isReadingKey = false;
//             } else if (char === ';') {
//                 if (currentKey) {
//                     currentObj[currentKey.trim()] = hasNumbersOnly(value) ? Number(value.trim()) : value.trim();
//                     currentKey = '';
//                     value = '';
//                 }
//                 isReadingKey = true;
//             } else {
//                 if (isReadingKey) {
//                     currentKey += char;
//                 } else {
//                     value += char;
//                 }
//             }
//         }

//         if (currentKey) {
//             currentObj[currentKey.trim()] = hasNumbersOnly(value) ? Number(value.trim()) : value.trim();
//         }

//         return obj;
//     };

//     const parseArray = (str) => {
//         str = str.slice(1, -1);

//         const result = [];
//         let temp = '';
//         let nestedLevel = 0;

//         for (let char of str) {
//             if (char === '[' || char === '{') {
//                 nestedLevel++;
//                 temp += char;
//             } else if (char === ']' || char === '}') {
//                 nestedLevel--;
//                 temp += char;
//             } else if (char === ';' && nestedLevel === 0) {
//                 result.push(temp);
//                 temp = '';
//             } else {
//                 temp += char;
//             }
//         }

//         if (temp) result.push(temp);

//         return result.map((item) => {
//             if (item.startsWith('[') && item.endsWith(']')) return parseArray(item)
//             else if (item.startsWith('{') && item.endsWith('}')) return parseObject(item)
//             else if (hasNumbersOnly(item)) return Number(item)
//             else if (hasLetters(item)) return item
//         });
//     };

//     const processLine = (line) => {
//         let temp = options.lineAsArray ? [] : {};
//         for (let i = 0; i < line.length; i++) {
//             const prop = props[i];
//             const value = line[i];
//             if (options.returnAsString.includes(prop)) {
//                 temp[options.lineAsArray ? temp.length : prop] = value;
//             } else if (value.startsWith('{') && value.endsWith('}')) {
//                 if (typeof callbacks.objectCallback === 'function' && options.inCallbacks)
//                     temp[options.lineAsArray ? temp.length : prop] = callbacks.objectCallback(parseObject(value));
//                 else temp[options.lineAsArray ? temp.length : prop] = parseObject(value);
//             } else if (value.startsWith('[') && value.endsWith(']')) {
//                 if (typeof callbacks.arrayCallback === 'function')
//                     temp[options.lineAsArray ? temp.length : prop] = callbacks.arrayCallback(parseArray(value))
//                 else temp[options.lineAsArray ? temp.length : prop] = parseArray(value);
//             } else if (hasLetters(value)) {
//                 if (typeof callbacks.stringCallback === 'function')
//                     temp[options.lineAsArray ? temp.length : prop] = callbacks.stringCallback(value);
//                 else temp[options.lineAsArray ? temp.length : prop] = value;
//             } else if (hasNumbersOnly(value)) {
//                 if (typeof callbacks.numberCallback === 'function')
//                     temp[options.lineAsArray ? temp.length : prop] = callbacks.numberCallback(Number(value));
//                 else temp[options.lineAsArray ? temp.length : prop] = Number(value);
//             } else if (value === '') {
//                 temp[options.lineAsArray ? temp.length : prop] = null;
//             }

//         }
//         return temp;
//     };

//     function updateObjects(options, update, isOptions = false) {
//         if (isOptions && Object.keys(options).indexOf('inCallbacks') !== -1) {
//             function isAnyCallbacksNotLine() {
//                 const keys = Object.keys(callbacks);
//                 for (let i = 0; i < keys.length; i++) {
//                     if (keys[i] !== 'fileCallback' && keys[i] !== 'lineCallback') {
//                         if (typeof callbacks[keys[i]] === 'function') {
//                             return true;
//                         }
//                     }
//                 }
//                 return false;
//             };

//             if (typeof callbacks.lineCallback === 'function' || typeof callbacks.fileCallback === 'function') {
//                 if (isAnyCallbacksNotLine() && update.inCallbacks) {
//                     options['inCallbacks'] = update['inCallbacks'];
//                 }
//             }
//         }

//         if (Object.keys(update).length > 0) {
//             const keys = Object.keys(update);
//             for (let key of keys) {
//                 if (key !== 'inCallbacks' && options[key] !== update[key]) {
//                     options[key] = update[key];
//                 }
//             }
//         }

//         return options;
//     };

//     return new Promise((resolve, reject) => {
//         fs.access(filePath, fs.constants.F_OK, (err) => {
//             if (err) return resolve('File not found.');

//             const fileStream = fs.createReadStream(filePath, 'utf8');
//             fileStream.on('data', (chunk) => {
//                 remaining += chunk;
//                 props = remaining.substring(0, remaining.indexOf('\n')).replace('\r', '').split(',');
//                 let last = remaining.indexOf('\n') + 1;
//                 let index = remaining.indexOf('\n', last);

//                 while (index > -1) {
//                     const line = remaining.substring(last, index).replace('\r', '').split(',');
//                     last = index + 1;
//                     let temp = typeof callbacks.lineCallback === 'function' ? callbacks.lineCallback(processLine(line)) : processLine(line);

//                     if (options.fileAsArray) fileData.push(temp)
//                     else fileData[String(lineCounter)] = temp;
//                     lineCounter += 1;
//                     index = remaining.indexOf('\n', last);
//                 }

//                 remaining = remaining.substring(last);
//             });

//             fileStream.on('end', () => {
//                 if (remaining !== '') {
//                     remaining = remaining.split(',');
//                     const temp = processLine(remaining);
//                     if (options.fileAsArray) fileData.push(temp)
//                     else fileData[String(lineCounter)] = temp;
//                     lineCounter += 1;
//                 }
//                 resolve(fileData);
//             });

//             fileStream.on('error', (err) => {
//                 reject(err);
//             });
//         });
//     });
// };

const addRow = (
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
            console.error('Error reading file:', err);
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

module.exports = { parse, addRow };

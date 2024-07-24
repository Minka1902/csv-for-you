const fs = require('fs');

module.exports.parseCsv = (filePath, tempOptions = { arraySeparator: ';', objectSeparator: '@', arrayOfArrays: true, returnArray: true, returnAsString: [] }) => {
    const options = updateOptions({ arraySeparator: ';', objectSeparator: '@', arrayOfArrays: true, returnArray: true, returnAsString: [] }, tempOptions);
    let remaining = '';
    let props;

    let fileData;
    if (options.returnArray) fileData = []
    else fileData = {};

    function hasLetters(variable) {
        const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        for (let letter of letters) {
            if (variable.indexOf(letter) !== -1) {
                return true;
            }
        }
        return false;
    };

    function hasNumbersOnly(variable, ignore = '') {
        if (variable !== '') {
            const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", " "];
            for (let char of variable) {
                if (numbers.indexOf(char) === -1 && ignore.indexOf(char) === -1) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    function parseArrayFromString(coordString) {
        const parts = coordString.slice(1, -1).split(options.arraySeparator);
        if (hasNumbersOnly(coordString, `[${options.arraySeparator}]`)) {
            return parts.map(Number);
        } else if (hasLetters(coordString)) {
            return parts.map(String);
        }
    };

    const processLine = (line) => {
        let temp;
        if (options.arrayOfArrays) temp = []
        else temp = {};
        for (let i = 0; i < line.length; i++) {
            if (options.returnAsString.length > 0 && options.returnAsString.indexOf(props[i]) !== -1) {
                if (options.arrayOfArrays) temp.push(line[i]);
                else temp[props[i]] = line[i];
            } else if (line[i][0] === '[' && line[i][line[i].length - 1] === ']') {
                if (hasNumbersOnly(line[i], `[${options.arraySeparator}]`)) {
                    if (options.arrayOfArrays) temp.push(parseArrayFromString(line[i]));
                    else temp[props[i]] = parseArrayFromString(line[i]);
                } else if (hasLetters(line[i])) {
                    if (options.arrayOfArrays) temp.push(parseArrayFromString(line[i]));
                    else temp[props[i]] = parseArrayFromString(line[i]);
                }
            } else if (hasLetters(line[i])) {
                if (options.arrayOfArrays) temp.push(line[i]);
                else temp[props[i]] = line[i];
            } else if (hasNumbersOnly(line[i])) {
                if (options.arrayOfArrays) temp.push(parseFloat(line[i]))
                else temp[props[i]] = parseFloat(line[i]);
            } else if (line[i] === '') {
                if (options.arrayOfArrays) temp.push(null);
                else temp[props[i]] = null;
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
        try {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return resolve(`File not found.`);
                }

                const fileStream = fs.createReadStream(filePath, 'utf8');
                fileStream.on('data', function (chunk) {
                    remaining += chunk;
                    props = remaining.substring(0, remaining.indexOf('\n')).replace('\r', '').split(',');
                    let last = remaining.indexOf('\n') + 1;
                    let index = remaining.indexOf('\n', last);

                    while (index > -1) {
                        if (last !== 0) {
                            const line = remaining.substring(last, index).replace('\r', '').split(',');
                            last = index + 1;
                            const temp = processLine(line);

                            if (options.returnArray) fileData.push(temp);
                            index = remaining.indexOf('\n', last);
                        }
                    }

                    remaining = remaining.substring(last);
                });

                fileStream.on('end', () => {
                    if (remaining !== '') {
                        remaining = remaining.split(',');
                        const temp = processLine(remaining);
                        if (options.returnArray) fileData.push(temp)
                    }
                    resolve(fileData.length === 1 ? fileData[0] : fileData);
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

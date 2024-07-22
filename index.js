const fs = require('fs');

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
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
        for (let char of variable) {
            if (numbers.indexOf(char) === -1 && ignore.indexOf(char) === -1) {
                return false;
            }
        }
        return true;
    }
    return false;
};

function parseArrayFromString(coordString, arraySeparator) {
    const parts = coordString.slice(1, -1).split(arraySeparator);
    if (hasNumbersOnly(coordString, `[${arraySeparator}]`)) {
        return parts.map(Number);
    } else if (hasLetters(coordString)) {
        return parts.map(String);
    }
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

module.exports.parseCsv = (filePath, tempOptions = { arraySeparator: ';', objectSeparator: '@', arrayOfArrays: true, returnArray: true }) => {
    const options = updateOptions({ arraySeparator: ';', objectSeparator: '@', arrayOfArrays: true, returnArray: true }, tempOptions);
    let remaining = '';
    let fileData;
    if (options.returnArray) fileData = []
    else fileData = {};
    let props;

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
                        let temp;
                        if (options.arrayOfArrays) temp = []
                        else temp = {};
                        if (last !== 0) {
                            const line = remaining.substring(last, index).replace('\r', '').split(',');
                            last = index + 1;

                            for (let i = 0; i < line.length; i++) {
                                if (line[i][0] === '[' && line[i][line[i].length - 1] === ']') {
                                    if (hasNumbersOnly(line[i], `[${options.arraySeparator}]`)) {
                                        if (options.arrayOfArrays) temp.push(parseArrayFromString(line[i], options.arraySeparator))
                                        else temp[props[i]] = parseArrayFromString(line[i], options.arraySeparator);
                                    } else if (hasLetters(line[i])) {
                                        if (options.arrayOfArrays) temp.push(parseArrayFromString(line[i], options.arraySeparator))
                                        else temp[props[i]] = parseArrayFromString(line[i], options.arraySeparator);
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
                            if (options.returnArray) fileData.push(temp);
                            index = remaining.indexOf('\n', last);
                        }
                    }

                    remaining = remaining.substring(last);
                });

                fileStream.on('end', () => {
                    if (remaining !== '') {
                        let temp;
                        if (options.arrayOfArrays) temp = []
                        else temp = {};
                        remaining = remaining.split(',');

                        for (let i = 0; i < remaining.length; i++) {
                            if (remaining[i][0] === '[' && remaining[i][remaining[i].length - 1] === ']') {
                                if (hasNumbersOnly(remaining[i], `[${options.arraySeparator}]`)) {
                                    if (options.arrayOfArrays) temp.push(parseArrayFromString(remaining[i], options.arraySeparator))
                                    else temp[props[i]] = parseArrayFromString(remaining[i], options.arraySeparator);
                                } else if (hasLetters(remaining[i])) {
                                    if (options.arrayOfArrays) temp.push(parseArrayFromString(remaining[i], options.arraySeparator))
                                    else temp[props[i]] = parseArrayFromString(remaining[i], options.arraySeparator);
                                }
                            } else if (hasLetters(remaining[i])) {
                                if (options.arrayOfArrays) temp.push(remaining[i]);
                                else temp[props[i]] = remaining[i];
                            } else if (hasNumbersOnly(remaining[i])) {
                                if (options.arrayOfArrays) temp.push(parseFloat(remaining[i]))
                                else temp[props[i]] = parseFloat(remaining[i]);
                            } else if (remaining[i] === '') {
                                if (options.arrayOfArrays) temp.push(null);
                                else temp[props[i]] = null;
                            }
                        }
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

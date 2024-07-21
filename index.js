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

function parseArrayFromString(coordString) {
    const parts = coordString.slice(1, -1).split(';');
    if (hasNumbersOnly(coordString, '[;]')) {
        return parts.map(Number);
    } else if (hasLetters(coordString)) {
        return parts.map(String);
    }
};

module.exports.parseCsv = ({ filePath }) => {
    let remaining = '';
    let fileData = [];
    let props;

    return new Promise((resolve, reject) => {
        try {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return resolve(`File not found - ${filePath}`);
                }

                const fileStream = fs.createReadStream(filePath, 'utf8');
                fileStream.on('data', function (chunk) {
                    remaining += chunk;
                    props = remaining.substring(0, remaining.indexOf('\n')).replace('\r', '').split(',');
                    let last = remaining.indexOf('\n') + 1;
                    let index = remaining.indexOf('\n', last);

                    while (index > -1) {
                        let temp = {};
                        if (last !== 0) {
                            const line = remaining.substring(last, index).replace('\r', '').split(',');
                            last = index + 1;
                            for (let i = 0; i < line.length; i++) {
                                if (line[i][0] === '[' && line[i][line[i].length - 1] === ']') {
                                    if (hasNumbersOnly(line[i], '[;]')) {
                                        temp[props[i]] = parseArrayFromString(line[i]);
                                    } else if (hasLetters(line[i])) {
                                        temp[props[i]] = parseArrayFromString(line[i]);
                                    }
                                } else if (hasLetters(line[i])) {
                                    temp[props[i]] = line[i];
                                } else if (hasNumbersOnly(line[i])) {
                                    temp[props[i]] = parseFloat(line[i]);
                                } else if (line[i] === '') {
                                    temp[props[i]] = null;
                                }
                            }
                            fileData.push(temp);
                            index = remaining.indexOf('\n', last);
                        }
                    }

                    remaining = remaining.substring(last);
                });

                fileStream.on('end', () => {
                    if (remaining !== '') {
                        let temp = {};
                        remaining = remaining.split(',');
                        for (let i = 0; i < remaining.length; i++) {
                            if (hasLetters(remaining[i])) {
                                temp[props[i]] = remaining[i];
                            } else if (remaining[i][0] === '[' && remaining[i][remaining[i].length - 1] === ']') {
                                if (hasNumbersOnly(remaining[i], '[;]')) {
                                    temp[props[i]] = parseArrayFromString(remaining[i]);
                                }
                            } else if (hasNumbersOnly(remaining[i])) {
                                temp[props[i]] = parseFloat(remaining[i]);
                            } else if (remaining[i] === '') {
                                temp[props[i]] = null;
                            }
                        }
                        fileData.push(temp);
                    }
                    resolve(fileData);
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

const { addRow } = require('./lib/rows/addRow');
const { deleteRows } = require('./lib/rows/deleteRow');
const { editRow } = require('./lib/rows/editRow');
const { parse } = require('./lib/parse');
const { getFileTree } = require('./lib/files/getFileTree');
const { moveFile } = require('./lib/files/moveFile');
const { createFile } = require('./lib/files/createFile');
const { copyFile } = require('./lib/files/copyFile');
const { renameFile } = require('./lib/files/renameFile');
const { deleteFile } = require('./lib/files/deleteFile');
const { readFile } = require('./lib/files/readFile');
const { appendToFile } = require('./lib/files/appendToFile');
const { validateCSV } = require('./lib/validateCSV');
const { batchOperations } = require('./lib/batchOperations');
const { watchFile, watchDirectory } = require('./lib/watch');
const { loadConfig, mergeConfig, getDefaultConfig } = require('./lib/config');

module.exports = { 
    parse, 
    deleteRows, 
    addRow, 
    editRow, 
    getFileTree, 
    moveFile, 
    createFile,
    copyFile,
    renameFile,
    deleteFile,
    readFile,
    appendToFile,
    validateCSV,
    batchOperations,
    watchFile,
    watchDirectory,
    loadConfig,
    mergeConfig,
    getDefaultConfig
};

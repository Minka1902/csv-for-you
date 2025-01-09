const { addRow } = require('./lib/rows/addRow');
const { deleteRowInLine } = require('./lib/rows/deleteRow');
const { parse } = require('./lib/parse');

module.exports = { parse, deleteRowInLine, addRow };

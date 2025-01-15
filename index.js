const { addRow } = require('./lib/rows/addRow');
const { deleteRows } = require('./lib/rows/deleteRow');
const { editRow } = require('./lib/rows/editRow');
const { parse } = require('./lib/parse');

module.exports = { parse, deleteRows, addRow, editRow };

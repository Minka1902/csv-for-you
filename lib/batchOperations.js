const fs = require('fs');

/**
 * Execute batch operations from a configuration file or object
 * @param {Object|string} config - Configuration object or path to config file
 * @returns {Promise<Object>} Batch operation results
 */
module.exports.batchOperations = async (config) => {
    let operations;
    
    if (typeof config === 'string') {
        // Load from file
        if (!fs.existsSync(config)) {
            throw new Error(`Config file does not exist: ${config}`);
        }
        const configData = fs.readFileSync(config, 'utf8');
        operations = JSON.parse(configData);
    } else {
        operations = config;
    }

    if (!operations.operations || !Array.isArray(operations.operations)) {
        throw new Error('Config must contain an "operations" array');
    }

    const results = {
        success: [],
        failed: [],
        total: operations.operations.length
    };

    // Import operation modules
    const { parse } = require('./parse');
    const { addRow } = require('./rows/addRow');
    const { editRow } = require('./rows/editRow');
    const { deleteRows } = require('./rows/deleteRow');
    const { moveFile } = require('./files/moveFile');
    const { createFile } = require('./files/createFile');
    const { copyFile } = require('./files/copyFile');
    const { deleteFile } = require('./files/deleteFile');

    for (let i = 0; i < operations.operations.length; i++) {
        const op = operations.operations[i];
        
        try {
            let result;
            
            switch (op.type) {
                case 'parse':
                    result = await parse(op.file, op.options || {});
                    break;
                case 'addRow':
                    result = await addRow(op.file, op.data, op.options || {});
                    break;
                case 'editRow':
                    result = await editRow(op.file, op.edit);
                    break;
                case 'deleteRows':
                    result = await deleteRows(op.file, op.options || {});
                    break;
                case 'moveFile':
                    result = await moveFile(op.source, op.destination, op.options || {});
                    break;
                case 'copyFile':
                    result = await copyFile(op.source, op.destination, op.options || {});
                    break;
                case 'createFile':
                    result = await createFile(op.file, op.options || {});
                    break;
                case 'deleteFile':
                    result = await deleteFile(op.file);
                    break;
                default:
                    throw new Error(`Unknown operation type: ${op.type}`);
            }
            
            results.success.push({
                operation: i + 1,
                type: op.type,
                result
            });
        } catch (error) {
            results.failed.push({
                operation: i + 1,
                type: op.type,
                error: error.message
            });
            
            if (operations.stopOnError) {
                break;
            }
        }
    }

    return results;
};

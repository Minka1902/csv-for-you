#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
let api;
try {
    api = require('..'); // prefer built dist via package main
} catch (e1) {
    try {
        api = require('../index.js'); // fallback for local dev without build
    } catch (e2) {
        console.error('Unable to load library exports. Try running "npm run build".');
        process.exit(1);
    }
}

const pkg = (() => {
    try {
        const p = path.resolve(__dirname, '..', 'package.json');
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (_) { return { version: '0.0.0' }; }
})();

const program = new Command();
program
    .name('csvfy')
    .description('CSV-for-you CLI: parse, add, edit, delete rows, and file operations')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Display help for command')
    .showHelpAfterError('(add --help for additional information)')
    .configureHelp({ sortSubcommands: true, sortOptions: true })
    .version(pkg.version || '1.0.0');

program.addHelpText('after', `

Examples:
  # Parse CSV file
  csvfy parse ./data.csv

  # Add a new row
  csvfy add ./data.csv --data '{"name":"Alice","age":30}'

  # Edit existing row
  csvfy edit ./data.csv --line 2 --data '{"name":"Bob","age":31}'

  # Delete rows
  csvfy delete ./data.csv --row -1

  # File operations
  csvfy move ./old.csv ./new.csv
  csvfy copy ./data.csv ./backup.csv
  csvfy rename ./old.csv ./new.csv
  csvfy remove ./temp.csv
  csvfy create ./new.csv --content "name,age"
  csvfy read ./data.csv
  csvfy append ./data.csv --content "\\nCharlie,35"

  # Directory tree
  csvfy tree . --depth 3

  # Validate CSV
  csvfy validate ./data.csv --check-types

  # Batch operations
  csvfy batch ./batch-config.json

  # Watch for changes
  csvfy watch ./data.csv --command "csvfy parse ./data.csv"
`);

program.command('parse')
    .argument('<file>', 'CSV file path')
    .usage('<file> [options]')
    .option('--line-as-array', 'Return each line as array (default true)', true)
    .option('--file-as-array', 'Return file as array (default true)', true)
    .option('--return-as-string <props>', 'Comma-separated list of header names to keep as string')
    .option('--array-sep <char>', 'Separator used inside bracketed arrays (default ;)')
    .option('--object-sep <char>', 'Separator used inside braced objects (default ;)')
    .option('--compact', 'Output compact JSON (one line)')
    .action(async (file, opts) => {
        try {
            const options = {
                lineAsArray: !!opts.lineAsArray,
                fileAsArray: !!opts.fileAsArray,
                returnAsString: opts.returnAsString ? String(opts.returnAsString).split(',').map(s => s.trim()).filter(Boolean) : [],
                arraySeparator: opts.arraySep || undefined,
                objectSeparator: opts.objectSep || undefined,
            };
            const target = file === '-' ? await readStdinToTempFile() : file;
            assertFileReadable(target);
            const result = await api.parse(target, options);
            const indent = opts.compact ? 0 : 2;
            process.stdout.write(JSON.stringify(result, null, indent) + '\n');
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.command('add')
    .argument('<file>', 'CSV file path')
    .usage('<file> --data <json> [--line <n>]')
    .requiredOption('--data <json>', 'JSON object representing row values keyed by headers')
    .option('--line <n>', 'Insert at 1-based line; 0 to append (default 0)', '0')
    .action((file, opts) => {
        let data;
        try { data = JSON.parse(opts.data); } catch (e) {
            console.error('Invalid JSON for --data');
            process.exit(1);
        }
        const lineNumber = Number.parseInt(opts.line, 10);
        try {
            assertFileReadable(file);
            const out = api.addRow(file, data, { lineNumber: Number.isFinite(lineNumber) ? lineNumber : 0 });
            if (out && out.then) {
                out.then(() => process.exit(0)).catch((e) => { console.error(e?.message || e); process.exit(1); });
            }
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'add')?.addHelpText('after', `

Examples:
  csvfy add ./data.csv --data '{"name":"Alice","age":30}'
  csvfy add ./data.csv --data '{"name":"Alice","age":30}' --line 1
`);

program.command('edit')
    .argument('<file>', 'CSV file path')
    .usage('<file> --line <n> --data <json>')
    .requiredOption('--line <n>', '1-based line number to edit')
    .requiredOption('--data <json>', 'JSON object representing row values keyed by headers')
    .action((file, opts) => {
        const lineNumber = Number.parseInt(opts.line, 10);
        if (!Number.isFinite(lineNumber) || lineNumber < 1) {
            console.error('Invalid --line: must be integer >= 1');
            process.exit(1);
        }
        let data;
        try { data = JSON.parse(opts.data); } catch (e) {
            console.error('Invalid JSON for --data');
            process.exit(1);
        }
        try {
            assertFileReadable(file);
            api.editRow(file, { data, lineNumber });
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'edit')?.addHelpText('after', `

Examples:
  csvfy edit ./data.csv --line 2 --data '{"name":"Bob","age":31}'
`);

program.command('delete')
    .argument('<file>', 'CSV file path')
    .usage('<file> [--row <n>] [--count <n>]')
    .option('--row <n>', '1-based row to delete; -1 deletes from end', '-1')
    .option('--count <n>', 'How many rows to delete starting at --row', '1')
    .action((file, opts) => {
        const rowNumber = Number.parseInt(opts.row, 10);
        const rowsToDelete = Number.parseInt(opts.count, 10);
        try {
            assertFileReadable(file);
            api.deleteRows(file, { rowNumber, rowsToDelete, reportToConsole: true });
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'delete')?.addHelpText('after', `

Examples:
  csvfy delete ./data.csv --row -1
  csvfy delete ./data.csv --row 3 --count 2
`);

program.command('move')
    .argument('<source>', 'Source file path')
    .argument('<destination>', 'Destination file path')
    .usage('<source> <destination> [--overwrite]')
    .option('--overwrite', 'Overwrite destination if it exists')
    .action(async (source, destination, opts) => {
        try {
            assertFileReadable(source);
            const result = await api.moveFile(source, destination, { overwrite: !!opts.overwrite });
            console.log(result.message);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'move')?.addHelpText('after', `

Examples:
  csvfy move ./old.csv ./new.csv
  csvfy move ./data.csv ./backup/data.csv --overwrite
`);

program.command('create')

    .argument('<file>', 'File path to create')
    .usage('<file> [--content <text>] [--overwrite]')
    .option('--content <text>', 'Initial file content', '')
    .option('--overwrite', 'Overwrite file if it exists')
    .action(async (file, opts) => {
        try {
            const result = await api.createFile(file, { content: opts.content || '', overwrite: !!opts.overwrite });
            console.log(result.message);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'create')?.addHelpText('after', `

Examples:
  csvfy create ./new.csv
  csvfy create ./new.csv --content "name,age\\nAlice,30"
  csvfy create ./existing.csv --overwrite
`);

program.command('tree')
    .argument('[path]', 'Directory or file path', '.')
    .usage('[path] [--depth <n>] [--show-hidden]')
    .option('--depth <n>', 'Maximum depth to traverse', '3')
    .option('--show-hidden', 'Show hidden files and directories')
    .action(async (targetPath, opts) => {
        try {
            const depth = Number.parseInt(opts.depth, 10);
            const tree = await api.getFileTree(targetPath || '.', {
                depth: Number.isFinite(depth) ? depth : 3,
                showHidden: !!opts.showHidden
            });
            console.log(tree);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'tree')?.addHelpText('after', `

Examples:
  csvfy tree .
  csvfy tree ./src --depth 2
  csvfy tree ./project --depth 5 --show-hidden
`);

program.command('copy')
    .argument('<source>', 'Source file path')
    .argument('<destination>', 'Destination file path')
    .usage('<source> <destination> [--overwrite]')
    .option('--overwrite', 'Overwrite destination if it exists')
    .action(async (source, destination, opts) => {
        try {
            assertFileReadable(source);
            const result = await api.copyFile(source, destination, { overwrite: !!opts.overwrite });
            console.log(result.message);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'copy')?.addHelpText('after', `

Examples:
  csvfy copy ./data.csv ./data-backup.csv
  csvfy copy ./data.csv ./backup/data.csv --overwrite
`);

program.command('rename')
    .argument('<oldPath>', 'Current file path')
    .argument('<newPath>', 'New file path')
    .usage('<oldPath> <newPath> [--overwrite]')
    .option('--overwrite', 'Overwrite destination if it exists')
    .action(async (oldPath, newPath, opts) => {
        try {
            assertFileReadable(oldPath);
            const result = await api.renameFile(oldPath, newPath, { overwrite: !!opts.overwrite });
            console.log(result.message);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'rename')?.addHelpText('after', `

Examples:
  csvfy rename ./old-name.csv ./new-name.csv
  csvfy rename ./data.csv ./renamed-data.csv --overwrite
`);

program.command('remove')
    .argument('<file>', 'File path to delete')
    .usage('<file>')
    .action(async (file, opts) => {
        try {
            assertFileReadable(file);
            const result = await api.deleteFile(file);
            console.log(result.message);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'remove')?.addHelpText('after', `

Examples:
  csvfy remove ./old-file.csv
  csvfy remove ./temp/data.csv
`);

program.command('read')
    .argument('<file>', 'File path to read')
    .usage('<file> [--encoding <enc>]')
    .option('--encoding <enc>', 'File encoding', 'utf8')
    .action(async (file, opts) => {
        try {
            assertFileReadable(file);
            const content = await api.readFile(file, { encoding: opts.encoding });
            console.log(content);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'read')?.addHelpText('after', `

Examples:
  csvfy read ./data.csv
  csvfy read ./data.csv --encoding ascii
`);

program.command('append')
    .argument('<file>', 'File path to append to')
    .usage('<file> --content <text>')
    .requiredOption('--content <text>', 'Content to append')
    .action(async (file, opts) => {
        try {
            const result = await api.appendToFile(file, opts.content);
            console.log(result.message);
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'append')?.addHelpText('after', `

Examples:
  csvfy append ./data.csv --content "\\nBob,25"
  csvfy append ./log.txt --content "New log entry\\n"
`);

program.command('validate')
    .argument('<file>', 'CSV file path to validate')
    .usage('<file> [--check-headers] [--check-types] [--check-columns] [--expected <headers>]')
    .option('--check-headers', 'Check for header row', true)
    .option('--check-types', 'Validate data type consistency', false)
    .option('--check-columns', 'Validate column count consistency', true)
    .option('--expected <headers>', 'Comma-separated list of expected headers')
    .action(async (file, opts) => {
        try {
            assertFileReadable(file);
            const result = await api.validateCSV(file, {
                checkHeaders: !!opts.checkHeaders,
                checkTypes: !!opts.checkTypes,
                checkColumns: !!opts.checkColumns,
                expectedHeaders: opts.expected ? opts.expected.split(',').map(h => h.trim()) : null
            });
            
            console.log(`\nValidation ${result.valid ? 'PASSED ✓' : 'FAILED ✗'}\n`);
            console.log(`Stats:`);
            console.log(`  Total Rows: ${result.stats.totalRows}`);
            console.log(`  Total Columns: ${result.stats.totalColumns}`);
            console.log(`  Headers: ${result.stats.headers.join(', ')}`);
            
            if (result.errors.length > 0) {
                console.log(`\nErrors (${result.errors.length}):`);
                result.errors.forEach(err => console.log(`  ✗ ${err}`));
            }
            
            if (result.warnings.length > 0) {
                console.log(`\nWarnings (${result.warnings.length}):`);
                result.warnings.forEach(warn => console.log(`  ⚠ ${warn}`));
            }
            
            if (!result.valid) {
                process.exit(1);
            }
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'validate')?.addHelpText('after', `

Examples:
  csvfy validate ./data.csv
  csvfy validate ./data.csv --check-types
  csvfy validate ./data.csv --expected "name,age,email"
`);

program.command('batch')
    .argument('<config>', 'Path to batch configuration JSON file')
    .usage('<config>')
    .action(async (config, opts) => {
        try {
            const result = await api.batchOperations(config);
            
            console.log(`\nBatch Operations Complete`);
            console.log(`  Total: ${result.total}`);
            console.log(`  Success: ${result.success.length}`);
            console.log(`  Failed: ${result.failed.length}`);
            
            if (result.success.length > 0) {
                console.log(`\nSuccessful Operations:`);
                result.success.forEach(op => {
                    console.log(`  ✓ Operation ${op.operation} (${op.type})`);
                });
            }
            
            if (result.failed.length > 0) {
                console.log(`\nFailed Operations:`);
                result.failed.forEach(op => {
                    console.log(`  ✗ Operation ${op.operation} (${op.type}): ${op.error}`);
                });
                process.exit(1);
            }
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'batch')?.addHelpText('after', `

Examples:
  csvfy batch ./batch-config.json

Config file format:
{
  "operations": [
    { "type": "parse", "file": "./data.csv" },
    { "type": "addRow", "file": "./data.csv", "data": {"name":"Alice","age":30} }
  ],
  "stopOnError": true
}
`);

program.command('watch')
    .argument('<path>', 'File or directory to watch')
    .usage('<path> [--command <cmd>] [--debounce <ms>]')
    .option('--command <cmd>', 'Command to execute on change')
    .option('--debounce <ms>', 'Debounce delay in milliseconds', '100')
    .action(async (watchPath, opts) => {
        try {
            const isDir = fs.existsSync(watchPath) && fs.statSync(watchPath).isDirectory();
            const debounce = Number.parseInt(opts.debounce, 10) || 100;
            
            console.log(`Watching ${isDir ? 'directory' : 'file'}: ${watchPath}`);
            console.log(`Press Ctrl+C to stop\n`);
            
            const onChange = (filePath, eventType) => {
                console.log(`[${new Date().toLocaleTimeString()}] ${eventType}: ${filePath}`);
                
                if (opts.command) {
                    const { exec } = require('child_process');
                    exec(opts.command, (error, stdout, stderr) => {
                        if (stdout) console.log(stdout);
                        if (stderr) console.error(stderr);
                        if (error) console.error(`Error: ${error.message}`);
                    });
                }
            };
            
            const watcher = isDir 
                ? api.watchDirectory(watchPath, { onChange, debounce })
                : api.watchFile(watchPath, { onChange, debounce });
            
            // Keep process alive
            process.on('SIGINT', () => {
                console.log('\nStopping watcher...');
                watcher.stop();
                process.exit(0);
            });
        } catch (err) {
            console.error(err?.message || err);
            process.exit(1);
        }
    });

program.commands.find(c => c.name() === 'watch')?.addHelpText('after', `

Examples:
  csvfy watch ./data.csv
  csvfy watch ./src --command "npm test"
  csvfy watch ./data.csv --command "csvfy parse ./data.csv" --debounce 500
`);

program.parseAsync().catch((e) => {
    console.error(e?.message || e);
    process.exit(1);
});

function assertFileReadable(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }
    try { fs.accessSync(filePath, fs.constants.R_OK); }
    catch (_) {
        console.error(`File not readable: ${filePath}`);
        process.exit(1);
    }
}

function readStdinToTempFile() {
    return new Promise((resolve, reject) => {
        const tmp = path.join(require('os').tmpdir(), `csvfy-${Date.now()}.csv`);
        const ws = fs.createWriteStream(tmp);
        process.stdin.pipe(ws);
        ws.on('finish', () => resolve(tmp));
        ws.on('error', reject);
    });
}


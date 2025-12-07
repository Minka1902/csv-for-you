<div align="center">

# 📊 csv-for-you

### A powerful, developer-friendly CSV toolkit for Node.js

[![npm version](https://badge.fury.io/js/csv-for-you.svg)](https://www.npmjs.com/package/csv-for-you)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Parse • Validate • Transform • Automate**

[Quick Start](#quick-start) • [Documentation](#documentation) • [CLI Guide](#️cli-commands) • [Examples](#examples)

</div>

---

## 🎯 What is csv-for-you?

A complete CSV solution that goes beyond parsing. Whether you need to read, validate, transform, or automate CSV workflows, csv-for-you has you covered with both a powerful JavaScript API and an intuitive CLI.

### Why csv-for-you?

- 🚀 **Simple API** - Get started in seconds
- 💪 **TypeScript** - Full type definitions included
- 🎨 **Flexible** - Parse nested arrays & objects
- ✅ **Validation** - Built-in CSV structure checking
- 🔄 **Automation** - Batch operations & file watching
- 🖥️ **CLI** - All features from command line
- 📦 **Zero Config** - Works out of the box

---

## 📦 Installation

```bash
# For use in your project
npm install csv-for-you

# For global CLI access
npm install -g csv-for-you
```

---

## 🚀 Quick Start

### Your First Parse

```javascript
const csv = require('csv-for-you');

// Parse CSV to JSON
const data = await csv.parse('./employees.csv');
console.log(data);
// [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
```

### Common Tasks

```javascript
// ✏️ Add a row
await csv.addRow('./data.csv', { name: 'Charlie', age: 35 });

// 🔍 Validate structure
const result = await csv.validateCSV('./data.csv');
if (result.valid) console.log('✓ CSV is valid!');

// 📝 Edit existing data
csv.editRow('./data.csv', {
    lineNumber: 2,
    data: { name: 'Bob', age: 26 }
});

// 🗑️ Delete rows
csv.deleteRows('./data.csv', { rowNumber: -1 }); // Delete last row
```

### CLI Quick Start

```bash
# Parse and display
csvfy parse ./data.csv

# Add a row
csvfy add ./data.csv --data '{"name":"Diana","age":28}'

# Validate
csvfy validate ./data.csv --check-types

# Show help
csvfy --help
```

---

## 📚 Documentation

### Table of Contents

- [CSV Operations](#csv-operations)
  - [Parsing](#parsing)
  - [Adding Rows](#adding-rows)
  - [Editing Rows](#️editing-rows)
  - [Deleting Rows](#️deleting-rows)
  - [Validation](#validation)
- [File Operations](#file-operations)
- [Advanced Features](#advanced-features)
- [CLI Commands](#️cli-commands)
- [Configuration](#️configuration)

---

## CSV Operations

### 📖 Parsing

Convert CSV files to JSON with powerful customization options.

#### Basic Parsing

```javascript
const data = await csv.parse('./data.csv');
```

#### Advanced Parsing

```javascript
const data = await csv.parse('./data.csv', {
    arraySeparator: ';',      // How array items are separated
    objectSeparator: ';',     // How object properties are separated
    lineAsArray: false,       // Return objects instead of arrays
    fileAsArray: true,        // Return array of items
    returnAsString: ['id']    // Keep these fields as strings
});
```

#### Parsing Nested Data

CSV with nested arrays and objects:
```csv
name,scores,metadata
Alice,[85;90;95],{project:A;grade:excellent}
Bob,[75;80;88],{project:B;grade:good}
```

Parse it:
```javascript
const data = await csv.parse('./scores.csv', {
    arraySeparator: ';',
    objectSeparator: ';'
});

console.log(data);
// [
//   { 
//     name: 'Alice', 
//     scores: [85, 90, 95],
//     metadata: { project: 'A', grade: 'excellent' }
//   },
//   { 
//     name: 'Bob', 
//     scores: [75, 80, 88],
//     metadata: { project: 'B', grade: 'good' }
//   }
// ]
```

#### Using Callbacks

Transform data during parsing:
```javascript
const data = await csv.parse('./data.csv', {}, {
    lineCallback: (line) => {
        console.log('Processing line:', line);
        return line;
    },
    numberCallback: (num) => Math.round(num),
    stringCallback: (str) => str.trim().toUpperCase()
});
```

---

### ➕ Adding Rows

Add new data to your CSV files.

#### Append to End

```javascript
await csv.addRow('./data.csv', {
    name: 'Eve',
    age: 32,
    department: 'Sales'
});
```

#### Insert at Specific Line

```javascript
await csv.addRow('./data.csv', 
    { name: 'Frank', age: 29 },
    { lineNumber: 2 }  // Insert at line 2
);
```

---

### ✏️ Editing Rows

Modify existing rows in place.

```javascript
csv.editRow('./data.csv', {
    lineNumber: 3,     // Which row to edit (1-based)
    data: {
        name: 'Alice Smith',
        age: 31,
        department: 'Engineering'
    }
});
```

---

### 🗑️ Deleting Rows

Remove rows from your CSV.

```javascript
// Delete last row
csv.deleteRows('./data.csv', { rowNumber: -1 });

// Delete specific row
csv.deleteRows('./data.csv', { rowNumber: 5 });

// Delete multiple rows
csv.deleteRows('./data.csv', { 
    rowNumber: 3,
    rowsToDelete: 2  // Delete 2 rows starting at row 3
});
```

---

### ✅ Validation

Ensure your CSV files are properly formatted.

#### Basic Validation

```javascript
const result = await csv.validateCSV('./data.csv');

if (result.valid) {
    console.log('✓ CSV is valid!');
} else {
    console.log('✗ Errors:', result.errors);
}

console.log('Stats:', result.stats);
// { totalRows: 10, totalColumns: 4, headers: [...] }
```

#### Advanced Validation

```javascript
const result = await csv.validateCSV('./data.csv', {
    checkHeaders: true,              // Verify headers exist
    checkTypes: true,                // Check type consistency
    checkColumns: true,              // Validate column counts
    expectedHeaders: ['name', 'age'] // Required headers
});

// Check results
console.log('Valid:', result.valid);
console.log('Errors:', result.errors);
console.log('Warnings:', result.warnings);
```

---

## File Operations

Beyond CSV - powerful file management tools.

### 📝 File Management

```javascript
// Create a file
await csv.createFile('./new.csv', {
    content: 'name,age\nAlice,30',
    overwrite: false
});

// Read file contents
const content = await csv.readFile('./data.csv');

// Append data
await csv.appendToFile('./data.csv', '\nBob,25');

// Copy file
await csv.copyFile('./data.csv', './backup.csv');

// Move file
await csv.moveFile('./old.csv', './new.csv');

// Rename file
await csv.renameFile('./old-name.csv', './new-name.csv');

// Delete file
await csv.deleteFile('./temp.csv');
```

### 🌳 Directory Tree

Visualize your directory structure:

```javascript
const tree = await csv.getFileTree('.', {
    depth: 3,
    showHidden: false
});

console.log(tree);
// ├── 📁 src
// │   ├── 📄 index.js
// │   └── 📄 utils.js
// └── 📄 package.json
```

---

## Advanced Features

### 🔄 Batch Operations

Execute multiple operations from a single configuration.

**Create a config file** (`batch-config.json`):
```json
{
  "operations": [
    {
      "type": "createFile",
      "file": "./output.csv",
      "options": { "content": "name,age\n", "overwrite": true }
    },
    {
      "type": "addRow",
      "file": "./output.csv",
      "data": { "name": "Alice", "age": 30 }
    },
    {
      "type": "validate",
      "file": "./output.csv"
    }
  ],
  "stopOnError": true
}
```

**Run it**:
```javascript
const result = await csv.batchOperations('./batch-config.json');

console.log(`✓ ${result.success.length} operations succeeded`);
console.log(`✗ ${result.failed.length} operations failed`);
```

### 👀 File Watching

Automatically react to file changes.

```javascript
const watcher = csv.watchFile('./data.csv', {
    onChange: (filePath, eventType) => {
        console.log(`File changed: ${filePath}`);
        // Re-parse or process the file
    },
    debounce: 100
});

// Stop watching when done
watcher.stop();
```

### ⚙️ Configuration Files

Create a `.csvfyrc.json` in your project:

```json
{
  "arraySeparator": "|",
  "objectSeparator": "^",
  "depth": 5,
  "lineAsArray": false
}
```

Load and use it:
```javascript
const config = csv.loadConfig();
const merged = csv.mergeConfig(config, { depth: 10 });
```

---

## 🖥️ CLI Commands

All features available from the command line!

### CSV Commands

```bash
# Parse CSV to JSON
csvfy parse ./data.csv
csvfy parse ./data.csv --compact

# Add a row
csvfy add ./data.csv --data '{"name":"Alice","age":30}'

# Edit a row
csvfy edit ./data.csv --line 2 --data '{"name":"Bob","age":26}'

# Delete rows
csvfy delete ./data.csv --row -1
csvfy delete ./data.csv --row 3 --count 2

# Validate
csvfy validate ./data.csv
csvfy validate ./data.csv --check-types --expected "name,age,email"
```

### File Commands

```bash
# Create file
csvfy create ./new.csv --content "name,age"

# Read file
csvfy read ./data.csv

# Append
csvfy append ./data.csv --content "\nCharlie,35"

# Copy, move, rename
csvfy copy ./data.csv ./backup.csv
csvfy move ./old.csv ./new.csv
csvfy rename ./old.csv ./new.csv

# Delete
csvfy remove ./temp.csv

# Directory tree
csvfy tree .
csvfy tree ./src --depth 2 --show-hidden
```

### Advanced Commands

```bash
# Batch operations
csvfy batch ./batch-config.json

# Watch for changes
csvfy watch ./data.csv
csvfy watch ./src --command "npm test"
```

### Getting Help

```bash
# General help
csvfy --help

# Command-specific help
csvfy parse --help
csvfy validate --help
```

---

## 💡 Examples

### Example 1: Data Processing Pipeline

```javascript
// Read → Validate → Transform → Save
const data = await csv.parse('./input.csv');

const validation = await csv.validateCSV('./input.csv', {
    checkTypes: true,
    expectedHeaders: ['name', 'email', 'age']
});

if (validation.valid) {
    // Add processed timestamp
    for (const row of data) {
        await csv.addRow('./output.csv', {
            ...row,
            processedAt: new Date().toISOString()
        });
    }
}
```

### Example 2: Automated Backup System

```javascript
const watcher = csv.watchDirectory('./data', {
    onChange: async (filePath) => {
        if (filePath.endsWith('.csv')) {
            const backupPath = filePath.replace('.csv', `-backup-${Date.now()}.csv`);
            await csv.copyFile(filePath, backupPath);
            console.log(`✓ Backed up: ${filePath}`);
        }
    }
});
```

### Example 3: CSV Report Generator

```javascript
// Generate monthly report
await csv.createFile('./report.csv', {
    content: 'month,sales,revenue\n',
    overwrite: true
});

const months = ['Jan', 'Feb', 'Mar'];
for (const month of months) {
    await csv.addRow('./report.csv', {
        month,
        sales: Math.floor(Math.random() * 1000),
        revenue: Math.floor(Math.random() * 50000)
    });
}

// Validate the report
const result = await csv.validateCSV('./report.csv');
console.log(`Report generated: ${result.stats.totalRows} rows`);
```

---

## 🎓 Learn More

### Run the Demo

See all features in action:

```bash
node demo.js
```

This interactive demo showcases all 21 functions with real examples!

### TypeScript Support

```typescript
import { parse, validateCSV, ParseOptions, ValidationResult } from 'csv-for-you';

const options: ParseOptions = {
    lineAsArray: false,
    fileAsArray: true
};

const data = await parse('./data.csv', options);
const validation: ValidationResult = await validateCSV('./data.csv');
```

---

## 📄 License

ISC License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📮 Support

- **Issues**: [GitHub Issues](https://github.com/Minka1902/csv-for-you/issues)
- **Email**: minka.scharff@gmail.com

---

<div align="center">

**Made with ❤️ by Michael Scharff**

[⭐ Star on GitHub](https://github.com/Minka1902/csv-for-you) • [📦 View on NPM](https://www.npmjs.com/package/csv-for-you)

</div>

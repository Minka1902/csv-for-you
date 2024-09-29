# csv-for-you
This npm package is used by nodeJS developers for parsing CSV files into JSON objects, arrays numbers or strings.</br>
If you liked the package please star and follow me on GitHub

## Installation
1) Run `npm install csv-for-you`.
2) Fork the git repository `https://github.com/Minka1902/csv-for-you.git`, and place it next to your project.

## Usage
1) In your entry point, import parseCsv from the package: `const parseCsv = require('csv-for-you');`
2) Define your function as follows:
```jsx
    const csv = require('csv-for-you');
    const defaultOptions = {
        arraySeparator: ';',
        objectSeparator: ';',
        lineAsArray: true,
        fileAsArray: true,
        returnAsString: []
    };
    const options2 = {
        arraySeparator: '|',
        objectSeparator: '^',
        lineAsArray: false,
        fileAsArray: true,
        returnAsString: ['name', 'ID']
    };

    async function myFunction() {
        const myCsvFileData = await csv.parse('C:\\path\\to\\my\\file.csv', defaultOptions );
        const otherCsvFileData = await csv.parse('C:\\path\\to\\other\\file.csv', options2 );
        // Use the data however you'd like
    };

    const myOtherFunction = async () => {
        const myCsvFileData = await csv.parse('C:\\path\\to\\my\\file.csv', defaultOptions );
        const otherCsvFileData = await csv.parse('C:\\path\\to\\other\\file.csv', options2 );
        // Use the data however you'd like
    };

    csv.addRow('C:\\path\\to\\my\\file.csv', { name: "john smith" } );
    csv.addRow('C:\\path\\to\\other\\file.csv', { name: "john smith" }, { lineNumber: 777 } );

```

## Options
This object contains the options for the CSV parser:
1) arraySeparator - the Char that represents the separator between Array elements (`;` by default)
2) objectSeparator - the Char that represents the separator between Object elements (`;` by default)
3) lineAsArray - Boolean that represents rather a line should be represented as an Array or Object (`true` by default)
4) fileAsArray - Boolean that represents rather the file should be represented as an Array or Object (`true` by default)
5) returnAsString - Array of property names that should be returned as a string (empty by default)

## Features
1) Parses strings in CSV
2) Parses numbers in CSV
3) Parses arrays - numbers, strings, arrays and objects
4) Parses objects - numbers, strings, arrays and objects
5) Add data with the `addRow` function

## CSV file format
1) Properties - The first line of the file must be the properties of the objects
2) Numbers - Any integer or float number
3) Strings - Strings of any length
4) Arrays - Must start with `[` and end with `]` while the separator is not `,`(arraySeparator in the options object to change)
5) Objects - Must start with `{` and end with `}` while the separator is not `,`(objectSeparator in the options object to change)
6) Values are separated by `,` and nothing else!
7) No need for whitespace after a coma - it might create problems

## Future features
1) Usage of callbacks for file/line/type of value
2) Parsing text to JSON
3) Fetching data from servers using URL
4) Reading file structure starting from a folder
5) Creating a CSV file from JSON object
6) Error notifier - Lets you know what is the problem
7) Generating numeric data to CSV or JSON
8) Generating lingual data to CSV or JSON

## Issues and Requests
For issues or feature requests go to https://github.com/Minka1902/csv-for-you/issues and add a new one.</br>
In the title write Request/Issue and elaborate in the description.</br>
I promise that i'll try my best to do everything.

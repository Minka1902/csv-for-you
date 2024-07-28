# csv-for-you
This npm package is used by nodeJS developers for parsing CSV files into JSON objects.</br>
If you liked the package please star and follow me on GitHub

## Installation
1) Run `npm install csv-for-you`.
2) Fork the git repository `https://github.com/Minka1902/csv-for-you.git`, and place it next to your project.

## Usage
1) In your entry point, import parseCsv from the package: `const { parseCsv } = require('csv-for-you');`
2) Define your function like follows:
```jsx
    const { parseCsv } = require('csv-for-you');

    async function myFunction() {
        const myCsvFileData = await parseCsv('C:\\path\\to\\my\\file.csv', { arraySeparator: ';', objectSeparator: ';', innerSeparator: '@', arrayOfArrays: true, returnArray: true, returnAsString: [] } );
        const otherCsvFileData = await parseCsv('C:\\path\\to\\other\\file.csv', { arraySeparator: '|', objectSeparator: '^', innerSeparator: '&', arrayOfArrays: false, returnArray: true, returnAsString: ['firstName', 'ID'] } );
        // Use the data however you'd like
    };
```

## Options
This object contains the options for the CSV parser:
1) arraySeparator - the Char that represents the separator between Array elements (`;` by default)
2) objectSeparator - the Char that represents the separator between Object elements (`;` by default)
3) arrayOfArrays - Boolean that represents rather a line should be represented as an Array or Object
4) returnArray - No-Function
5) returnAsString - Array of property names that should be returned as a string (empty by default)
6) innerSeparator - the Char that represents the separator of the inner Array/Object (`@` by default)

## Features
1) Parses strings in CSV
2) Parses numbers in CSV
3) Parses arrays - numbers, strings, arrays and objects
5) Parses objects - numbers, strings, arrays and objects

## CSV file format
1) Properties - The first line of the file must be the properties of the objects
2) Numbers - Any integer or float number
3) Strings - Strings of any length
4) Arrays - Must start with `[` and end with `]` while the separator is not `,`(arraySeparator in options to change)
5) Objects - Must start with `{` and end with `}` while the separator is not `,`(objectSeparator in options to change)
6) Values are separated by `,` and nothing else
7) No need for whitespace after a coma - it might create problems

## Future features
1) Parsing TSV files
2) Reading file structure starting from a folder
3) Parsing CSV/TSV from JSON
4) Error notifier - Lets you know what is the error
5) Generating numeric data to CSV/TSV or JSON
6) Generating lingual data to CSV/TSV or JSON

## Issues and Requests
For issues or feature requests go to https://github.com/Minka1902/csv-for-you/issues and add a new one.</br>
In the title write Request/Issue and elaborate in the description.</br>
I promise that i'll try my best to do everything.

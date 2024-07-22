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
        const myCsvFileData = await parseCsv('C:\\path\\to\\my\\file.csv', { arraySeparator: ';', objectSeparator: '@', arrayOfArrays: true, returnArray: true } );
        const otherCsvFileData = await parseCsv('C:\\path\\to\\other\\file.csv', { arraySeparator: '|', objectSeparator: ':', arrayOfArrays: false, returnArray: true } );
        // Use the data however you'd like
    };
```

## Options
This object contains the options for the CSV parser:
1) arraySeparator - the Char that represents the separator between Array elements (`;` by default)
2) objectSeparator - NO-FUNCTION
3) arrayOfArrays - Boolean that represents rather a line should be represented as an Array or Object
4) returnArray - No-Function

## Features
1) Parses strings in CSV
2) Parses numbers in CSV
3) Parses arrays of strings in CSV
4) Parses arrays of numbers in CSV

## CSV file format
1) Properties - The first line of the file must be the properties of the objects
2) Numbers - Any integer or float number
3) Strings - Strings of any length
4) Arrays - Must start with `[` and end with `]` while the separator is not `,`(arraySeparator in options to change)
5) Values are separated by `,` and nothing else
6) No need for whitespace after a coma - it might create problems

## Future features
1) Parsing Objects from the CSV file
2) Parsing CSV from JSON
3) Error notifier - Lets you know what is the error
4) Generating numeric data to CSV or JSON
5) Generating lingual data to CSV or JSON

## Issues and Requests
For issues or feature requests go to https://github.com/Minka1902/csv-for-you/issues and add a new one.</br>
In the title write Request/Issue and elaborate in the description.</br>
I promise that i'll try my best to do everything.

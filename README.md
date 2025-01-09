# csv-for-you
This npm package is used by nodeJS developers for parsing CSV files into JSON objects, arrays numbers or strings.</br>
Recently added the callback feature to this package, you can pass a callback function in your code and see it implemented.

## Installation
1) Run `npm install csv-for-you`.
2) Fork the git repository `https://github.com/Minka1902/csv-for-you.git`, and place it in your project`s root.

## Usage
1) In your entry point, import csv from the package: `const csv = require('csv-for-you');`
2) Use your function as follows:
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
        const myCsvFileData = await csv.parse('C:\\path\\to\\my\\file.csv', defaultOptions, { lineCallback: () => console.log("This is a callback for each line."), objectCallback: () => console.log("This is a callback for each OBJECT") } );
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
6) inCallbacks - Boolean that represents rather value callbacks should be implemented if there is a callback for the line/file (`true` by default)

## Features
1) Parses strings in CSV
2) Parses numbers in CSV
3) Parses arrays - numbers, strings, arrays and objects
4) Parses objects - numbers, strings, arrays and objects
5) Add data with the `addRow` function
6) callbacks - you can pass a callback function for each line and type of value:</br>
&ensp;a) number</br>
&ensp;b) string</br>
&ensp;c) array</br>
&ensp;d) object

## CSV file format
1) Properties - The first line of the file must be the properties of the objects
2) Numbers - Any integer or float number
3) Strings - Strings of any length
4) Arrays - Must start with `[` and end with `]` while the separator is not `,`(arraySeparator in the options object to change)
5) Objects - Must start with `{` and end with `}` while the separator is not `,`(objectSeparator in the options object to change)
6) Values are separated by `,` and nothing else!
7) No need for whitespace after a coma - it might create problems

## Future features
1) Parsing text to JSON
2) Fetching data from servers using URL
3) Reading file structure starting from a folder
4) Creating a CSV file from JSON object
5) Error notifier - Lets you know what is the problem
6) Generating numeric data to CSV or JSON
7) Generating lingual data to CSV or JSON

## Issues and Requests
For issues or feature requests go to https://github.com/Minka1902/csv-for-you/issues and add a new one.</br>
In the title write Request/Issue and elaborate in the description.

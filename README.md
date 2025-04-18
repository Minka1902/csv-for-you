# csv-for-you
This npm package is used by nodeJS developers for parsing CSV files into JSON objects, arrays numbers or strings.</br>
Recently added the callback feature to this package, you can pass a callback function in your code and see it implemented.

## Installation
1) Run `npm install csv-for-you`
2) Fork the git repository `https://github.com/Minka1902/csv-for-you.git`

## Usage
```jsx
    const csv = require('csv-for-you');
    const parseOptions = {
        arraySeparator: '|', // not required, default value is ';'
        objectSeparator: '^', // not required, default value is ';'
        lineAsArray: false, // not required, default value is 'true'
        fileAsArray: true, // not required, default value is 'true'
        returnAsString: ['name', 'ID'], // not required, default value is an empty array
        innerCallbacks: true, // not required, default value is 'true
    };

    const addOptions = {
        lineNumber: 0 // not required, default value is 0 (deletes first line)
    };

    const deleteOptions = {
        rowNumber: 5, // required! default value is -1
        rowsToDelete: 3 // not required, default value is 1
    };

    const editOptions = {
        data: { name: "john smith", age: 77 }, // required! must be an object
        lineNumber: 3 // required! must be an integer and bigger than 1
    };

    async function myFunction() {
        const myCsvFileData = await csv.parse('C:\\path\\to\\my\\file.csv', parseOptions, { lineCallback: yourLineCallback, objectCallback: yourObjectCallback } );
        // Use the data however you'd like
    };

    csv.addRow('C:\\path\\to\\my\\file.csv', { name: "john smith" }, addOptions );
    csv.editRow('C:\\path\\to\\my\\file.csv', editOptions );
    csv.deleteRow('C:\\path\\to\\other\\file.csv', deleteOptions);

```

## The parse options object
This object contains the parse function options.
1) arraySeparator - the Char that represents the separator between Array elements
2) objectSeparator - the Char that represents the separator between Object elements
3) lineAsArray - Boolean that represents rather a line should be represented as an Array or Object
4) fileAsArray - Boolean that represents rather the file should be represented as an Array or Object
5) returnAsString - Array of property names that should be returned as a string
6) innerCallbacks - Boolean that represents rather value callbacks should be implemented if there is a callback for the line/file

## Features
1) Parses strings in CSV
2) Parses numbers in CSV
3) Parses arrays - numbers, strings, arrays and objects
4) Parses objects - numbers, strings, arrays and objects
5) Add data with the `addRow` function
6) Delete data with the `deleteRow` function
7) Edit line with the `editRow` function
8) callbacks - you can pass a custom callback function for each line and type of value
9) getHeaders function - returns an array of the file headers

## CSV file format
1) Properties - The first line of the file must be the properties of the objects
2) Numbers - Any integer or float number
3) Strings - Strings of any length
4) Arrays - Must start with `[` and end with `]` while the separator is not `,`(`arraySeparator` in the options object to change)
5) Objects - Must start with `{` and end with `}` while the separator is not `,`(`objectSeparator` in the options object to change)
6) Values are separated by `,`

## Future features
1) Parsing text to JSON
2) Fetching data from servers using URL
3) Reading file structure starting from a folder
4) Creating a CSV file from JSON object
5) Error notifier - Lets you know what is the problem
6) Generating numeric data to CSV or JSON
7) Generating lingual data to CSV or JSON
8) Reading a specific value for example only the name property, or an array of properties

## Issues and Requests
For issues or feature requests go to https://github.com/Minka1902/csv-for-you/issues and add a new one.</br>
In the title write Request/Issue and elaborate in the description.

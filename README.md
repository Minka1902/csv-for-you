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
    async function myFunction() {
        const myCsvFileData = await parseCsv({ filePath: 'C:\\path\\to\\my\\file.csv' });
        // Use the data however you'd like
    };
```

## Features
1) Parses strings in CSV
2) Parses numbers in CSV
3) Parses arrays of strings in CSV
4) Parses arrays of numbers in CSV

## CSV file format
1) Properties - The first line of the file must be the properties of the objects.
2) Numbers - Any integer or float number.
3) Strings - Strings of any length.
4) Arrays - Must start with `[` and end with `]` while the separator is not `,` but `;`.
5) Values are separated by `,` and nothing else.

## Future features
1) Parsing Objects from the CSV file.
2) Adding the options property to the package.
3) Parsing CSV from JSON.

## Issues and Requests
For issues or requests go to https://github.com/Minka1902/csv-for-you/issues and add a new one.</br>
In the title write Request/Issue and elaborate in the description.</br>
I promise that i'll try my best to do everything.

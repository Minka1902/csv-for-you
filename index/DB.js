const fs = require('fs');
const path = require('path');

export default class localDB {
    constructor() {
        this.dbFolder = path.join(__dirname, 'localDB');

        // Ensure the localDB folder exists
        if (!fs.existsSync(this.dbFolder)) {
            fs.mkdirSync(this.dbFolder);
        }

        this.currentCollection = null;
    }

    switchCollection(collectionName) {
        this.currentCollection = collectionName;
        const collectionPath = path.join(this.dbFolder, `${collectionName}.csv`);

        // Create the collection file if it doesn't exist
        if (!fs.existsSync(collectionPath)) {
            fs.writeFileSync(collectionPath, 'id,data\n'); // Add headers for CSV
        }
    }

    createEntry(collectionName, data) {
        this.switchCollection(collectionName);
        const collectionPath = path.join(this.dbFolder, `${collectionName}.csv`);

        const entries = this.getEntries(collectionName);
        const newId = entries.length > 0 ? entries[entries.length - 1].id + 1 : 1;
        const entry = { id: newId, data: JSON.stringify(data) };

        const csvLine = `${entry.id},${entry.data}\n`;
        fs.appendFileSync(collectionPath, csvLine);

        return entry;
    }

    deleteEntry(collectionName, entryId) {
        const entries = this.getEntries(collectionName).filter((entry) => entry.id !== entryId);
        const collectionPath = path.join(this.dbFolder, `${collectionName}.csv`);

        const newContent = ['id,data', ...entries.map((entry) => `${entry.id},${JSON.stringify(entry.data)}`)].join('\n');
        fs.writeFileSync(collectionPath, newContent);
    }

    editEntry(collectionName, entryId, newData) {
        const entries = this.getEntries(collectionName);
        const entryIndex = entries.findIndex((entry) => entry.id === entryId);

        if (entryIndex === -1) {
            throw new Error(`Entry with id ${entryId} not found in collection ${collectionName}`);
        }

        entries[entryIndex].data = newData;
        const collectionPath = path.join(this.dbFolder, `${collectionName}.csv`);

        const newContent = ['id,data', ...entries.map((entry) => `${entry.id},${JSON.stringify(entry.data)}`)].join('\n');
        fs.writeFileSync(collectionPath, newContent);
    }

    getEntryById(collectionName, entryId) {
        const entries = this.getEntries(collectionName);
        const entry = entries.find((entry) => entry.id === entryId);

        if (!entry) {
            throw new Error(`Entry with id ${entryId} not found in collection ${collectionName}`);
        }

        return entry;
    }

    getEntries(collectionName) {
        this.switchCollection(collectionName);
        const collectionPath = path.join(this.dbFolder, `${collectionName}.csv`);

        const fileContent = fs.readFileSync(collectionPath, 'utf8');
        const lines = fileContent.split('\n').filter((line) => line.trim() !== '');

        return lines.slice(1).map((line) => {
            const [id, data] = line.split(',');
            return { id: parseInt(id, 10), data: JSON.parse(data) };
        });
    }

    createCollection(collectionName, properties) {
        if (!Array.isArray(properties)) {
            throw new Error('Properties must be an array of strings.');
        }

        const invalidProperties = properties.filter(prop => prop.startsWith('!') && prop.length === 1);
        if (invalidProperties.length > 0) {
            throw new Error(`Invalid property names: ${invalidProperties.join(', ')}`);
        }

        const collectionPath = path.join(this.dbFolder, `${collectionName}.csv`);
        if (fs.existsSync(collectionPath)) {
            throw new Error(`Collection ${collectionName} already exists.`);
        }

        const headers = ['id', ...properties.map(prop => prop.startsWith('!') ? prop.substring(1) : prop)];
        fs.writeFileSync(collectionPath, `${headers.join(',')}\n`);
    }

    deleteCollection(collectionName) {
        const collectionPath = path.join(this.dbFolder, `${collectionName}.csv`);

        if (fs.existsSync(collectionPath)) {
            fs.unlinkSync(collectionPath);
        } else {
            throw new Error(`Collection ${collectionName} does not exist.`);
        }
    }

    getAllCollections() {
        return fs.readdirSync(this.dbFolder)
            .filter((file) => file.endsWith('.csv'))
            .map((file) => path.basename(file, '.csv'));
    }

    getAllData() {
        const collections = this.getAllCollections();
        const data = {};

        collections.forEach((collection) => {
            data[collection] = this.getEntries(collection);
        });

        return data;
    }
}

class NoFileError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoFileError';
    }
}

module.exports = NoFileError;

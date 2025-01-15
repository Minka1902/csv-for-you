class InvalidLineNumberError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidLineNumberError';
    }
}

module.exports = InvalidLineNumberError;

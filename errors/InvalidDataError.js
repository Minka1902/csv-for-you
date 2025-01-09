class InvalidRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidRequestError';
    }
}

module.exports = InvalidRequestError;

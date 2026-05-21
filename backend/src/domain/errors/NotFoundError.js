const AppError = require('./AppError');

/**
 * Thrown when a requested resource does not exist.
 * Maps to HTTP 404.
 */
class NotFoundError extends AppError {
    constructor(resource, identifier) {
        super(`${resource} '${identifier}' not found`, 404);
        this.resource = resource;
        this.identifier = identifier;
    }
}

module.exports = NotFoundError;

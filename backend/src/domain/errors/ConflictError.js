const AppError = require('./AppError');

/**
 * Thrown when a resource with the same unique identifier already exists.
 * Maps to HTTP 409.
 */
class ConflictError extends AppError {
    constructor(resource, identifier) {
        super(`${resource} '${identifier}' already exists`, 409);
        this.resource = resource;
        this.identifier = identifier;
    }
}

module.exports = ConflictError;

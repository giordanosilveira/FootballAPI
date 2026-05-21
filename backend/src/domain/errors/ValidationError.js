const AppError = require('./AppError');

/**
 * Thrown when input data fails validation rules.
 * Maps to HTTP 400.
 */
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = ValidationError;

/**
 * Base class for all application errors.
 * Carries an HTTP statusCode so controllers can respond without
 * additional conditional logic.
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

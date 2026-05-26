const NotFoundError = require('../../../domain/errors/NotFoundError');
const ValidationError = require('../../../domain/errors/ValidationError');

class Delete {
    constructor(repository, options = {}) {
        this.repository = repository;
        this.resourceName = options.resourceName || 'Resource';
        this.validateId = options.validateId || this.defaultValidateId;
        this.notFoundErrorFactory = options.notFoundErrorFactory || ((id) => new NotFoundError(this.resourceName, id));
    }

    defaultValidateId(id) {
        if (!id) {
            throw new ValidationError('ID is required');
        }

        if (!Number.isInteger(id)) {
            throw new ValidationError('ID must be an integer');
        }
    }

    async execute(id) {
        this.validateId(id);

        const existingEntity = await this.repository.findById(id);
        if (!existingEntity) {
            throw this.notFoundErrorFactory(id);
        }

        await this.repository.delete(id);
    }
}

module.exports = Delete;
const ValidationError = require('../../../domain/errors/ValidationError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class GetById {
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

        const entity = await this.repository.findById(id);
        if (!entity) {
            throw this.notFoundErrorFactory(id);
        }

        return entity;
    }
}

module.exports = GetById;

const ConflictError = require('../../../domain/errors/ConflictError');
const ValidationError = require('../../../domain/errors/ValidationError');

class Create {
    constructor(repository, options = {}) {
        this.repository = repository;
        this.resourceName = options.resourceName || 'Resource';
        this.validateInput = options.validateInput || this.defaultValidateInput;
        this.uniqueField = options.uniqueField;
        this.getUniqueValue = options.getUniqueValue || ((input) => (this.uniqueField ? input[this.uniqueField] : undefined));
        this.findExistingEntity = options.findExistingEntity;
        this.conflictErrorFactory = options.conflictErrorFactory || ((identifier) => new ConflictError(this.resourceName, identifier));
    }

    defaultValidateInput(input) {
        if (!input || typeof input !== 'object') {
            throw new ValidationError('Input data must be an object');
        }
    }

    normalizeFindResult(result) {
        if (Array.isArray(result)) {
            return result.length ? result[0] : null;
        }

        return result || null;
    }

    async defaultFindExistingEntity(input) {
        if (!this.uniqueField) {
            return null;
        }

        const uniqueValue = this.getUniqueValue(input);
        if (uniqueValue === undefined || uniqueValue === null || uniqueValue === '') {
            return null;
        }

        const finderName = `findBy${this.uniqueField.charAt(0).toUpperCase()}${this.uniqueField.slice(1)}`;
        if (typeof this.repository[finderName] === 'function') {
            const result = await this.repository[finderName](uniqueValue);
            return this.normalizeFindResult(result);
        }

        if (typeof this.repository.findByField === 'function') {
            const field = this.uniqueField.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
            const result = await this.repository.findByField(field, uniqueValue);
            return this.normalizeFindResult(result);
        }

        throw new Error('Unique lookup strategy is not configured for this create use case');
    }

    async resolveExistingEntity(input) {
        if (typeof this.findExistingEntity === 'function') {
            const result = await this.findExistingEntity(input, this.repository);
            return this.normalizeFindResult(result);
        }

        return this.defaultFindExistingEntity(input);
    }

    async execute(input) {
        this.validateInput(input);

        const existingEntity = await this.resolveExistingEntity(input);
        if (existingEntity) {
            const identifier = this.getUniqueValue(input) ?? existingEntity.id ?? JSON.stringify(input);
            throw this.conflictErrorFactory(identifier, input, existingEntity);
        }

        const persist = this.repository.save || this.repository.create;
        if (typeof persist !== 'function') {
            throw new Error('Repository must implement save(entity) or create(entity)');
        }

        return persist.call(this.repository, input);
    }
}

module.exports = Create;
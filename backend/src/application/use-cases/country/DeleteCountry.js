const NotFoundError = require('../../../domain/errors/NotFoundError');
const ValidationError = require('../../../domain/errors/ValidationError');

class DeleteCountry {
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }

    async execute(id) {
        if (!id) {
            throw new ValidationError('ID is required');
        }

        // Validate that the ID is integer format
        if (!Number.isInteger(id)) {
            throw new ValidationError('ID must be an integer');
        }

        const existingCountry = await this.countryRepository.findById(id);
        if (!existingCountry) {
            throw new NotFoundError('Country', id);
        }

        await this.countryRepository.delete(id);
    }
}

module.exports = DeleteCountry;
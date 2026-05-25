const ValidationError = require('../../../domain/errors/ValidationError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class GetCountryById {
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

        const country = await this.countryRepository.findById(id);
        if (!country) {
            throw new NotFoundError('Country', id);
        }
        return country;
    }
}

module.exports = GetCountryById;

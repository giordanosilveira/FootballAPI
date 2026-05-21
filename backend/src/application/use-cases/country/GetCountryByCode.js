const NotFoundError = require('../../../domain/errors/NotFoundError');

class GetCountryByCode {
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }

    async execute(code) {
        const country = await this.countryRepository.findByCode(code);
        if (!country) {
            throw new NotFoundError('Country', code);
        }
        return country;
    }
}

module.exports = GetCountryByCode;
const ConflictError = require('../../../domain/errors/ConflictError');
const ValidationError = require('../../../domain/errors/ValidationError');

class CreateCountry {
  constructor(countryRepository) {
    this.countryRepository = countryRepository;
  }

  async execute({ name, code, flag }) {
    if (!name || !code) {
      throw new ValidationError('Name and code are required');
    }
    
    const existingCountry = await this.countryRepository.findByCode(code);
    if (existingCountry) {
      throw new ConflictError('Country', code);
    }
    
    const country = await this.countryRepository.create({ name, code, flag });
    return country;
  }
}

module.exports = CreateCountry;
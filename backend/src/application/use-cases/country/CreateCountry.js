const Create = require('../shared/Create');
const ValidationError = require('../../../domain/errors/ValidationError');

class CreateCountry extends Create {
  constructor(countryRepository) {
    super(countryRepository, {
      resourceName: 'Country',
      uniqueField: 'code',
      validateInput: (input) => {
        if (!input || typeof input !== 'object') {
          throw new ValidationError('Input data must be an object');
        }

        if (!input.name || !input.code) {
          throw new ValidationError('Name and code are required');
        }
      },
    });
  }
}

module.exports = CreateCountry;
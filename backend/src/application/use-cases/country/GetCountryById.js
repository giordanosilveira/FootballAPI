const GetById = require('../shared/GetById');

class GetCountryById extends GetById {
    constructor(countryRepository) {
        super(countryRepository, {
            resourceName: 'Country',
        });
    }
}

module.exports = GetCountryById;

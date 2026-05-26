const GetAll = require('../shared/GetAll');

class GetAllCountries extends GetAll {
    constructor(countryRepository) {
        super(countryRepository, {
            resourceName: 'Country',
        });
    }
}

module.exports = GetAllCountries;
const Update = require('../shared/Update');
class UpdateCountry extends Update {
    constructor(countryRepository) {
        super(countryRepository, {
            resourceName: 'Country',
        });
    }

}

module.exports = UpdateCountry;
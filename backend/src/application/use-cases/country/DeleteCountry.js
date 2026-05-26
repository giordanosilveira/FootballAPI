const Delete = require('../shared/Delete');

class DeleteCountry extends Delete {
    constructor(countryRepository) {
        super(countryRepository, {
            resourceName: 'Country',
        });
    }
}

module.exports = DeleteCountry;
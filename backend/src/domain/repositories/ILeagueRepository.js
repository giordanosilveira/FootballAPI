const IBaseRepository = require('./IBaseRepository');

class ICountryRepository extends IBaseRepository {
    constructor() {
        super();
    }
    
    async findByCode(code) {throw new Error('Method not implemented');}
}
module.exports = ICountryRepository;
const IBaseRepository = require('./IBaseRepository');

class ISeasonRepository extends IBaseRepository {
    constructor() {
        super();
    }

    async findByYear(year) {throw new Error('Method not implemented');}
}
module.exports = ISeasonRepository;

const IBaseRepository = require('./IBaseRepository');

class ILeagueRepository extends IBaseRepository {
    constructor() {
        super();
    }
    
    async findByCode(code) {throw new Error('Method not implemented');}
}
module.exports = ILeagueRepository;
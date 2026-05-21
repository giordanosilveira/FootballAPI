const IBaseRepository = require('./IBaseRepository');

class ILeagueRepository extends IBaseRepository {
    constructor() {
        super();
    }
    
    async findByLeagueId(leagueId) {throw new Error('Method not implemented');}
}
module.exports = ILeagueRepository;
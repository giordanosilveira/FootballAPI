const GetAll = require('../shared/GetAll');

class GetAllLeagues extends GetAll {
    constructor(leagueRepository) {
        super(leagueRepository, {
            resourceName: 'League',
        });
    }
}

module.exports = GetAllLeagues;
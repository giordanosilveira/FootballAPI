const GetById = require('../shared/GetById');

class GetLeagueById extends GetById {
    constructor(leagueRepository) {
        super(leagueRepository, {
            resourceName: 'League',
        });
    }
}

module.exports = GetLeagueById;

const Update = require('../shared/Update');

class UpdateLeague extends Update {
    constructor(leagueRepository) {
        super(leagueRepository, {
            resourceName: 'League',
        });
    }
}

module.exports = UpdateLeague;
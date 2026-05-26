const Delete = require('../shared/Delete');

class DeleteLeague extends Delete {
    constructor(leagueRepository) {
        super(leagueRepository, {
            resourceName: 'League',
        });
    }
}

module.exports = DeleteLeague;
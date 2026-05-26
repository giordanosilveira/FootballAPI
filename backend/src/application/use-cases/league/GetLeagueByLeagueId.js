const ValidationError = require('../../../domain/errors/ValidationError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class GetLeagueByLeagueId {
    constructor(leagueRepository) {
        this.leagueRepository = leagueRepository;
    }
    
    async execute(leagueId) {
        if (!leagueId) {
            throw new ValidationError('League ID is required');
        }

        const league = await this.leagueRepository.findByLeagueId(leagueId);
        if (!league) {
            throw new NotFoundError('League', leagueId);
        }

        return league;
    }
}

module.exports = GetLeagueByLeagueId;
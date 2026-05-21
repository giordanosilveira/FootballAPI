const BaseRepository = require('./BaseRepository');
const League = require('../../domain/entities/League');
const leagueQueries = require('../database/queries/leagueQueries');

class LeagueRepository extends BaseRepository {
    constructor() {
        super(leagueQueries, {
            allowedFindFields: ['id', 'league_id', 'name', 'type', 'country_id', 'created_at', 'updated_at'],
        });
    }

    async findByLeagueId(leagueId) {
        const leagues = await this.findByField('league_id', leagueId);
        return leagues.length ? leagues[0] : null;
    }

    toEntity(row) {
        return new League({
            id: row.id,
            name: row.name,
            country: row.country || { id: row.country_id },
            leagueId: row.league_id,
            type: row.type,
            logo: row.logo,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    toPersistence(entity) {
        return [
            entity.leagueId,
            entity.name,
            entity.type,
            entity.logo,
            entity.country_id || (entity.country ? entity.country.id : null),
        ];
    }
}

module.exports = LeagueRepository;
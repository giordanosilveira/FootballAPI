const BaseRepository = require('./BaseRepository');
const League = require('../../domain/entities/League');
const leagueQueries = require('../database/queries/leagueQueries');

class LeagueRepository extends BaseRepository {
    constructor() {
        super(leagueQueries);
    }

    toEntity(row) {
        return new League({
            id: row.id,
            name: row.name,
            country: row.country,
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
            entity.country ? entity.country.id : null,
        ];
    }
}

module.exports = LeagueRepository;
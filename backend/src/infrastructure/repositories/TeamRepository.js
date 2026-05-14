const BaseRepository = require('./BaseRepository');
const Team = require('../../domain/entities/Team');
const teamQueries = require('../database/queries/teamQueries');

class TeamRepository extends BaseRepository {
    constructor() {
        super(teamQueries);
    }

    toEntity(row) {
        return new Team({
            id: row.id,
            name: row.name,
            teamId: row.team_id,
            country: row.country,
            founded: row.founded,
            national: row.national,
            logo: row.logo,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }

    toPersistence(entity) {
        return [
            entity.teamId,
            entity.name,
            entity.country ? entity.country.id : null,
            entity.founded,
            entity.national,
            entity.logo,
        ];
    }
}

module.exports = TeamRepository;
const BaseRepository = require('./BaseRepository');
const Season = require('../../domain/entities/Season');
const seasonQueries = require('../database/queries/seasonQueries');

class SeasonRepository extends BaseRepository {
    constructor() {
        super(seasonQueries, {
            allowedFindFields: ['id', 'year', 'created_at', 'updated_at'],
        });
    }

    async findByYear(year) {
        const seasons = await this.findByField('year', year);
        return seasons.length ? seasons[0] : null;
    }

    toEntity(row) {
        return new Season({
            id: row.id,
            year: row.year,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    toPersistence(entity) {
        return [
            entity.year,
        ];
    }
}

module.exports = SeasonRepository;
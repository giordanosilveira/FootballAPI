const BaseRepository = require('./BaseRepository');
const Country = require('../../domain/entities/Country');
const countryQueries = require('../database/queries/countryQueries');

class CountryRepository extends BaseRepository {
    constructor() {
        super(countryQueries, {
            allowedFindFields: ['id', 'name', 'code', 'created_at', 'updated_at'],
        });
    }

    async findByCode(code) {
        const countries = await this.findByField('code', code);
        return countries.length ? countries[0] : null;
    }

    toEntity(row) {
        return new Country({
            id: row.id,
            name: row.name,
            code: row.code,
            flag: row.flag,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }

    toPersistence(entity) {
        return [
            entity.name,
            entity.code,
            entity.flag,
        ];
    }
}

module.exports = CountryRepository;

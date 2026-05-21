const IBaseRepository = require('../../domain/repositories/IBaseRepository');
const db = require('../database/connection');

class BaseRepository extends IBaseRepository {
    constructor(queries, options = {}) {
        super();
        this.queries    = queries;
        this.db         = db;
        this.allowedFindFields = new Set(options.allowedFindFields || []);
    }

    async findAll() {
        const rows = await this.db.manyOrNone(this.queries.findAll);
        return rows.map(row => this.toEntity(row));
    }

    async findById(id) {
        const row = await this.db.oneOrNone(this.queries.findById, [id]);
        return row ? this.toEntity(row) : null;
    }

    async findByField(field, value) {
        this.validateFindField(field);
        const rows = await this.db.manyOrNone(this.queries.findByField, [field, value]);
        return rows.map(row => this.toEntity(row));
    }

    async save(entity) {
        const saveQuery = this.queries.save || this.queries.create;
        if (!saveQuery) {
            throw new Error('Save query not configured');
        }

        const row = await this.db.one(saveQuery, this.toPersistence(entity));
        return this.toEntity(row);
    }

    async create(entity) {
        return this.save(entity);
    }

    async update(id, entity) {
        if (!this.queries.update) {
            throw new Error('Update query not configured');
        }

        const persisted = this.toPersistence(entity);
        const payload = Array.isArray(persisted)
            ? [id, ...persisted]
            : { id, ...persisted };
        const row = await this.db.oneOrNone(this.queries.update, payload);
        return row ? this.toEntity(row) : null;
    }

    async delete(id) {
        const result = await this.db.result(this.queries.delete, [id]);
        return result.rowCount > 0;
    }

    async exists(id) {
        const result = await this.db.one(this.queries.exists, [id]);
        return Boolean(result.exists);
    }

    async count() {
        const result = await this.db.one(this.queries.count);
        return Number(result.count);
    }

    toEntity(row) {
        return row;
    }

    toPersistence(entity) {
        if (!entity || typeof entity !== 'object') {
            throw new Error('Invalid entity for persistence mapping');
        }

        const saveQuery = this.queries.save || this.queries.create;
        const columns = this.extractInsertColumns(saveQuery);
        if (!columns.length) {
            return entity;
        }

        return columns.map((column) => {
            if (entity[column] !== undefined) {
                return entity[column];
            }

            const camelKey = this.toCamelCase(column);
            if (entity[camelKey] !== undefined) {
                return entity[camelKey];
            }

            return null;
        });
    }

    extractInsertColumns(query) {
        if (!query || typeof query !== 'string') {
            return [];
        }

        const match = query.match(/insert\s+into\s+[^()]+\(([^)]+)\)/i);
        if (!match || !match[1]) {
            return [];
        }

        return match[1]
            .split(',')
            .map((column) => column.trim().replace(/^"|"$/g, ''));
    }

    toCamelCase(value) {
        return value.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    }

    validateFindField(field) {
        if (typeof field !== 'string' || !/^[a-z_][a-z0-9_]*$/i.test(field)) {
            throw new Error('Invalid field name for query');
        }

        if (!this.allowedFindFields.size) {
            return;
        }

        if (!this.allowedFindFields.has(field)) {
            throw new Error(`Field not allowed for findByField: ${field}`);
        }
    }
}

module.exports = BaseRepository;
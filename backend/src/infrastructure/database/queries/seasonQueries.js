const seasonQueries = {
    findAll: `
        SELECT * FROM seasons
        ORDER BY id;
    `,

    findById: `
        SELECT * FROM seasons
        WHERE id = $1;
    `,

    findByField: `
        SELECT * FROM seasons
        WHERE $1:name = $2;
    `,

    save: `
        INSERT INTO seasons (year, updated_at)
        VALUES ($1, NOW())
        ON CONFLICT (year) DO UPDATE
        SET updated_at = NOW()
        RETURNING *;    
    `,

    update: `
        UPDATE seasons
        SET year = $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `,

    delete: `
        DELETE FROM seasons
        WHERE id = $1;
    `,

    exists: `
        SELECT EXISTS (
            SELECT 1 FROM seasons
            WHERE id = $1
        );
    `,

    count: `
        SELECT COUNT(*) FROM seasons;
    `
};
module.exports = seasonQueries;
const countryQueries = {
    findAll: `
        SELECT * FROM countries
        ORDER BY id;
    `,

    findById: `
        SELECT * FROM countries
        WHERE id = $1;
    `,

    findByField: `
        SELECT * FROM countries
        WHERE $1:name = $2;
    `,

    save: `
        INSERT INTO countries (name, code, flag, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (code) DO UPDATE SET 
            name        = EXCLUDED.name,
            flag        = EXCLUDED.flag,
            updated_at  = NOW()
        RETURNING *;
    `,

    update: `
        UPDATE countries
        SET name = $2,
            code = $3,
            flag = $4,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `,

    delete: `
        DELETE FROM countries
        WHERE id = $1;
    `,

    exists: `
        SELECT EXISTS (
            SELECT 1 FROM countries
            WHERE id = $1
        );
    `,

    count: `
        SELECT COUNT(*) FROM countries;
    `
};
module.exports = countryQueries;
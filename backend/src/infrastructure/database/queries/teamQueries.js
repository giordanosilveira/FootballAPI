const teamQueries = {
    findAll: `
        SELECT * FROM teams
        ORDER BY id;
    `,

    findById: `
        SELECT * FROM teams
        WHERE id = $1;
    `,

    findByField: `
        SELECT * FROM teams
        WHERE $1:name = $2;
    `,

    save: `
        INSERT INTO teams (team_id, name, country_id, founded, national, logo, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (team_id) DO UPDATE SET 
            name        = EXCLUDED.name,
            country_id  = EXCLUDED.country_id,
            founded     = EXCLUDED.founded,
            national    = EXCLUDED.national,
            logo        = EXCLUDED.logo,
            updated_at  = NOW()
        RETURNING *;
    `,

    delete: `
        DELETE FROM teams
        WHERE id = $1;
    `,

    exists: `
        SELECT EXISTS (
            SELECT 1 FROM teams
            WHERE id = $1
        );
    `,

    count: `
        SELECT COUNT(*) FROM teams;
    `
};
module.exports = teamQueries;
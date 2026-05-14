const leagueQueries = {
    findAll: `
        SELECT * FROM leagues
        ORDER BY id;
    `,

    findById: `
        SELECT * FROM leagues
        WHERE id = $1;
    `,

    findByField: `
        SELECT * FROM leagues
        WHERE $1:name = $2;
    `,

    save: `
        INSERT INTO leagues (league_id, name, type, logo, country_id, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (league_id) DO UPDATE SET 
            name = EXCLUDED.name,
            type = EXCLUDED.type,
            logo = EXCLUDED.logo,
            country_id = EXCLUDED.country_id,
            updated_at = NOW()
        RETURNING *;    
    `,

    delete: `
        DELETE FROM leagues
        WHERE id = $1;
    `,

    exists: `
        SELECT EXISTS (
            SELECT 1 FROM leagues
            WHERE id = $1
        );
    `,

    count: `
        SELECT COUNT(*) FROM leagues;
    `
};
module.exports = leagueQueries;
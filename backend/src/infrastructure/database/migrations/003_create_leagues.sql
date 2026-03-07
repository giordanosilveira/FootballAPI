CREATE TABLE IF NOT EXISTS leagues (
    id         SERIAL PRIMARY KEY,
    league_id  INT          NOT NULL UNIQUE,
    name       VARCHAR(255) NOT NULL,
    type       VARCHAR(255) NOT NULL,
    logo       VARCHAR(255) NOT NULL DEFAULT '',
    country_id INT          NOT NULL,
    created_at TIMESTAMP    DEFAULT NOW(),
    updated_at TIMESTAMP    DEFAULT NOW(),

    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leagues_country_id ON leagues(country_id);
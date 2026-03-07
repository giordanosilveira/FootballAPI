CREATE TABLE IF NOT EXISTS teams (
    id         SERIAL       PRIMARY KEY,
    team_id    INT          NOT NULL UNIQUE,
    name       VARCHAR(255) NOT NULL,
    country_id INT          NOT NULL,
    founded    INT          NOT NULL,
    national   BOOLEAN      NOT NULL,
    logo       VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP    DEFAULT NOW(),
    updated_at TIMESTAMP    DEFAULT NOW(),
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);
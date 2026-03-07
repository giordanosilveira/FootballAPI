const Base = require('./Base');

class Team extends Base {
    constructor({id, name, teamId, country, founded, national, logo, created_at, updated_at}) {
        super({id, created_at, updated_at});
        this.name = name;
        this.teamId = teamId;
        this.country = country;
        this.founded = founded;
        this.national = national;
        this.logo = logo;
    }
}
module.exports = Team;

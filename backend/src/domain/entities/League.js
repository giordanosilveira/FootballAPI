const Base = require('./Base');

class League extends Base {
    constructor({id, leagueId, name, type, logo, country, createdAt, updatedAt}) {
        super({id, createdAt, updatedAt});
        this.name = name;
        this.country = country;
        this.leagueId = leagueId;
        this.type = type;
        this.logo = logo;
    }
}
module.exports = League;

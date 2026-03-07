const Base = require('./Base');

class Season extends Base {
    constructor({id, year, createdAt, updatedAt}) {
        super({id, createdAt, updatedAt});
        this.year = year;
    }
}
module.exports = Season;
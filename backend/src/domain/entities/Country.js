const Base = require('./Base');

class Country extends Base {
    constructor({id, name, code, flag, created_at, updated_at}) {
        super({id, created_at, updated_at});
        this.name = name;
        this.code = code;
        this.flag = flag;
    }
}
module.exports = Country;
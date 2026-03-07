class Base {
    constructor({id = null, created_at = null, updated_at = null}) {
        if (new.target === Base) {
            throw new TypeError("Cannot construct Base instances directly");
        }
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
module.exports = Base;
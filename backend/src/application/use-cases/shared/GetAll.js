class GetAll {
    constructor(repository, options = {}) {
        this.repository = repository;
        this.resourceName = options.resourceName || 'Resource';
    }

    async execute() {
        return await this.repository.findAll();
    }
}

module.exports = GetAll;
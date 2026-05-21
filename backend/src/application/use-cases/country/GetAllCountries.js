class GetAllCountries {
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }

    async execute() {
        return await this.countryRepository.findAll();
    }
}

module.exports = GetAllCountries;
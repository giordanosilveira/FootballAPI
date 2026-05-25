const CreateCountry = require('../use-cases/country/CreateCountry');
const GetAllCountries = require('../use-cases/country/GetAllCountries');
const GetCountryByCode = require('../use-cases/country/GetCountryByCode');
const GetCountryById = require('../use-cases/country/GetCountryById');
const UpdateCountry = require('../use-cases/country/UpdateCountry');
const DeleteCountry = require('../use-cases/country/DeleteCountry');

class CountryService {
    constructor(countryRepository) {
        this.createCountryUseCase = new CreateCountry(countryRepository);
        this.getAllCountriesUseCase = new GetAllCountries(countryRepository);
        this.getCountryByCodeUseCase = new GetCountryByCode(countryRepository);
        this.getCountryByIdUseCase = new GetCountryById(countryRepository);
        this.updateCountryUseCase = new UpdateCountry(countryRepository);
        this.deleteCountryUseCase = new DeleteCountry(countryRepository);
    }

    async create(payload) {
        return this.createCountryUseCase.execute(payload);
    }

    async getAll() {
        return this.getAllCountriesUseCase.execute();
    }

    async getByCode(code) {
        return this.getCountryByCodeUseCase.execute(code);
    }

    async getById(id) {
        return this.getCountryByIdUseCase.execute(id);
    }

    async update(id, payload) {
        return this.updateCountryUseCase.execute(id, payload);
    }

    async delete(id) {
        return this.deleteCountryUseCase.execute(id);
    }
}

module.exports = CountryService;

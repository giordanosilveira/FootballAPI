class CountryController {
    constructor({ countryService }) {
        this.countryService = countryService;

        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getByCode = this.getByCode.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req, res) {
        try {
            const country = await this.countryService.create(req.body);
            res.status(201).json(country);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const countries = await this.countryService.getAll();
            res.json(countries);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    async getByCode(req, res) {
        try {
            const country = await this.countryService.getByCode(req.params.code);
            res.json(country);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const country = await this.countryService.getById(Number(req.params.id));
            res.json(country);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const country = await this.countryService.update(Number(req.params.id), req.body);
            res.json(country);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await this.countryService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}

module.exports = CountryController;
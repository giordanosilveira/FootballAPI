const Create = require('../shared/Create');
const ValidationError = require('../../../domain/errors/ValidationError');

class CreateLeague extends Create {
    constructor(leagueRepository) {
        super(leagueRepository, {
            resourceName: 'League',
            uniqueField: 'leagueId',
            getUniqueValue: (input) => input.leagueId,
            findExistingEntity: async (input, repository) => repository.findByLeagueId(input.leagueId),
            validateInput: (input) => {
                if (!input || typeof input !== 'object') {
                    throw new ValidationError('Input data must be an object');
                }

                if (!input.leagueId || !input.name) {
                    throw new ValidationError('LeagueId and name are required');
                }

                const hasCountryId = input.country_id || input.countryId || (input.country && input.country.id);
                if (!hasCountryId) {
                    throw new ValidationError('Country is required');
                }
            },
        });
    }

    async execute(input) {
        const normalizedInput = { ...input };

        if (normalizedInput.countryId !== undefined && normalizedInput.country_id === undefined) {
            normalizedInput.country_id = normalizedInput.countryId;
            delete normalizedInput.countryId;
        }

        return super.execute(normalizedInput);
    }
}

module.exports = CreateLeague;
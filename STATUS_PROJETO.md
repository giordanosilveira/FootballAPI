# Status do Projeto - FootballAPI

Data: 2026-05-20

## Objetivo deste documento
Registrar o estado real do backend ao final do dia, consolidando o que ja foi concluido e o que fica como proximo passo.

## Resumo executivo
- Arquitetura em camadas mantida: domain, application e infrastructure.
- Camada de repositorios foi estabilizada com contratos e queries de update.
- Use-cases de Country foram criados na camada de application.
- Erros customizados foram introduzidos no dominio e ja estao sendo usados em parte dos use-cases.
- Camada HTTP de Country (controllers e routes) ainda nao foi implementada.

## O que foi concluido

### 1) Repositorios e contratos (rodada Priority 1)
Arquivos principais:
- backend/src/infrastructure/repositories/BaseRepository.js
- backend/src/infrastructure/repositories/CountryRepository.js
- backend/src/infrastructure/repositories/LeagueRepository.js
- backend/src/infrastructure/repositories/SeasonRepository.js
- backend/src/infrastructure/repositories/TeamRepository.js
- backend/src/domain/repositories/IBaseRepository.js
- backend/src/domain/repositories/ILeagueRepository.js

Concluido:
- BaseRepository com metodos findAll, findById, findByField, save, update, delete, exists e count.
- save com fallback para queries.save ou queries.create.
- create mantido como alias de save no repositorio base.
- toPersistence com mapeamento por colunas do INSERT e suporte a snake_case/camelCase.
- validacao de campo dinamico em findByField com whitelist por entidade (allowedFindFields).
- contrato de ILeagueRepository corrigido.

### 2) Queries SQL por entidade
Arquivos:
- backend/src/infrastructure/database/queries/countryQueries.js
- backend/src/infrastructure/database/queries/leagueQueries.js
- backend/src/infrastructure/database/queries/seasonQueries.js
- backend/src/infrastructure/database/queries/teamQueries.js

Concluido:
- findByField com identificador dinamico seguro ($1:name).
- query update adicionada para Country, League, Season e Team.

### 3) Use-cases de Country
Arquivos:
- backend/src/application/use-cases/country/CreateCountry.js
- backend/src/application/use-cases/country/GetAllCountries.js
- backend/src/application/use-cases/country/GetCountryByCode.js
- backend/src/application/use-cases/country/GetCountryById.js
- backend/src/application/use-cases/country/UpdateCountry.js
- backend/src/application/use-cases/country/DeleteCountry.js

Concluido:
- Casos de uso de CRUD e consulta por codigo criados.
- Validacoes basicas de entrada para cenarios com id.
- Uso de erro de dominio em casos de not found e validacao.

### 4) Erros customizados de dominio
Arquivos:
- backend/src/domain/errors/AppError.js
- backend/src/domain/errors/NotFoundError.js
- backend/src/domain/errors/ValidationError.js
- backend/src/domain/errors/ConflictError.js

Concluido:
- Hierarquia de erros de dominio criada.
- AppError com statusCode para facilitar tratamento HTTP.
- Use-cases de Country ja comecaram a usar esses erros.

## Estado atual da camada HTTP
Arquivos:
- backend/src/infrastructure/http/controllers
- backend/src/infrastructure/http/routes

Status:
- Ainda vazios.
- server.js contem apenas endpoints de health e health/db.
- Nao ha wiring de DI para instanciar repositorio + use-cases + controller + rotas de Country.

## Validacoes executadas
- Smoke test previo de repositorios e queries: OK.
- Smoke test atual de carregamento dos use-cases de Country e erros customizados: OK.

Comando de validacao executado hoje:
cd backend && node -e "require('./src/application/use-cases/country/CreateCountry'); require('./src/application/use-cases/country/DeleteCountry'); require('./src/application/use-cases/country/GetAllCountries'); require('./src/application/use-cases/country/GetCountryByCode'); require('./src/application/use-cases/country/GetCountryById'); require('./src/application/use-cases/country/UpdateCountry'); require('./src/domain/errors/AppError'); require('./src/domain/errors/ConflictError'); require('./src/domain/errors/NotFoundError'); require('./src/domain/errors/ValidationError'); console.log('country-use-cases-and-errors-ok')"

Resultado:
country-use-cases-and-errors-ok

## Pendencias reais para a retomada
- Implementar CountryController na camada HTTP.
- Implementar countryRoutes e registrar no server.js.
- Criar middleware global de tratamento de erro (AppError -> statusCode; fallback 500).
- Ajustar consistencia de uso do ConflictError em CreateCountry (assinatura esperada: resource e identifier).
- Revisar export de GetCountryById para garantir padrao igual aos demais use-cases.
- Opcional: remover metodo create de BaseRepository no futuro e padronizar chamadas para save, para aderencia estrita ao contrato de IBaseRepository.

## Proximo passo recomendado
Subir a vertical completa de Country na HTTP:
1. Criar CountryController chamando os use-cases.
2. Criar countryRoutes com endpoints REST.
3. Registrar rotas em server.js.
4. Adicionar error handler global baseado em AppError.
5. Validar com testes de rota (health, CRUD Country, cenarios de erro 400/404/409).

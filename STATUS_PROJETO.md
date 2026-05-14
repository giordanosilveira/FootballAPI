# Status do Projeto - FootballAPI

Data: 2026-05-13

## Objetivo deste documento
Consolidar o que foi revisado e corrigido até agora no backend, para facilitar a retomada do projeto.

## Contexto levantado
- Estrutura atual organizada em camadas: domain, application e infrastructure.
- Entidades de domínio já existentes: Season, Country, League e Team.
- Migrations SQL existentes para seasons, countries, leagues e teams.
- Camadas ainda vazias neste momento: use-cases, controllers, routes e external.
- Camada de infraestrutura com repositórios concretos já presentes: BaseRepository, CountryRepository, LeagueRepository, SeasonRepository e TeamRepository.

## Correções realizadas

### 1) BaseRepository ajustado para execução real
Arquivo: backend/src/infrastructure/repositories/BaseRepository.js

Mudanças aplicadas:
- Ajuste de leitura com pg-promise:
  - findAll e findByField passaram a usar retorno direto de manyOrNone (array), sem destructuring de rows.
- Persistência unificada:
  - save passou a usar queries.save com fallback para queries.create.
  - create mantido como alias para save.
- Métodos de contrato implementados:
  - update, delete, exists e count.
- Mapeamento implementado:
  - toEntity com retorno padrão do row.
  - toPersistence com mapeamento automático por colunas do INSERT.
  - suporte a snake_case e camelCase no toPersistence.
- Helpers adicionados:
  - extractInsertColumns para extrair colunas do SQL de INSERT.
  - toCamelCase para normalização de chaves.

### 2) SQL dinâmico corrigido em findByField
Arquivos:
- backend/src/infrastructure/database/queries/countryQueries.js
- backend/src/infrastructure/database/queries/leagueQueries.js
- backend/src/infrastructure/database/queries/seasonQueries.js
- backend/src/infrastructure/database/queries/teamQueries.js

Mudança aplicada:
- findByField alterado de WHERE $1 = $2 para WHERE $1:name = $2.

Motivo:
- $1:name no pg-promise trata o parâmetro como identificador SQL (nome de coluna), permitindo consulta dinâmica por campo de forma correta.

### 3) Interface de League corrigida
Arquivo: backend/src/domain/repositories/ILeagueRepository.js

Mudanças aplicadas:
- Nome da classe corrigido de ICountryRepository para ILeagueRepository.
- Export corrigido para ILeagueRepository.

### 4) Contrato base alinhado
Arquivo: backend/src/domain/repositories/IBaseRepository.js

Mudança observada no estado atual:
- Método create não está mais no contrato base.
- Contrato está centrado em save, update, delete, exists e count.

### 5) CountryRepository implementado
Arquivo: backend/src/infrastructure/repositories/CountryRepository.js

Mudanças aplicadas:
- Repositório concreto criado para Country.
- Extensão de BaseRepository com countryQueries.
- Implementação de findByCode(code), retornando uma entidade Country ou null.
- Mapeamento explícito de entidade em toEntity(row).
- Mapeamento explícito de persistência em toPersistence(entity).

## Validações executadas
- Verificação de problemas nos arquivos alterados: sem erros.
- Smoke test de carregamento dos módulos alterados com Node: OK.

Comando de smoke test executado:
cd backend && node -e "require('./src/infrastructure/repositories/BaseRepository'); require('./src/infrastructure/database/queries/countryQueries'); require('./src/infrastructure/database/queries/leagueQueries'); require('./src/infrastructure/database/queries/seasonQueries'); require('./src/infrastructure/database/queries/teamQueries'); console.log('ok')"

Resultado:
ok

Smoke test adicional executado:
cd backend && node -e "require('./src/infrastructure/repositories/CountryRepository'); console.log('country-repo-ok')"

Resultado:
country-repo-ok

## Pendências imediatas (somente correção, sem features novas)
- Incluir queries.update nos arquivos de queries para suportar update no BaseRepository sem lançar erro de configuração.
- Validar que todos os campos usados por findByField estejam em uma whitelist por entidade (boa prática de segurança para coluna dinâmica).
- Revisar nome do método findByCode em ICountryRepository, se a intenção for manter um padrão mais explícito por entidade.

## Próximo passo recomendado
Fechar a rodada de correções estruturais adicionando queries.update para Country, League, Season e Team, mantendo o foco em estabilidade antes de criar use-cases e rotas.

## Mapa simples do fluxo

### Fluxo atual
API/entrada
→ [backend/src/server.js](backend/src/server.js)
→ infraestrutura HTTP ainda vazia
→ repositórios concretos em [backend/src/infrastructure/repositories](backend/src/infrastructure/repositories)
→ [BaseRepository](backend/src/infrastructure/repositories/BaseRepository.js)
→ queries SQL em [backend/src/infrastructure/database/queries](backend/src/infrastructure/database/queries)
→ PostgreSQL

### Fluxo que o projeto deve seguir quando estiver completo
controller
→ use-case
→ repository interface em [backend/src/domain/repositories](backend/src/domain/repositories)
→ repository concreto em [backend/src/infrastructure/repositories](backend/src/infrastructure/repositories)
→ queries SQL em [backend/src/infrastructure/database/queries](backend/src/infrastructure/database/queries)
→ PostgreSQL

### Leitura rápida das responsabilidades
- server: sobe a aplicação e registra middleware/rotas.
- controller: recebe request e devolve response.
- use-case: concentra a regra de negócio.
- repository interface: define o contrato.
- repository concreto: traduz o contrato para acesso ao banco.
- queries: guarda o SQL de cada entidade.
- banco: persiste e retorna os dados.

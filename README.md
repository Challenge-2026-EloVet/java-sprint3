# Elo Vet — Backend (API)

Resumo do projeto

Elo Vet é uma solução focada em melhorar a adesão dos tutores aos cuidados pós-consulta e em reduzir churn nas clínicas parceiras. Em vez de hardware, o MVP prioriza:

- experiência conversacional para checklists e follow-ups;
- motor de regras e dados clínicos para disparos proativos;
- painel web para veterinários fazerem handoff e gerenciarem planos de cuidado.

Este repositório contém a API backend em Spring Boot que fornece as rotas e regras para os fluxos principais do MVP.

Integrantes:

| Nome | RM |
|---|---|
| Arthur Graciani | RM561728 |
| Gustavo Oliveira | RM566358 |
| João Pedro Scarpin | RM565421 |
| Lucas Hideki | RM565355 |
| Wesley Andrade | RM563593 |

Como esta implementação atende ao objetivo do MVP

- Handoff automatizado: o veterinário gera um plano de cuidados simplificado que é enviado ao tutor (simulado via registro em `notification`).
- Checklist terapêutico: itens com datas e status (PENDING, DONE, CANCELLED) permitem acompanhamento e geração de lembretes.
- Motor de follow-up: regras simples (reminders) que podem evoluir para disparos proativos baseados em modelos.

Principais conceitos e onde encontrá-los

- Migrações (Flyway): `src/main/resources/db/migration` — controle de versão do esquema
- Segurança: `src/main/java/com/br/elovetapi/security` — JWT e filtros; roles `USER`/`ADMIN` no model de usuário
- Care (domínio): `src/main/java/com/br/elovetapi/care` — controllers, services, repositórios, validações, enums e exceptions

Como executar localmente

1. Configure o acesso ao banco em `src/main/resources/application.properties` ou via variáveis de ambiente (spring.datasource.url etc.).
2. Execute a aplicação:

```powershell
.\gradlew.bat bootRun
```

O Flyway aplicará as migrações automaticamente.

Endpoints (resumo completo)

Autenticação
- POST /auth/register — registrar usuário (Enviar role: USER ou ADMIN)
- POST /auth/login — autenticar e retornar token JWT

Pet (CRUD)
- GET /pet — listar pets (auth)
- GET /pet/{eloId} — obter pet por id
- POST /pet — criar (ADMIN)
- PUT /pet/{eloId} — atualizar (ADMIN)
- DELETE /pet/{eloId} — deletar (ADMIN)

Veterinário (CRUD)
- GET /veterinary — listar
- GET /veterinary/{id} — obter por id
- POST /veterinary — criar (ADMIN)
- PUT /veterinary/{id} — atualizar (ADMIN)
- DELETE /veterinary/{id} — deletar (ADMIN)

Care (fluxos)
- POST /api/v1/veterinaries/{vetId}/care-plans — criar care plan e enviar handoff (ADMIN)
- GET /api/v1/users/{userId}/care-plans — listar planos do tutor (USER/ADMIN, propriedade verificada)
- POST /api/v1/care-plans/{carePlanId}/items/{itemId}/mark — marcar item (USER/ADMIN)
- POST /api/v1/admin/process-reminders — processar reminders manualmente (ADMIN)

Teste rápido com `api.http`

Use o arquivo `api.http`: ele contém exemplos de registro/login, CRUD de pet/veterinário e os fluxos de care.
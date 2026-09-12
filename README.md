# Elo Vet API

Elo Vet é uma solução B2B2C focada em reduzir o churn de 90 dias e melhorar a adesão dos tutores aos cuidados continuados pós-consulta. O projeto combina experiência conversacional, gestão clínica e follow-up inteligente para tornar o cuidado do pet mais claro, humano e eficaz.

> Slogan oficial: "Cuidar de quem amamos: é isso que nos une."

## Visão geral do sprint

Este repositório contempla a entrega do 3º sprint da disciplina JAVA ADVANCED, com foco em:

- frontend web para gestão e visualização de dados;
- backend em Spring Boot para regras de negócio e APIs;
- Flyway para versionamento e evolução do banco de dados;
- Spring Security para autenticação e autorização;
- funcionalidades completas com validações e fluxos relevantes para o MVP do Elo Vet.

## Requisitos da tarefa e como o projeto atende

### 1. Frontend — 30 pontos

- Portal web em React + Vite localizado em `portal/`;
- telas para login, dashboard, pets, veterinários e care plans;
- visual consistente com a identidade oficial do Elo Vet (paleta Mint, Sage, Emerald e Gold);
- layout responsivo e experiência orientada a clínica/veterinários.

### 2. Flyway — 20 pontos

- versionamento do banco via migrations em `src/main/resources/db/migration/`;
- criação e evolução de tabelas para usuários, pets, veterinários, planos de cuidado e notificações;
- controle de estrutura do banco de forma reprodutível e segura.

### 3. Spring Security — 30 pontos

- autenticação JWT com Spring Security;
- diferentes perfis de acesso por tipo de usuário;
- proteção de rotas e controle de autorização por perfil;
- integração com o frontend via CORS configurado para `http://localhost:5173`.

### 4. Funcionalidades completas — 20 pontos

- gestão de usuários e autenticação;
- CRUD/fluxo de pets e veterinários;
- geração e acompanhamento de care plans;
- notificações de follow-up e itens de cuidado;
- validações básicas de dados e regras de negócio.

## Stack tecnológica

- Java 21
- Spring Boot 3 / Spring Framework
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- JWT (Auth0)
- React + Vite
- Docker Compose

## Arquitetura do projeto

```text
elo-vet-api/
├── src/main/java/          # backend Spring Boot
├── src/main/resources/     # application.properties e migrations
├── src/test/java/          # testes automatizados
├── portal/                 # frontend React/Vite
├── build.gradle            # dependências e configuração do projeto
├── compose.yaml            # banco PostgreSQL em container
├── gradlew                 # wrapper do Gradle
├── README.md               # documentação principal
└── api.http                # exemplos de chamadas da API
```

## Perfis e permissões

O sistema foi pensado para múltiplos tipos de usuário, com diferentes níveis de acesso. A base da autorização inclui perfis como:

- ADMIN
- USER
- VETERINARIO
- RESPONSAVEL

Esses perfis permitem separar acesso a ações e rotas conforme a operação de negócio, como gestão administrativa, acompanhamento de planos e uso do portal clínico.

## Funcionalidades principais

### Fluxo de cuidado do paciente

- criação e monitoramento de care plans;
- itens de plano com status de acompanhamento;
- atualização de status de tarefas;
- vínculo entre pet, veterinário e responsável.

### Gestão clínica

- cadastro e visualização de veterinários;
- cadastro e manutenção de pets;
- gestão de atendimentos e planos de cuidado.

### Follow-up e notificações

- geração de lembretes e alertas;
- registro de notificações para o tutor;
- rastreio do status do cuidado ao longo do tempo.

### Segurança

- autenticação de usuários;
- proteção de endpoints sensíveis;
- controle de acesso via roles e filtros do Spring Security.

## Design system Elo Vet

O portal foi desenhado para seguir a identidade oficial do Elo Vet, com a paleta base:

- Mint: `#A3D9C9`
- Sage: `#7E9F8E`
- Emerald: `#185A43`
- Gold: `#DFB461`

A proposta visual transmite acolhimento, confiança clínica e modernidade, alinhando a experiência digital ao posicionamento da marca.

## Como executar o projeto

### Pré-requisitos

- Java 21
- Gradle (ou uso do wrapper `gradlew`)
- PostgreSQL
- Node.js 18+ e npm para o frontend

### 1. Preparar o banco

O projeto usa Docker Compose para subir o PostgreSQL localmente.

```bash
# Windows PowerShell
$env:POSTGRES_DB="elo_vet"
$env:POSTGRES_USER="postgres"
$env:POSTGRES_PASSWORD="postgres"
docker compose up -d
```

### 2. Configurar variáveis de ambiente

No arquivo `src/main/resources/application.properties`, configure os valores usados pela aplicação:

```properties
api.security.token.secret=sua_chave_secreta
portal.elo-vet.url=http://localhost:5173
POSTGRES_DB=elo_vet
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
```

### 3. Executar a API

```bash
./gradlew bootRun
```

A API ficará disponível em:

- `http://localhost:8080`

### 4. Executar o frontend

No diretório `portal/`:

```bash
npm install
npm run dev
```

A interface web ficará disponível em:

- `http://localhost:5173`

## Estrutura principal do backend

- `security/` — autenticação, JWT e configuração de segurança
- `user/` — usuários, perfis e regras de acesso
- `pet/` — pets e gestão clínica
- `veterinary/` — profissionais veterinários
- `care/` — planos de cuidado, itens, notificações e follow-up
- `db/migration/` — scripts Flyway

## Endpoints principais

A API fornece rotas para os principais módulos do sistema. O arquivo `api.http` pode ser usado como referência para testes rápidos.

Exemplos de módulos:

- autenticação
- usuários
- pets
- veterinários
- care plans
- notificações

## Boas práticas adotadas

- organização por módulos e responsabilidades
- uso de DTOs para separação entre camada de transporte e domínio
- validações em serviços e controllers
- scripts Flyway para manter a base consistente
- autenticação centralizada para controle seguro de acesso

## Integrantes

| Nome | RM |
|---|---|
| Arthur Graciani | RM561728 |
| Gustavo Oliveira | RM566358 |
| João Pedro Scarpin | RM565421 |
| Lucas Hideki | RM565355 |
| Wesley Andrade | RM563593 |

## Observação final

Este projeto representa uma entrega aplicada de uma solução completa em Java com frontend integrado, seguindo o contexto do Elo Vet e os requisitos do desafio do 3º sprint. A manutenção de uma arquitetura organizada, validações consistentes, autenticação segura e dados versionados são fundamentais para que o sistema seja escalável, profissional e coerente com a proposta de negócio.
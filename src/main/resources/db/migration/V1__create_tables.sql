CREATE TABLE IF NOT EXISTS elo_login (
    id_usuario BIGSERIAL PRIMARY KEY,
    nome_usuario VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS elo_pet (
    id_pet BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    especie VARCHAR(255),
    raca VARCHAR(255),
    sexo CHAR(1),
    data_nascimento DATE,
    idade_aproximada INTEGER,
    flag_castrado BOOLEAN,
    foto BYTEA
);

CREATE TABLE IF NOT EXISTS elo_veterinario (
    id_veterinario BIGSERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(255),
    rg VARCHAR(255),
    data_nascimento DATE,
    crmv VARCHAR(255),
    telefone VARCHAR(255),
    id_usuario BIGINT UNIQUE,
    CONSTRAINT fk_elo_veterinario_usuario
        FOREIGN KEY (id_usuario) REFERENCES elo_login(id_usuario)
);

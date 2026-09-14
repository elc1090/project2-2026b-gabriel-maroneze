CREATE TABLE materiais (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE pontos_coleta (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    horario_abertura TIME,
    horario_fechamento TIME,
    numero_contato VARCHAR(30),
    descricao TEXT
);

CREATE TABLE ponto_material (
    ponto_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,

    PRIMARY KEY (ponto_id, material_id),

    FOREIGN KEY (ponto_id)
        REFERENCES pontos_coleta(id)
        ON DELETE CASCADE,

    FOREIGN KEY (material_id)
        REFERENCES materiais(id)
        ON DELETE CASCADE
);
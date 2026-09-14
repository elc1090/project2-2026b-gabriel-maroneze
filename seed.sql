INSERT INTO materiais (nome)
VALUES
    ('Papel'),
    ('Papelão'),
    ('Plástico'),
    ('Vidro'),
    ('Metal'),
    ('Eletrônicos'),
    ('Pilhas e baterias'),
    ('Lâmpadas'),
    ('Óleo de cozinha'),
    ('Medicamentos');

INSERT INTO pontos_coleta (
    nome,
    endereco,
    latitude,
    longitude,
    horario_abertura,
    horario_fechamento,
    numero_contato,
    descricao
)
VALUES
(
    'Ecoponto Centro - Demonstração',
    'Centro, Santa Maria - RS',
    -29.6842,
    -53.8069,
    '08:00',
    '18:00',
    NULL,
    'Ponto de coleta de materiais recicláveis comuns.'
),
(
    'Ecoponto Camobi - Demonstração',
    'Camobi, Santa Maria - RS',
    -29.7135,
    -53.7168,
    '08:30',
    '17:30',
    NULL,
    'Ponto de coleta de materiais recicláveis na região de Camobi.'
),
(
    'Coleta de Eletrônicos - Demonstração',
    'Santa Maria - RS',
    -29.7000,
    -53.7900,
    '09:00',
    '18:00',
    NULL,
    'Ponto especializado no recebimento de resíduos eletrônicos.'
),
(
    'Coleta de Óleo - Demonstração',
    'Santa Maria - RS',
    -29.6950,
    -53.8150,
    '08:00',
    '17:00',
    NULL,
    'Ponto destinado ao recebimento de óleo de cozinha usado.'
),
(
    'Ecoponto Norte - Demonstração',
    'Santa Maria - RS',
    -29.6700,
    -53.8100,
    '08:00',
    '18:00',
    NULL,
    'Ponto de coleta de materiais recicláveis diversos.'
);

-- RELACIONAMENTO ENTRE PONTOS DE COLETA E MATERIAIS

INSERT INTO ponto_material (ponto_id, material_id)
VALUES
    -- Ecoponto Centro - Demonstração
    (1, 1),  -- Papel
    (1, 2),  -- Papelão
    (1, 3),  -- Plástico
    (1, 4),  -- Vidro
    (1, 5),  -- Metal

    -- Ecoponto Camobi - Demonstração
    (2, 1),  -- Papel
    (2, 2),  -- Papelão
    (2, 3),  -- Plástico
    (2, 4),  -- Vidro
    (2, 5),  -- Metal
    (2, 7),  -- Pilhas e baterias

    -- Coleta de Eletrônicos - Demonstração
    (3, 6),  -- Eletrônicos
    (3, 7),  -- Pilhas e baterias
    (3, 8),  -- Lâmpadas

    -- Coleta de Óleo - Demonstração
    (4, 9),  -- Óleo de cozinha

    -- Ecoponto Norte - Demonstração
    (5, 1),  -- Papel
    (5, 2),  -- Papelão
    (5, 3),  -- Plástico
    (5, 4),  -- Vidro
    (5, 5);  -- Metal
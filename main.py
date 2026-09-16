from fastapi import FastAPI
from database import conectar

app = FastAPI()

@app.get("/")
def inicio():
    return {"mensagem": "Minha API está funcionando"}


@app.get("/pontos")
def listar_pontos():
    """
    Retorna os pontos de coleta e seus respectivos materiais.
    """

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    p.id,
                    p.nome,
                    p.endereco, 
                    p.latitude,
                    p.longitude,
                    p.horario_abertura,
                    p.horario_fechamento,
                    p.numero_contato,
                    p.descricao,

                COALESCE(
                    ARRAY_AGG(m.nome ORDER BY m.nome)
                        FILTER (WHERE m.id IS NOT NULL),
                    ARRAY[]::VARCHAR[]
                    ) AS materiais

                FROM public.pontos_coleta AS p

                LEFT JOIN public.ponto_material AS pm
                    ON pm.ponto_id = p.id

                LEFT JOIN public.materiais AS m
                    ON m.id = pm.material_id

                GROUP BY
                    p.id,
                    p.nome,
                    p.endereco,
                    p.latitude,
                    p.longitude,
                    p.horario_abertura,
                    p.horario_fechamento,
                    p.numero_contato,
                    p.descricao

                ORDER BY p.id;
                """
            )

            pontos = cursor.fetchall()

    return pontos
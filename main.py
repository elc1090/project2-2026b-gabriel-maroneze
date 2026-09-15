from fastapi import FastAPI
from database import conectar 

app = FastAPI()


@app.get("/")
def inicio():
    return {"mensagem": "Minha API está funcionando"}
@app.get("/pontos")
def listar_pontos():
    """
    Retorna os pontos existentes na tabela pontos_coleta.
    """
    
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    nome,
                    endereco,
                    latitude,
                    longitude,
                    horario_abertura,
                    horario_fechamento,
                    numero_contato,
                    descricao
                FROM pontos_coleta
                ORDER BY id;
                """
            )
            
            pontos = cursor.fetchall()
    return pontos
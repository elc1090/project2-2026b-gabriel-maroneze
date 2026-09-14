from fastapi import FastAPI
from pydantic import BaseModel
from datetime import time

app = FastAPI()

class PontoColeta(BaseModel):
    nome: str
    endereco: str
    latidude: float
    longitude: float
    endereco: str
    materiais: list[str]
    horario_abertura: time
    horario_fechamento: time
    numero_contato: str | None = None
    descricao: str | None = None  

pontos = []

@app.get("/")
def inicio():
    return {"mensagem": "Minha API está funcionando"}

@app.post("/pontos")
def criarPonto(ponto: PontoColeta):
    pontos.append(ponto)
    
    
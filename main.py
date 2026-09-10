from fastapi import FastAPI
from pydantic import BaseModel
from enum import Enum

app = FastAPI()

class PontoColeta(BaseModel):
    nome: str
    endereco: str
    latidude: float
    longitude: float
    endereco: str
    materiais: Enum[str]
    horario_abertura: str
    horario_fechamento: str
    numero_contato: int
    descricao: str | None = None    

@app.get("/")
def inicio():
    return {"mensagem": "Minha API está funcionando"}


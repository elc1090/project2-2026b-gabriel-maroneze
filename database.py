import psycopg
from psycopg.rows import dict_row

def conectar():
    
    """
    Abre uma conexão com o banco de dados.
    """
    
    return psycopg.connect(dbname = "reciclagem_db",
                           user = "reciclagem_app",
                           password = "gabi1301",
                           host = "localhost",
                           port = "5432",
                           row_factory = dict_row,)


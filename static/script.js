const btnCarregar = document.querySelector("#btn-load");
const lstPontos = document.querySelector("#lista-pontos");
const msgCarregar = document.querySelector("#msg-load");

btnCarregar.addEventListener("click", ptsCarregar);

async function ptsCarregar() {
    carregando();

    try {
        const resp = await fetch("/pontos");

        if (!resp.ok) {
            throw new Error(`A requisição falhou com o status ${resp.status}`);
        }

        const pontos = await resp.json();

        mostrarPontos(pontos);
    } catch (error) {
        msgErro(error);
    } finally {
        btnCarregar.disabled = false;
    }
}

function carregando() {
    btnCarregar.disabled = true;
    msgCarregar.textContent = "Carregando...";
    lstPontos.replaceChildren();
}

function mostrarPontos(pontos) {
    if (pontos.length === 0) {
        msgCarregar.textContent = "Nenhum ponto encontrado.";
        return;
    }
    msgCarregar.textContent = `${pontos.length} ponto(s) encontrado(s).`;

    for (const ponto of pontos) {
        const cartao = criarCartao(ponto);
        lstPontos.appendChild(cartao);
    }
}

function criarCartao(ponto) {
    const artigo = document.createElement("article")
    artigo.classList.add("cartao-ponto");

    const nome = document.createElement("h3");
    nome.textContent = ponto.nome;
    artigo.append(nome);

    const endereco = document.createElement("p");
    endereco.textContent = ponto.endereco;
    artigo.append(endereco);

    const materiais = document.createElement("ul");
    for (const material of ponto.materiais) {
        const li = document.createElement("li");
        li.textContent = material;
        materiais.append(li);
    }
    artigo.append(materiais);

    return artigo;
}

function msgErro(error) {
    msgCarregar.textContent = `Não foi possível carregar os pontos: ${error.message}`;
}

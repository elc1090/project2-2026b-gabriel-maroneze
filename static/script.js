const btnCarregar = document.querySelector("#btn-load");
const lstPontos = document.querySelector("#lista-pontos");
const msgCarregar = document.querySelector("#msg-load");
const filtroMateriais = document.querySelector("#filtro-materiais");
const btnFiltrar = document.querySelector("#btn-filtrar");
const btnLimpar = document.querySelector("#btn-limpar");

let pontosCarregados = [];

btnCarregar.addEventListener("click", ptsCarregar);

btnFiltrar.addEventListener("click", aplicarFiltro);

btnLimpar.addEventListener("click", () => {
    for (const option of filtroMateriais.options) {
        option.selected = false;
    }
    mostrarPontos(pontosCarregados);
});

async function ptsCarregar() {
    carregando();

    try {
        const resp = await fetch("/pontos");

        if (!resp.ok) {
            throw new Error(`A requisição falhou com o status ${resp.status}`);
        }

        pontosCarregados = await resp.json();

        mostrarPontos(pontosCarregados);
        preencherFiltro(pontosCarregados);
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
    lstPontos.replaceChildren();
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

    const abertura = document.createElement("p");
    abertura.textContent = `Horário de Abertura: ${ponto.horario_abertura}`;
    artigo.append(abertura);

    const fechamento = document.createElement("p");
    fechamento.textContent = `Horário de Fechamento: ${ponto.horario_fechamento}`;
    artigo.append(fechamento);

    const contato = document.createElement("p");
    if (!ponto.numero_contato) {
        contato.textContent = "Contato: Não disponível";
    } else {
        contato.textContent = `Contato: ${ponto.numero_contato}`;
    }
    artigo.append(contato);

    const descricao = document.createElement("p");
    if (ponto.descricao === null || ponto.descricao === "") {
        descricao.textContent = "Descrição: Não disponível";
    } else {
        descricao.textContent = `Descrição: ${ponto.descricao}`;
    }
    artigo.append(descricao);

    return artigo;
}

function preencherFiltro(pontos) {
    filtroMateriais.replaceChildren();

    const materiaisEncontrados = new Set();
    for (const ponto of pontos) {
        for (const material of ponto.materiais) {
            materiaisEncontrados.add(material);
        }
    }

    const materiaisOrdenados = Array.from(materiaisEncontrados).sort();

    for (const material of materiaisOrdenados) {
        const option = document.createElement("option");
        option.value = material;
        option.textContent = material;
        filtroMateriais.append(option);
    }
}

function obtMateriaisSelect() {
    return Array.from(filtroMateriais.selectedOptions).map(option => option.value);
}

function aplicarFiltro() {
    const selecionados = obtMateriaisSelect();
    if (selecionados.length === 0) {
        mostrarPontos(pontosCarregados);
        return;
    }

    const pontosFiltrados = pontosCarregados.filter((ponto) => {
        return selecionados.some((material) => { return ponto.materiais.includes(material); });
    });
    mostrarPontos(pontosFiltrados);
}

function msgErro(error) {
    msgCarregar.textContent = `Não foi possível carregar os pontos: ${error.message}`;
}

ptsCarregar();
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
});

async function ptsCarregar() {
    carregando();

    try {
        const resp = await fetch("/pontos");

        if (!resp.ok) {
            throw new Error(`A requisição falhou com o status ${resp.status}`);
        }

        const pontos = await resp.json();

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

    const optionTodos = document.createElement("option");
    optionTodos.value = "todos";
    optionTodos.textContent = "Todos";
    filtroMateriais.append(optionTodos);

    const optionpapel = document.createElement("option");
    optionpapel.value = "papel";
    optionpapel.textContent = "Papel";
    filtroMateriais.append(optionpapel);

    const optionpapelao = document.createElement("option");
    optionpapelao.value = "papelão";
    optionpapelao.textContent = "Papelão";
    filtroMateriais.append(optionpapelao);

    const optionplastico = document.createElement("option");
    optionplastico.value = "plástico";
    optionplastico.textContent = "Plástico";
    filtroMateriais.append(optionplastico); 

    const optionvidro = document.createElement("option");
    optionvidro.value = "vidro";
    optionvidro.textContent = "Vidro";
    filtroMateriais.append(optionvidro);

    const optionmetal = document.createElement("option");
    optionmetal.value = "metal";
    optionmetal.textContent = "Metal";
    filtroMateriais.append(optionmetal);

    const optioneletronico = document.createElement("option");
    optioneletronico.value = "eletrônico";
    optioneletronico.textContent = "Eletrônico";
    filtroMateriais.append(optioneletronico);
    
    const optionpilhas = document.createElement("option");
    optionpilhas.value = "pilhas";
    optionpilhas.textContent = "Pilhas";
    filtroMateriais.append(optionpilhas);

    const optionoleo = document.createElement("option");
    optionoleo.value = "óleo";
    optionoleo.textContent = "Óleo";
    filtroMateriais.append(optionoleo);

    const optionmedicamentos = document.createElement("option");
    optionmedicamentos.value = "medicamentos";
    optionmedicamentos.textContent = "Medicamentos";
    filtroMateriais.append(optionmedicamentos);
}

function obtMateriaisSelect() {
    return Array.from(filtroMateriais.selectedOptions).map(option => option.value);
}

function aplicarFiltro() {
    const selecionados = obtMateriaisSelect();
    if (selecionados.lenght === 0 || selecionados.includes("todos")) {
        mostrarPontos(pontosCarregados);
        return;
    }
    
    const pontosFiltrados = pontosCarregados.filter((ponto) => {
        switch (true) {
            case selecionados.includes("papel") && ponto.materiais.includes("papel"):
            case selecionados.includes("papelão") && ponto.materiais.includes("papelão"):
            case selecionados.includes("plástico") && ponto.materiais.includes("plástico"):
            case selecionados.includes("vidro") && ponto.materiais.includes("vidro"):
            case selecionados.includes("metal") && ponto.materiais.includes("metal"):
            case selecionados.includes("eletrônico") && ponto.materiais.includes("eletrônico"):
            case selecionados.includes("pilhas") && ponto.materiais.includes("pilhas"):
            case selecionados.includes("óleo") && ponto.materiais.includes("óleo"):
            case selecionados.includes("medicamentos") && ponto.materiais.includes("medicamentos"):
                return true;
            default:
                return false;
        }
    });
    mostrarPontos(pontosFiltrados);
}

function msgErro(error) {
    msgCarregar.textContent = `Não foi possível carregar os pontos: ${error.message}`;
}


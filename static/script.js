const btnCarregar = document.querySelector("#btn-load");
const lstPontos = document.querySelector("#lista-pontos");
const msgCarregar = document.querySelector("#msg-load");
const filtroDropdown = document.querySelector("#filtro-dropdown");
const btnAbrirFiltro = document.querySelector("#btn-abrir-filtro");
const painelFiltro = document.querySelector("#painel-filtro");
const opcoesFiltro = document.querySelector("#opcoes-filtro");
const textoFiltro = document.querySelector("#texto-filtro");
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

btnAbrirFiltro.addEventListener("click", () => {
    const estaAberto = filtroDropdown.classList.toggle("aberto");

    btnAbrirFiltro.setAttribute("aria-expanded", String(estaAberto));
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        filtroDropDown.classList.remove("aberto");
        btnAbrirFiltro.setAttribute("aria-expanded", "false");
        btnAbrirFiltro.focus();
    }
});

opcoesFiltro.addEventListener("change", () => {
    const quantidade = obtMateriaisSelect().length;

    if (quantidade === 0) {
        textoFiltro.textContent = "Selecionar materiais";
        return;
    }

    textoFiltro.textContent =
        `${quantidade} material(is) selecionado(s)`;
});

btnLimpar.addEventListener("click", () => {
    const checkboxes = opcoesFiltro.querySelectorAll(
        'input[type="checkbox"]'
    );

    for (const checkbox of checkboxes) {
        checkbox.checked = false;
    }

    textoFiltro.textContent = "Selecionar materiais";
    mostrarPontos(pontosCarregados);
});

opcoesFiltro.addEventListener("keydown", (evento) => {
    const checkboxes = Array.from(
        opcoesFiltro.querySelectorAll('input[type="checkbox"]')
    );

    const indiceAtual = checkboxes.indexOf(document.activeElement);

    if (indiceAtual === -1) {
        return;
    }

    if (evento.key === "ArrowDown") {
        evento.preventDefault();

        const proximo =
            (indiceAtual + 1) % checkboxes.length;

        checkboxes[proximo].focus();
    }

    if (evento.key === "ArrowUp") {
        evento.preventDefault();

        const anterior =
            (indiceAtual - 1 + checkboxes.length) %
            checkboxes.length;

        checkboxes[anterior].focus();
    }

    if (evento.key === "Enter") {
        evento.preventDefault();

        const checkbox = checkboxes[indiceAtual];
        checkbox.checked = !checkbox.checked;

        checkbox.dispatchEvent(
            new Event("change", { bubbles: true })
        );
    }
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
    opcoesFiltro.replaceChildren();

    const materiaisEncontrados = new Set();

    for (const ponto of pontos) {
        for (const material of ponto.materiais) {
            materiaisEncontrados.add(material);
        }
    }

    const materiaisOrdenados =
        Array.from(materiaisEncontrados).sort();

    for (const material of materiaisOrdenados) {
        const item = document.createElement("label");
        item.classList.add("opcao-material");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = material;
        checkbox.name = "material";

        const texto = document.createElement("span");
        texto.textContent = material;

        item.append(checkbox, texto);
        opcoesFiltro.append(item);
    }
}

function obtMateriaisSelect() {
    const marcados = opcoesFiltro.querySelectorAll(
        'input[type="checkbox"]:checked'
    );

    return Array.from(marcados).map((checkbox) => {
        return checkbox.value;
    });
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

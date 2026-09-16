async function carregarPontos() {
    const resposta = await fetch("/pontos");
    const pontos = await resposta.json();

    console.log(pontos);
}
document.addEventListener("DOMContentLoaded", function () {
    // Mapeia os IDs das <li> com as respectivas divs
    const sections = {
        sm1: document.getElementById("horarioFunc"),
        sm2: document.getElementById("horarioEducFis"),
        sm3: document.getElementById("normas"),
        sm4: document.getElementById("portarias"),
        sm5: document.getElementById("patrimonio"),
        sm6: document.getElementById("vistorias"),
    };

    // Oculta todas as seções inicialmente
    Object.values(sections).forEach(section => section.style.display = "none");

    // Exibe a seção "Normas" ao carregar a página
    sections.sm1.style.display = "flex";

    // Adiciona evento de clique para cada <li>
    Object.keys(sections).forEach(id => {
        document.getElementById(id).addEventListener("click", function () {
            // Oculta todas as seções antes de exibir a correta
            Object.values(sections).forEach(section => section.style.display = "none");
            sections[id].style.display = "flex";
        });
    });
});

//Horario de trabalho dos funcionarios
document.addEventListener("DOMContentLoaded", () => {
    const tabelaBody = document.querySelector(".horariosFuncionarios tbody");

    async function carregarHorarios() {
        try {
            // Faz a requisição para a API
            const resposta = await fetch("/horas"); // Altere para a URL correta da sua API
            const dados = await resposta.json();

            if (dados.horas && dados.horas.length > 0) {
                tabelaBody.innerHTML = ""; // Limpa a tabela antes de inserir novos dados

                // Ordena os funcionários pelo nome em ordem alfabética
                dados.horas.sort((a, b) => a.nomeFunc.localeCompare(b.nomeFunc));

                // Percorre os dados e cria as linhas da tabela
                dados.horas.forEach(hora => {
                    const linha = document.createElement("tr");

                    // Expressão regular para verificar se é um horário (formato HH:MM)
                    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
                    
                    if (!regexHora.test(hora.horaIn)) {
                        // Caso seja um motivo de afastamento, aplicar colspan
                        linha.innerHTML = `
                            <td>${hora.matricula}</td>
                            <td>${hora.nomeFunc}</td>
                            <td>${hora.cargoFunc}</td>
                            <td colspan="6">${hora.horaIn}</td>
                        `;
                    } else {
                        // Caso seja um horário normal, exibir todas as colunas
                        linha.innerHTML = `
                            <td>${hora.matricula}</td>
                            <td>${hora.nomeFunc}</td>
                            <td>${hora.cargoFunc}</td>
                            <td>${hora.horaIn || "-"}</td>
                            <td>${hora.almocoIn || "-"}</td>
                            <td>${hora.almocoOut || "-"}</td>
                            <td>${hora.horaOut || "-"}</td>
                            <td>${hora.htpcIn || "-"}</td>
                            <td>${hora.htpcOut || "-"}</td>
                        `;
                    }

                    tabelaBody.appendChild(linha);
                });
            } else {
                tabelaBody.innerHTML = "<tr><td colspan='9'>Nenhum horário encontrado.</td></tr>";
            }
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
            tabelaBody.innerHTML = "<tr><td colspan='9'>Erro ao carregar dados.</td></tr>";
        }
    }

    // Chama a função ao carregar a página
    carregarHorarios();
});

//Horario de trabalho educação física
document.addEventListener("DOMContentLoaded", () => {
    const tabelaBodyEF = document.querySelector(".horariosEducacaoFisica tbody");

    async function carregarAulas() {
        try {
            // Faz a requisição para a API
            const respostaEF = await fetch("/aulasEF"); // Altere para a URL correta da sua API
            const dadosEF = await respostaEF.json();

            if (dadosEF.aulas && dadosEF.aulas.length > 0) {
                tabelaBodyEF.innerHTML = ""; // Limpa a tabela antes de inserir novos dados

                // Ordena os funcionários pelo nome em ordem alfabética
                dadosEF.aulas.sort((a, b) => a.nomeProf.localeCompare(b.nomeProf));

                // Percorre os dados e cria as linhas da tabela
                dadosEF.aulas.forEach(aula => {
                    const linhaEF = document.createElement("tr");

                    linhaEF.innerHTML = `
                        <td>${aula.matricula}</td>
                        <td>${aula.nomeProf}</td>
                        <td>${aula.DiaSemana}</td>
                        <td>${aula.horaIn || "-"}</td>
                        <td>${aula.horaOut || "-"}</td>
                        <td>${aula.turma || "-"}</td>
                    `;

                    tabelaBodyEF.appendChild(linhaEF);
                });
            } else {
                tabelaBodyEF.innerHTML = "<tr><td colspan='9'>Nenhum horário encontrado.</td></tr>";
            }
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
            tabelaBodyEF.innerHTML = "<tr><td colspan='9'>Erro ao carregar dados.</td></tr>";
        }
    }

    // Chama a função ao carregar a página
    carregarAulas();
});

//Patrimônio
document.addEventListener("DOMContentLoaded", () => {
    const tabelaBodyPAT = document.querySelector(".patrimonio tbody");

    async function carregarAulas() {
        try {
            // Faz a requisição para a API
            const respostaPAT = await fetch("/patrimonios"); // Altere para a URL correta da sua API
            const dadosPAT = await respostaPAT.json();

            if (dadosPAT.pats && dadosPAT.pats.length > 0) {
                tabelaBodyPAT.innerHTML = ""; // Limpa a tabela antes de inserir novos dados

                // Ordena os funcionários pelo nome em ordem alfabética
                dadosPAT.pats.sort((a, b) => a.codPat.localeCompare(b.codPat));

                // Percorre os dados e cria as linhas da tabela
                dadosPAT.pats.forEach(pat => {
                    const linhaPAT = document.createElement("tr");

                    linhaPAT.innerHTML = `
                        <td>${pat.codPat}</td>
                        <td>${pat.descrition}</td>
                        <td>${pat.situation}</td>
                        <td>${pat.local || "-"}</td>
                        <td>${pat.ue || "-"}</td>
                        <td>${pat.lastCheck || "-"}</td>
                        <td>${pat.obs || "-"}</td>
                        <td>${pat.value || "-"}</td>
                        <td>${pat.fiscal || "-"}</td>
                        <td>${pat.patPic || "-"}</td>
                    `;

                    tabelaBodyPAT.appendChild(linhaPAT);
                });
            } else {
                tabelaBodyPAT.innerHTML = "<tr><td colspan='9'>Nenhum item encontrado.</td></tr>";
            }
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
            tabelaBodyPAT.innerHTML = "<tr><td colspan='9'>Erro ao carregar dados.</td></tr>";
        }
    }

    // Chama a função ao carregar a página
    carregarAulas();
});

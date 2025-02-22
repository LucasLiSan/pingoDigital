document.addEventListener("DOMContentLoaded", function () {
    // Mapeia os IDs das <li> com as respectivas divs
    const sections = {
        sm1: document.getElementById("horarioFunc"),
        sm2: document.getElementById("horarioEducFis"),
        sm3: document.getElementById("normas"),
        sm4: document.getElementById("portarias")
    };

    // Oculta todas as seções inicialmente
    Object.values(sections).forEach(section => section.style.display = "none");

    // Exibe a seção "Normas" ao carregar a página
    sections.sm1.style.display = "block";

    // Adiciona evento de clique para cada <li>
    Object.keys(sections).forEach(id => {
        document.getElementById(id).addEventListener("click", function () {
            // Oculta todas as seções antes de exibir a correta
            Object.values(sections).forEach(section => section.style.display = "none");
            sections[id].style.display = "block";
        });
    });
});
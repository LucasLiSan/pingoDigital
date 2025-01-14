function toggleCard(event) {
    const button = event.target; // Botão clicado
    const container = button.closest(".container"); // Seleciona o container correspondente
    const content = container.querySelector(".content"); // Seleciona o conteúdo dentro do mesmo container

    if (!content) {
        console.error("Elemento '.content' não encontrado.");
        return;
    }

    // Alterna o valor de 'top'
    if (content.style.top === "0%") {
        content.style.top = "-30%"; // Esconde o conteúdo
    } else {
        // Fecha todos os outros cards
        document.querySelectorAll(".content").forEach((otherContent) => {
            otherContent.style.top = "-30%";
        });

        content.style.top = "0%"; // Mostra o conteúdo do card clicado
    }
}

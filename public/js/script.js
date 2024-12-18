//Scripts básicos

//Menu responsivo
document.addEventListener('DOMContentLoaded', () => {
    const navResponsive = document.querySelector('.navResponsive');
    const optResponsive = document.querySelector('.optResponvisve');

    // Alternar exibição do menu ao clicar no botão
    navResponsive.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique se propague para o documento
        const isVisible = optResponsive.style.display === 'flex';
        optResponsive.style.display = isVisible ? 'none' : 'flex';
    });

    // Ocultar menu ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!optResponsive.contains(event.target)) {
            optResponsive.style.display = 'none';
        }
    });
});
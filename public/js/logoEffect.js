// Seleciona os elementos
const imgLogo = document.querySelector('.imgLogo');
const header = document.querySelector('header');

let lastScrollTop = 0; // Guarda a última posição do scroll

// Função principal para lidar com o scroll
function handleScroll() {
    // Pega a altura máxima de rolagem
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Pega a posição atual do scroll
    const scrollTop = window.scrollY;

    // ----- Lógica para o efeito de fade-in da imgLogo -----
    const opacity = Math.min(scrollTop / scrollHeight, 1);
    imgLogo.style.opacity = opacity;

    // ----- Lógica para esconder/mostrar o header logo -----
    if (scrollTop > lastScrollTop) {
        // Scroll para baixo - header desaparece
        header.style.opacity = '0';
    } else {
        // Scroll para cima - header reaparece
        header.style.opacity = '1';
    }

    // Atualiza a posição do scroll
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita valores negativos
}

// Configura estilos iniciais
imgLogo.style.opacity = 0; // imgLogo começa invisível
header.style.transition = 'opacity 0.5s ease'; // Adiciona transição suave
imgLogo.style.transition = 'opacity 0.5s ease';

// Adiciona o evento de scroll
window.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', () => {
    // Mapeamento entre os IDs das divs clicáveis e as divs alvo
    const mapping = {
        neighborhood: 'search-neighborhood',
        streets: 'search-streets',
        house: 'search-house'
    };

    // Obtemos todas as divs alvo
    const allTargetElements = Object.values(mapping).map(id => document.getElementById(id));

    // Iteramos sobre os elementos clicáveis
    Object.keys(mapping).forEach(triggerId => {
        const targetId = mapping[triggerId];
        const triggerElement = document.getElementById(triggerId);
        const targetElement = document.getElementById(targetId);

        if (triggerElement && targetElement) {
            triggerElement.addEventListener('click', () => {
                // Esconde todas as divs alvo
                allTargetElements.forEach(el => {
                    if (el) el.style.display = 'none';
                });

                // Mostra apenas a div correspondente ao clique
                targetElement.style.display = 'flex';
            });
        }
    });
});
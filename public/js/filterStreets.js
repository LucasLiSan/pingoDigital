const selectNeighborhood = document.getElementById('input-neighborhood');
    const searchResultDiv = document.querySelector('.searchResult.neighborhood');

    // Função para carregar os bairros e ruas
    async function loadNeighborhoodsAndStreets() {
        const setor = "EMEB Pingo de Gente"; // Setor fixo
        const bairro = selectNeighborhood.value; // Bairro selecionado

        try {
            // Buscar os dados da API
            const response = await fetch(`/ruas?setor=${encodeURIComponent(setor)}&bairro=${encodeURIComponent(bairro)}`);
            const data = await response.json();

            if (response.ok) {
                renderNeighborhoods(data.streets);
            } else {
                console.error(data.err);
            }
        } catch (error) {
            console.error('Erro ao carregar os bairros e ruas:', error);
        }
    }

    // Função para renderizar os bairros e ruas
    function renderNeighborhoods(streets) {
        // Limpar os resultados anteriores
        searchResultDiv.innerHTML = '';

        // Agrupar ruas por bairro
        const groupedByNeighborhood = streets.reduce((acc, street) => {
            if (!acc[street.bairro]) {
                acc[street.bairro] = [];
            }
            acc[street.bairro].push(street.rua);
            return acc;
        }, {});

        // Criar as divs dinamicamente
        let index = 1;
        for (const [bairro, ruas] of Object.entries(groupedByNeighborhood)) {
            const neighborhoodDiv = document.createElement('div');
            neighborhoodDiv.id = `neighbordhood-${index}`;
            neighborhoodDiv.innerHTML = `
                <h3>${bairro.toUpperCase()}</h3>
                ${ruas.map(rua => `<p>${rua}</p>`).join('')}
            `;
            searchResultDiv.appendChild(neighborhoodDiv);
            index++;
        }
    }

    // Event listener para carregar os dados ao mudar o valor do select
    selectNeighborhood.addEventListener('change', loadNeighborhoodsAndStreets);

    // Carregar todos os bairros e ruas inicialmente
    window.addEventListener('DOMContentLoaded', loadNeighborhoodsAndStreets);
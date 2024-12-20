// ---------- ABA BAIRRO ---------- //

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
        ruas.sort((a, b) => a.localeCompare(b));
        
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


// ---------- ABA RUAS ---------- //


document.addEventListener("DOMContentLoaded", () => {
    const inputStreets = document.getElementById("input-streets");
    const searchResultsContainer = document.querySelector(".searchResult.streets");

    let debounceTimeout;

    // Função para buscar ruas no backend
    async function fetchStreets(query) {
        try {
            const response = await fetch(`/nomeruas?setor=EMEB%20Pingo%20de%20Gente&query=${query}`);
            if (!response.ok) throw new Error("Erro ao buscar ruas.");

            const data = await response.json();
            return data.streets;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Função para renderizar os resultados
    function renderResults(streets) {
        searchResultsContainer.innerHTML = ""; // Limpa os resultados anteriores

        if (streets.length === 0) return; // Não renderiza se não houver resultados

        const groupedByNeighborhood = {};

        // Agrupar ruas por bairro
        streets.forEach(street => {
            if (!groupedByNeighborhood[street.bairro]) {
                groupedByNeighborhood[street.bairro] = [];
            }
            groupedByNeighborhood[street.bairro].push(street.rua || street.nomeAnterior);
        });

        // Renderizar bairros e ruas
        let neighborhoodIndex = 1;
        for (const [bairro, ruas] of Object.entries(groupedByNeighborhood)) {
            ruas.sort((a, b) => a.localeCompare(b));
            
            const neighborhoodDiv = document.createElement("div");
            neighborhoodDiv.id = `neighbordhood-${neighborhoodIndex}`;
            neighborhoodDiv.innerHTML = `
                <h3>${bairro}</h3>
                ${ruas.map(rua => `<p>${rua}</p>`).join("")}
            `;
            searchResultsContainer.appendChild(neighborhoodDiv);
            neighborhoodIndex++;
        }
    }

    // Listener do campo de input
    inputStreets.addEventListener("input", () => {
        const query = inputStreets.value.trim();

        clearTimeout(debounceTimeout); // Evita múltiplas requisições

        if (query.length < 3) {
            searchResultsContainer.innerHTML = ""; // Limpa os resultados se menos de 3 letras
            return;
        }

        // Debounce para evitar requisições excessivas
        debounceTimeout = setTimeout(async () => {
            const streets = await fetchStreets(query);
            renderResults(streets);
        }, 300); // Aguarda 300ms após digitação
    });
});


// ---------- ABA CASAS ---------- //


const searchHouseStreet = document.getElementById("search-house-street");
const searchHouseNumber = document.getElementById("search-house-number");
const inputNeighborhood = document.getElementById("input-neighborhood");
const searchResult = document.querySelector(".searchResult.house");
const matriculaDiv = document.getElementById("matricula");

document.getElementById("search-house").addEventListener("input", async () => {
    const street = searchHouseStreet.value.trim();
    const number = parseInt(searchHouseNumber.value.trim());
    const neighborhood = inputNeighborhood.value;

    if (!street || isNaN(number)) {
        searchResult.querySelector("#resultadoPesquisa h4").textContent = "ENDEREÇO NÃO LOCALIZADO";
        matriculaDiv.style.display = "none";
        return;
    }

    try {
        const response = await fetch(
            `/search-house?street=${encodeURIComponent(street)}&number=${number}&neighborhood=${encodeURIComponent(neighborhood)}`
        );

        if (!response.ok) throw new Error("Erro ao buscar endereço.");

        const data = await response.json();

        // Atualizar resultado
        searchResult.querySelector("#resultadoPesquisa h4").textContent = data.setor;
        if (data.setor === "EMEB Pingo de Gente") {
            matriculaDiv.style.display = "flex";
        } else {
            matriculaDiv.style.display = "none";
        }
    } catch (error) {
        console.error(error);
        searchResult.querySelector("#resultadoPesquisa h4").textContent = "ENDEREÇO NÃO LOCALIZADO";
        matriculaDiv.style.display = "none";
    }
});
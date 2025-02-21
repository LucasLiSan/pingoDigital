document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".pics");
    
    try {
        const response = await fetch("/perdidos/perdidos"); // Rota que retorna apenas os itens PERDIDOS
        const data = await response.json();
        
        if (!data.lostItems || data.lostItems.length === 0) {
            container.innerHTML = "<p>Nenhum item perdido encontrado.</p>";
            return;
        }

        // Ordena os itens pelo campo 'item'
        data.lostItems.sort((a, b) => a.item.localeCompare(b.item));

        data.lostItems.forEach(item => {
            const perdidosDiv = document.createElement("div");
            perdidosDiv.classList.add("perdidos");
            
            // Calcula o tempo restante
            const dataAchada = new Date(item.data);
            const hoje = new Date();
            const diasRestantes = 30 - Math.floor((hoje - dataAchada) / (1000 * 60 * 60 * 24));
            const tempoRestanteText = diasRestantes > 0 ? `${diasRestantes} dias` : "Expirado";
            
            perdidosDiv.innerHTML = `
                <img class="pic" src="${item.pic}" alt="${item.desc_item}">
                <label class="item" for="${item.item}">${item.item}</label>
                <span class="desc_item">${item.desc_item}</span>
                <span class="data">Data achada: ${new Date(item.data).toLocaleDateString("pt-BR")}</span>
                <span class="tempoRestante">Tempo restante: ${tempoRestanteText}</span>
                <button>
                    <a class="linkWhats" href="https://api.whatsapp.com/send?phone=551338225152&text=Ol%C3%A1,%20o%20item%20${encodeURIComponent(item.item)}%20pertence%20ao(a)%20meu(minha)%20filho(a)." target="_blank">
                        SOLICITAR
                    </a>
                </button>
            `;
            
            container.appendChild(perdidosDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar os itens perdidos:", error);
        container.innerHTML = "<p>Erro ao carregar os itens. Tente novamente mais tarde.</p>";
    }
});
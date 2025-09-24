// ===============================
// Carregar pedidos na tela inicial
// ===============================
async function carregarPedidosAtendimento() {
    try {
        const resPedidos = await fetch("/pedidos/lista");
        const { pedidos } = await resPedidos.json();

        const container = document.querySelector(".almoxarifadoAtendimento");
        container.innerHTML = "";

        for (const pedido of pedidos) {
            const section = document.createElement("section");
            section.id = "pedido";

            const dataFormatada = new Date(pedido.criadoEm).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });

            const statusColor = {
                "ENTREGUE": "#00ff00",
                "CANCELADO": "#ff0000",
                "PENDENTE": "#ffd000",
                "ENTREGA PARCIAL": "#ffa500",
                "EM SEPARAÇÃO": "#00bfff"
            }   [pedido.statusPedido] || "#aaa";

            const header = `
                <h2>
                    <span class="pedido">Pedido: ${pedido.solicitante.numPedido}</span>
                    <span class="statusPedido-geral" style="color:${statusColor}">${pedido.statusPedido}</span>
                </h2>
                <div class="descricaoPedido">
                    <div class="origemPedido">
                        <span class="origem">
                            ${pedido.solicitante?.setor && pedido.solicitante?.nome ? `${pedido.solicitante.setor} - ${pedido.solicitante.nome}` : "-"}
                        </span>
                        <span class="dataPedido">${dataFormatada.toUpperCase()}</span>
                        <button id="${pedido.solicitante.numPedido}" class="btnAtender">ATENDER</button>
                    </div>
                    <div class="itens">
                        <div class="cabecalhoItens">
                            <span>ITEM</span>
                            <span>CÓDIGO DE BARRA</span>
                            <span>DESCRIÇÃO ITEM</span>
                            <span>COR<br>TAMANHO</span>
                            <span>QTD</span>
                            <span>LOCALIZAÇÃO</span>
                            <span>STATUS</span>
                            <span>DATA ENTREGA</span>
                        </div>
            `;

            let corpo = "";
            let numItem = 1;

            // Buscar materiais com localizações
            const materiaisComLocal = await Promise.all(pedido.materiais.map(async (item) => {
                const resMat = await fetch(`/materiais/${item.codigoBarras}`);
                const { material } = await resMat.json();
                return { item, material };
            }));

            // Ordenar por armário e prateleira
            materiaisComLocal.sort((a, b) => {
                const armA = a.material.localizacao?.armario || "";
                const armB = b.material.localizacao?.armario || "";
                const pratA = a.material.localizacao?.prateleira || "";
                const pratB = b.material.localizacao?.prateleira || "";

                return armA.localeCompare(armB) || pratA.localeCompare(pratB);
            });

            for (const { item, material } of materiaisComLocal) {
                const localizacao = material?.localizacao ? `ARMARIO ${material.localizacao.armario} - PRATELEIRA ${material.localizacao.prateleira}` : "N/D";
                const corCampo = item.corSelecionada ? `<input type="color" value="${item.corSelecionada}" disabled>` : "<input type='hidden'>";
                const tamCampo = item.tamanhoSelecionado ? `<input type='text' value="${item.tamanhoSelecionado}" disabled>` : "<input type='hidden'>";

                // calcular saldo
                const totalEntregue = (item.entregas || []).reduce((sum, e) => sum + e.quantidade, 0);
                const saldo = Math.max(item.quantidadeSolicitada - totalEntregue, 0);

                const entregasHtml = (item.entregas || []).map(e => {
                    const data = new Date(e.dataEntrega).toLocaleDateString("pt-BR");
                    return `
                        <span class="qtdEntregue">${e.quantidade}</span>
                        <span class="entrega">${data}</span>
                        <span class="respEntrega">${e.responsavel || "-"}</span>
                    `;
                }).join("");

                const corStatus = {
                    "ENTREGUE": "#00ff00",
                    "CANCELADO": "#ff0000",
                    "PENDENTE": "#ffd000",
                    "EM FALTA": "#ff0000",
                    "DISPONÍVEL": "#00ff00",
                    "SEPARADO": "#ffd000",
                    "ENTREGA PARCIAL": "#ff8000"
                }[item.statusItem] || "#aaa";

                corpo += `
                    <div id="#${numItem}Item">
                        <span class="numItem">${numItem++}</span>
                        <span class="barCode">${item.codigoBarras}</span>
                        <span class="item">${item.nome}</span>
                        <div class="variacoes">${corCampo}${tamCampo}</div>
                        <span class="qtdPedido">${saldo} <small>(de ${item.quantidadeSolicitada})</small></span>
                        <span class="localItem">${localizacao}</span>
                        <span class="statusPedido" style="color:${corStatus}">${item.statusItem}</span>
                        <div class="dataEntrega">${entregasHtml}</div>
                    </div>
                `;
            }

            section.innerHTML = header + corpo + `</div></div>`;
            container.appendChild(section);
        }
    } catch (error) { console.error("Erro ao carregar pedidos de atendimento:", error); }
}

window.addEventListener("DOMContentLoaded", carregarPedidosAtendimento);

// ===============================
// Abrir modal para atender pedido
// ===============================
async function carregarPedidosParaModal(numPedido) {
    try {
        const res = await fetch("/pedidos/lista");
        const { pedidos } = await res.json();
        const pedido = pedidos.find(p => p.solicitante.numPedido === parseInt(numPedido));

        if (!pedido) return alert("Pedido não encontrado.");

        const container = document.getElementById("itensAtendimento");
        container.innerHTML = "";
        document.getElementById("tituloModal").textContent = `Atendimento - Pedido ${numPedido}`;

        let i = 0;
        for (const item of pedido.materiais) {
            // Ignorar itens já concluídos
            if (item.statusItem === "ENTREGUE") continue;

            const resEstoque = await fetch(`/materiais/${item.codigoBarras}`);
            const { material } = await resEstoque.json();
            const qtdEstoque = material?.quantidadeAtual || 0;

            const totalEntregue = (item.entregas || []).reduce((sum, e) => sum + e.quantidade, 0);
            const saldo = Math.max(item.quantidadeSolicitada - totalEntregue, 0);

            const temCorOuTamanho = item.corSelecionada || item.tamanhoSelecionado;
            const campoVariacoes = temCorOuTamanho
                ? `
                    ${item.corSelecionada ? `<p class="colorSize">Cor: <input type="color" value="${item.corSelecionada}" disabled></p>` : ""}
                    ${item.tamanhoSelecionado ? `<p>Tamanho: ${item.tamanhoSelecionado}</p>` : ""}
                `
                : `<p>N/A</p>`;

            const div = document.createElement("div");
            div.className = "itemEntrega";
            div.innerHTML = `
                <p><strong>${item.codigoBarras}</strong></p>
                <p>${item.nome}</p>
                <p><strong>${qtdEstoque}</strong></p>
                <p>${saldo} <small>(de ${item.quantidadeSolicitada})</small></p>
                ${campoVariacoes}
                <input type="number" name="entregaQtd-${i}" min="0" max="${saldo}" value="0">
                <select name="statusItem-${i}">
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="DISPONÍVEL">DISPONÍVEL</option>
                    <option value="EM FALTA">EM FALTA</option>
                    <option value="SEPARADO">SEPARADO</option>
                    <option value="ENTREGA PARCIAL">ENTREGA PARCIAL</option>
                    <option value="ENTREGUE">ENTREGUE</option>
                </select>
                <input type="text" name="responsavel-${i}" placeholder="Nome do responsável">
                <input type="hidden" name="codigoBarras-${i}" value="${item.codigoBarras}">
            `;
            container.appendChild(div);
            i++;
        }

        document.getElementById("modalAtendimento").style.display = "block";
        document.getElementById("formAtendimento").dataset.idPedido = pedido._id;
    } catch (err) { console.error("Erro ao carregar pedido:", err); }
}

function fecharModal() { document.getElementById("modalAtendimento").style.display = "none"; }

// ===============================
// Eventos
// ===============================
document.addEventListener("click", e => {
    if (e.target.classList.contains("btnAtender")) {
        const numPedido = e.target.id;
        carregarPedidosParaModal(numPedido);
    }
});

// ===============================
// Submeter formulário de entregas
// ===============================
document.getElementById("formAtendimento").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const idPedido = e.target.dataset.idPedido;

    const entradas = [];
    for (let [key, value] of form.entries()) {
        if (key.startsWith("codigoBarras-")) {
            const i = key.split("-")[1];
            entradas.push({
                itemId: form.get(`itemId-${i}`),
                codigoBarras: value, // ainda pode mandar, mas não é o identificador principal
                quantidade: parseInt(form.get(`entregaQtd-${i}`)) || 0,
                responsavel: form.get(`responsavel-${i}`) || "Desconhecido",
                statusItem: form.get(`statusItem-${i}`) || null
            });
        }
    }

    try {
        for (const entrega of entradas) {
            await fetch(`/atendimento/${idPedido}/entrega`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoBarras: entrega.codigoBarras,
                    quantidade: entrega.quantidade,
                    responsavel: entrega.responsavel,
                    statusItem: entrega.statusItem
                })
            });
        }
        fecharModal();
        carregarPedidosAtendimento();
    } catch (err) { console.error("Erro ao registrar entrega:", err); }
});
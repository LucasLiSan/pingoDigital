async function carregarPedidosAtendimento() {
    try {
        const resPedidos = await fetch("/pedidos/lista");
        const { pedidos } = await resPedidos.json();

        const container = document.querySelector(".almoxarifadoAtendimento");
        container.innerHTML = "";

        for (const pedido of pedidos) {
            const section = document.createElement("section");
            section.id = "pedido";

            const dataFormatada = new Date(pedido.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
            const statusColor = {
                "ENTREGUE": "#00ff00",
                "CANCELADO": "#ff0000",
                "PENDENTE": "#ffd000"
            }[pedido.statusPedido] || "#aaa";

            const header = `
                <h2><span class="pedido">Pedido: ${pedido.solicitante.numPedido}</span>
                <span class="statusPedido-geral" style="color:${statusColor}">${pedido.statusPedido}</span></h2>
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

            // ⬇ Buscar materiais com localizações associadas ao pedido
            const materiaisComLocal = await Promise.all(
                pedido.materiais.map(async (item) => {
                    const resMat = await fetch(`/materiais/${item.codigoBarras}`);
                    const { material } = await resMat.json();
                    return {
                        item,
                        material
                    };
                })
            );

            // ⬇ Ordenar por armário e prateleira
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
                    "SEPARADO": "#ffd000"
                }[item.statusItem] || "#aaa";

                corpo += `
                    <div id="#${numItem}Item">
                        <span class="numItem">${numItem++}</span>
                        <span class="barCode">${item.codigoBarras}</span>
                        <span class="item">${item.nome}</span>
                        <div class="variacoes">${corCampo}${tamCampo}</div>
                        <span class="qtdPedido">${item.quantidadeSolicitada}</span>
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
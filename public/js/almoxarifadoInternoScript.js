// ===============================
// BOTÃOS DE NAVEGAÇÃO
// ===============================
function abrirAba(aba) {
    const geral = document.querySelector(".almoxarifadoGeral");
    const pedidos = document.querySelector(".almoxarifadoPedidos");
    const cadastro = document.querySelector(".almoxarifadoCadastro");

    // Resetar tudo
    geral.style.display = "block";
    pedidos.style.display = "none";
    cadastro.style.display = "none";

    // Mostrar apenas a aba escolhida
    if (aba === "estoque") {
        geral.style.display = "block";  // grid pro estoque
        pedidos.style.display = "none";
        cadastro.style.display = "none";
    } else if (aba === "pedidos") {
        pedidos.style.display = "block";
        geral.style.display = "none";
        cadastro.style.display = "none";
    } else if (aba === "cadastro") {
        cadastro.style.display = "block";
        pedidos.style.display = "none";
        geral.style.display = "none";
    }
}

// ===============================
// ABA ESTOQUE - CARREGAR ESTOQUE
// ===============================
async function carregarEstoque() {
  try {
    const res = await fetch("/materiais/lista");
    const { materiais } = await res.json();

    const container = document.querySelector(".almoxarifadoGeral");
    
    // Limpa antes de inserir
    container.querySelectorAll(".content-bar").forEach(el => el.remove());

    for (const mat of materiais) {
      const div = document.createElement("div");
      div.className = "content-bar";

      // Status cor
      const statusColor = {
        "EM ESTOQUE": "#00b050",
        "ESGOTADO": "#ff0000"
      }[mat.status] || "#aaa";

      // Formatar tamanho/peso
      let tamanho = "";
      if (mat.medidas?.largura_cm || mat.medidas?.altura_cm || mat.medidas?.comprimento_cm) {
        const l = mat.medidas.largura_cm || "-";
        const a = mat.medidas.altura_cm || "-";
        const c = mat.medidas.comprimento_cm || "-";
        tamanho = `${l} x ${a} x ${c} cm`;
      }
      if (mat.peso_gramas) {
        tamanho += (tamanho ? " | " : "") + `${mat.peso_gramas} g`;
      }

      div.innerHTML = `
        <div class="itemCodBar">${mat.codigoBarras}</div>
        <div class="itemQtd">${mat.quantidadeAtual}</div>
        <div class="itemStatus" style="color:${statusColor}">${mat.status}</div>
        <div class="itemTitle">${mat.nome}</div>
        <div class="itemDescription">${mat.descricao || "-"}</div>
        <div class="itemBrand">${mat.marca || "-"}</div>
        <div class="itemColor">
            ${mat.cor && mat.cor.length ? mat.cor.map(c => `<input type="color" value="${c}" disabled>`).join(" ") : "-"}
        </div>
        <div class="itemTime">${mat.validade ? new Date(mat.validade).toLocaleDateString("pt-BR") : "-"}</div>
        <div class="itemSize">${tamanho || "-"}</div>
        <div class="itemPlace">${mat.localizacao?.armario ? `Armário ${mat.localizacao.armario}, Prat. ${mat.localizacao.prateleira}` : "-"}</div>
        <div class="itemCat">${mat.categoria}</div>
        <div class="btncontainer">
          <button class="cbbtn" onclick="verItem('${mat.codigoBarras}')"><i class="fa-solid fa-eye"></i></button>
          <button class="cbbtn" onclick="editarItem('${mat.codigoBarras}')"><i class="fa fa-pencil"></i></button>
        </div>
      `;

      container.appendChild(div);
    }
  } catch (err) {
    console.error("Erro ao carregar estoque:", err);
  }
}

// Exemplos de handlers
function verItem(codigo) {
  alert("Visualizar: " + codigo);
}
function editarItem(codigo) {
  alert("Editar: " + codigo);
}

window.addEventListener("DOMContentLoaded", carregarEstoque);

// ===============================
// ABA PEDIDOS - CARREGAR PEDIDOS
// ===============================
async function carregarPedidosAtendimento() {
    try {
        const resPedidos = await fetch("/pedidos/lista");
        const { pedidos } = await resPedidos.json();

        const container = document.querySelector(".almoxarifadoPedidos");
        //container.innerHTML = "";

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
                <div class="descricaoPedido">
                    <div class="origemPedido">
                        <h2>
                            <span class="pedido">Pedido: ${pedido.solicitante.numPedido}</span>
                            <span class="statusPedido-geral" style="color:${statusColor}">${pedido.statusPedido}</span>
                        </h2>
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

// ===============================
// ABA CADASTRO
// ===============================
document.querySelector(".searchBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const codigoBarras = document.querySelector(".searchBar").value.trim();
  if (!codigoBarras) {
    alert("Digite um código de barras para buscar.");
    return;
  }

  try {
    const res = await fetch(`/materiais/${codigoBarras}`);
    if (!res.ok) {
      alert("❌ Material não encontrado.");
      return;
    }

    const { material } = await res.json();

    // Preenche os campos do formulário
    const form = document.getElementById("formCadastroMaterial");
    form.querySelector("[name='nome']").value = material.nome || "";
    form.querySelector("[name='descricao']").value = material.descricao || "";
    form.querySelector("[name='marca']").value = material.marca || "";
    form.querySelector("[name='validade']").value = material.validade ? material.validade.split("T")[0] : "";
    form.querySelector("[name='cor']").value = material.cor?.[0] || "#000000";
    form.querySelector("[name='largura_cm']").value = material.medidas?.largura_cm || "";
    form.querySelector("[name='comprimento_cm']").value = material.medidas?.comprimento_cm || "";
    form.querySelector("[name='altura_cm']").value = material.medidas?.altura_cm || "";
    form.querySelector("[name='peso_gramas']").value = material.peso_gramas || "";
    form.querySelector("[name='tamanho_numerico']").value = material.tamanho_numerico || "";
    form.querySelector("[name='volume_ml']").value = material.volume_ml || "";
    form.querySelector("[name='armario']").value = material.localizacao?.armario || "";
    form.querySelector("[name='prateleira']").value = material.localizacao?.prateleira || "";
    form.querySelector("[name='quantidadeAtual']").value = material.quantidadeAtual || 0;
    form.querySelector("[name='categoria']").value = material.categoria || "OUTROS";

    alert(`✅ Material '${material.nome}' carregado para edição.`);

  } catch (err) {
    console.error("Erro ao buscar material:", err);
    alert("Erro ao buscar material: " + err.message);
  }
});

document.getElementById("formCadastroMaterial").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const codigoBarras = document.querySelector(".searchBar").value.trim();

  const dados = {
    nome: form.nome.value,
    descricao: form.descricao.value,
    marca: form.marca.value,
    validade: form.validade.value || null,
    cor: form.cor.value ? [form.cor.value] : [],
    medidas: {
      largura_cm: form.largura_cm.value ? Number(form.largura_cm.value) : null,
      comprimento_cm: form.comprimento_cm.value ? Number(form.comprimento_cm.value) : null,
      altura_cm: form.altura_cm.value ? Number(form.altura_cm.value) : null
    },
    peso_gramas: form.peso_gramas.value ? Number(form.peso_gramas.value) : null,
    tamanho_numerico: form.tamanho_numerico.value ? Number(form.tamanho_numerico.value) : null,
    volume_ml: form.volume_ml.value ? Number(form.volume_ml.value) : null,
    localizacao: {
      armario: form.armario.value,
      prateleira: form.prateleira.value
    },
    quantidadeAtual: form.quantidadeAtual.value ? Number(form.quantidadeAtual.value) : 0,
    categoria: form.categoria.value,
  };

  const entrada = {
    fornecedor: form.fornecedor.value,
    quantidade: Number(form.quantidadeAtual.value),
    data: new Date()
  };

  try {
    if (codigoBarras) {
      // 🔎 Verifica se material já existe
      const checkRes = await fetch(`/materiais/${codigoBarras}`);
      if (checkRes.ok) {
        // 📌 Já existe → Atualiza dados + cria entrada
        await fetch(`/materiais/${codigoBarras}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados)
        });

        await fetch(`/materiais/${codigoBarras}/entrada`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entrada)
        });

        alert(`✅ Material '${dados.nome}' atualizado e entrada registrada.`);

      } else {
        // 📌 Não existe → Cria novo com código fornecido
        await fetch(`/materiais`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...dados, codigoBarras })
        });
        alert(`🆕 Novo material '${dados.nome}' cadastrado.`);
      }
    } else {
      // 📌 Sem código → Cria novo (service gera o código)
      await fetch(`/materiais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      alert(`🆕 Novo material '${dados.nome}' cadastrado com código gerado automaticamente.`);
    }

    form.reset();
    document.querySelector(".search").value = "";

  } catch (err) {
    console.error("Erro ao cadastrar/atualizar material:", err);
    alert("❌ Erro ao cadastrar/atualizar material.");
  }
});
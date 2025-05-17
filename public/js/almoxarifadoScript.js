let carrinho = JSON.parse(localStorage.getItem("carrinhoAlmox")) || [];
const listaCarrinho = document.getElementById("listaCarrinho");
const btnEnviar = document.getElementById("enviarPedido");

// Toast
function showToast(msg) {
    let toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
}

fetch("/materiais/lista")
    .then(res => res.json())
    .then(data => {
        renderMateriais(data.materiais);
        renderizarCarrinho(); // Garante sincronização visual ao carregar
    })
    .catch(err => console.error("Erro ao buscar materiais:", err));

function renderMateriais(materiais) {
    const container = document.getElementById("containerAlmoxarifado");
    container.innerHTML = "";

    materiais.forEach(material => {
        const card = document.createElement("div");
        card.className = "card";

        const estoque = document.createElement("p");
        estoque.className = "estoque";
        if (material.status === "ESGOTADO") estoque.classList.add("esgotado");
        estoque.textContent = material.status;

        const infoIcon = document.createElement("i");
        infoIcon.className = "info fas fa-info-circle";

        const descricao = document.createElement("p");
        descricao.className = "text";
        descricao.textContent = material.descricao || "";

        const imgBx = document.createElement("div");
        imgBx.className = "imgBx";
        const img = document.createElement("img");
        img.src = material.materialPic?.[0] || "/img/sem-foto.png";
        img.alt = material.nome;
        imgBx.appendChild(img);

        const contentBx = document.createElement("div");
        contentBx.className = "contentBx";

        const nome = document.createElement("h2");
        nome.textContent = material.nome;
        contentBx.appendChild(nome);

        if (material.tamanhosDisponiveis && material.tamanhosDisponiveis.length > 0) {
            const sizeDiv = document.createElement("div");
            sizeDiv.className = "size";
            const sizeTitle = document.createElement("h3");
            sizeTitle.textContent = "Tamanhos:";
            sizeDiv.appendChild(sizeTitle);
            material.tamanhosDisponiveis.forEach(tam => {
                const span = document.createElement("span");
                span.textContent = tam;
                sizeDiv.appendChild(span);
            });
            contentBx.appendChild(sizeDiv);
        }

        if (material.cor && material.cor.length > 0) {
            const colorDiv = document.createElement("div");
            colorDiv.className = "color";
            const colorTitle = document.createElement("h3");
            colorTitle.textContent = "Cores:";
            colorDiv.appendChild(colorTitle);
            material.cor.forEach(cor => {
                const span = document.createElement("span");
                span.style.background = cor;
                colorDiv.appendChild(span);
            });
            contentBx.appendChild(colorDiv);
        }

        const button = document.createElement("button");
        button.className = "solicitar-btn";

        const itemNoCarrinho = carrinho.some(item => item.codigoBarras === material.codigoBarras);
        if (itemNoCarrinho) {
            button.textContent = "NO CARRINHO";
            button.classList.add("noHover");
            button.disabled = true;
        } else {
            button.textContent = material.status === "ESGOTADO" ? "SOLICITAR" : "ADICIONAR AO PEDIDO";
            button.addEventListener("click", () => {
                adicionarAoCarrinho(material);
                button.textContent = "NO CARRINHO";
                button.classList.add("noHover");
                button.disabled = true;
                showToast("Item adicionado ao carrinho 🛒");
            });
        }

        contentBx.appendChild(button);

        card.appendChild(estoque);
        card.appendChild(infoIcon);
        card.appendChild(descricao);
        card.appendChild(imgBx);
        card.appendChild(contentBx);
        container.appendChild(card);
    });
}

// Carrinho
function salvarCarrinho() {
    localStorage.setItem("carrinhoAlmox", JSON.stringify(carrinho));
}

function adicionarAoCarrinho(material) {
    const existente = carrinho.find(item => item.codigoBarras === material.codigoBarras);
    if (existente) {
        existente.quantidadeSolicitada += 1;
    } else {
        carrinho.push({
            codigoBarras: material.codigoBarras,
            nome: material.nome,
            quantidadeSolicitada: 1,
            observacao: "",
            statusItem: material.status === "ESGOTADO" ? "EM FALTA" : "PENDENTE"
        });
    }
    salvarCarrinho();
    renderizarCarrinho();
}

function removerDoCarrinho(index) {
    const codigoRemovido = carrinho[index].codigoBarras;
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotaoNaVitrine(codigoRemovido);
}

function atualizarBotaoNaVitrine(codigoBarras) {
    const cards = document.querySelectorAll(".card");
  
    cards.forEach(card => {
      const titulo = card.querySelector("h2");
      const statusTag = card.querySelector(".estoque");
      const button = card.querySelector("button.solicitar-btn");
  
      if (!titulo || !statusTag || !button) return;
  
      const nome = titulo.textContent;
      const status = statusTag.textContent;
  
      const aindaNoCarrinho = carrinho.find(item =>
        item.nome === nome && item.codigoBarras === codigoBarras
      );
  
      if (!aindaNoCarrinho) {
        button.disabled = false;
        button.classList.remove("noHover");
  
        // Aplica o texto com base no status atual do item
        button.innerText = status === "ESGOTADO" ? "SOLICITAR" : "ADICIONAR AO PEDIDO";
  
        // Reanexa o evento de clique para permitir nova adição
        button.addEventListener("click", () => {
          const material = {
            codigoBarras,
            nome,
            status
          };
          adicionarAoCarrinho(material);
          button.innerText = "NO CARRINHO";
          button.classList.add("noHover");
          button.disabled = true;
          showToast("Item adicionado ao carrinho 🛒");
        }, { once: true });
      }
    });
}
  
  

function renderizarCarrinho() {
    listaCarrinho.innerHTML = "";

    carrinho.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.nome}</strong><br>
            Qtd: <input type="number" min="1" value="${item.quantidadeSolicitada}" data-index="${index}" class="inputQtd">
            <br>
            Obs: <input type="text" value="${item.observacao}" data-index="${index}" class="inputObs" placeholder="Para que?">
            <br>
            <small>${item.statusItem === "EM FALTA" ? "⚠️ Item esgotado" : ""}</small>
            <button data-index="${index}" class="btnRemover">🗑️</button>
        `;
        listaCarrinho.appendChild(li);
    });

    document.querySelectorAll(".inputQtd").forEach(input => {
        input.addEventListener("change", e => {
            const index = e.target.dataset.index;
            const novaQtd = parseInt(e.target.value);
            if (novaQtd > 0) {
                carrinho[index].quantidadeSolicitada = novaQtd;
                salvarCarrinho();
            }
        });
    });

    document.querySelectorAll(".inputObs").forEach(input => {
        input.addEventListener("input", e => {
            const index = e.target.dataset.index;
            carrinho[index].observacao = e.target.value;
            salvarCarrinho();
        });
    });

    document.querySelectorAll(".btnRemover").forEach(btn => {
        btn.addEventListener("click", e => {
            const index = e.target.dataset.index;
            removerDoCarrinho(index);
        });
    });
}

// Envio do pedido
btnEnviar.addEventListener("click", () => {
    if (carrinho.length === 0) {
      alert("O carrinho está vazio. Adicione itens antes de enviar o pedido.");
      return;
    }
  
    const resumo = document.getElementById("resumoPedido");
    resumo.innerHTML = "";
  
    carrinho.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.nome}</strong><br>
        Quantidade: ${item.quantidadeSolicitada}<br>
        Observação: ${item.observacao || "—"}
      `;
      resumo.appendChild(li);
    });
  
    document.getElementById("modalConfirmacao").style.display = "flex";
  
    // Armazena nome/setor para usar após confirmar
    window._solicitante = {
      nome: prompt("Seu nome:"),
      setor: prompt("Setor ou sala:"),
      tipo: "PROFESSOR"
    };
  });
  
  document.getElementById("cancelarEnvio").addEventListener("click", () => {
    document.getElementById("modalConfirmacao").style.display = "none";
  });
  
  document.getElementById("confirmarEnvio").addEventListener("click", async () => {
    const modal = document.getElementById("modalConfirmacao");
    modal.style.display = "none";
  
    const solicitante = window._solicitante;
    if (!solicitante.nome || !solicitante.setor) {
      alert("Nome e setor são obrigatórios.");
      return;
    }
  
    try {
      const res = await fetch("/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitante, materiais: carrinho })
      });
  
      if (res.ok) {
        alert("Pedido enviado com sucesso!");
        carrinho = [];
        salvarCarrinho();
        renderizarCarrinho();
        renderMateriais(await (await fetch("/materiais/lista")).json().materiais);
      } else {
        alert("Erro ao enviar pedido.");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao enviar pedido.");
    }
  });
  
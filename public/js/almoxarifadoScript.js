let carrinho = JSON.parse(localStorage.getItem("carrinhoAlmox")) || [];
const listaCarrinho = document.getElementById("listaCarrinho");

function salvarCarrinho() { localStorage.setItem("carrinhoAlmox", JSON.stringify(carrinho)); }

function showToast(msg) {
    let toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
}

fetch("/materiais/lista")
    .then(res => res.json())
    .then(data => {
        window.materiaisRenderizados = data.materiais;
        renderMateriais(data.materiais);
        renderizarCarrinho();
    })
    .catch(err => console.error("Erro ao buscar materiais:", err));

function renderMateriais(materiais) {
    const container = document.getElementById("containerAlmoxarifado");
    container.innerHTML = "";

    materiais.forEach(material => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-codigo-barras", material.codigoBarras);

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

        // Seletor de tamanhos
        if (material.tamanhosDisponiveis?.length) {
            const sizeDiv = document.createElement("div");
            sizeDiv.className = "size";
            sizeDiv.innerHTML = "<h3>Tamanhos:</h3>";
            material.tamanhosDisponiveis.forEach((tam, i) => {
                const label = document.createElement("label");
                label.innerHTML = `<input type="radio" name="size-${material.codigoBarras}" value="${tam}"> ${tam}`;
                sizeDiv.appendChild(label);
            });
            contentBx.appendChild(sizeDiv);
        }

        // Seletor de cores
        if (material.cor?.length) {
            const colorDiv = document.createElement("div");
            colorDiv.className = "color";
            colorDiv.innerHTML = "<h3>Cores:</h3>";
            material.cor.forEach((cor, i) => {
                const label = document.createElement("label");
                label.innerHTML = `<input type="radio" name="cor-${material.codigoBarras}" value="${cor}"> <span style='display:inline-block;width:12px;height:12px;background:${cor};border-radius:50%;margin-left:4px;'></span>`;
                colorDiv.appendChild(label);
            });
            contentBx.appendChild(colorDiv);
        }

        const button = document.createElement("button");
        button.className = "solicitar-btn";
        button.textContent = material.status === "ESGOTADO" ? "SOLICITAR" : "ADICIONAR AO PEDIDO";
        contentBx.appendChild(button);

        // Eventos de clique no botão
        button.addEventListener("click", () => {
            const cor = card.querySelector(`input[name='cor-${material.codigoBarras}']:checked`)?.value;
            const tam = card.querySelector(`input[name='size-${material.codigoBarras}']:checked`)?.value;

            const duplicado = carrinho.find(item =>
                item.codigoBarras === material.codigoBarras &&
                item.corSelecionada === cor &&
                item.tamanhoSelecionado === tam
            );

            if (duplicado) {
                alert("Essa combinação de cor e tamanho já está no carrinho.");
                return;
            }

            const item = {
                codigoBarras: material.codigoBarras,
                nome: material.nome,
                quantidadeSolicitada: 1,
                observacao: "",
                statusItem: material.status === "ESGOTADO" ? "EM FALTA" : "PENDENTE",
                corSelecionada: cor || null,
                tamanhoSelecionado: tam || null
            };

            carrinho.push(item);
            salvarCarrinho();
            renderizarCarrinho();
            showToast("Item adicionado ao carrinho 🛒");
            atualizarTodosBotoesDaVitrine();
        });

        card.appendChild(estoque);
        card.appendChild(infoIcon);
        card.appendChild(descricao);
        card.appendChild(imgBx);
        card.appendChild(contentBx);
        container.appendChild(card);
    });

    atualizarTodosBotoesDaVitrine();
}

function abrirCarrinhoModal() {
    const lista = document.getElementById("resumoCarrinho");
    lista.innerHTML = "";

    carrinho.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.nome}</strong><br>
            ${item.corSelecionada ? `Cor: <span style='display:inline-block;width:12px;height:12px;background:${item.corSelecionada};border-radius:50%;margin-left:4px;'></span><br>` : ""}
            ${item.tamanhoSelecionado ? `Tamanho: ${item.tamanhoSelecionado}<br>` : ""}
            Qtd: <input type="number" value="${item.quantidadeSolicitada}" min="1" data-index="${index}" class="inputQtd"><br>
            Obs: <input type="text" value="${item.observacao}" data-index="${index}" class="inputObs" placeholder="Para que?"><br>
            <button onclick="removerDoCarrinho(${index})">🗑️</button>
        `;
        lista.appendChild(li);
    });

    document.querySelectorAll(".inputQtd").forEach(input => {
        input.addEventListener("change", e => {
            const index = e.target.dataset.index;
            carrinho[index].quantidadeSolicitada = parseInt(e.target.value);
            salvarCarrinho();
            renderizarCarrinho();
        });
    });

    document.querySelectorAll(".inputObs").forEach(input => {
        input.addEventListener("input", e => {
            const index = e.target.dataset.index;
            carrinho[index].observacao = e.target.value;
            salvarCarrinho();
        });
    });

    document.getElementById("modalCarrinho").style.display = "flex";
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
    atualizarTodosBotoesDaVitrine();
    abrirCarrinhoModal(); //força a reconstrução visual do modal
}

function renderizarCarrinho() {
    document.getElementById("contadorCarrinho").textContent = carrinho.length;
    console.log("📦 Carrinho atual:", JSON.stringify(carrinho, null, 2));
}

function atualizarTodosBotoesDaVitrine() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const codigo = card.getAttribute("data-codigo-barras");
        const button = card.querySelector("button.solicitar-btn");
        if (!codigo || !button) return;

        const material = window.materiaisRenderizados.find(m => m.codigoBarras === codigo);
        if (!material) return;

        const cores = material.cor || [null];
        const tamanhos = material.tamanhosDisponiveis || [null];

        if (!material.cor?.length && !material.tamanhosDisponiveis?.length) {
            const estaNoCarrinho = carrinho.some(item => item.codigoBarras === codigo);
            if (estaNoCarrinho) {
                button.textContent = "NO CARRINHO";
                button.classList.add("noHover");
                button.disabled = true;
            } else {
                button.textContent = "ADICIONAR AO PEDIDO";
                button.classList.remove("noHover");
                button.disabled = false;
            }
            return;
        }

        const corSelecionada = card.querySelector(`input[name='cor-${codigo}']:checked`)?.value || null;
        const tamSelecionado = card.querySelector(`input[name='size-${codigo}']:checked`)?.value || null;

        const existe = carrinho.some(item =>
            item.codigoBarras === codigo &&
            item.corSelecionada === corSelecionada &&
            item.tamanhoSelecionado === tamSelecionado
        );

        if ((corSelecionada || tamSelecionado) && existe) {
            button.textContent = "NO CARRINHO";
            button.classList.add("noHover");
            button.disabled = true;
        } else {
            const faltando = cores.some(cor => tamanhos.some(tam =>
                !carrinho.find(item =>
                    item.codigoBarras === codigo &&
                    item.corSelecionada === cor &&
                    item.tamanhoSelecionado === tam
                )
            ));

            if (!faltando) {
                button.textContent = "NO CARRINHO";
                button.classList.add("noHover");
                button.disabled = true;
            } else {
                button.textContent = "ADICIONAR AO PEDIDO";
                button.classList.remove("noHover");
                button.disabled = false;
            }
        }

        const radios = card.querySelectorAll("input[type='radio']");
        radios.forEach(radio => {
            radio.onchange = () => atualizarTodosBotoesDaVitrine();
        });
    });
}

function abrirCarrinhoModal() {
    const lista = document.getElementById("resumoCarrinho");
    lista.innerHTML = "";

    carrinho.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.nome}</strong><br>
            ${item.corSelecionada ? `Cor: <span style='display:inline-block;width:12px;height:12px;background:${item.corSelecionada};border-radius:50%;margin-left:4px;'></span><br>` : ""}
            ${item.tamanhoSelecionado ? `Tamanho: ${item.tamanhoSelecionado}<br>` : ""}
            Qtd: <input type="number" value="${item.quantidadeSolicitada}" min="1" data-index="${index}" class="inputQtd"><br>
            Obs: <input type="text" value="${item.observacao}" data-index="${index}" class="inputObs"   placeholder="Para que?"><br>
            <button onclick="removerDoCarrinho(${index})">🗑️</button>
        `;
        lista.appendChild(li);
    });

    document.querySelectorAll(".inputQtd").forEach(input => {
        input.addEventListener("change", e => {
            const index = e.target.dataset.index;
            carrinho[index].quantidadeSolicitada = parseInt(e.target.value);
            salvarCarrinho();
            renderizarCarrinho();
        });
    });

    document.querySelectorAll(".inputObs").forEach(input => {
        input.addEventListener("input", e => {
            const index = e.target.dataset.index;
            carrinho[index].observacao = e.target.value;
            salvarCarrinho();
        });
    });

    document.getElementById("modalCarrinho").style.display = "flex";
}

// Atualiza exibição final na confirmação do pedido
function atualizarResumoConfirmacao() {
    const resumo = document.getElementById("resumoPedido");
    resumo.innerHTML = "";
    carrinho.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.nome}</strong><br>
            ${item.corSelecionada ? `Cor: <span style='display:inline-block;width:12px;height:12px;background:${item.corSelecionada};border-radius:50%;margin-left:4px;'></span><br>` : ""}
            ${item.tamanhoSelecionado ? `Tamanho: ${item.tamanhoSelecionado}<br>` : ""}
            Qtd: ${item.quantidadeSolicitada}<br>
            Obs: ${item.observacao || "—"}
        `;
        resumo.appendChild(li);
    });
}

function fecharCarrinhoModal() { document.getElementById("modalCarrinho").style.display = "none"; }

function fecharConfirmacao() { document.getElementById("modalConfirmacao").style.display = "none"; }

const btnFinalizar = document.getElementById("finalizarPedido");

if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        fecharCarrinhoModal();
        const nome = prompt("Seu nome:");
        const setor = prompt("Setor ou sala:");
        if (!nome || !setor) return alert("Nome e setor obrigatórios");

        const protocolo = Math.floor(Math.random() * 1000000);
        document.getElementById("tituloConfirmacao").innerHTML = `Pedido nº ${protocolo} - ${nome}<br>Confirmação`;
        window._protocolo = protocolo;
        window._solicitante = { nome, setor, tipo: "PROFESSOR" };
        atualizarResumoConfirmacao();
        document.getElementById("modalAlmoxarifadoConfirmacao").style.display = "flex";
    });
}

document.getElementById("confirmarEnvio").addEventListener("click", async () => {
    const modal = document.getElementById("modalAlmoxarifadoConfirmacao");
    modal.style.display = "none";

    const solicitante = window._solicitante;

    try {
        const res = await fetch("/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ solicitante, materiais: carrinho })
        });

        const result = await res.json();
        if (res.ok) {
            alert(`Pedido enviado com sucesso!\nNúmero: ${result.novoPedido?._id || window._protocolo}`);
            carrinho = [];
            salvarCarrinho();
            renderizarCarrinho();
            const novos = await fetch("/materiais/lista").then(res => res.json());
            renderMateriais(novos.materiais);
        } else {
            alert("Erro ao enviar pedido.");
        }
    } catch (err) {
        console.error("Erro:", err);
        alert("Erro ao enviar pedido.");
    }
});
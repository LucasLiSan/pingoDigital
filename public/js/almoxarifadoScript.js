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

            if (material.tamanhosDisponiveis?.length) {
                const sizeDiv = document.createElement("div");
                sizeDiv.className = "size";
                sizeDiv.innerHTML = "<h3>Tamanhos:</h3>";
                material.tamanhosDisponiveis.forEach(tam => {
                    const span = document.createElement("span");
                    span.textContent = tam;
                    sizeDiv.appendChild(span);
                });
                contentBx.appendChild(sizeDiv);
            }

            if (material.cor?.length) {
                const colorDiv = document.createElement("div");
                colorDiv.className = "color";
                colorDiv.innerHTML = "<h3>Cores:</h3>";
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
                    const copia = JSON.parse(JSON.stringify(material));
                    adicionarAoCarrinho(copia);

                    button.textContent = "NO CARRINHO";
                    button.classList.add("noHover");
                    button.disabled = true;
                    showToast("Item adicionado ao carrinho 🛒");
                }, { once: true });
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

    function adicionarAoCarrinho(material) {
        const existente = carrinho.find(item => item.codigoBarras === material.codigoBarras);

        if (existente) {
            console.warn("⚠️ Item já no carrinho. Ignorando nova adição:", material.codigoBarras);
            return; // Proteção principal contra duplicações
        }

        carrinho.push({
            codigoBarras: material.codigoBarras,
            nome: material.nome,
            quantidadeSolicitada: 1,
            observacao: "",
            statusItem: material.status === "ESGOTADO" ? "EM FALTA" : "PENDENTE"
        });

        salvarCarrinho();
        renderizarCarrinho();
    }

    function removerDoCarrinho(index) {
        carrinho.splice(index, 1);
        salvarCarrinho();
        renderizarCarrinho();
        atualizarTodosBotoesDaVitrine();
        abrirCarrinhoModal(); // 👈 força a reconstrução visual do modal
    }

    function renderizarCarrinho() {
        document.getElementById("contadorCarrinho").textContent = carrinho.length;
        console.log("📦 Carrinho atual:", JSON.stringify(carrinho, null, 2));
    }

    function atualizarTodosBotoesDaVitrine() {
        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            const codigo = card.getAttribute("data-codigo-barras");
            const statusTag = card.querySelector(".estoque");
            const button = card.querySelector("button.solicitar-btn");

            if (!codigo || !statusTag || !button) return;

            const aindaNoCarrinho = carrinho.find(item => item.codigoBarras === codigo);

            if (aindaNoCarrinho) {
                button.textContent = "NO CARRINHO";
                button.classList.add("noHover");
                button.disabled = true;
            } else {
                button.disabled = false;
                button.classList.remove("noHover");
                button.textContent = statusTag.textContent === "ESGOTADO" ? "SOLICITAR" : "ADICIONAR AO PEDIDO";
                button.onclick = () => {
                    if (button.disabled) return; // Proteção extra
                    button.disabled = true; // Prevê múltiplos cliques rápidos

                    const materialOriginal = window.materiaisRenderizados.find(mat => mat.codigoBarras === codigo);
                    if (!materialOriginal) return console.warn("❗ Material não encontrado:", codigo);

                    const copia = JSON.parse(JSON.stringify(materialOriginal));
                    adicionarAoCarrinho(copia);

                    button.textContent = "NO CARRINHO";
                    button.classList.add("noHover");
                    showToast("Item adicionado ao carrinho 🛒");
                };
            }
        });
    }

    function abrirCarrinhoModal() {
        const lista = document.getElementById("resumoCarrinho");
        lista.innerHTML = "";

        carrinho.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${item.nome}</strong><br>
                Qtd: <input type="number" value="${item.quantidadeSolicitada}" min="1" data-index="${index}" class="inputQtd">
                <br>
                Obs: <input type="text" value="${item.observacao}" data-index="${index}" class="inputObs" placeholder="Para que?">
                <br>
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

    function fecharCarrinhoModal() { document.getElementById("modalCarrinho").style.display = "none"; }

    document.getElementById("finalizarPedido").addEventListener("click", () => {
        fecharCarrinhoModal();

        const nome = prompt("Seu nome:");
        const setor = prompt("Setor ou sala:");
        if (!nome || !setor) return alert("Nome e setor obrigatórios");

        const protocolo = Math.floor(Math.random() * 1000000);
        const titulo = document.getElementById("tituloConfirmacao");
        titulo.innerHTML = `Pedido nº ${protocolo} - ${nome}<br>Confirmação`;

        window._protocolo = protocolo;
        window._solicitante = { nome, setor, tipo: "PROFESSOR" };

        const resumo = document.getElementById("resumoPedido");
        resumo.innerHTML = "";
        carrinho.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${item.nome}</strong> — Qtd: ${item.quantidadeSolicitada}<br>
                Obs: ${item.observacao || "—"}
            `;
            resumo.appendChild(li);
        });

        document.getElementById("modalAlmoxarifadoConfirmacao").style.display = "flex";
    });

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
            } else { alert("Erro ao enviar pedido."); }
        } catch (err) {
            console.error("Erro:", err);
            alert("Erro ao enviar pedido.");
        }
    });

    function fecharConfirmacao() { document.getElementById("modalConfirmacao").style.display = "none"; }
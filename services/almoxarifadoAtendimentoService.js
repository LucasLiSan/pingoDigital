import Pedido from "../models/almoxarifadoPedidos.js";
import Material from "../models/almoxarifado.js";
import MaterialService from "./almoxarifadoService.js"; // ✅ IMPORTANTE: adiciona o service de materiais

class AtendimentoService {
    // Listar pedidos com status PENDENTE ou EM SEPARAÇÃO
    async listarPedidosPendentes() {
        try {
            const pedidos = await Pedido.find({ statusPedido: { $in: ["PENDENTE", "EM SEPARAÇÃO"] } }).lean();

            for (let pedido of pedidos) {
                for (let item of pedido.materiais) {
                    const material = await Material.findOne({ codigoBarras: item.codigoBarras }).lean();
                    item.localizacao = material?.localizacao || { armario: "-", prateleira: "-" };
                }

                // Ordenar materiais por armário e prateleira
                pedido.materiais.sort((a, b) => {
                    const armA = a.localizacao.armario || "";
                    const armB = b.localizacao.armario || "";

                    if (armA !== armB) return armA.localeCompare(armB);

                    const pratA = a.localizacao.prateleira || "";
                    const pratB = b.localizacao.prateleira || "";
                    return pratA.localeCompare(pratB);
                });
            }

            return pedidos;
        } catch (err) {
            console.error("Erro ao listar pedidos pendentes:", err);
            throw err;
        }
    }

    // Registrar entrega parcial ou total de item
    async registrarEntrega(idPedido, codigoBarras, entrega) {
        const pedido = await Pedido.findById(idPedido);
        if (!pedido) throw new Error("Pedido não encontrado.");

        const item = pedido.materiais.find(i => i.codigoBarras === codigoBarras);
        if (!item) throw new Error("Item não encontrado.");

        // ✅ Registrar entrega
        item.entregas.push({
            quantidade: entrega.quantidade,
            dataEntrega: new Date(),
            responsavel: entrega.responsavel || "Desconhecido"
        });

        // ✅ Atualiza status individual do item
        if (entrega.statusItem) {
            item.statusItem = entrega.statusItem;
        } else {
            const totalEntregue = item.entregas.reduce((sum, e) => sum + e.quantidade, 0);
            if (totalEntregue >= item.quantidadeSolicitada) {
                item.statusItem = "ENTREGUE";
            } else if (totalEntregue > 0) {
                item.statusItem = "ENTREGA PARCIAL";
            } else {
                item.statusItem = "PENDENTE";
            }
        }

        // ✅ Atualiza status geral do pedido
        if (pedido.materiais.every(i => i.statusItem === "ENTREGUE")) {
            pedido.statusPedido = "ENTREGUE";
        } else if (pedido.materiais.some(i => i.statusItem === "ENTREGA PARCIAL")) {
            pedido.statusPedido = "ENTREGA PARCIAL";
        } else {
            pedido.statusPedido = "EM SEPARAÇÃO";
        }

        pedido.atualizadoEm = new Date();
        await pedido.save();

        // === 🔹 Atualizar estoque físico do material === //
        try {
            if (entrega.quantidade > 0) {
                await MaterialService.addSaida(codigoBarras, {
                    quantidade: entrega.quantidade,
                    data: new Date(),
                    motivo: `Entrega do pedido ${pedido.solicitante.numPedido}`,
                    destino: pedido.solicitante.setor,
                    origem: "Almoxarifado"
                });
            }
        } catch (err) {
            console.error(`Erro ao atualizar estoque do material ${codigoBarras}:`, err);
        }

        return pedido;
    }

    // Cancelar pedido
    async cancelarPedido(id) {
        return await Pedido.findByIdAndUpdate(
            id,
            { statusPedido: "CANCELADO", atualizadoEm: new Date() },
            { new: true }
        );
    }
}

export default new AtendimentoService();

import Pedido from "../models/almoxarifadoPedidos.js";
import Material from "../models/almoxarifado.js";

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

        item.entregas.push({
            quantidade: entrega.quantidade,
            dataEntrega: new Date(),
            responsavel: entrega.responsavel || "Desconhecido"
        });

        const totalEntregue = item.entregas.reduce((sum, e) => sum + e.quantidade, 0);

        if (totalEntregue >= item.quantidadeSolicitada) { item.statusItem = "ENTREGUE"; }
        else { item.statusItem = "SEPARADO"; }

        // Atualiza status geral do pedido se necessário
        const todosEntregues = pedido.materiais.every(i => i.statusItem === "ENTREGUE");
        pedido.statusPedido = todosEntregues ? "ENTREGUE" : "EM SEPARAÇÃO";

        pedido.atualizadoEm = new Date();
        await pedido.save();
        return pedido;
    }

    // Cancelar pedido
    async cancelarPedido(id) {
        return await Pedido.findByIdAndUpdate(id, {
            statusPedido: "CANCELADO",
            atualizadoEm: new Date()
        }, { new: true });
    }
}

export default new AtendimentoService();
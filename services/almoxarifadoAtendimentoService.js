import Pedido from "../models/almoxarifadoPedidos.js";

class AtendimentoService {
  async listarPedidosPendentes() {
    return await Pedido.find({ statusPedido: { $in: ["PENDENTE", "EM SEPARAÇÃO"] } });
  }

  async registrarEntrega(idPedido, codigoBarras, entrega) {
    const pedido = await Pedido.findById(idPedido);
    if (!pedido) throw new Error("Pedido não encontrado.");

    const item = pedido.materiais.find(i => i.codigoBarras === codigoBarras);
    if (!item) throw new Error("Item não encontrado.");

    item.entregas.push({
      quantidade: entrega.quantidade,
      dataEntrega: new Date()
    });

    if (entrega.quantidade >= item.quantidadeSolicitada) {
      item.statusItem = "ENTREGUE";
    } else {
      item.statusItem = "SEPARADO";
    }

    // Se todos os itens estão entregues, muda status geral
    const todosEntregues = pedido.materiais.every(i => i.statusItem === "ENTREGUE");
    pedido.statusPedido = todosEntregues ? "ENTREGUE" : "EM SEPARAÇÃO";

    pedido.atualizadoEm = new Date();
    await pedido.save();
    return pedido;
  }

  async cancelarPedido(id) {
    return await Pedido.findByIdAndUpdate(id, { statusPedido: "CANCELADO" }, { new: true });
  }
}

export default new AtendimentoService();
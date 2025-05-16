import Pedido from "../models/almoxarifadoPedidos.js";

class PedidoService {
  // Criar um novo pedido
  async create(solicitante, materiais) {
    try {
      for (let mat of materiais) {
      const material = await Pedido.findOne({ codigoBarras: mat.codigoBarras });
      if (material?.status === "ESGOTADO") {
        mat.statusItem = "EM FALTA";
      }
    }
      const novoPedido = new Pedido({ solicitante, materiais });
      await novoPedido.save();
      return novoPedido;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  }

  // Listar todos os pedidos
  async getAll() {
    try {
      return await Pedido.find().sort({ criadoEm: -1 });
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  }

  // Buscar pedido por ID
  async getOne(id) {
    try {
      return await Pedido.findById(id);
    } catch (error) {
      console.error("Erro ao buscar pedido por ID:", error);
    }
  }

  // Atualizar status do pedido (geral)
  async updateStatusPedido(id, statusPedido) {
    try {
      const atualizado = await Pedido.findByIdAndUpdate(
        id,
        { statusPedido, atualizadoEm: new Date() },
        { new: true }
      );
      return atualizado;
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      throw error;
    }
  }

  // Atualizar status de um item específico dentro do pedido
  async updateStatusItem(idPedido, codigoBarras, novoStatus) {
    try {
      const pedido = await Pedido.findById(idPedido);
      if (!pedido) throw new Error("Pedido não encontrado.");

      const item = pedido.materiais.find(m => m.codigoBarras === codigoBarras);
      if (!item) throw new Error("Item não encontrado no pedido.");

      item.statusItem = novoStatus;
      pedido.atualizadoEm = new Date();
      await pedido.save();
      return pedido;
    } catch (error) {
      console.error("Erro ao atualizar status do item:", error);
      throw error;
    }
  }

  // Deletar pedido
  async delete(id) {
    try {
      await Pedido.findByIdAndDelete(id);
      console.log(`Pedido ID: ${id} deletado com sucesso.`);
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
    }
  }

  // Buscar pedidos por nome do solicitante (útil para listar do professor)
  async getBySolicitante(nome) {
    try {
      return await Pedido.find({ "solicitante.nome": nome }).sort({ criadoEm: -1 });
    } catch (error) {
      console.error("Erro ao buscar pedidos por solicitante:", error);
    }
  }
}

export default new PedidoService();
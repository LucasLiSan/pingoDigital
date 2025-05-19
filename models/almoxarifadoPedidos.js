import mongoose from "mongoose";

const itemPedidoSchema = new mongoose.Schema({
    codigoBarras: { type: String, required: true },
    nome: String,
    quantidadeSolicitada: { type: Number, required: true },
    observacao: String, // exemplo: "Usar na Feira de Ciências", "Preciso para segunda-feira"
    statusItem: {
        type: String,
        enum: ["PENDENTE", "DISPONÍVEL", "EM FALTA", "SEPARADO", "ENTREGUE"],
        default: "PENDENTE"
    }
});

const pedidoSchema = new mongoose.Schema({
    solicitante: {
        nome: { type: String, required: true },
        setor: String, // Ex: "3º Ano A", "Coordenação", "Direção"
        tipo: {
            type: String,
            enum: ["PROFESSOR", "FUNCIONÁRIO", "OUTRO"],
            default: "PROFESSOR"
        }
    },
    materiais: [itemPedidoSchema],
    statusPedido: {
        type: String,
        enum: ["PENDENTE", "EM SEPARAÇÃO", "PRONTO PARA ENTREGA", "ENTREGUE", "CANCELADO"],
        default: "PENDENTE"
    },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("Pedido", pedidoSchema);
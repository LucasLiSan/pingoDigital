import mongoose from "mongoose";

const itemPedidoSchema = new mongoose.Schema({
    codigoBarras: String,
    nome: String,
    quantidadeSolicitada: Number,
    corSelecionada: String,
    tamanhoSelecionado: String,
    observacao: String,
    statusItem: {
        type: String,
        enum: ["PENDENTE", "DISPONÍVEL", "EM FALTA", "SEPARADO", "ENTREGA PARCIAL", "ENTREGUE"],
        default: "PENDENTE"
    },
    entregas: [{
            quantidade: Number,
            dataEntrega: Date,
            responsavel: String
    }]
});

const pedidoSchema = new mongoose.Schema({
    solicitante: {
        numPedido: { type: Number, required: true},
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
        enum: ["PENDENTE", "EM SEPARAÇÃO", "PRONTO PARA ENTREGA", "ENTREGUE", "ENTREGA PARCIAL", "CANCELADO"],
        default: "PENDENTE"
    },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("Pedido", pedidoSchema);
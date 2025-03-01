import mongoose from "mongoose";

const movementSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now }, // Data da movimentação
    from: { type: String, required: true }, // Local de origem
    to: { type: String, required: true }, // Local de destino
    type: { type: String, required: true, enum: ["PERMANENTE", "TEMPORÁRIO"] }, // Tipo da movimentação
});

const patSchema = new mongoose.Schema({
    codPat: {type: String, required: true, unique: true}, //codigo do patrimonio
    descrition: {type: String, required: true}, //descricao do patrimonio
    situation: {type: String, required: true, enum:["EXCELENTE", "ÓTIMO", "BOM", "REGULAR", "RUIM", "INSERVIVEL"]}, //estado de conservação do patrimonio
    local: {type: String, required: true}, //em que comodo esta
    ue: {type: String, required: true}, //em que escola/local esta
    lastCheck: {type: Date, required: true}, //ultima checagem desse patrimonio
    obs: {type: String}, //observacao se necessario
    value: {type: Number, default: 0}, //valor do patrimonio
    fiscal: {type: String}, //notas ficais se houverem
    patPic: {type: String}, //foto do patrimonio
    history: [movementSchema] // Histórico de movimentações
});

const Patrimonio = mongoose.model('Patrimonio', patSchema);

export default Patrimonio;
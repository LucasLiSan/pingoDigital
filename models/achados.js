import mongoose from "mongoose";

const donoSchema = new mongoose.Schema({
    dono: {type: String},
    dono_turma: {type: String},
    data_devolucao: {type: Date}
});

const achadosSchema = new mongoose.Schema ({
    item: { type: String, required: true, unique: true},
    desc_item: { type: String, required: true},
    pic: { type: String, required: true},
    data: { type: Date, required: true },
    situacao: { type: String, required: true, enum:["PERDIDO", "DEVOLVIDO", "DOADO"]},
    dono: { type: donoSchema, required: false }
});

const AchadosPerdidos = mongoose.model('AchadosPerdidos', achadosSchema);

export default AchadosPerdidos;
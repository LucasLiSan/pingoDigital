import mongoose from "mongoose";

const achadosSchema = new mongoose.Schema ({
    item: { type: String, require: true},
    pic: { type: String, require: true},
    data: { type: Date, require: true},
    situacao: { type: String, require: true, enum:["PERDIDO, DEVOLVIDO, DOADO"]}
});

const AchadosPerdidos = mongoose.model('AchadosPerdidos', achadosSchema);

export default AchadosPerdidos;
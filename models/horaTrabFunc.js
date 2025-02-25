import mongoose from "mongoose";

const horariosSchema = new mongoose.Schema({
    matricula: { type: String, required: true, unique: true},
    nomeFunc: { type: String, required: true},
    cargoFunc: { type: String, required: true},
    horaIn: { type: String},
    horaOut: { type: String},
    almocoIn: { type: String},
    almocoOut: { type: String},
    htpcIn: { type: String},
    htpcOut: { type: String}
});

const HorarioFuncionarios = mongoose.model('HorarioFuncionarios', horariosSchema);

export default HorarioFuncionarios;
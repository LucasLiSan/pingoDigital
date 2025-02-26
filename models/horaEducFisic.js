import mongoose from "mongoose";

const horarioEducFisicSchema = new mongoose.Schema({
    matricula: { type: String, required: true},
    nomeProf: { type: String, required: true},
    DiaSemana: { type: String, required: true},
    horaIn: { type: String},
    horaOut: { type: String},
    turma: { type: String}
});

const HorarioEducacaoFisica = mongoose.model('HorarioEducacaoFisica', horarioEducFisicSchema);

export default HorarioEducacaoFisica;
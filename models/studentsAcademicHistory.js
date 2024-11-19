import mongoose from "mongoose";

const academicSchema = new mongoose.Schema({
    alunoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Relaciona com o aluno
    escola: String,     // Nome da escola
    anoLetivo: String,  // O ano letivo corrente Ex: "2024"
    classe: String,     // A serie da criança esta Ex: "1º Ano-A"
    tipo: String,       // Tipo de ensino Ex: "Educação infantil"
    sala: String,       // Sala física Ex: "Sala 1"
    turno: {type: String, enum: ["Manhã", "Tarde", "Noite", "Integral"], default: "Manhã"}, // Turno de aula Ex: "Manhã"
    dataInicio: { type: Date, default: Date.now }, // Quando começou o ano letivo ou a entrada na escola
    dataFim: Date       // Quando terminou o ano letivo ou o período até a transferencia ou remanejamento do aluno (pode ser null para o ano atual)
});

const Academic = mongoose.model('Academic', academicSchema);
export default Academic;
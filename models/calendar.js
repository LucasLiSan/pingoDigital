import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema ({
    data_evento: {type: Date},
    descricao_evento: {type: String},
    participantes: [String]
});

const diaSchema = new mongoose.Schema ({
    dia: {type: Number, require: true},
    dia_semana: {type: String, require: true, enum:["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]},
    situacao: {type: String, require: true, enum:["FERIADO", "FÉRIAS", "PLANEJAMENTO", "LETIVO", "PONTO FACULTATIVO", "CONSELHO DE CLASSE", "RECESSO", "NÃO LETIVO", "SÁBADO", "DOMINGO"]},
    eventos: [eventoSchema]
});

const calendarioSchema = new mongoose.Schema ({
    mes: { type: String, require: true},
    ano: { type: Number, require: true},
    dias: [diaSchema]
});

const CalendarioEscolar = mongoose.model('CalendarioEscolar', calendarioSchema);

export default CalendarioEscolar;
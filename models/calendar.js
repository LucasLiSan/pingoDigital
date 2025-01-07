import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema({
    data_evento: { type: String, required: true, trim: true }, // Usando string para data no formato "DD/MM/YYYY"
    descricao_evento: { type: String, required: true, trim: true },
    participantes: [{ type: String, trim: true }] // Lista de participantes
});

const DiaSchema = new mongoose.Schema({
    dia: { type: Number, required: true },
    dia_semana: { type: String, required: true, trim: true },
    situacao: { type: String, required: true, trim: true, enum: ["SÁBADO", "DOMINGO", "LETIVO", "NÃO LETIVO","FERIADO", "PONTO FACULTATIVO", "FÉRIAS", "PLANEJAMENTO", "CONSELHO DE CLASSE", "RECESSO"] },
    eventos: [EventoSchema] // Lista de eventos
});

const MesSchema = new mongoose.Schema({
    mes: { type: String, required: true, trim: true },
    ano: { type: Number, required: true },
    dias: [DiaSchema] // Lista de dias no mês
});

const CalendarioEscolarSchema = new mongoose.Schema({
    calendario_escolar: [MesSchema] // Lista de meses com os dias e eventos
});

const CalendarioEscolar = mongoose.model('CalendarioEscolar', CalendarioEscolarSchema);

export default CalendarioEscolar;

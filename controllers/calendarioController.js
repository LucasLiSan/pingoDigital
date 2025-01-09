import calendarioService from "../services/calendarioService.js";
import { ObjectId } from "mongodb";

/* --- Renderizar a página do calendário --- */
const renderCalendarPage = (req, res) => {
    try {
        res.render("calendario"); // Renderiza a página "calendario"
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao carregar a página do calendário." }); // Status 500: Internal Server Error
    }
};

/* --- Inserir novo dia --- */
const createNewDay = async (req, res) => {
    try {
        const { mes, ano, dia, dia_semana, situacao, eventos } = req.body;
        const updatedCalendar = await calendarioService.create(mes, ano, dia, dia_semana, situacao, eventos);
        res.status(201).json({ Success: "Dia cadastrado com sucesso", calendario: updatedCalendar });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno no servidor' });
    }
}

/* --- Listar todos os dias --- */
const getAllDays = async (req, res) => {
    try {
        const days = await calendarioService.getAll();
        res.status(200).json({ days: days });
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Erro interno do servidor.'});
    }
}

export default {
    renderCalendarPage,
    createNewDay,
    getAllDays
};
import calendarioService from "../services/calendarioService.js";
import { ObjectId } from "mongodb";
import moment from "moment";

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
    /* --- Single --- */
    const createNewDay = async (req, res) => {
        try {
            const { mes, ano, dia, dia_semana, situacao, eventos } = req.body;

            // Converte as datas no formato correto
            const eventosFormatados = eventos.map(evento => ({
                ...evento,
                data_evento: moment(evento.data_evento, "DD/MM/YYYY").toDate() // Converte para Date
            }));

            const updatedCalendar = await calendarioService.create(mes, ano, dia, dia_semana, situacao, eventosFormatados);
            res.status(201).json({ Success: "Dia cadastrado com sucesso", calendario: updatedCalendar });
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: 'Erro interno no servidor' });
        }
    };

    /* --- Multiple --- */
    const createMultipleDays = async (req, res) => {
        try {
            const { mes, ano, dias } = req.body; // Recebe o mês, ano e array de dias no corpo da requisição
    
            // Chama o método do serviço para criar o calendário com múltiplos dias
            const calendario = await calendarioService.create(mes, ano, dias);
    
            res.status(201).json({ Success: "Calendário atualizado com sucesso", calendario });
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: "Erro ao cadastrar múltiplos dias." });
        }
    };


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

/* --- Listar um mês --- */
const getCalendarById = async (req, res) => {
    try {
        const { id } = req.params; // ID passado como parâmetro na URL
        const calendario = await calendarioService.getById(id);

        if (!calendario) {
            return res.status(404).json({ message: `Nenhum calendário encontrado para o ID: ${id}` });
        }

        res.status(200).json({ calendario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao buscar calendário pelo ID." });
    }
};

/* --- Atualizar calendário --- */
const updateCalendar = async (req, res) => {
    try {
        const { id } = req.params; // ID do calendário a ser atualizado
        const { mes, ano, dias } = req.body; // Novos dados do calendário

        // Atualiza o calendário e retorna o resultado
        const updatedCalendar = await calendarioService.update(id, mes, ano, dias);

        res.status(200).json({
            Success: "Calendário atualizado com sucesso",
            calendario: updatedCalendar,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao atualizar o calendário." });
    }
};

const updateDay = async (req, res) => {
    try {
        const { dayId } = req.params; // ID do dia
        const updatedDay = req.body; // Dados atualizados do dia

        const updatedCalendar = await calendarioService.updateDay(dayId, updatedDay);

        res.status(200).json({
            Success: "Dia atualizado com sucesso",
            calendario: updatedCalendar,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao atualizar o dia." });
    }
};

/* --- Deletar calendário --- */
const deleteCalendar = async (req, res) => {
    try {
        const { id } = req.params; // ID do calendário a ser deletado

        // Verifica se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ err: "ID inválido." });
        }

        await calendarioService.delete(id);

        res.status(200).json({ Success: "Calendário deletado com sucesso" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao deletar o calendário." });
    }
};

const deleteSpecificDay = async (req, res) => {
    try {
        const { calendarioId, diaId } = req.params; // IDs passados como parâmetros na URL

        const updatedCalendar = await calendarioService.deleteDay(calendarioId, diaId);
        res.status(200).json({ Success: "Dia removido com sucesso", calendario: updatedCalendar });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao remover o dia." });
    }
};

export default {
    renderCalendarPage,
    createNewDay,
    createMultipleDays,
    getAllDays,
    getCalendarById,
    updateCalendar,
    updateDay,
    deleteCalendar,
    deleteSpecificDay
};
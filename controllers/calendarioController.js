import calendarService from "../services/calendarioService.js";

/* --- Renderizar a página do calendário --- */
const renderCalendarPage = (req, res) => {
    try {
        res.render("calendario"); // Renderiza a página "calendario"
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao carregar a página do calendário." }); // Status 500: Internal Server Error
    }
};

/* --- Inserir novo dia com eventos --- */
const createNewDay = async (req, res) => {
    try {
        const { mes, ano, dia, dia_semana, situacao, eventos } = req.body;
        const updatedCalendar = await calendarService.createDay(mes, ano, dia, dia_semana, situacao, eventos);
        res.status(201).json({ Success: `Dia ${dia}/${mes}/${ano} cadastrado com sucesso no calendário.` }); // Status 201: Created
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro interno do servidor." }); // Status 500: Internal Server Error
    }
};

/* --- Listar todos os meses e dias --- */
const getAllCalendar = async (req, res) => {
    try {
        const calendar = await calendarService.getAll();
        res.status(200).json({ calendar }); // Status 200: OK
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro interno do servidor." }); // Status 500: Internal Server Error
    }
};

/* --- Listar um mês específico --- */
const getMonth = async (req, res) => {
    try {
        const { mes, ano } = req.params;
        const calendarMonth = await calendarService.getMonth(mes, ano);
        if (!calendarMonth) {
            res.status(404).json({ err: `Mês ${mes}/${ano} não encontrado.` }); // Status 404: Not Found
        } else {
            res.status(200).json({ calendarMonth }); // Status 200: OK
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro interno do servidor." }); // Status 500: Internal Server Error
    }
};

/* --- Atualizar informações de um dia --- */
const updateDay = async (req, res) => {
    try {
        const { mes, ano, dia } = req.params;
        const updates = req.body;
        const updatedCalendar = await calendarService.updateDay(mes, ano, dia, updates);
        res.status(200).json({ Success: `Dia ${dia}/${mes}/${ano} atualizado com sucesso.` }); // Status 200: OK
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro interno do servidor." }); // Status 500: Internal Server Error
    }
};

/* --- Deletar um dia específico --- */
const deleteDay = async (req, res) => {
    try {
        const { mes, ano, dia } = req.params;
        await calendarService.deleteDay(mes, ano, dia);
        res.status(204).send(); // Status 204: No Content
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro interno do servidor." }); // Status 500: Internal Server Error
    }
};

export default {
    renderCalendarPage,
    createNewDay,
    getAllCalendar,
    getMonth,
    updateDay,
    deleteDay
};

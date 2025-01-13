import express from "express";
import calendarioController from "../controllers/calendarioController.js";

const calendarioRoutes = express.Router();

/* Renderizar a página do calendário */
calendarioRoutes.get("/calendario", calendarioController.renderCalendarPage);

/* --- ENDPOINTS --- */
    /* 1º Endpoint: Cadastrar dia (Single) */
    calendarioRoutes.post("/calendario", calendarioController.createNewDay);

    /* 2º Endpoint: Cadastrar dia (Multi) */
    calendarioRoutes.post("/calendario/multiplo", calendarioController.createMultipleDays);
    
    /* 3º Endpoint: Listar todos */
    calendarioRoutes.get("/dias", calendarioController.getAllDays);

    /* 4º Endpoint: Listar um mês */
    calendarioRoutes.get("/calendario/id/:id", calendarioController.getCalendarById);

    /* 5º Endpoint: Atualizar calendário */
    calendarioRoutes.patch("/calendario/:id", calendarioController.updateCalendar);

    /* 6º Endpoint: Atualizar um dia específico */
    calendarioRoutes.patch("/calendario/dia/:dayId", calendarioController.updateDay);

    /* 7º Endpoint: Deletar calendário */
    calendarioRoutes.delete("/calendario/:id", calendarioController.deleteCalendar);

    /* 8º Endpoint: Deletar dia especifico*/
    calendarioRoutes.delete("/calendario/:calendarioId/dia/:diaId", calendarioController.deleteSpecificDay);


export default calendarioRoutes;
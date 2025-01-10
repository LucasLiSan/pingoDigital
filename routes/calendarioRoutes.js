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

    /* 4º Endpoint: Atualizar calendário */
    calendarioRoutes.patch("/calendario/:id", calendarioController.updateCalendar);

    /* 5º Endpoint: Deletar calendário */
    calendarioRoutes.delete("/calendario/:id", calendarioController.deleteCalendar);

export default calendarioRoutes;
import express from "express";
import calendarioController from "../controllers/calendarioController.js";

const calendarioRoutes = express.Router();

/* Renderizar a página do calendário */
calendarioRoutes.get("/calendario", calendarioController.renderCalendarPage);

/* --- ENDPOINTS --- */
    /* 1º Endpoint: Cadastrar dia */
    calendarioRoutes.post("/calendario", calendarioController.createNewDay);
    
    /* 2º Endpoint: Listar todos */
    calendarioRoutes.get("/dias", calendarioController.getAllDays);

export default calendarioRoutes;
import express from "express";
import calendarController from "../controllers/calendarioController.js";

const calendarioRoutes = express.Router();

calendarioRoutes.get("/calendario", calendarController.renderCalendarPage); // Renderizar a página do calendário
calendarioRoutes.post("/calendario", calendarController.createNewDay); // Criar novo dia
calendarioRoutes.get("/calendario/all", calendarController.getAllCalendar); // Listar todos os meses
calendarioRoutes.get("/calendario/:mes/:ano", calendarController.getMonth); // Listar um mês específico
calendarioRoutes.put("/calendario/:mes/:ano/:dia", calendarController.updateDay); // Atualizar um dia
calendarioRoutes.delete("/calendario/:mes/:ano/:dia", calendarController.deleteDay); // Deletar um dia

export default calendarioRoutes;
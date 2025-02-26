import express from "express";
import horaEducFisicaController from "../controllers/horaTrabEducFisicaController.js";

const aulaRoutes = express.Router();

/* --- ENDPOINTS --- */
/* 1º Endpoint: Cadastrar um novo livro */
aulaRoutes.post("/aulaEF", horaEducFisicaController.createNewHora);

/* 2º Endpoint: Listar todos os livros */
aulaRoutes.get("/aulasEF", horaEducFisicaController.getAllHoras);

/* 3º Endpoint: Listar um livro */
aulaRoutes.get("/aulaEF/:id", horaEducFisicaController.getOneHora);

/* 4º Endpoint: Atualizar um livro */
aulaRoutes.patch("/aulaEF/:id", horaEducFisicaController.updateHora);

/* 5º Endpoint: Deletar um livro */
aulaRoutes.delete("/aulaEF/:id", horaEducFisicaController.deleteHora);

export default aulaRoutes;
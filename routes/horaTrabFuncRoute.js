import express from "express";
import horaControllers from "../controllers/horaTrabFuncController.js";

const horaRoutes = express.Router();

/* --- ENDPOINTS --- */
/* 1º Endpoint: Cadastrar um novo livro */
horaRoutes.post("/hora", horaControllers.createNewHora);

/* 2º Endpoint: Listar todos os livros */
horaRoutes.get("/horas", horaControllers.getAllHoras);

/* 3º Endpoint: Listar um livro */
horaRoutes.get("/hora/:id", horaControllers.getOneHora);

/* 4º Endpoint: Atualizar um livro */
horaRoutes.patch("/hora/:id", horaControllers.updateHora);

/* 5º Endpoint: Deletar um livro */
horaRoutes.delete("/hora/:id", horaControllers.deleteHora);

export default horaRoutes;
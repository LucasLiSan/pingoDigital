import express from "express";
import achadosController from "../controllers/achadosController.js";

const achadosRoutes = express.Router();

achadosRoutes.get("/achados", achadosController.renderAchadosPage);

/* --- ENDPOINTS --- */
/* 1º Endpoint: Cadastrar um novo item perdido */
achadosRoutes.post("/perdido", achadosController.createNewItem);

/* 2º Endpoint: Listar todos os itens */
achadosRoutes.get("/perdidos", achadosController.getAllItems);

/* 3º Endpoint: Listar um item específico */
achadosRoutes.get("/perdido/:itemCode", achadosController.getOneItem);

/* 4º Endpoint: Atualizar um item */
achadosRoutes.put("/perdido/:id", achadosController.updateItem);

/* 5º Endpoint: Deletar um item */
achadosRoutes.delete("/perdido/:id", achadosController.deleteItem);

/* 6º Endpoint: Listar apenas itens PERDIDOS */
achadosRoutes.get("/perdidos/perdidos", achadosController.getLostItems);

/* 7º Endpoint: Marcar um item como DEVOLVIDO */
achadosRoutes.patch("/perdido/:id/devolvido", achadosController.markItemAsReturned);

export default achadosRoutes;
import express from "express";
import almoxarifadoController from "../controllers/almoxarifadoController.js";

const almoxarifadoRoutes = express.Router();

// Página principal de materiais (EJS)
almoxarifadoRoutes.get("/almoxarifado", almoxarifadoController.renderAlmoxarifadoPage);

// CRUD
almoxarifadoRoutes.post("/materiais", almoxarifadoController.createNewMaterial);           // Criar novo material
almoxarifadoRoutes.get("/materiais/lista", almoxarifadoController.getAllMaterials);       // Listar todos
almoxarifadoRoutes.get("/materiais/:codigoBarras", almoxarifadoController.getMaterialByCodigo); // Buscar por código

almoxarifadoRoutes.put("/materiais/:codigoBarras", almoxarifadoController.updateMaterial);     // Atualizar
almoxarifadoRoutes.delete("/materiais/:codigoBarras", almoxarifadoController.deleteMaterial);  // Deletar

// Movimentações
almoxarifadoRoutes.post("/materiais/:codigoBarras/entrada", almoxarifadoController.registrarEntrada);
almoxarifadoRoutes.post("/materiais/:codigoBarras/saida", almoxarifadoController.registrarSaida);

export default almoxarifadoRoutes;
import express from "express";
import almoxarifadoController from "../controllers/almoxarifadoController.js";

const almoxarifadoRouter = express.Router();

almoxarifadoRouter.get("/almoxarifado", almoxarifadoController.renderAlmoxarifadoPage);
almoxarifadoRouter.post("/materiais", almoxarifadoController.cadastrarMaterial);
almoxarifadoRouter.get("/materiais", almoxarifadoController.listarMateriais);
almoxarifadoRouter.get("/materiais/:codigoBarras", almoxarifadoController.buscarPorCodigo);
almoxarifadoRouter.post("/materiais/:codigoBarras/entrada", almoxarifadoController.registrarEntrada);
almoxarifadoRouter.post("/materiais/:codigoBarras/saida", almoxarifadoController.registrarSaida);

export default almoxarifadoRouter;
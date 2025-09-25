import express from "express";
import almoxarifadoAtendimentoController from "../controllers/almoxarifadoAtendimentoController.js";

const almoxarifadoAtendimentoRoutes = express.Router();

almoxarifadoAtendimentoRoutes.get("/almoxarifadoAtendimento", almoxarifadoAtendimentoController.renderAtendimentoPage);
almoxarifadoAtendimentoRoutes.get("/almoxarifadoInterno", almoxarifadoAtendimentoController.renderAtendimentoInternoPage);

almoxarifadoAtendimentoRoutes.get("/atendimento/pendentes", almoxarifadoAtendimentoController.listarPedidosPendentes);
almoxarifadoAtendimentoRoutes.put("/atendimento/:id/entrega", almoxarifadoAtendimentoController.registrarEntregaItem);
almoxarifadoAtendimentoRoutes.put("/atendimento/:id/cancelar", almoxarifadoAtendimentoController.cancelarPedido);

export default almoxarifadoAtendimentoRoutes;
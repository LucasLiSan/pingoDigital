import express from "express";
import pedidoController from "../controllers/almoxarifadoPedidosController.js";
//import Auth from "../middlewares/Auth.js";

const almoxarifadoPedidosRoutes = express.Router();

// Página principal de pedidos (aplicável ao painel interno)
almoxarifadoPedidosRoutes.get("/pedidos", pedidoController.renderPedidosPage);

// Criar novo pedido (via vitrine ou formulário)
almoxarifadoPedidosRoutes.post("/pedidos", pedidoController.createPedido);

// Listar todos os pedidos
almoxarifadoPedidosRoutes.get("/pedidos/lista", pedidoController.getAllPedidos);

// Buscar pedido por ID
almoxarifadoPedidosRoutes.get("/pedidos/:id", pedidoController.getPedidoById);

// Atualizar status geral do pedido
almoxarifadoPedidosRoutes.put("/pedidos/:id/status", pedidoController.updateStatusPedido);

// Atualizar status de um item específico dentro do pedido
almoxarifadoPedidosRoutes.put("/pedidos/:id/item-status", pedidoController.updateStatusItem);

// Buscar pedidos de um solicitante específico (professor, setor, etc.)
almoxarifadoPedidosRoutes.get("/pedidos/solicitante/:nome", pedidoController.getPedidosPorSolicitante);

// Deletar pedido por ID
almoxarifadoPedidosRoutes.delete("/pedidos/:id", pedidoController.deletePedido);

export default almoxarifadoPedidosRoutes;

import pedidoService from "../services/almoxarifadoPedidoService.js";
import { ObjectId } from "mongodb";

/* --- Renderizar a página de pedidos --- */
const renderPedidosPage = (req, res) => {
    try { res.render("pedidos"); }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao carregar a página de pedidos." });
    }
};

/* --- Criar novo pedido --- */
const createPedido = async (req, res) => {
    try {
        const { solicitante, materiais } = req.body;

        if (!solicitante.numPedido || !solicitante || !materiais || materiais.length === 0) { return res.status(400).json({ error: "Dados de pedido incompletos." }); }

        const novoPedido = await pedidoService.create(solicitante, materiais);
        res.status(201).json({ success: "Pedido criado com sucesso.", novoPedido });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar pedido." });
    }
};

/* --- Listar todos os pedidos --- */
const getAllPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoService.getAll();
        res.status(200).json({ pedidos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
};

/* --- Buscar pedido por ID --- */
const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) return res.sendStatus(400);

        const pedido = await pedidoService.getOne(id);
        
        if (!pedido) return res.status(404).json({ error: "Pedido não encontrado." });

        res.status(200).json({ pedido });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar pedido." });
    }
};

/* --- Atualizar status geral do pedido --- */
const updateStatusPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusPedido } = req.body;

        const atualizado = await pedidoService.updateStatusPedido(id, statusPedido);
        res.status(200).json({ success: "Status do pedido atualizado.", atualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar status do pedido." });
    }
};

/* --- Atualizar status de um item específico --- */
const updateStatusItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigoBarras, statusItem } = req.body;

        const atualizado = await pedidoService.updateStatusItem(id, codigoBarras, statusItem);
        res.status(200).json({ success: "Status do item atualizado.", atualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar status do item." });
    }
};

/* --- Deletar pedido por ID --- */
const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const existe = await pedidoService.getOne(id);
  
        if (!existe) return res.status(404).json({ error: "Pedido não encontrado." });

        await pedidoService.delete(id);
  
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao deletar pedido." });
    }
};

/* --- Buscar pedidos por nome do solicitante --- */
const getPedidosPorSolicitante = async (req, res) => {
    try {
        const { nome } = req.params;
        const pedidos = await pedidoService.getBySolicitante(nome);
        res.status(200).json({ pedidos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar pedidos do solicitante." });
    }
};

export default {
    renderPedidosPage,
    createPedido,
    getAllPedidos,
    getPedidoById,
    updateStatusPedido,
    updateStatusItem,
    deletePedido,
    getPedidosPorSolicitante
};

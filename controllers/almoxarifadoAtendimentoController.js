import AtendimentoService from "../services/almoxarifadoAtendimentoService.js";

const renderAtendimentoPage = (req, res) => {
    try { res.render("almoxarifadoAtendimento"); }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao carregar a página de pedidos." });
    }
};

const renderAtendimentoInternoPage = (req, res) => {
    try { res.render("almoxarifadoInterno"); }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao carregar a página de pedidos." });
    }
};

const listarPedidosPendentes = async (req, res) => {
    try {
        const pedidos = await AtendimentoService.listarPedidosPendentes();
        res.status(200).json({ pedidos });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const registrarEntregaItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigoBarras, quantidade, responsavel, statusItem } = req.body;

        if (!codigoBarras || quantidade === undefined) {
            return res.status(400).json({ error: "Dados de entrega incompletos." });
        }

        const pedido = await AtendimentoService.registrarEntrega(
            id,
            codigoBarras,
            { quantidade, responsavel, statusItem }
        );

        res.status(200).json({ success: "Entrega registrada com sucesso.", pedido });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const cancelarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const cancelado = await AtendimentoService.cancelarPedido(id);
        res.status(200).json({ success: "Pedido cancelado.", cancelado });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export default {
    renderAtendimentoPage,
    renderAtendimentoInternoPage,
    listarPedidosPendentes,
    registrarEntregaItem,
    cancelarPedido
};

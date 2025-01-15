import cardapioService from "../services/cardapioService.js";
import { ObjectId } from "mongodb";

const renderCardapioPage = (req, res) => {
    res.render('cardapio');
};

/* --- Inserir novo cardápio --- */
const createNewCardapio = async (req, res) => {
    try {
        const { mes, ano, dias } = req.body; // Agora recebemos 'dias' diretamente
        const newCardapio = await cardapioService.create(mes, ano, dias);
        res.status(201).json({
            Success: `Cardápio para o mês '${mes}' cadastrado com sucesso.`,
            cardapio: newCardapio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor.' });
    }
};

const createMultipleDays = async (req, res) => {
    try {
        const { mes, ano, dias } = req.body; // Recebe o mês, ano e array de dias no corpo da requisição

        // Chama o método do serviço para criar ou atualizar o cardápio com múltiplos dias
        const cardapio = await cardapioService.create(mes, ano, dias);

        res.status(201).json({ Success: "Cardápio atualizado com sucesso", cardapio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Erro ao cadastrar múltiplos dias no cardápio." });
    }
};

/* --- Listar todos os cardápios --- */
const getAllCardapios = async (req, res) => {
    try {
        const cardapios = await cardapioService.getAll();
        res.status(200).json({ cardapios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor.' });
    }
};

/* --- Listar um cardápio específico --- */
const getOneCardapio = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const cardapio = await cardapioService.getOne(id);
            if (!cardapio) {
                res.status(404).json({ err: 'Cardápio não encontrado.' });
            } else {
                res.status(200).json({ cardapio });
            }
        } else {
            res.sendStatus(400); // Bad Request
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor.' });
    }
};

/* --- Atualizar informações de um cardápio --- */
const updateCardapio = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const cardapioData = req.body;
            const existingCardapio = await cardapioService.getOne(id);
            if (!existingCardapio) {
                return res.status(404).json({ err: 'Cardápio não encontrado.' });
            }
            const updatedCardapio = await cardapioService.update(id, cardapioData);
            res.status(200).json({ Success: `Cardápio para o mês '${updatedCardapio.cardapio_regular[0].mes}' atualizado com sucesso.` });
        } else {
            res.sendStatus(400); // Bad Request
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor.' });
    }
};

/* --- Deletar um cardápio --- */
const deleteCardapio = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const existingCardapio = await cardapioService.getOne(id);
            if (!existingCardapio) {
                return res.status(404).json({ err: 'Cardápio não encontrado.' });
            }
            await cardapioService.delete(id);
            res.status(204).json({ Success: `Cardápio para o mês '${existingCardapio.cardapio_regular[0].mes}' deletado com sucesso.` });
        } else {
            res.sendStatus(400); // Bad Request
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor.' });
    }
};

export default { 
    renderCardapioPage,
    createNewCardapio,
    createMultipleDays,
    getAllCardapios,
    getOneCardapio,
    updateCardapio,
    deleteCardapio
};
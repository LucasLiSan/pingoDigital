import achadosService from "../services/achadosService.js";
import { ObjectId } from "mongodb";

/* --- Renderizar a página do calendário --- */
const renderAchadosPage = (req, res) => {
    try {
        res.render("achados"); // Renderiza a página "achados"
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Erro ao carregar a página do achados e perdidos." }); // Status 500: Internal Server Error
    }
};

/* --- Cadastrar novo item perdido --- */
const createNewItem = async (req, res) => {
    try {
        let { item, desc_item, pic, data, situacao, dono } = req.body;

        // Verifica se `dono` foi enviado corretamente
        if (typeof dono !== "object" || dono === null) {
            dono = undefined; // Ou um objeto vazio: {}
        }

        // Converte data de "DD/MM/YYYY" para Date
        if (data) {
            const [day, month, year] = data.split("/");
            data = new Date(`${year}-${month}-${day}T00:00:00Z`); // Usa UTC para evitar erros de fuso
        }

        // Verifica se `situacao` está dentro dos valores esperados
        if (!["PERDIDO", "DEVOLVIDO", "DOADO"].includes(situacao)) {
            return res.status(400).json({ error: "Valor inválido para 'situacao'." });
        }

        const newItem = await achadosService.create(item, desc_item, pic, data, situacao, dono);
        res.status(201).json({ success: `Item '${newItem.item}' cadastrado com sucesso.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Listar todos os itens --- */
const getAllItems = async (req, res) => {
    try {
        const items = await achadosService.getAll();
        res.status(200).json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Buscar um item específico pelo código único --- */
const getOneItem = async (req, res) => {
    try {
        const { itemCode } = req.params;
        const item = await achadosService.getOneItem(itemCode);
        if (!item) {
            return res.status(404).json({ error: "Item não encontrado." });
        }
        res.status(200).json({ item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Atualizar um item pelo ID --- */
const updateItem = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.sendStatus(400); // Status 400: Bad Request (ID inválido)
        }

        const id = req.params.id;
        const { item, desc_item, pic, data, situacao, dono } = req.body;

        const existingItem = await achadosService.getOne(id); // Busca pelo _id correto
        if (!existingItem) {
            return res.status(404).json({ error: "Item não encontrado." });
        }

        const updatedItem = await achadosService.update(id, item, desc_item, pic, data, situacao, dono);
        if (!updatedItem) {
            return res.status(404).json({ error: "Erro ao atualizar: Item não encontrado." });
        }

        res.status(200).json({ success: `Item atualizado com sucesso.`, updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Deletar um item pelo ID --- */
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const existingItem = await achadosService.getOne(id);
        if (!existingItem) {
            return res.status(404).json({ error: "Item não encontrado." });
        }

        await achadosService.delete(id);
        res.status(204).send(); // Código 204 (No Content)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Listar apenas itens PERDIDOS --- */
const getLostItems = async (req, res) => {
    try {
        const lostItems = await achadosService.getLostItems();
        res.status(200).json({ lostItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Marcar um item como DEVOLVIDO --- */
const markItemAsReturned = async (req, res) => {
    try {
        const { id } = req.params; // ID do item
        let { dono, dono_turma, data_devolucao } = req.body;

        // Verifica se o item existe
        const existingItem = await achadosService.getOne(id);
        if (!existingItem) {
            return res.status(404).json({ error: "Item não encontrado." });
        }

        if (data_devolucao) {
            const [day, month, year] = data_devolucao.split("/");
            data_devolucao = new Date(`${year}-${month}-${day}T00:00:00Z`); // Usa UTC para evitar erros de fuso
        }

        // Passa a data de devolução e as informações do dono para o serviço
        await achadosService.markAsReturned(existingItem.item, dono, dono_turma, data_devolucao);

        res.status(200).json({ success: `Item '${existingItem.item}' marcado como DEVOLVIDO.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

export default {
    renderAchadosPage,
    createNewItem, 
    getAllItems, 
    getOneItem, 
    updateItem, 
    deleteItem, 
    getLostItems, 
    markItemAsReturned
};
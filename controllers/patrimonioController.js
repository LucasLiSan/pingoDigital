import patrimonioService from "../services/patrimonioService.js";
import { ObjectId } from "mongodb";

/* --- Cadastrar novo item de patrimonio --- */
const createNewPat = async (req, res) => {
    try {
        let { codPat, descrition, situation, local, ue, lastCheck, obs, value, fiscal, patPic, history } = req.body;

        // Verifica se tem historico de movimentação
        if (typeof history !== "object" || history === null) {
            history = undefined; // Ou um objeto vazio: {}
        }

        // Converte data de "DD/MM/YYYY" para Date
        if (lastCheck) {
            const [day, month, year] = lastCheck.split("/");
            lastCheck = new Date(`${year}-${month}-${day}T00:00:00Z`); // Usa UTC para evitar erros de fuso
        }

        // Verifica o que foi inserido na situação do patrimonio esta correto
        if (!["EXCELENTE", "ÓTIMO", "BOM", "REGULAR", "RUIM", "INSERVIVEL"].includes(situation)) {
            return res.status(400).json({ error: "Valor inválido para 'situacao'." });
        }

        const newPat = await patrimonioService.create(codPat, descrition, situation, local, ue, lastCheck, obs, value, fiscal, patPic, history);
        res.status(201).json({ success: `Patrimônio ${newPat.codPat} cadastrado com sucesso.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

/* --- Listasr todos os itens de patrimonio --- */
const gettAllPats = async (req, res) => {
    try {
        const pats = await patrimonioService.getAll();
        res.status(200).json({ pats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

/* --- Listar item especifico de patrimonio --- */
const getOnePat = async (req, res) => {
    try {
        const { patCode } = req.params;
        const pat = await patrimonioService.getOnePat(patCode);
        if(!pat) {
            return res.status(404).json({ error: "Item não encontrado." });
        }
        res.status(200).json({ pat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

/* --- Atualizar informações de um item de patrimônio --- */
const updatePat = async (req, res) => {
    try {
        const { codPat } = req.params;
        const { descrition, situation, local, ue, lastCheck, obs, value, fiscal, patPic } = req.body;

        const updatedPat = await patrimonioService.update(codPat, descrition, situation, local, ue, lastCheck, obs, value, fiscal, patPic);
        
        if (!updatedPat) {
            return res.status(404).json({ error: "Item não encontrado." });
        }

        res.status(200).json({ success: `Patrimônio ${updatedPat.codPat} atualizado com sucesso.`, updatedPat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Atualizar movimentação do patrimônio --- */
const updateMove = async (req, res) => {
    try {
        const { codPat } = req.params;
        const { date, from, to, type } = req.body;

        const updatedPat = await patrimonioService.updateSpot(codPat, date, from, to, type);
        
        if (!updatedPat) {
            return res.status(404).json({ error: "Item não encontrado." });
        }

        res.status(200).json({ success: `Movimentação registrada para o patrimônio ${codPat}.`, updatedPat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

/* --- Deletar item de patrimônio --- */
const deletePat = async (req, res) => {
    try {
        const { id } = req.params;
        
        await patrimonioService.delete(id);
        res.status(200).json({ success: `Patrimônio ID ${id} deletado com sucesso.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

export default {
    createNewPat,
    gettAllPats,
    getOnePat,
    updatePat,
    updateMove,
    deletePat
}
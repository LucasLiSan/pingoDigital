import sectorService from "../services/sectorStreetsService.js";
import { ObjectId } from "mongodb";

const createNewSectorStreet = async (req, res) => {
    try {
        const {rua, nomeAnterior, bairro, numero, setor, historico: [{ evento }]} = req.body;
        const newSector = await sectorService.create(rua, nomeAnterior, bairro, numero, setor, evento);
        res.status(201).json({ Success: `Endereço '${newSector.rua}', '${newSector.bairro}' cadastrado com sucesso`}); //Cód. Status 201: Create
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor' }); //Cód. Status 500: Internal Server Error
    }
};

/* --- Listar todos os livros --- */
const getAllSectors = async (req, res) => {
    try {
        const sectors = await sectorService.getAll();
        res.status(200).json({ sectors: sectors }); //Cód. Status 200: OK
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Erro interno do servidor.'}); //Cód. Status 500: Internal Server Error
    }
}

/* --- Listar um livro --- */
const getOneSector = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const sector = await sectorService.getOne(id);
            if(!sector) { res.status(404).json({ Success: 'Setor não encontrado.' }) } //Cód. Status 404: Not Found
            else { res.status(200).json({ sector })} //Cód. Status 200: OK
        } else { res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

/* --- Atualizar informações do livro --- */
const updateSector = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const { rua, nomeAnterior, bairro, numero, setor, evento } = req.body;
            const existingSector = await sectorService.getOne(id);
            if (!existingSector) { return res.status(404).json({ err: 'Rua não encontrado.' }); }
            const updatedSector = sectorService.update(id, rua, nomeAnterior, bairro, numero, setor, evento);
            res.status(200).json({ Success: `Endereço '${existingSector.rua}', '${existingSector.bairro}' atualizado com sucesso.` }); //Cód. Status 200: OK
        } else { res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

/* --- Deletar livro --- */
const deleteSector = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const existingSector = await sectorService.getOne(id);
            if (!existingSector) { return res.status(404).json({ err: 'Setor não encontrado.' }); }
            sectorService.delete(id);
            res.status(204).json({ Success: `Endereço '${sectorService.rua}' deletado com sucesso.` }); //Cód. Status 204: No content
        } else {res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

export default { createNewSectorStreet, getAllSectors, getOneSector, updateSector, deleteSector };
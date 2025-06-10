import horaTrabalhoService from "../services/horaTrabService.js";
import { ObjectId } from "mongodb";

/* --- Inserir novo livro --- */
const createNewHora = async (req, res) => {
    try {
        const { matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut } = req.body;
        const newHora = await horaTrabalhoService.create(matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut);
        res.status(201).json({ Success: `Hora '${newHora.title}' cadastrado com sucesso` }); //Cód. Status 201: Create
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor' }); //Cód. Status 500: Internal Server Error
    }
}

/* --- Listar todos os livros --- */
const getAllHoras = async (req, res) => {
    try {
        const horas = await horaTrabalhoService.getAll();
        res.status(200).json({ horas: horas }); //Cód. Status 200: OK
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Erro interno do servidor.'}); //Cód. Status 500: Internal Server Error
    }
}

/* --- Listar um livro --- */
const getOneHora = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const hora = await horaTrabalhoService.getOne(id);
            
            if(!hora) { res.status(404).json({ Success: 'Hora não encontrado.' }) } //Cód. Status 404: Not Found
            else { res.status(200).json({ hora })} //Cód. Status 200: OK

        } else { res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

/* --- Atualizar informações do livro --- */
const updateHora = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const { matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut } = req.body;
            const existingHora = await horaTrabalhoService.getOne(id);
            
            if (!existingHora) { return res.status(404).json({ err: 'Hora não encontrado.' }); }
            
            horaTrabalhoService.update(id, matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut);
            res.status(200).json({ Success: `Hora '${existingHora.title}' atualizado com sucesso.` }); //Cód. Status 200: OK
        } else { res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

/* --- Deletar livro --- */
const deleteHora = async (req, res) => {
    try {
        if(ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const existingHora = await horaTrabalhoService.getOne(id);
            
            if (!existingHora) { return res.status(404).json({ err: 'Hora não encontrado.' }); }
            
            horaTrabalhoService.delete(id);
            res.status(204).json({ Success: `Livro '${existingHora.title}' deletado com sucesso.` }); //Cód. Status 204: No content
        } else {res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

export default {
    createNewHora,
    getAllHoras,
    getOneHora,
    updateHora,
    deleteHora
};
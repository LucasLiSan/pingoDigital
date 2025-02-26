import horaEducFisicService from "../services/horaEducFisicService.js";
import { ObjectId } from "mongodb";

/* --- Inserir novo livro --- */
const createNewHora = async (req, res) => {
    try {
        const { matricula, nomeProf, DiaSemana, horaIn, horaOut, turma } = req.body;
        const newAula = await horaEducFisicService.create(matricula, nomeProf, DiaSemana, horaIn, horaOut, turma);
        res.status(201).json({ Success: `Aula cadastrado com sucesso` }); //Cód. Status 201: Create
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor' }); //Cód. Status 500: Internal Server Error
    }
}

/* --- Listar todos os livros --- */
const getAllHoras = async (req, res) => {
    try {
        const aulas = await horaEducFisicService.getAll();
        res.status(200).json({ aulas: aulas }); //Cód. Status 200: OK
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
            const aula = await horaEducFisicService.getOne(id);
            if(!aula) { res.status(404).json({ Success: 'Aula não encontrado.' }) } //Cód. Status 404: Not Found
            else { res.status(200).json({ aula })} //Cód. Status 200: OK
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
            const { matricula, nomeProf, DiaSemana, horaIn, horaOut, turma } = req.body;
            const existingAula = await horaEducFisicService.getOne(id);
            if (!existingAula) { return res.status(404).json({ err: 'Aula não encontrado.' }); }
            horaEducFisicService.update(id, matricula, nomeProf, DiaSemana, horaIn, horaOut, turma);
            res.status(200).json({ Success: `Aula '${existingAula.DiaSemana}' atualizado com sucesso.` }); //Cód. Status 200: OK
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
            const existingAula = await horaEducFisicService.getOne(id);
            if (!existingAula) { return res.status(404).json({ err: 'Hora não encontrado.' }); }
            horaEducFisicService.delete(id);
            res.status(204).json({ Success: `Livro '${existingAula.DiaSemana}' deletado com sucesso.` }); //Cód. Status 204: No content
        } else {res.sendStatus(400); } //Cód. Status 400: Bad Request
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Erro interno do servidor.' }); //Cód. Status 500: Internal Server Error
    }
}

export default { createNewHora, getAllHoras, getOneHora, updateHora, deleteHora };
import studentService from "../services/studentsService.js"; // Importa o serviço de alunos
import Health from "../models/studentsHealth.js"
import HealthRecord from "../models/studentsHealthRecord.js";
import Address from "../models/studentsAddress.js";
import Academic from "../models/studentsAcademicHistory.js";
import ReportCard from "../models/studentsGrades.js";
import AcademicHistoryFull from "../models/studentsGradesReport.js";
import { ObjectId } from "mongodb";

/* --- Inserir novo aluno --- */
const createNewStudent = async (req, res) => {
    try {
        const {
            rm, nome, nascimento, sexo, racaCor, documentos, ra, inep, filiacao,
            responsavel, gemeo, enderecoAtual, contatos, vidaAcademica, saude,
            boletins, historicoAcademico, autorizacaoSaida, transporteEscolar, transporteEscolarAtual
        } = req.body;

        // Salvar endereço e obter ObjectId
        const endereco = await Address.create(enderecoAtual);

        // Salvar vida acadêmica e obter ObjectIds
        const vidaAcademicaDocs = await Academic.create(vidaAcademica);

        // Salvar saúde e obter ObjectId
        const saudeDoc = await Health.create(saude);

        // Preparar os dados finais para criação do aluno
        const studentData = {
            rm, nome, nascimento, sexo, racaCor, documentos, ra, inep, filiacao,
            responsavel, gemeo, contatos, boletins, historicoAcademico, autorizacaoSaida,
            transporteEscolar, transporteEscolarAtual,
            enderecoAtual: endereco._id,
            vidaAcademica: vidaAcademicaDocs.map(doc => doc._id),
            saude: saudeDoc._id
        };

        // Chama o serviço para criar o aluno
        const newStudent = await studentService.create(studentData);

        res.status(201).json({ Success: `Aluno '${newStudent.nome}' cadastrado com sucesso` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor' });
    }
};

/* --- Listar todos os alunos --- */
const getAllStudents = async (req, res) => {
    try {
        const students = await studentService.getAll();
        res.status(200).json({ students }); // Cód. Status 200: OK
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor' }); // Cód. Status 500: Internal Server Error
    }
};

/* --- Listar um aluno por ID --- */
const getOneStudent = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const student = await studentService.getOne(id);

            if (!student) { res.status(404).json({ err: 'Aluno não encontrado' }); } // Cód. Status 404: Not Found
            else { res.status(200).json({ student }); } // Cód. Status 200: OK

        } else { res.sendStatus(400); } // Cód. Status 400: Bad Request
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor' }); // Cód. Status 500: Internal Server Error
    }
};

/* --- Atualizar informações do aluno --- */
const updateStudent = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const updates = req.body;
            const updatedStudent = await studentService.update(id, updates);

            if (!updatedStudent) { res.status(404).json({ err: 'Aluno não encontrado' }); } // Cód. Status 404: Not Found
            else { res.status(200).json({ Success: `Aluno '${updatedStudent.nome.nome}' atualizado com sucesso` }); } // Cód. Status 200: OK

        } else { res.sendStatus(400); } // Cód. Status 400: Bad Request
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor' }); // Cód. Status 500: Internal Server Error
    }
};

/* --- Deletar aluno --- */
const deleteStudent = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const id = req.params.id;
            const deletedStudent = await studentService.delete(id);

            if (!deletedStudent) { res.status(404).json({ err: 'Aluno não encontrado' }); } // Cód. Status 404: Not Found
            else { res.status(204).json({ Success: `Aluno '${deletedStudent.nome.nome}' deletado com sucesso` }); } // Cód. Status 204: No Content
        } else { res.sendStatus(400); } // Cód. Status 400: Bad Request
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Erro interno do servidor' }); // Cód. Status 500: Internal Server Error
    }
};

export default { 
    createNewStudent,
    getAllStudents,
    getOneStudent,
    updateStudent,
    deleteStudent
};
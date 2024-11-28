import express from "express";
import studentsControllers from "../controllers/studentsControllers.js";

const studentRoutes = express.Router();

/* --- Rotas de Alunos --- */
studentRoutes.post("/estudante", studentsControllers.createNewStudent); // Criar novo aluno
studentRoutes.get("/estudantes", studentsControllers.getAllStudents); // Listar todos os alunos
studentRoutes.get("/estudante/:id", studentsControllers.getOneStudent); // Listar aluno por ID
studentRoutes.patch("/estudante/:id", studentsControllers.updateStudent); // Atualizar aluno
studentRoutes.delete("/estudante/:id", studentsControllers.deleteStudent); // Deletar aluno

export default studentRoutes;

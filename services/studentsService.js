import Student from "../models/students.js";

class studentService {
    /* --- Método CADASTRAR --- */
    async create(data) {
        try {
            const newStudent = new Student(data);
            await newStudent.save();
            return newStudent;
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
        }
    }

    /* --- Método READ (LISTAR TODOS) --- */
    async getAll() {
        try {
            const students = await Student.find().populate('enderecoAtual vidaAcademica saude boletins historicoAcademico');
            return students;
        } catch (error) {
            console.error("Erro ao listar alunos:", error);
        }
    }

    /* --- Método READ (LISTAR UM) --- */
    async getOne(id) {
        try {
            const student = await Student.findById(id).populate('enderecoAtual vidaAcademica saude boletins historicoAcademico');
            return student;
        } catch (error) {
            console.error("Erro ao buscar aluno:", error);
        }
    }

    /* --- Método UPDATE --- */
    async update(id, data) {
        try {
            const updatedStudent = await Student.findByIdAndUpdate(id, data, { new: true });
            console.log(`Aluno ID: ${id} atualizado com sucesso.`);
            return updatedStudent;
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
        }
    }

    /* --- Método DELETE --- */
    async delete(id) {
        try {
            await Student.findByIdAndDelete(id);
            console.log(`Aluno ID: ${id} deletado com sucesso.`);
        } catch (error) {
            console.error("Erro ao deletar aluno:", error);
        }
    }
}

export default new studentService();
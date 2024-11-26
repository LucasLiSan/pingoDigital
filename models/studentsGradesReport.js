import mongoose from "mongoose";

// Esquema para componentes curriculares (Base Comum e Parte Diversificada)
const curriculumSchema = new mongoose.Schema({
    disciplina: { type: String, required: true }, // Nome da disciplina
    mencaoFinal: { 
        type: String, 
        enum: ["S", "I", "PARECER DESCRITIVO", "N/A"], // Menção ou observação especial
        default: "N/A" 
    },
    legislacao: { type: String, default: null } // Legislação aplicada em casos especiais
});

// Histórico detalhado de um ano letivo anterior
const previousYearSchema = new mongoose.Schema({
    anoLetivo: { type: Number, required: true }, // Ano letivo
    escola: {
        nome: { type: String, required: true }, // Nome da escola
        municipio: { type: String, required: true }, // Município
        estado: { type: String, required: true } // Estado
    },
    baseComum: [curriculumSchema], // Notas da Base Comum
    parteDiversificada: [curriculumSchema], // Notas da Parte Diversificada (opcional)
    situacao: { 
        type: String, 
        enum: ["Concluído", "Transferido"], 
        default: "Concluído" 
    } // Situação do aluno naquele ano
});

// Esquema principal do Histórico Escolar
const academicHistorySchema = new mongoose.Schema({
    alunoId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Referência ao aluno
    escolaAtual: {
        nome: { type: String, required: true }, // Nome da escola atual
        municipio: { type: String, required: true }, // Município da escola atual
        estado: { type: String, required: true } // Estado da escola atual
    },
    anoLetivoAtual: { type: Number, required: true }, // Ano letivo atual
    situacaoAtual: { 
        type: String, 
        enum: ["Concluído", "Transferido", "Em Curso"], 
        required: true 
    }, // Situação atual do aluno
    legislacaoAplicada: { 
        type: String, 
        default: null 
    }, // Exemplo: Portarias específicas para parecer descritivo ou menções
    baseComumAtual: [curriculumSchema], // Notas do ano letivo atual (Base Comum)
    parteDiversificadaAtual: [curriculumSchema], // Notas do ano letivo atual (Parte Diversificada)
    anosAnteriores: [previousYearSchema], // Lista com notas de anos anteriores de escolas diferentes
    dataEmissao: { type: Date, default: Date.now } // Data de emissão do histórico
});

const AcademicHistoryFull = mongoose.model("AcademicHistoryFull", academicHistorySchema);
export default AcademicHistoryFull;
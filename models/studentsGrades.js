import mongoose from "mongoose";


const gradeSchema = new mongoose.Schema({
    bimestre: {
        type: Number, // 1 a 4 bimestres
        required: true
    },
    disciplina: {
        type: String,
        enum: ["LINGUAGEM ORAL E ESCRITA", "EDUCAÇÃO FÍSICA", "ARTES", "CIÊNCIAS", "HISTÓRIA", "GEOGRAFIA", "MATEMÁTICA"], // Matérias da Base Comum
        required: true
    },
    nota: { 
        type: Number, 
        min: 0, 
        max: 10, 
        required: false 
    },
    faltas: { 
        type: Number, 
        default: 0 
    }
});

// Para matérias da Parte Diversificada
const diverseGradeSchema = new mongoose.Schema({
    bimestre: {
        type: Number, // 1 a 4 bimestres
        required: true
    },
    disciplina: {
        type: String,
        required: true // Aqui será uma string genérica, pois as matérias são dinâmicas (inglês, espanhol, religião, etc.)
    },
    nota: { 
        type: Number, 
        min: 0, 
        max: 10, 
        required: false 
    },
    faltas: { 
        type: Number, 
        default: 0 
    }
});

const reportCardSchema = new mongoose.Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    ano: {
        type: Number, // Ex: 2024
        required: true
    },
    notasBimestrais: [gradeSchema], // Notas da Base Comum
    parteDiversificada: [diverseGradeSchema], // Notas da Parte Diversificada (opcional)
    frequenciaAnual: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    mediaFinal: { 
        type: Number, 
        min: 0, 
        max: 10 
    },
    observacoes: {
        type: String
    },
    recuperacaoParalela: {
        type: Boolean,
        default: false
    },
    recuperacaoContinua: {
        type: Boolean,
        default: false
    }
});

// Método para calcular a média final com base nas notas bimestrais
reportCardSchema.methods.calcularMediaFinal = function() {
    const totalNotas = this.notasBimestrais.reduce((acc, notaObj) => acc + notaObj.nota, 0);
    this.mediaFinal = totalNotas / this.notasBimestrais.length;
    return this.mediaFinal;
};

// Método para calcular a frequência anual com base nos dias letivos e faltas
reportCardSchema.methods.calcularFrequenciaAnual = function(totalDiasLetivos) {
    const totalFaltas = this.notasBimestrais.reduce((acc, notaObj) => acc + notaObj.faltas, 0);
    const frequencia = ((totalDiasLetivos - totalFaltas) / totalDiasLetivos) * 100;
    this.frequenciaAnual = frequencia;
    return this.frequenciaAnual;
};

const ReportCard = mongoose.model('ReportCard', reportCardSchema);
export default ReportCard;
import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema ({
    codEscola: Number, // Cód. da escola
    codClasse: Number, // Cód. da classe
    anoLetivo: Number, // Ano Letivo atual
    sala: Number,   // Nº da sala física (Sala 1, Sala 2)
    dimensoes: Number, // Areá da sala m2
    turma: String,  // Turma na sala (1º Ano - A, Jardim 2 - B)
    tipoEnsino: { type: String, enum: ['Ensino Fundamental', 'Educação Infantil', 'Educação de Jovens e Adultos', 'Atendimento Educacional Especializado']},
    turno: { type: String, enum: ['Manhã', 'Tarde', 'Noite', 'Integral']}, // Turno
    maxCapacity: Number, // Capacidade maxima da sala
    qtdAtual: { type: Number, default: 0}, // Quantidade de alunos atual
    vagas: { type: Number, default: 0}, // Vagas atual
    qtdInclusao: { type: Number, default: 0}, // Quantidade de alunos de inclusão atual
    qtdCadastros: { type: Number, default: 0}, // Quantidade de alunos matriculados no total da sala
    qtdTransferencias: { type: Number, default: 0}, // Quantidade de alunos transferidos da sala durante o ano letivo
    qtdMatriculas: { type: Number, default: 0}, // Quantidade de alunos matriculados na sala durante o ano letivo
    qtdRemanejamentosIn: { type: Number, default: 0}, // Quantidade de alunos remanejados para outra sala durante o ano letivo
    qtdRemanejamentosOut: { type: Number, default: 0}, // Quantidade de alunos remanejados para essa sala durante o ano letivo
    abandonos: { type: Number, default: 0}, // Quantidade de abandonos para essa sala durante o ano letivo
    naoComparecimento: { type: Number, default: 0}, // Quantidade de não comparecimentos para essa sala durante o ano letivo
    historico: [
        {
            evento: { type: String, required: true, enum: ["Matricula", "Transferencia", "Remanejamento", "Abandono", "Não comparecimento", "Edição"] },
            data: { type: Date, default: Date.now }, // Data do evento
            detalhes: { type: String } // Detalhes adicionais do evento
        }
    ]
});

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom;
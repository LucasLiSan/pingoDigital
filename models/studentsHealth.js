//INFORMAÇÕES DE SAÚDE

import mongoose from 'mongoose';

const healthSchema = new mongoose.Schema({
    alunoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },  // Relaciona o estado de saúde ao aluno
    
    alergia: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo", "Não se aplica"], default: "Não se aplica" }
    },
    
    doencaCronica: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo", "Não se aplica"], default: "Não se aplica" }
    },
    
    restricaoAlimentar: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo", "Não se aplica"], default: "Não se aplica" }
    },
    
    deficiencia: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo", "Não se aplica"], default: "Não se aplica" }
    },

    TEA: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo", "Não se aplica"], default: "Não se aplica" }
    },
    
    participacaoEducacaoFisica: {
        tipo: { type: String, default: "Sim" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo", "Não se aplica"], default: "Não se aplica" }
    },
    
    dataInicio: { type: Date, default: Date.now },  // Data da inserção da informação de saúde
    dataFim: { type: Date },  // Data de término da validade da condição (se aplicável)
    
    registrosDeSaude: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthRecord' }]  // Referência ao histórico de registros de saúde
});

const Health = mongoose.model('Health', healthSchema);
export default Health;
import mongoose from "mongoose";

//
const nameSchema = new mongoose.Schema ({
    nome: String,
    nomeSocial: {type: String, default: null},
    nomeAfetivo: {type: String, default: null}
});

const bornSchema = new mongoose.Schema({
    dataNascimento: Date,
    cidade: String,
    estado: String,
    pais: String,
    dataRegistro: Date
});

const documentsSchema = new mongoose.Schema({
    tipo: String,
    documento: String
});

const parentSchema = new mongoose.Schema({
    filiacaoUm: {
        nome: {type: String},
        parentesco: {type: String, enum: ["Mãe", "Pai"]}
    },
    filiacaoDois: {
        nome: {type: String},
        parentesco: {type: String, enum: ["Mãe", "Pai"]}
    }
});

const legalParentSchema = new mongoose.Schema({
    responsavel: {
        type: String,
        default: function() { 
            return (this.filiacaoUm && this.filiacaoUm.nome) || 
                   (this.filiacaoDois && this.filiacaoDois.nome) || 
                   "Sem responsável informado"; 
        }
    },
    parentesco: {
        type: String,
        default: function() {
            return (this.filiacaoUm && this.filiacaoUm.parentesco) || 
                   (this.filiacaoDois && this.filiacaoDois.parentesco) || 
                   "Pai ou Mãe"; 
        }
    }
});

const healthSchema = new mongoose.Schema({
    alergia: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo"], default: "Sem Laudo" }
    },
    doencaCronica: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo"], default: "Sem Laudo" }
    },
    restricaoAlimentar: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo"], default: "Sem Laudo" }
    },
    deficiencia: {
        tipo: { type: String, default: "Não" },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo"], default: "Sem Laudo" }
    },
    participacaoEducacaoFisica: {
        permitido: { type: Boolean, default: true },
        laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo"], default: "Sem Laudo" }
    }
});

const studentSchema = new mongoose.Schema({
    rm: Number,
    nome: [nameSchema],
    nascimento: [bornSchema],
    sexo: String,
    racaCor: {type: String, default: "NÃO INFORMADO"},
    documentos: [documentsSchema], // Documentos de identidade e identificação
    ra: String,
    filiacao: [parentSchema], // Nomes dos pais como consta na certidão
    responsavel: {
        type: legalParentSchema,
        default: function() {
            // Caso nenhum responsável seja informado, assume os pais como padrão
            return {
                responsavel: this.filiacao[0]?.filiacaoUm?.nome || this.filiacao[0]?.filiacaoDois?.nome || 'Sem responsável informado',
                parentesco: this.filiacao[0]?.filiacaoUm?.parentesco || this.filiacao[0]?.filiacaoDois?.parentesco || 'Pai ou Mãe'
            };
        }
    },
    enderecoAtual: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }, // Referência para o endereço atual
    historicoAcademico: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Academic' }], // Referência para o histórico acadêmico
    "saude": [healthSchema],
    "transporteEscolar": String
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
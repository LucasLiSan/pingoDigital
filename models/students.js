import mongoose from "mongoose";
import Health from "./studentsHealth.js";
import HealthRecord from "./studentsHealthRecord.js";
import Address from "./studentsAddress.js";
import Academic from "./studentsAcademicHistory.js";
import ReportCard from "./studentsGrades.js";

//nomes do aluno
const nameSchema = new mongoose.Schema ({
    nome: String,
    nomeSocial: {type: String, default: null},
    nomeAfetivo: {type: String, default: null}
});

const twinSchema = new mongoose.Schema ({ nome: {type: String, default: null} }); //gemeos

//informações sobre o nascimento
const bornSchema = new mongoose.Schema({
    dataNascimento: Date,
    cidade: String,
    estado: String,
    pais: String,
    dataRegistro: Date
});

/* ----- \/ Esquemas para armazenamento de diferentes tipos de documentos \/ ----- */
const certidaoAntigaSchema = new mongoose.Schema({
    livro: String,
    folha: String,
    numero: String,
    municipioComarca: String,
    ufComarca: String,
    distrito: String,
    dataExpedicao: Date
});

const certidaoNovaSchema = new mongoose.Schema({
    numeroMatricula: String,
    municipioComarca: String,
    ufComarca: String,
    distrito: String,
    dataExpedicao: Date
});

const rgSchema = new mongoose.Schema({
    numero: String,
    emissao: Date,
    orgaoEmissor: String,
    ufOrgaoEmissor: String
});

const simpleDocumentSchema = new mongoose.Schema({ numero: String });

const documentsSchema = new mongoose.Schema({
    tipo: { 
        type: String, 
        enum: [
            "Certidão de Nascimento (Antiga)", 
            "Certidão de Nascimento (Nova)", 
            "RG", 
            "CPF", 
            "SUS", 
            "NIS",
            "CROSS"
        ],
        required: true 
    },
    documento: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: function() {
            if (this.tipo === "Certidão de Nascimento (Antiga)") return {};
            if (this.tipo === "Certidão de Nascimento (Nova)") return {};
            if (this.tipo === "RG") return {};
            return { numero: "" }; // Para CPF, SUS, NIS, CROSS
        }
    }
});

documentsSchema.pre('validate', function(next) {
    switch (this.tipo) {
        case "Certidão de Nascimento (Antiga)":
            this.documento = new certidaoAntigaSchema(this.documento);
            break;
        case "Certidão de Nascimento (Nova)":
            this.documento = new certidaoNovaSchema(this.documento);
            break;
        case "RG":
            this.documento = new rgSchema(this.documento);
            break;
        case "CPF":
        case "SUS":
        case "NIS":
            this.documento = new simpleDocumentSchema(this.documento);
            break;
    }
    next();
});

/* ----- /\ Esquemas para armazenamento de diferentes tipos de documentos /\ ----- */

//Esquema de pais e responsáveis
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
            return this.filiacao?.filiacaoUm?.nome || 
                   this.filiacao?.filiacaoDois?.nome || 
                   "Sem responsável informado"; 
        }
    },
    parentesco: {
        type: String,
        default: function() {
            return this.filiacao?.filiacaoUm?.parentesco || 
                   this.filiacao?.filiacaoDois?.parentesco || 
                   "Pai ou Mãe"; 
        }
    }
});

//Esquema principal
const studentSchema = new mongoose.Schema({
    rm: Number,
    nome: nameSchema, 
    nascimento: bornSchema,
    sexo: String,
    racaCor: {type: String, default: "NÃO INFORMADO"},
    documentos: [documentsSchema],
    ra: String,
    inep: String,
    filiacao: parentSchema,
    responsavel: {
        type: legalParentSchema,
        default: function() {
            return {
                responsavel: this.filiacao?.filiacaoUm?.nome || this.filiacao?.filiacaoDois?.nome || 'Sem responsável informado',
                parentesco: this.filiacao?.filiacaoUm?.parentesco || this.filiacao?.filiacaoDois?.parentesco || 'Pai ou Mãe'
            };
        }
    },
    gemeo: {type: String, default: "Não"},
    nomeGemeo: [twinSchema],
    enderecoAtual: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }, // Referência ao modelo de endereços
    historicoAcademico: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Academic' }], // Referência ao modelo de vida academica
    saude: { type: mongoose.Schema.Types.ObjectId, ref: 'Health' },  // Referência ao modelo de saúde
    boletins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReportCard' }], // Referência aos boletins
    transporteEscolar: String
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
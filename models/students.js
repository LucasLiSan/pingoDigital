import mongoose from "mongoose";
import Health from "./studentsHealth.js";
import HealthRecord from "./studentsHealthRecord.js";
import Address from "./studentsAddress.js";
import Academic from "./studentsAcademicHistory.js";
import ReportCard from "./studentsGrades.js";
import AcademicHistoryFull from "./studentsGradesReport.js";

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
    },
    historico: [
        {
            evento: { type: String, required: true, enum: ["Cadastro", "Remoção", "Adição", "Edição"] },
            data: { type: Date, default: Date.now }, // Data do evento
            detalhes: { type: String } // Detalhes adicionais do evento
        }
    ]
});

//Autorização de saída do aluno
const authorizationSchema = new mongoose.Schema({
    nome: { type: String, required: true }, // Nome da pessoa autorizada
    relacao: { type: String, required: true }, // Relação com o aluno
    telefone: [{ type: String, required: true }], // Lista de números de telefone
    documentos: {
        rg: { type: String, required: true }, // Número do RG
        cpf: { type: String, required: true }  // Número do CPF
    },
    foto: { type: String, required: true }, // URL ou caminho da foto
    ativa: { type: Boolean, default: true }, // Indica se a autorização está ativa
    dataCadastro: { type: Date, default: Date.now }, // Data de cadastro
    dataBloqueio: { type: Date, default: null }, // Data de bloqueio, caso desativado
    historico: [
        {
            evento: { type: String, required: true, enum: ["Cadastro", "Bloqueio", "Ativação", "Edição"] },
            data: { type: Date, default: Date.now }, // Data do evento
            detalhes: { type: String } // Detalhes adicionais do evento
        }
    ]
});

//Telefones de contato
const contatoSchema = new mongoose.Schema({
    proprietario: { type: String, required: true }, // Nome do dono da linha
    telefone: { type: String, required: true }, // Número telefone
    whatsapp: { type: String, enum: ["S", "N"] }, // Se número é whatsapp
    historico: [
        {
            evento: { type: String, required: true, enum: ["Cadastro", "Cancelado", "Bloqueio", "Ativação", "Edição"] },
            data: { type: Date, default: Date.now }, // Data do evento
            detalhes: { type: String } // Detalhes adicionais do evento
        }
    ]
});

// Subdocumento para armazenar informações de transporte escolar e histórico de uso
const transporteEscolarSchema = new mongoose.Schema({
    tipo: { 
        type: String, 
        enum: ["Zona Rural", "Raio Maior que 2km", "Outros"], 
        required: true 
    }, // Indica o tipo de transporte
    historico: [
        {
            dataInicio: { type: Date, required: true }, // Data de início do uso do transporte
            dataFim: { type: Date, default: null }, // Data de término do uso do transporte
            enderecoRelacionado: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }, // Relaciona com o endereço
            observacoes: { type: String, default: null } // Detalhes adicionais
        }
    ]
});

//Esquema principal
const studentSchema = new mongoose.Schema({
    rm: Number, //Número de registro do aluno na escola
    nome: nameSchema, //Nome do aluno
    nascimento: bornSchema, //Data de nascimento DD/MM/AAAA
    sexo: {type: String, enum: ["M", "F"]}, //Sexo do aluno "M - Masculino", "F - Feminino"
    racaCor: {
        type: String, 
        enum: [
            "Preta",
            "Parda",
            "Branca",
            "Indigena",
            "Amararela"
        ], default: "NÃO INFORMADO"}, //Raça-Cor auto declarada
    documentos: [documentsSchema], //Documento aninhado "Documentos"
    ra: String, //Registro do aluno (Estado de São Paulo)
    inep: String, //Registro do aluno (MEC)
    filiacao: parentSchema, //Nome do pais conforme a certidão
    responsavel: {
        type: legalParentSchema,
        default: function() {
            return {
                responsavel: this.filiacao?.filiacaoUm?.nome || this.filiacao?.filiacaoDois?.nome || 'Sem responsável informado',
                parentesco: this.filiacao?.filiacaoUm?.parentesco || this.filiacao?.filiacaoDois?.parentesco || 'Pai ou Mãe'
            };
        }
    }, //Responsáveis legais da criança
    gemeo: {type: String, enum: ["Sim", "Não"], default: "Não"}, //Gemeo
    nomeGemeo: [twinSchema], //Nome do gemeo se houver
    enderecoAtual: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }, // Referência ao modelo de endereços
    contatos: [contatoSchema],
    historicoAcademico: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Academic' }], // Referência ao modelo de vida academica
    saude: { type: mongoose.Schema.Types.ObjectId, ref: 'Health' },  // Referência ao modelo de saúde
    boletins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReportCard' }], // Referência aos boletins
    historicoAcademico: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AcademicHistoryFull' }],
    autorizacaoSaida: [authorizationSchema],
    transporteEscolar: transporteEscolarSchema, // Adiciona transporte escolar
    transporteEscolarAtual: {
        type: Boolean,
        default: function () {
            // Verifica se há um histórico ativo (sem data de término)
            return this.transporteEscolar?.historico.some(h => !h.dataFim);
        }
    }
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
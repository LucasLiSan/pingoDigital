import mongoose from "mongoose";
import employeeAddress from "./employeesAddress.js"

//nomes do funcionário
const nameSchema = new mongoose.Schema ({
    nome: String,
    nomeSocial: {type: String, default: null},
    nomeAfetivo: {type: String, default: null}
});

//Cargo do funcionário
const cargoSchema = new mongoose.Schema ({
    cargo: String,
    tipo: {type: String, enum: ["TITULAR", "VOLANTE", "SUBSTITUTO"]},
    forma: {type: String, enum: ["Concurso", "Contrato", "Processo seletivo"]}
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
    ],
    email: String
});

//informações sobre o nascimento
const bornSchema = new mongoose.Schema({
    dataNascimento: Date,
    cidade: String,
    estado: String,
    pais: String,
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
        enum: ["RG", "CPF", "SUS", "NIS", "CROSS"],
        required: true 
    },
    documento: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: function() {
            if (this.tipo === "RG") return {};
            return { numero: "" }; // Para CPF, SUS, NIS, CROSS
        }
    }
});

// Middleware para transformar documento RG em schema específico antes da validação
documentsSchema.pre('validate', function(next) {
    if (this.tipo === "RG" && !(this.documento instanceof mongoose.Document)) {
        this.documento = new mongoose.Document(this.documento, rgSchema);
    }
    next();
});

// Validação customizada para o campo `documento.numero` quando o tipo for CPF
documentsSchema.path('documento.numero').validate(function (value) {
    if (this.tipo === 'CPF' && !/^\d{11}$/.test(value)) { return false; } // Validação para CPF com exatamente 11 dígitos numéricos
    return true;
}, 'CPF inválido');

const employeesSchema = new mongoose.Schema({
    matricula: { type: Number, unique: true, required: true },
    nome: nameSchema,
    nascimento: bornSchema,
    sexo: { type: String, enum: ["M", "F"], default: "M" },
    racaCor: {
        type: String,
        enum: ["Preta", "Parda", "Branca", "Indigena", "Amarela", "NÃO INFORMADO"],
        default: "NÃO INFORMADO"
    },
    documentos: [documentsSchema],
    enderecoAtual: { type: mongoose.Schema.Types.ObjectId, ref: 'employeeAddress' },
    contatos: [contatoSchema],
    cargo: cargoSchema,
    categ: { type: String, enum: ["Apoio", "Magistério"], required: true },
    jornada: Number,
    turno: { type: String, enum: ["Manhã", "Tarde", "Noite", "Integral"] },
    sede: String,
    admissao: Date,
});

const Employee = mongoose.model('Employee', employeesSchema);
export default Employee;
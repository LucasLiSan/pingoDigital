import mongoose from "mongoose";

//nomes do funcionário
const nameSchema = new mongoose.Schema ({
    nome: String,
    nomeSocial: {type: String, default: null},
    nomeAfetivo: {type: String, default: null}
});

//informações sobre o nascimento
const bornSchema = new mongoose.Schema({
    dataNascimento: Date,
    cidade: String,
    estado: String,
    pais: String,
    dataRegistro: Date
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

const employeesSchema = new mongoose.Schema({
    matricula: Number, //Numero da matricula do funcionário
    nome: nameSchema, //Nome do funcionário
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
        ], default: "NÃO INFORMADO"
    }, //Raça-Cor auto declarada
    documentos: [documentsSchema], //Documento aninhado "Documentos"
    enderecoAtual: { }, // Referência ao modelo de endereços
    contatos: [contatoSchema],
});

const Employee = mongoose.model('Employee', employeesSchema);
export default Employee;
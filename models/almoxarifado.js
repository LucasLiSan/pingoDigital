import mongoose from "mongoose";

const entradaSchema = new mongoose.Schema({
  fornecedor: String,
  quantidade: Number,
  data: { type: Date, default: Date.now }
});

const saidaSchema = new mongoose.Schema({
  destino: String, // nome do professor, setor ou sala
  quantidade: Number,
  data: { type: Date, default: Date.now }
});

const materialSchema = new mongoose.Schema({
  codigoBarras: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  descricao: String,
  marca: String,
  validade: Date,
  cor: String,
  medidas: {
    largura_cm: Number,
    comprimento_cm: Number,
    altura_cm: Number,
    base: Number,
    raio: Number,
    diametro: Number,
    diagonal: Number,
    apotema: Number
  },
  peso_gramas: Number,
  tamanho_numerico: Number,
  volume_ml: Number,
  localizacao: {
    armario: String,
    prateleira: String
  },
  quantidadeAtual: { type: Number, default: 0 },
  materialPic: [{type: String}],
  entradas: [entradaSchema],
  saidas: [saidaSchema],
  atualizadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("Material", materialSchema);
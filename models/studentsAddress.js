//ENDEREÇO

import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    alunoId: { type: Schema.Types.ObjectId, ref: 'Student' }, // Relaciona o endereço ao aluno
    logradouro: String,
    numero: Number, //Em caso de casa sem número deixar 0
    bairro: String,
    cidade: String,
    estado: String,
    cep: String,
    dataInicio: { type: Date, default: Date.now }, //Data da inserção da informação
    dataFim: {type: Date, default: null} //Data da troca de informação se houver
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
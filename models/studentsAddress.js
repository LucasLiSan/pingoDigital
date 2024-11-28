//ENDEREÇO

import mongoose from 'mongoose';
import Student from "./students.js";

const addressSchema = new mongoose.Schema({
    alunoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Relaciona o endereço ao aluno
    logradouro: String,
    numero: Number, //Em caso de casa sem número deixar 0
    bairro: String,
    cidade: String,
    estado: String,
    cep: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{5}-\d{3}/.test(v);
            },
            message: props => `${props.value} não é um CEP válido!`
        },
        required: true
    },
    dataInicio: { type: Date, default: Date.now }, //Data da inserção da informação
    dataFim: {type: Date, default: null} //Data da troca de informação se houver
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
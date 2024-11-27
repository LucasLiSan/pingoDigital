//ENDEREÇO

import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    funcionarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Relaciona o endereço ao funcionário
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

const employeeAddress = mongoose.model('employeeAddress', addressSchema);
export default employeeAddress;
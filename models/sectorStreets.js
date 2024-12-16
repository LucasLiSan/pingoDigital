import mongoose from "mongoose";

const sectorStreetsSchema = new mongoose.Schema ({
    rua: { type: String, required: true, trim: true },
    nomeAnterior: { type: String, required: false, trim: true },
    bairro: { type: String, required: true, trim: true },
    numero: { type: String, required: true },
    setor: { type: String, required: true },
    historico: [
        {
            evento: { type: String, required: true, enum: ["Cadastro", "Cancelado", "Correção", "Atualização", "Mudança de setorização"] },
            data: { type: Date, default: Date.now }, // Data do evento
            detalhes: { type: String } // Detalhes adicionais do evento
        }
    ]
});

const Setor = mongoose.model('Setor', sectorStreetsSchema);
export default Setor;
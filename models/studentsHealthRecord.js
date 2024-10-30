import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
    tipoCondicao: { 
        type: String, 
        enum: ["Alergia", "Doença Crônica", "Restrição Alimentar", "Deficiência", "Participação em Educação Física"], 
        required: true 
    },
    descricao: { type: String, required: true },  // Detalhe sobre a condição
    dataInicio: { type: Date, default: Date.now },  // Quando a condição foi registrada ou atualizada
    dataValidade: { type: Date },  // Validade da receita ou laudo, se aplicável
    ativo: { type: Boolean, default: true },  // Se o registro ainda está válido ou não
    laudo: { type: String, enum: ["Laudado", "Em Investigação", "Sem Laudo"], required: true },
    observacoes: { type: String, default: "" },  // Qualquer observação adicional

    // Tipo de documento (Laudo, Relatório, Receita, Atestado)
    tipoDocumento: {
        type: String,
        enum: ["Laudo", "Relatório", "Receita", "Atestado"],
        required: true  // Identifica o tipo de documento
    },

    // Campo CID (opcional para Laudo e Atestado)
    cid: { type: String, default: "" },  // Código Internacional de Doenças, opcional

    // Campos específicos para Atestados
    diasAtestado: { type: Number },  // Quantidade de dias do atestado
    dataInicioAtestado: { type: Date },  // Data de início do atestado
    dataFimAtestado: { type: Date },  // Data de término do atestado

    criadoEm: { type: Date, default: Date.now },  // Data de criação do registro
    atualizadoEm: { type: Date, default: Date.now }  // Data da última atualização
});

// Validação condicional para Atestados e Laudos
healthRecordSchema.pre('save', function (next) {
    if (this.tipoDocumento === "Atestado") {
        if (!this.diasAtestado || !this.dataInicioAtestado || !this.dataFimAtestado) {
            return next(new Error("Os campos 'diasAtestado', 'dataInicioAtestado', e 'dataFimAtestado' são obrigatórios para atestados."));
        }
    }

    // O campo CID é obrigatório apenas para Laudos e Atestados
    if ((this.tipoDocumento === "Laudo" || this.tipoDocumento === "Atestado") && !this.cid) {
        return next(new Error("O campo 'CID' é obrigatório para Laudos e Atestados."));
    }
    next();
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
export default HealthRecord;
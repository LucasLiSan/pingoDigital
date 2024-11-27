import mongoose from "mongoose";

const teachingSchema = new mongoose.Schema ({
    funcionarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    htpc: { type: Boolean, default: true }, // Sempre true para quadro do magistério
    horarioAlmoco: { type: Boolean, default: false }, // Diretores/Coordenadores têm almoço
    tipoProfessor: { 
    type: String, 
    enum: [
      'Educação Infantil',
      'Ensino Fundamental',
      'Substituto Fundamental',
      'Substituto Infantil',
      'Educação Física',
      'Atendimento Educacional Especializado',
      'Coordenador',
      'Diretor',
    ],
    required: true,
  },
  cargaHorariaSemanal: { type: Number, required: true }, // Exemplo: 20h, 40h, etc.
});

// Middleware para ajustar o campo `horarioAlmoco`
teachingSchema.pre('save', function(next) {
    if ((this.tipoProfessor === 'Coordenador' || this.tipoProfessor === 'Diretor') && !this.horarioAlmoco) {
        this.horarioAlmoco = true;
    }
    next();
});

const Teaching = mongoose.model('Teaching', teachingSchema);
export default Teaching;
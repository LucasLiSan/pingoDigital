import HorarioEducacaoFisica from "../models/horaEducFisic.js";

class horaEducFisicService {
    async create (matricula, nomeProf, DiaSemana, horaIn, horaOut, turma) {
        try {
            const newAula = new HorarioEducacaoFisica ({ matricula, nomeProf, DiaSemana, horaIn, horaOut, turma });
            await newAula.save();
            return newAula;
        } catch (error) { console.log(error); }
    }

    async getAll() {
        try {
            const aulas = await HorarioEducacaoFisica.find();
            return aulas;
        } catch (error) { console.log(error); }
    }

    /* --- (LISTAR UM) --- */
    async getOne(id) {
        try {
            const aula = await HorarioEducacaoFisica.findOne({ _id: id });
            return aula;
        } catch (error) { console.log(error); }
    }

    /* --- Método UPDATE --- */
    async update(id, matricula, nomeProf, DiaSemana, horaIn, horaOut, turma) {
        try {
            await HorarioEducacaoFisica.findByIdAndUpdate(id, { matricula, nomeProf, DiaSemana, horaIn, horaOut, turma });
            console.log(`Alterações na aula id: ${id} feitas com sucesso`);
        } catch (error) { console.log(error); }
    }

    /* --- Método DELETE --- */
    async delete(id) {
        try {
            await HorarioEducacaoFisica.findByIdAndDelete(id);
            console.log(`Aula id: ${id} deletado com sucesso.`);
        } catch (error) { console.log(error); }
    }
}

export default new horaEducFisicService();
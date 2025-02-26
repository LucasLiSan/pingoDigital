import HorarioFuncionarios from "../models/horaTrabFunc.js";

class horaTrabalhoService {
    async create (matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut) {
        try {
            const newHora = new HorarioFuncionarios ({ matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut });
            await newHora.save();
            return newHora;
        } catch (error) { console.log(error); }
    }

    async getAll() {
        try {
            const horas = await HorarioFuncionarios.find();
            return horas;
        } catch (error) { console.log(error); }
    }

    /* --- (LISTAR UM) --- */
    async getOne(id) {
        try {
            const hora = await HorarioFuncionarios.findOne({ _id: id });
            return hora;
        } catch (error) { console.log(error); }
    }

    /* --- Método UPDATE --- */
    async update(id, matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut) {
        try {
            await HorarioFuncionarios.findByIdAndUpdate(id, { matricula, nomeFunc, cargoFunc, horaIn, horaOut, almocoIn, almocoOut, htpcIn, htpcOut });
            console.log(`Alterações no horario id: ${id} feitas com sucesso`);
        } catch (error) { console.log(error); }
    }

    /* --- Método DELETE --- */
    async delete(id) {
        try {
            await HorarioFuncionarios.findByIdAndDelete(id);
            console.log(`Horario id: ${id} deletado com sucesso.`);
        } catch (error) { console.log(error); }
    }
}

export default new horaTrabalhoService();
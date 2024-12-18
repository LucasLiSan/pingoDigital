import Setor from "../models/sectorStreets.js";

class sectorService {
    /* --- Método CADASTRAR --- */
    async create(rua, nomeAnterior, bairro, numero, setor, evento, detalhes) {
        try {
            const newSector = new Setor({
                rua,
                nomeAnterior,
                bairro,
                numero,
                setor,
                historico: [{ evento, detalhes }] // Adiciona "detalhes" ao histórico inicial
            });
            await newSector.save();
            return newSector;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /* --- Método READ (LISTAR TODOS) --- */
    async getAll() {
        try {
            const sectors = await Setor.find();
            return sectors;
        } catch (error) { console.log(error); }
    }

    /* --- (LISTAR UM) --- */
    async getOne(id) {
        try {
            const sectors = await Setor.findOne({ _id: id });
            return sectors;
        } catch (error) { console.log(error); }
    }

    /* --- Método UPDATE --- */
    async update(id, rua, nomeAnterior, bairro, numero, setor, evento, detalhes) {
        try {
            const updatedSector = await Setor.findByIdAndUpdate(
                id,
                { rua, nomeAnterior, bairro, numero, setor },
                { new: true } // Retorna o documento atualizado
            );
    
            if (evento) {
                await Setor.findByIdAndUpdate(
                    id,
                    { 
                        $push: { 
                            historico: { 
                                evento, 
                                detalhes // Inclui o campo "detalhes" no histórico
                            } 
                        } 
                    }
                );
            }
            console.log(`Alterações na rua id: ${id} feitas com sucesso`);
            return updatedSector;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /* --- Método DELETE --- */
    async delete(id) {
        try {
            await Setor.findByIdAndDelete(id);
            console.log(`Rua id: ${id} deletado com sucesso.`);
        } catch (error) { console.log(error); }
    }
}

export default new sectorService();
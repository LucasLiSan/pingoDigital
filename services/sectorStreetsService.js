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

    /* --- Buscar casa por rua, número e bairro --- */
    async searchHouse(street, number, neighborhood) {
        try {
            const query = {
                $or: [
                    { rua: { $regex: street, $options: "i" } },
                    { nomeAnterior: { $regex: street, $options: "i" } }
                ]
            };

            if (neighborhood) {
                query.bairro = neighborhood;
            }

            const results = await Setor.find(query);

            if (number) {
                return results.find((sector) => {
                    const numCondition = sector.numero?.toLowerCase();
                    if (numCondition.startsWith("acima")) {
                        const threshold = parseInt(numCondition.replace("acima ", ""));
                        return number >= threshold;
                    }
                    if (numCondition.startsWith("abaixo")) {
                        const threshold = parseInt(numCondition.replace("abaixo ", ""));
                        return number <= threshold;
                    }
                    return true; // "Todos" aceita qualquer número
                });
            }

            return results.length ? results[0] : null;
        } catch (error) {
            console.log(error);
            throw error;
        }
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
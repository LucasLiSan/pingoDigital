import Patrimonio from "../models/patrimonio.js";

class PatrimonioService {
    /* --- Método CADASTRAR --- */
    async create(codPat, descrition, situation, local, ue, lastCheck, obs, value, fiscal, patPic, history = null) {
        try {
            const newPat = new Patrimonio({ codPat, descrition, situation, local, ue, lastCheck, obs, value, fiscal, patPic, history });
            await newPat.save();
            return newPat;
        } catch (error) { console.log("Erro ao cadastrar item:", error); }
    }

    /* --- Método READ --- */
        /* --- Listar todos --- */
        async getAll() {
            try {
                return await Patrimonio.find();
            } catch(error) { console.log("Erro ao buscar os itens:", error); }
        }

        /* --- Listar um com ID --- */
        async getOne(id) {
            try {
                const pat = await Patrimonio.findOne({ _id:id});
                return pat;
            } catch (error) { console.log(error); }
        }

        /* --- Listar um com codPat --- */
        async getOnePat(patCode) {
            try {
                return await Patrimonio.findOne({ codPat : patCode});
            } catch (error) { console.log("Erro ao buscar o item:", error); }
        }

    /* --- Método UPDATE --- */
        /* --- Atualizar item --- */

        async update(codPat, descrition, situation, local, ue, lastCheck, obs, value, fiscal, patPic) {
            try {
                const updateData = {};
                if (codPat) updateData.codPat = codPat;
                if (descrition) updateData.descrition = descrition;
                if (situation) updateData.situation = situation;
                if (local) updateData.local = local;
                if (ue) updateData.ue = ue;
                if (lastCheck) {
                    const [day, month, year] = lastCheck.split("/");
                    lastCheck = new Date(`${year}-${month}-${day}T00:00:00Z`); // Usa UTC para evitar erros de fuso
                    updateData.lastCheck = lastCheck;
                } 
                if (obs) updateData.obs = obs;
                if (value) updateData.value = value;
                if (fiscal) updateData.fiscal = fiscal;
                if (patPic) updateData.patPic = patPic;

                const updatedPat = await Patrimonio.findByIdAndUpdate(id, updateData, { new: true});

                if (!updatedPat) {
                    console.log(`Item ID: ${id} não encontrado.`);
                    return null;
                }
        
                console.log(`Item ID: ${id} atualizado com sucesso.`);
                return updatedPat;

            } catch (error) {
                console.error("Erro ao atualizar item:", error);
                throw error;
            }
        }
        
        /* --- Atualizar local --- */    
        async updateSpot(codPat, date, from, to, type) {
            try {
                const movement = {};
                
                if (from) movement.from = from;
                if (to) {
                    movement.to = to;
                    // Atualiza o local atual do patrimônio
                    await Patrimonio.findOneAndUpdate(
                        { codPat },
                        { local: to }
                    );
                }
                
                if (type) movement.type = type;

                if (date) {
                    const [day, month, year] = date.split("/");
                    movement.date = new Date(`${year}-${month}-${day}T00:00:00Z`);
                } else {
                    movement.date = new Date(); // Data atual se não for fornecida
                }

                const updatedPat = await Patrimonio.findOneAndUpdate(
                    { codPat },
                    { $push: { history: movement } }, // Adiciona a movimentação ao histórico
                    { new: true }
                );

                if (!updatedPat) {
                    console.log(`Item com código: ${codPat} não encontrado.`);
                    return null;
                }

                console.log(`Movimentação registrada para o patrimônio '${codPat}'.`);
                return updatedPat;

            } catch (error) {
                console.error("Erro ao atualizar local do patrimônio:", error);
                throw error;
            }
        }

    /* --- Método DELETE --- */
    async delete(id) {
        try {
            await Patrimonio.findByIdAndDelete(id);
            console.log(`Item ID: ${id} deletado com sucesso.`);
        } catch (error) { console.log("Erro ao deletar o item:", error); }
    }

}

export default new PatrimonioService();
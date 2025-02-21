import AchadosPerdidos from "../models/achados.js";

class AchadosService {
    /* --- Método CADASTRAR (Criar um novo item perdido) --- */
    async create(item, desc_item, pic, data, situacao, dono = null) {
        try {
            const newItem = new AchadosPerdidos({ item, desc_item, pic, data, situacao, dono });
            await newItem.save();
            return newItem;
        } catch (error) {
            console.error("Erro ao cadastrar item:", error);
        }
    }

    /* --- Método READ (Listar todos os itens) --- */
    async getAll() {
        try {
            return await AchadosPerdidos.find();
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
        }
    }

    /* --- Método READ (Listar um item específico por item) --- */
    async getOne(itemCode) {
        try {
            return await AchadosPerdidos.findOne({ item: itemCode });
        } catch (error) {
            console.error("Erro ao buscar item:", error);
        }
    }

    /* --- Método UPDATE (Atualizar um item perdido) --- */
    async update(id, item, desc_item, pic, situacao, dono) {
        try {
            await AchadosPerdidos.findByIdAndUpdate(id, { item, desc_item, pic, situacao, dono });
            console.log(`Item ID: ${id} atualizado com sucesso.`);
        } catch (error) {
            console.error("Erro ao atualizar item:", error);
        }
    }

    /* --- Método DELETE (Remover um item perdido) --- */
    async delete(id) {
        try {
            await AchadosPerdidos.findByIdAndDelete(id);
            console.log(`Item ID: ${id} deletado com sucesso.`);
        } catch (error) {
            console.error("Erro ao deletar item:", error);
        }
    }

    /* --- Método para listar apenas os itens ainda PERDIDOS --- */
    async getLostItems() {
        try {
            return await AchadosPerdidos.find({ situacao: "PERDIDO" });
        } catch (error) {
            console.error("Erro ao buscar itens perdidos:", error);
        }
    }

    /* --- Método para marcar um item como DEVOLVIDO e registrar o dono --- */
    async markAsReturned(item, dono, dono_turma, data_devolucao) {
        try {
            await AchadosPerdidos.findOneAndUpdate(
                { item }, // Busca pelo item, que é único
                { 
                    situacao: "DEVOLVIDO",
                    dono: { dono, dono_turma, data_devolucao }
                }
            );
            console.log(`Item '${item}' foi marcado como DEVOLVIDO.`);
        } catch (error) {
            console.error("Erro ao marcar item como devolvido:", error);
        }
    }    
}

export default new AchadosService();
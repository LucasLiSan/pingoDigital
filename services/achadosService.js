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

    /* --- Método READ (Listar um item específico por id) --- */
    async getOne (id) {
        try {
            const item = await AchadosPerdidos.findOne({ _id: id});
            return item;
        } catch (error) { console.log(error); }
    }


    /* --- Método READ (Listar um item específico por item) --- */
    async getOneItem(itemCode) {
        try {
            return await AchadosPerdidos.findOne({ item: itemCode });
        } catch (error) {
            console.error("Erro ao buscar item:", error);
        }
    }

    /* --- Método UPDATE (Atualizar um item perdido) --- */
    async update(id, item, desc_item, pic, data, situacao, dono) {
        try {
            const updateData = {};
            if (item) updateData.item = item;
            if (desc_item) updateData.desc_item = desc_item;
            if (pic) updateData.pic = pic;
            // Converte data de "DD/MM/YYYY" para Date
            if (data) {
                const [day, month, year] = data.split("/");
                data = new Date(`${year}-${month}-${day}T00:00:00Z`); // Usa UTC para evitar erros de fuso
                updateData.data = data;
            }
            if (situacao) updateData.situacao = situacao; // Certifica-se de que a situação está sendo passada corretamente
            if (dono) updateData.dono = dono;
    
            const updatedItem = await AchadosPerdidos.findByIdAndUpdate(id, updateData, { new: true });
    
            if (!updatedItem) {
                console.log(`Item ID: ${id} não encontrado.`);
                return null;
            }
    
            console.log(`Item ID: ${id} atualizado com sucesso.`);
            return updatedItem;
        } catch (error) {
            console.error("Erro ao atualizar item:", error);
            throw error;
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
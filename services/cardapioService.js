import CardapioEscolarRegular from "../models/cardapio.js";

class CardapioService {
    /* --- Método CADASTRAR --- */
    async create(mes, ano, dias) {
        try {
            // Verifica se já existe um cardápio para o mês e ano
            let cardapio = await CardapioEscolarRegular.findOne({ "cardapio_regular.mes": mes, "cardapio_regular.ano": ano });
    
            // Se não existir, cria um novo cardápio
            if (!cardapio) {
                cardapio = new CardapioEscolarRegular({ cardapio_regular: [{ mes, ano, dias: [] }] });
            }
    
            // Localiza o cardápio do mês/ano dentro do array
            const cardapioMesAno = cardapio.cardapio_regular.find(c => c.mes === mes && c.ano === ano);
    
            // Adiciona os novos dias ao cardápio
            dias.forEach(dia => {
                cardapioMesAno.dias.push({
                    dia: dia.dia,
                    desjejum: dia.desjejum,
                    almoco: dia.almoco,
                    sobremesa: dia.sobremesa,
                });
            });
    
            // Salva o cardápio atualizado
            await cardapio.save();
    
            return cardapio;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /* --- Método READ (LISTAR TODOS) --- */
    async getAll() {
        try {
            const cardapios = await CardapioEscolarRegular.find();
            return cardapios;
        } catch (error) {
            console.error("Erro ao listar os cardápios:", error);
        }
    }

    /* --- Método READ (LISTAR UM) --- */
    async getOne(id) {
        try {
            const cardapio = await CardapioEscolarRegular.findById(id);
            return cardapio;
        } catch (error) {
            console.error(`Erro ao buscar o cardápio com ID ${id}:`, error);
        }
    }

    /* --- Método UPDATE --- */
    async update(id, cardapioData) {
        try {
            const updatedCardapio = await CardapioEscolarRegular.findByIdAndUpdate(id, cardapioData, { new: true });
            console.log(`Cardápio com ID ${id} atualizado com sucesso.`);
            return updatedCardapio;
        } catch (error) {
            console.error(`Erro ao atualizar o cardápio com ID ${id}:`, error);
        }
    }

    /* --- Método DELETE --- */
    async delete(id) {
        try {
            await CardapioEscolarRegular.findByIdAndDelete(id);
            console.log(`Cardápio com ID ${id} deletado com sucesso.`);
        } catch (error) {
            console.error(`Erro ao deletar o cardápio com ID ${id}:`, error);
        }
    }
}

export default new CardapioService();

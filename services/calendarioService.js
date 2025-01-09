import CalendarioEscolar from "../models/calendar.js";

class calendarioService {
    /* --- Método CADASTRAR --- */

    async create(mes, ano, dia, dia_semana, situacao, eventos) {
        try {
            // Busca o calendário pelo mês e ano
            let calendario = await CalendarioEscolar.findOne({ mes, ano });
    
            // Se o calendário não existir, cria um novo
            if (!calendario) {
                calendario = new CalendarioEscolar({ mes, ano, dias: [] });
            }
    
            // Cria um novo dia
            const novoDia = {
                dia,
                dia_semana,
                situacao,
                eventos
            };
    
            // Adiciona o novo dia ao calendário
            calendario.dias.push(novoDia);
    
            // Salva o calendário atualizado
            await calendario.save();
    
            return calendario;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /* --- Método READ --- */
        /* --- (LISTAR TODOS) --- */
        async getAll() {
            try {
                const days = await CalendarioEscolar.find();
                return days;
            } catch (error) { console.log(error); }
        }

}

export default new calendarioService();
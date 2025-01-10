import CalendarioEscolar from "../models/calendar.js";
import moment from "moment";

class calendarioService {
    /* --- Método CADASTRAR --- */

    async create(mes, ano, dias) {
        try {
            // Verifica se já existe um calendário para o mês e ano
            let calendario = await CalendarioEscolar.findOne({ mes, ano });
    
            // Se não existir, cria um novo
            if (!calendario) {
                calendario = new CalendarioEscolar({ mes, ano, dias: [] });
            }
    
            // Adiciona os novos dias ao calendário
            dias.forEach(dia => {
                const eventosFormatados = dia.eventos.map(evento => ({
                    ...evento,
                    data_evento: moment(evento.data_evento, "DD/MM/YYYY").toDate()
                }));
    
                calendario.dias.push({
                    dia: dia.dia,
                    dia_semana: dia.dia_semana,
                    situacao: dia.situacao,
                    eventos: eventosFormatados,
                });
            });
    
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
    
    /* --- Método UPDATE --- */
    async update(id, mes, ano, dias) {
        try {
            // Atualiza o calendário pelo ID
            const updatedCalendar = await CalendarioEscolar.findByIdAndUpdate(
                id,
                { mes, ano, dias },
                { new: true } // Retorna o documento atualizado
            );
            console.log(`Alterações no calendário id: ${id} feitas com sucesso`);
            return updatedCalendar;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    /* --- Método DELETE --- */
    async delete(id) {
        try {
            await CalendarioEscolar.findByIdAndDelete(id);
            console.log(`Calendário id: ${id} deletado com sucesso.`);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

export default new calendarioService();
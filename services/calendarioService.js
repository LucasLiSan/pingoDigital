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

        /* --- (LISTRA MÊS) --- */
        async getById(id) {
            try {
                // Busca o calendário pelo ID
                const calendario = await CalendarioEscolar.findById(id);
                if (!calendario) {
                    console.log(`Nenhum calendário encontrado para o ID: ${id}`);
                }
                return calendario;
            } catch (error) {
                console.log(error);
                throw error;
            }
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

    async updateDay(dayId, updatedDay) {
        try {
            // Encontra o calendário que contém o dia com o ID fornecido
            const calendar = await CalendarioEscolar.findOne({ "dias._id": dayId });
    
            if (!calendar) {
                throw new Error(`Calendário contendo o dia com ID ${dayId} não encontrado.`);
            }
    
            // Encontra o índice do dia na matriz `dias`
            const dayIndex = calendar.dias.findIndex(day => day._id.toString() === dayId);
    
            if (dayIndex === -1) {
                throw new Error(`Dia com ID ${dayId} não encontrado no calendário.`);
            }
    
            // Processa as datas no formato correto (DD/MM/YYYY para Date)
            if (updatedDay.eventos) {
                updatedDay.eventos = updatedDay.eventos.map(evento => ({
                    ...evento,
                    data_evento: moment(evento.data_evento, "DD/MM/YYYY").toDate(), // Converte para Date
                }));
            }
    
            // Atualiza o dia específico
            calendar.dias[dayIndex] = {
                ...calendar.dias[dayIndex]._doc, // Mantém os dados originais
                ...updatedDay, // Sobrescreve com os dados atualizados
            };
    
            // Salva as alterações no banco
            const updatedCalendar = await calendar.save();
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

    async deleteDay(calendarioId, diaId) {
        try {
            // Encontra o calendário e remove o dia com o ID especificado
            const result = await CalendarioEscolar.findOneAndUpdate(
                { _id: calendarioId }, // ID do calendário
                { $pull: { dias: { _id: diaId } } }, // Remove o dia pelo ID
                { new: true } // Retorna o documento atualizado
            );
    
            if (result) {
                console.log(`Dia id: ${diaId} removido com sucesso do calendário ${calendarioId}.`);
                return result;
            } else {
                throw new Error(`Calendário com ID ${calendarioId} ou dia com ID ${diaId} não encontrado.`);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

export default new calendarioService();
import CalendarioEscolar from "../models/calendar.js";

class CalendarService {
    /* --- Método CADASTRAR DIA E EVENTOS --- */
    async createDay(mes, ano, dia, dia_semana, situacao, eventos = []) {
        try {
            // Verifica se o mês e ano já existem no banco
            let calendarMonth = await CalendarioEscolar.findOne({ "calendario_escolar.mes": mes, "calendario_escolar.ano": ano });

            if (!calendarMonth) {
                // Se não existir, cria um novo mês no calendário
                calendarMonth = new CalendarioEscolar({
                    calendario_escolar: [{ mes, ano, dias: [] }]
                });
            }

            // Adiciona o dia ao mês existente ou novo
            const monthIndex = calendarMonth.calendario_escolar.findIndex(m => m.mes === mes && m.ano === ano);
            const existingDay = calendarMonth.calendario_escolar[monthIndex].dias.find(d => d.dia === dia);

            if (existingDay) {
                // Atualiza os eventos de um dia existente
                existingDay.eventos.push(...eventos);
            } else {
                // Adiciona um novo dia
                calendarMonth.calendario_escolar[monthIndex].dias.push({ dia, dia_semana, situacao, eventos });
            }

            // Salva no banco de dados
            await calendarMonth.save();
            return calendarMonth;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /* --- Método LISTAR TODOS OS DIAS --- */
    async getAll() {
        try {
            const calendar = await CalendarioEscolar.find();
            return calendar;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /* --- Método LISTAR UM MÊS --- */
    async getMonth(mes, ano) {
        try {
            const calendarMonth = await CalendarioEscolar.findOne({ "calendario_escolar.mes": mes, "calendario_escolar.ano": ano });
            return calendarMonth || null;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /* --- Método ATUALIZAR UM DIA --- */
    async updateDay(mes, ano, dia, updates) {
        try {
            const calendarMonth = await CalendarioEscolar.findOne({ "calendario_escolar.mes": mes, "calendario_escolar.ano": ano });

            if (!calendarMonth) {
                throw new Error("Mês e ano não encontrados.");
            }

            const monthIndex = calendarMonth.calendario_escolar.findIndex(m => m.mes === mes && m.ano === ano);
            const dayIndex = calendarMonth.calendario_escolar[monthIndex].dias.findIndex(d => d.dia === dia);

            if (dayIndex === -1) {
                throw new Error("Dia não encontrado.");
            }

            // Atualiza os campos do dia
            Object.assign(calendarMonth.calendario_escolar[monthIndex].dias[dayIndex], updates);

            await calendarMonth.save();
            return calendarMonth;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /* --- Método DELETAR UM DIA --- */
    async deleteDay(mes, ano, dia) {
        try {
            const calendarMonth = await CalendarioEscolar.findOne({ "calendario_escolar.mes": mes, "calendario_escolar.ano": ano });

            if (!calendarMonth) {
                throw new Error("Mês e ano não encontrados.");
            }

            const monthIndex = calendarMonth.calendario_escolar.findIndex(m => m.mes === mes && m.ano === ano);
            calendarMonth.calendario_escolar[monthIndex].dias = calendarMonth.calendario_escolar[monthIndex].dias.filter(d => d.dia !== dia);

            await calendarMonth.save();
            return calendarMonth;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default new CalendarService();
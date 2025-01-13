document.addEventListener("DOMContentLoaded", async function () {
    const calendarBody = document.getElementById("bodyCalendar");
    const eventsContainer = document.querySelector(".events");
    const monthLabel = document.getElementById("mouth");
    const yearLabel = document.getElementById("year");
    const schoolDaysCurrent = document.getElementById("shoolDaysCurrent");

    // Fetch calendar data from the API
    async function fetchCalendarData() {
        try {
            const response = await fetch("http://localhost:8080/dias"); // Altere para a URL da sua API
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erro ao carregar dados do calendário:", error);
            return null;
        }
    }

    // Load data and initialize
    const calendarData = await fetchCalendarData();
    if (!calendarData) {
        console.error("Não foi possível carregar os dados do calendário.");
        return;
    }

    const today = new Date();
    let displayedYear = today.getFullYear();
    let displayedMonth = today.getMonth();

    let schoolDaysCount = calculateSchoolDaysCount(today.getFullYear(), today.getMonth());

    function calculateSchoolDaysCount(currentYear, currentMonth) {
        let countSchoolDays = 0;

        for (let m = 0; m <= currentMonth; m++) {
            const currentMonthData = calendarData.days.find(
                data => data.mes === getMonthName(m) && data.ano === currentYear
            );
            if (currentMonthData) {
                currentMonthData.dias.forEach(day => {
                    if (currentYear === today.getFullYear() && m === today.getMonth() && day.dia > today.getDate()) {
                        return;
                    }
                    if (day.situacao === "LETIVO") {
                        countSchoolDays++;
                    }
                });
            }
        }

        schoolDaysCurrent.innerText = countSchoolDays;
        return countSchoolDays;
    }

    function displayMonthEvents(monthData) {
        eventsContainer.innerHTML = "";
        if (monthData && monthData.dias.length > 0) {
            monthData.dias.forEach(dayData => {
                if (dayData.eventos && dayData.eventos.length > 0) {
                    dayData.eventos.forEach(event => {
                        const eventElement = createEventElement(event, dayData.dia);
                        eventsContainer.appendChild(eventElement);
                    });
                }
            });
        }
    }

    function createEventElement(event, day) {
        const eventElement = document.createElement("p");
        eventElement.className = "event";

        const dateSpan = document.createElement("span");
        dateSpan.className = "eventDate";
        dateSpan.innerText = `${day}/${getMonthName(displayedMonth).slice(0, 3)}`;

        const descSpan = document.createElement("span");
        descSpan.className = "eventDescrition";
        descSpan.innerText = event.descricao_evento;

        const guestsSpan = document.createElement("span");
        guestsSpan.className = "eventGuests";
        guestsSpan.innerText = event.participantes.length > 0 ? event.participantes.join(", ") : "NÃO HAVERÁ AULA";

        eventElement.appendChild(dateSpan);
        eventElement.appendChild(descSpan);
        eventElement.appendChild(guestsSpan);

        return eventElement;
    }

    function displayDayEvents(dayStatus) {
        eventsContainer.innerHTML = "";
        if (dayStatus && dayStatus.eventos.length > 0) {
            dayStatus.eventos.forEach(event => {
                const eventElement = createEventElement(event, dayStatus.dia);
                eventsContainer.appendChild(eventElement);
            });
        } else {
            const noEventElement = document.createElement("p");
            noEventElement.className = "noEvent";
            noEventElement.innerText = "NENHUM EVENTO PARA O DIA ESPECÍFICO";
            eventsContainer.appendChild(noEventElement);
        }
    }

    function displayCalendar(year, month) {
        calendarBody.innerHTML = "";
        eventsContainer.innerHTML = "";

        monthLabel.innerText = getMonthName(month);
        yearLabel.innerText = year;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

        const prevMonthDays = new Date(year, month, 0).getDate();
        const startPrevMonth = prevMonthDays - firstDayOfMonth + 1;

        const monthData = calendarData.days.find(
            data => data.mes === getMonthName(month) && data.ano === year
        );

        for (let i = startPrevMonth; i <= prevMonthDays; i++) {
            const day = document.createElement("span");
            day.className = "previusMouth";
            day.setAttribute("tabindex", "0");
            day.innerText = i;
            calendarBody.appendChild(day);
        }

        for (let i = 1; i <= totalDaysInMonth; i++) {
            const day = document.createElement("span");
            day.setAttribute("tabindex", "0");
            day.innerText = i;

            const dayOfWeek = new Date(year, month, i).getDay();
            const dayStatus = monthData ? monthData.dias.find(d => d.dia === i) : null;

            if (dayStatus && dayStatus.situacao !== "LETIVO") {
                day.classList.add("holiday");
            } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                day.classList.add("weekend");
            }

            calendarBody.appendChild(day);

            day.addEventListener("click", () => {
                displayDayEvents(dayStatus);
            });
        }

        const remainingSlots = 35 - calendarBody.children.length;
        for (let i = 1; i <= remainingSlots; i++) {
            const day = document.createElement("span");
            day.className = "nextMouth";
            day.setAttribute("tabindex", "0");
            day.innerText = i;
            calendarBody.appendChild(day);
        }

        displayMonthEvents(monthData);
    }

    function getMonthName(monthIndex) {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return monthNames[monthIndex];
    }

    function changeMonth(offset) {
        displayedMonth += offset;
        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear -= 1;
        } else if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear += 1;
        }
        displayCalendar(displayedYear, displayedMonth);
    }

    document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
    document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));

    document.addEventListener("click", (e) => {
        if (!calendarBody.contains(e.target)) {
            const monthData = calendarData.days.find(
                data => data.mes === getMonthName(displayedMonth) && data.ano === displayedYear
            );
            displayMonthEvents(monthData);
        }
    });

    displayCalendar(displayedYear, displayedMonth);
});
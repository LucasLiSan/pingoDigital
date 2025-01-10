document.addEventListener("DOMContentLoaded", async function () {
    const calendarBody = document.getElementById("bodyCalendar");
    const eventsContainer = document.querySelector(".events");
    const monthLabel = document.getElementById("mouth");
    const yearLabel = document.getElementById("year");
    const schoolDaysCurrent = document.getElementById("shoolDaysCurrent");

    const apiUrl = "/dias"; // URL para acessar sua API

    // Fetch calendar data from MongoDB
    async function fetchCalendarData(year, month) {
        try {
            const response = await fetch(`${apiUrl}/${month + 1}/${year}`); // Ajuste do mês (0-indexed para 1-indexed)
            if (!response.ok) {
                throw new Error("Erro ao carregar os dados do calendário.");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar dados do calendário:", error);
            return null;
        }
    }

    // Initialize with the current month
    const today = new Date();
    let displayedYear = today.getFullYear();
    let displayedMonth = today.getMonth();

    // Initialize school days count
    let schoolDaysCount = 0;

    // Function to calculate school days
    function calculateSchoolDaysCount(monthData) {
        if (!monthData || !monthData.dias) return 0;

        return monthData.dias.reduce((count, day) => {
            if (day.situacao === "LETIVO") {
                count++;
            }
            return count;
        }, 0);
    }

    // Function to display all events for the current month
    function displayMonthEvents(monthData) {
        eventsContainer.innerHTML = ""; // Clear previous events
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

    // Function to create an event element
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

    // Function to display the calendar for a specific month
    async function displayCalendar(year, month) {
        calendarBody.innerHTML = ""; // Clear calendar body
        eventsContainer.innerHTML = ""; // Clear events container

        // Update month and year labels
        monthLabel.innerText = getMonthName(month);
        yearLabel.innerText = year;

        // Get days in the current month and the first day
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

        // Calculate previous month's days needed to fill the grid
        const prevMonthDays = new Date(year, month, 0).getDate();
        const startPrevMonth = prevMonthDays - firstDayOfMonth + 1;

        // Fetch data from MongoDB
        const monthData = await fetchCalendarData(year, month);

        // Update school days count
        schoolDaysCount = calculateSchoolDaysCount(monthData);
        schoolDaysCurrent.innerText = schoolDaysCount;

        // Populate previous month days
        for (let i = startPrevMonth; i <= prevMonthDays; i++) {
            const day = document.createElement("span");
            day.className = "previusMouth";
            day.setAttribute("tabindex", "0");
            day.innerText = i;
            calendarBody.appendChild(day);
        }

        // Populate current month days with special conditions
        for (let i = 1; i <= totalDaysInMonth; i++) {
            const day = document.createElement("span");
            day.setAttribute("tabindex", "0");
            day.innerText = i;

            const dayOfWeek = new Date(year, month, i).getDay();
            const dayStatus = monthData ? monthData.dias.find(d => d.dia === i) : null;

            // Add holiday class if day status is different from "LETIVO"
            if (dayStatus && (dayStatus.situacao !== "LETIVO")) {
                day.classList.add("holiday");
            } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                // Apply weekend class only if it's not "LETIVO"
                day.classList.add("weekend");
            }

            calendarBody.appendChild(day);

            // Add click event listener to show events of the day
            day.addEventListener("click", () => {
                displayDayEvents(dayStatus);
            });
        }

        // Populate next month's days
        const remainingSlots = 35 - calendarBody.children.length;
        for (let i = 1; i <= remainingSlots; i++) {
            const day = document.createElement("span");
            day.className = "nextMouth";
            day.setAttribute("tabindex", "0");
            day.innerText = i;
            calendarBody.appendChild(day);
        }

        // Display all events for the current month by default
        displayMonthEvents(monthData);
    }

    // Helper function to get the month name
    function getMonthName(monthIndex) {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return monthNames[monthIndex];
    }

    // Function to navigate months
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

    // Event listeners for month navigation
    document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
    document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));

    // Initialize the calendar with the current month
    displayCalendar(displayedYear, displayedMonth);
});

//Script de efeito de rolagem
document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("scroll", function() {
        var scrollPosition = window.scrollY;
        var halfWindowHeight = window.innerHeight / 2;
        var page1Top = 350;
        var page2Top = document.querySelector('.page2').offsetTop - halfWindowHeight;
        var page3Top = document.querySelector('.page3').offsetTop - halfWindowHeight;
        var page4Top = document.querySelector('.page4').offsetTop - halfWindowHeight;

        if (scrollPosition > page1Top && scrollPosition < page2Top) {
            document.querySelector('.page1-title').classList.add('page1-title-active');
            document.querySelector('.page1-desc').classList.add('page1-desc-active');
            document.querySelector('.plate1').classList.add('plate1-active');

            document.querySelector('.pg2-green-back').classList.remove('pg2-green-back-active');
            document.querySelector('.pg2-white-desc').classList.remove('pg2-white-desc-active');
            document.querySelector('.pg2-photo-wrap').classList.remove('pg2-photo-wrap-active');
            document.querySelector('.pg2-photo').classList.remove('pg2-photo-active');
            document.querySelector('.grapes').classList.remove('grapes-active');

            document.querySelector('.pg3-red-back').classList.remove('pg3-red-back-active');
            document.querySelector('.pg3-white-desc').classList.remove('pg3-white-desc-active');
            document.querySelector('.pg3-photo-wrap').classList.remove('pg3-photo-wrap-active');
            document.querySelector('.pg3-photo').classList.remove('pg3-photo-active');
            document.querySelector('.leafs').classList.remove('leafs-active');

            document.querySelector('.pg4-bezh-back').classList.remove('pg4-bezh-back-active');
            document.querySelector('.pg4-white-desc').classList.remove('pg4-white-desc-active');
            document.querySelector('.pg4-photo-wrap').classList.remove('pg4-photo-wrap-active');
            document.querySelector('.pg4-photo').classList.remove('pg4-photo-active');
            document.querySelector('.dessert').classList.remove('dessert-active');
        } else if (scrollPosition > page2Top && scrollPosition < page3Top) {
            document.querySelector('.pg2-green-back').classList.add('pg2-green-back-active');
            document.querySelector('.pg2-white-desc').classList.add('pg2-white-desc-active');
            document.querySelector('.pg2-photo-wrap').classList.add('pg2-photo-wrap-active');
            document.querySelector('.pg2-photo').classList.add('pg2-photo-active');
            document.querySelector('.grapes').classList.add('grapes-active');

            document.querySelector('.page1-title').classList.remove('page1-title-active');
            document.querySelector('.page1-desc').classList.remove('page1-desc-active');
            document.querySelector('.plate1').classList.remove('plate1-active');

            document.querySelector('.pg3-red-back').classList.remove('pg3-red-back-active');
            document.querySelector('.pg3-white-desc').classList.remove('pg3-white-desc-active');
            document.querySelector('.pg3-photo-wrap').classList.remove('pg3-photo-wrap-active');
            document.querySelector('.pg3-photo').classList.remove('pg3-photo-active');
            document.querySelector('.leafs').classList.remove('leafs-active');

            document.querySelector('.pg4-bezh-back').classList.remove('pg4-bezh-back-active');
            document.querySelector('.pg4-white-desc').classList.remove('pg4-white-desc-active');
            document.querySelector('.pg4-photo-wrap').classList.remove('pg4-photo-wrap-active');
            document.querySelector('.pg4-photo').classList.remove('pg4-photo-active');
            document.querySelector('.dessert').classList.remove('dessert-active');
        } else if (scrollPosition > page3Top && scrollPosition < page4Top) {
            document.querySelector('.pg3-red-back').classList.add('pg3-red-back-active');
            document.querySelector('.pg3-white-desc').classList.add('pg3-white-desc-active');
            document.querySelector('.pg3-photo-wrap').classList.add('pg3-photo-wrap-active');
            document.querySelector('.pg3-photo').classList.add('pg3-photo-active');
            document.querySelector('.leafs').classList.add('leafs-active');

            document.querySelector('.page1-title').classList.remove('page1-title-active');
            document.querySelector('.page1-desc').classList.remove('page1-desc-active');
            document.querySelector('.plate1').classList.remove('plate1-active');

            document.querySelector('.pg2-green-back').classList.remove('pg2-green-back-active');
            document.querySelector('.pg2-white-desc').classList.remove('pg2-white-desc-active');
            document.querySelector('.pg2-photo-wrap').classList.remove('pg2-photo-wrap-active');
            document.querySelector('.pg2-photo').classList.remove('pg2-photo-active');
            document.querySelector('.grapes').classList.remove('grapes-active');

            document.querySelector('.pg4-bezh-back').classList.remove('pg4-bezh-back-active');
            document.querySelector('.pg4-white-desc').classList.remove('pg4-white-desc-active');
            document.querySelector('.pg4-photo-wrap').classList.remove('pg4-photo-wrap-active');
            document.querySelector('.pg4-photo').classList.remove('pg4-photo-active');
            document.querySelector('.dessert').classList.remove('dessert-active');
        } else if (scrollPosition > page4Top) {
            document.querySelector('.pg4-bezh-back').classList.add('pg4-bezh-back-active');
            document.querySelector('.pg4-white-desc').classList.add('pg4-white-desc-active');
            document.querySelector('.pg4-photo-wrap').classList.add('pg4-photo-wrap-active');
            document.querySelector('.pg4-photo').classList.add('pg4-photo-active');
            document.querySelector('.dessert').classList.add('dessert-active');

            document.querySelector('.page1-title').classList.remove('page1-title-active');
            document.querySelector('.page1-desc').classList.remove('page1-desc-active');
            document.querySelector('.plate1').classList.remove('plate1-active');

            document.querySelector('.pg2-green-back').classList.remove('pg2-green-back-active');
            document.querySelector('.pg2-white-desc').classList.remove('pg2-white-desc-active');
            document.querySelector('.pg2-photo-wrap').classList.remove('pg2-photo-wrap-active');
            document.querySelector('.pg2-photo').classList.remove('pg2-photo-active');
            document.querySelector('.grapes').classList.remove('grapes-active');

            document.querySelector('.pg3-red-back').classList.remove('pg3-red-back-active');
            document.querySelector('.pg3-white-desc').classList.remove('pg3-white-desc-active');
            document.querySelector('.pg3-photo-wrap').classList.remove('pg3-photo-wrap-active');
            document.querySelector('.pg3-photo').classList.remove('pg3-photo-active');
            document.querySelector('.leafs').classList.remove('leafs-active');
        }
    });
});

// Script para o cardápio do dia

document.addEventListener("DOMContentLoaded", async () => {
    const prevDayBtn = document.getElementById("prevDay");
    const nextDayBtn = document.getElementById("nextDay");
    const daySpan = document.getElementById("day");
    const monthSpan = document.getElementById("mouth");
    const desjejumTitle = document.querySelector(".pg2-white-desc h2");
    const desjejumPhoto = document.querySelector(".pg2-photo");
    const almocoTitle = document.querySelector(".pg3-white-desc h2");
    const almocoDesc = document.querySelector(".pg3-white-desc p");
    const almocoPhoto = document.querySelector(".pg3-photo");
    const sobremesaTitle = document.querySelector(".pg4-white-desc h2");
    const sobremesaPhoto = document.querySelector(".pg4-photo");

    let currentDate = new Date();
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth(); // Índice do mês (0 = Janeiro, 11 = Dezembro)
    let currentYear = currentDate.getFullYear();

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    async function fetchCardapio() {
        try {
            const response = await fetch(`/diascardapio`);
            const data = await response.json();
            return data.cardapios;
        } catch (error) {
            console.error("Erro ao buscar o cardápio:", error);
            return [];
        }
    }

    async function updateCardapio(day, month, year) {
        const cardapios = await fetchCardapio();
        const monthName = monthNames[month];

        const cardapioMes = cardapios.find(c => 
            c.cardapio_regular.some(m => m.mes === monthName && m.ano === year)
        );
        if (!cardapioMes) return;

        const cardapioData = cardapioMes.cardapio_regular.find(m => m.mes === monthName && m.ano === year);
        const diaData = cardapioData.dias.find(d => d.dia === day);
        if (!diaData) return;

        // Atualiza desjejum
        desjejumTitle.textContent = diaData.desjejum[0].itens.join(" & ");
        desjejumPhoto.style.backgroundImage = `url(${diaData.desjejum[0].pic})`;
        
        // Atualiza almoço
        almocoTitle.textContent = diaData.almoco[0].prato_do_dia;
        almocoDesc.textContent = diaData.almoco[0].almoco_do_dia[0].itens.join(" & ");
        almocoPhoto.style.backgroundImage = `url(${diaData.almoco[0].pic})`;
        
        // Atualiza sobremesa
        sobremesaTitle.textContent = diaData.sobremesa[0].itens.join(" & ");
        sobremesaPhoto.style.backgroundImage = `url(${diaData.sobremesa[0].pic})`;
    }

    function updateDateDisplay() {
        daySpan.textContent = currentDay.toString().padStart(2, '0');
        monthSpan.textContent = monthNames[currentMonth];
    }

    function changeDay(increment) {
        currentDate.setDate(currentDate.getDate() + increment);
        currentDay = currentDate.getDate();
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();

        updateDateDisplay();
        updateCardapio(currentDay, currentMonth, currentYear);
    }

    prevDayBtn.addEventListener("click", () => changeDay(-1));
    nextDayBtn.addEventListener("click", () => changeDay(1));

    updateDateDisplay();
    updateCardapio(currentDay, currentMonth, currentYear);
});

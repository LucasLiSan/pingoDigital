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

    // Função para substituir vírgulas por "&"
    function formatarItens(itens) {
        return itens.join(", ").replace(/,/g, " &");
    }

    // Função para obter o cardápio baseado no dia e mês atual
    async function carregarCardapioDia(dia, mes) {
        try {
            const resposta = await fetch(`/cardapio/${mes.toLowerCase()}/${dia}`); // Novo endpoint baseado em dia e mês
            const dados = await resposta.json();

            if (!dados.cardapio) {
                console.error("Cardápio não encontrado.");
                return;
            }

            const cardapio = dados.cardapio;

            // Desjejum
            const desjejum = cardapio.desjejum[0];
            const desjejumItens = formatarItens(desjejum.itens);
            document.querySelector('.pg2-white-desc h2').textContent = desjejumItens;
            document.querySelector('.pg2-photo').style.backgroundImage = `url('${desjejum.pic}')`;

            // Almoço
            const almoco = cardapio.almoco[0];
            document.querySelector('.pg3-white-desc h2').textContent = almoco.prato_do_dia;
            const almocoItens = formatarItens(almoco.almoco_do_dia[0].itens);
            document.querySelector('.pg3-white-desc p').textContent = almocoItens;
            document.querySelector('.pg3-photo').style.backgroundImage = `url('${almoco.pic}')`;

            // Sobremesa
            const sobremesa = cardapio.sobremesa[0];
            const sobremesaItens = formatarItens(sobremesa.itens);
            document.querySelector('.pg4-white-desc h2').textContent = `Sobremesa - ${sobremesaItens}`;
            document.querySelector('.pg4-photo').style.backgroundImage = `url('${sobremesa.pic}')`;
        } catch (error) {
            console.error("Erro ao carregar o cardápio:", error);
        }
    }

    // Função para atualizar a data exibida no DOM
    function atualizarDataDisplay(dia, mes) {
        document.querySelector('#day').textContent = dia;
        document.querySelector('#mouth').textContent = mes;
    }

    // Função para manipular os botões de navegação
    function configurarBotoesDeNavegacao() {
        const btnPrev = document.getElementById('prevDay');
        const btnNext = document.getElementById('nextDay');

        let diaAtual = parseInt(document.querySelector('#day').textContent);
        const mesAtual = document.querySelector('#mouth').textContent;

        btnPrev.addEventListener('click', () => {
            if (diaAtual > 1) {
                diaAtual--;
            } else {
                diaAtual = 31; // Supondo que o mês tenha 31 dias, você pode querer ajustar isso com base no mês
            }
            atualizarDataDisplay(diaAtual, mesAtual);
            carregarCardapioDia(diaAtual, mesAtual);
        });

        btnNext.addEventListener('click', () => {
            if (diaAtual < 31) {
                diaAtual++;
            } else {
                diaAtual = 1; // Volta para o primeiro dia do mês
            }
            atualizarDataDisplay(diaAtual, mesAtual);
            carregarCardapioDia(diaAtual, mesAtual);
        });
    }

    // Função inicial que carrega o cardápio para o dia atual
    function inicializar() {
        const diaAtual = parseInt(document.querySelector('#day').textContent);
        const mesAtual = document.querySelector('#mouth').textContent;
        
        carregarCardapioDia(diaAtual, mesAtual);
        configurarBotoesDeNavegacao();
    }

    // Chama a função inicial ao carregar a página
    document.addEventListener('DOMContentLoaded', inicializar);
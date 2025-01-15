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
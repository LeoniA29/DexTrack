let intro = document.querySelector('.intro');
let logo = document.querySelector('.logo-header');
let dextrack = document.querySelector('.dextrack-logo');

window.addEventListener('DOMContentLoaded', ()=> {

    setTimeout(() => {
        logo.style.opacity = 1;
    }, 500);

    setTimeout(() => {
        intro.style.top = '-100vh';
    }, 2300);

})
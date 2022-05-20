function openNav() {
    document.getElementById("myNav").style.width = "280px";
  }
  
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }

  
const menu = document.querySelector(".menu");
const navbar = document.querySelector(".nav_pages");


menu.addEventListener("click", mobileMenu);

function mobileMenu() {
    menu.classList.toggle("active");
    navbar.classList.toggle("active");
  }

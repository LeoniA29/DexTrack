let popup = document.getElementById("popup");
let bg = document.getElementById("popup-bg");

function openPopup() {
    popup.classList.add("open-popup");
    bg.classList.add("bg-active");
}

function closePopup() {
    popup.classList.remove("open-popup");
    bg.classList.remove("bg-active");
}
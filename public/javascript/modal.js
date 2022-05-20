let popup = document.getElementById("popup");
let bg = document.getElementById("popup-bg");

function required() {
    var empt = document.querySelector("form[name='form']>textarea.req-fill").value;

    if (empt == "") {
        alert("Please input a Value");
        return false;
    }
    else {
        return true;
    }
}

function openPopup() {  
    popup.classList.add("open-popup");
    bg.classList.add("bg-active");
    event.preventDefault();

}

function closePopup() {
    popup.classList.remove("open-popup");
    bg.classList.remove("bg-active");
}
    




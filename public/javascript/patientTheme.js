var element = document.body;
function toggleDark() {
    element.classList.toggle("dark-theme");
    if (element.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark-theme");
    } else {
        localStorage.setItem("theme", "");
    } 
}

document.addEventListener("DOMContentLoaded", function(event) {
    var theme = localStorage.getItem("theme");
    if (theme) {
        document.body.className += theme;
    }
});

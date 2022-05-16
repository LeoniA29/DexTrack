// Script for accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
      for (let el of document.querySelectorAll('.data.hide')) el.style.visibility = 'visible';

    } else {
      panel.style.display = "block";
      for (let el of document.querySelectorAll('.data.hide')) el.style.visibility = 'hidden';

    }
  });
}
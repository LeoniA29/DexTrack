// Script for accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (this.classList.contains("active")) {
      panel.style.maxHeight = panel.scrollHeight + "px";
      for (let el of document.querySelectorAll('.data.hide')) el.style.visibility = 'hidden';

    } else {
      panel.style.maxHeight = 0;
      for (let el of document.querySelectorAll('.data.hide')) el.style.visibility = 'visible';

    }
  });
}
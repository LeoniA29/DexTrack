//Get the button
    var topbutton = document.getElementById("top_button");
          
// When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};
          
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
              topbutton.style.display = "block";
        } else {
              topbutton.style.display = "none";
        }
    }
          
// When the user clicks on the button, scroll to the top of the document
    function scrollToTop() {

      window.scrollTo({top: 0, behavior: 'smooth'});
      
    }

// Function for Read More button
    function scrollReadMore() {

      window.scrollTo({top: 450, behavior: 'smooth'});

    }

    
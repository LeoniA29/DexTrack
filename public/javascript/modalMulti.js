function required() {
    var fname = document.forms["form"]["first_name"].value;
    var lname = document.forms["form"]["last_name"].value;
    var email = document.forms["form"]["email"].value;
    var dob = document.forms["form"]["dob"].value;
    var phone = document.forms["form"]["phone"].value;
    var occup = document.forms["form"]["occupation"].value;
    var address = document.forms["form"]["address"].value;
    var postcode = document.forms["form"]["postcode"].value;


    if ((fname == "")||(lname == "")||(email == "")||(email == "")||(dob == "")||(phone == "")||(occup == "")||(address == "")||(postcode == "")) {
        alert("Please input a Value");
        return false;
    } else {
        return true;
    }
}

function openPopupMulti() {
    if (required()) {
        popup.classList.add("open-popup");
        bg.classList.add("bg-active");
        event.preventDefault();
    }
}

function closePopupMulti() {
    popup.classList.remove("open-popup");
    bg.classList.remove("bg-active");
}
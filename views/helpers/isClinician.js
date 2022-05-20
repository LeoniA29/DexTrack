module.exports = function(handlebars) {
    return function(logged, role) {
        if (logged & role == "clinician") {
            return true;
        }
        else {
            return false;
        }
    };
}
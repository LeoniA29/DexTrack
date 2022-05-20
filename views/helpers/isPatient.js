module.exports = function(handlebars) {
    return function(logged, role) {
    
        if (logged & role == "patient") {
            return true;
        }
        else {
            return false;
        }
    };
}
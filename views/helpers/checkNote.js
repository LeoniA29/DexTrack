module.exports = function(handlebars) {
    return function(note) {
        if (note == " "){
            return ("Your clinician hasn't made any message...")
        }
        else {
            return note
        }
    };
}
const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEPT","OCT","NOV","DEC"];

module.exports = function(handlebars) {
    return function() {
        return (months[new Date().getMonth()]);
    };
}

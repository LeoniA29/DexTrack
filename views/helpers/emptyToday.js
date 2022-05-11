module.exports = function(handlebars) {
    return function(isEmpty) {
        return (isEmpty == "true");
    };
}
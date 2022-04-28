const days = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];

module.exports = function(handlebars) {
    return function() {
        return (days[new Date().getDay()]);
    };
}

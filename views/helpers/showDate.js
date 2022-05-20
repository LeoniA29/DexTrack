module.exports = function(handlebars) {
    return function(date) {
        // const todaysDate = new Date(); // today's date constant 
        const formatter = new Intl.DateTimeFormat('en-au', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h23',
            timeZone: 'Australia/Melbourne'
        });

        return (formatter.formatToParts(date))
    };
}
module.exports = function(handlebars) {
    return function(x) {
        return (x!=null);
    };
}

/*
app.engine(
    'hbs',
    require('exphbs'),
    exphbs.engine({
        defaultlayout: 'patientLayout',
        extname: 'hbs',
        helpers: {
            todaysDate: function() {
                return (new Date().getDate())
            },
            todaysDay: function() {
                return (days[new Date().getDay()])
            },
            todaysMonth: function() {
                return (months[new Date().getMonth()])
            },

            filledToday: function(x) {
                return (x!=null)
            }

        }
    })
)*/
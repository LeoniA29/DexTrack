const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

module.exports = function(handlebars) {
    return function(input_data) {

        const temp = []
        const day = days[input_data.set_date.getDay()]
        const date = input_data.set_date.getDate()
       
        temp.push(day); temp.push(date); 
        return (temp)
    }
};

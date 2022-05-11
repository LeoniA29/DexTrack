const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

module.exports = function(handlebars) {
    return function(input_data) {

        const temp = []
        const date = input_data.getDate()
        const month = months[input_data.getMonth()]
        const year = input_data.getFullYear()
       
        temp.push(date); temp.push(month); temp.push(year)
        return (temp)
    }
};

module.exports = function(handlebars) {
    return function(input_data) {


        function padTo2Digits(num) {
            return String(num).padStart(2, '0');
        }

        function amPm(data_date){
            return (data_date.getHours() >= 12 ? 'pm' : 'am');
        }

        function hoursAndMinutes(data_date){
            return (padTo2Digits(data_date.getHours()) + ':' + padTo2Digits(data_date.getMinutes()) + " " + amPm(data_date));
        }

        const final = []
       
        if (input_data.glucose_data){
            const gluc_temp = []
            const date_of_data = hoursAndMinutes(input_data.glucose_data.data_date)
            gluc_temp.push(input_data.glucose_data.data_type); gluc_temp.push(input_data.glucose_data.data_entry); gluc_temp.push(date_of_data)
            final.push(gluc_temp)
        }

        if (input_data.steps_data){
            const steps_temp = []
            const date_of_data = hoursAndMinutes(input_data.steps_data.data_date)
            steps_temp.push(input_data.steps_data.data_type); steps_temp.push(input_data.steps_data.data_entry); steps_temp.push(date_of_data)
            final.push(steps_temp)
        }

        if (input_data.weight_data){
            const weight_temp = []
            const date_of_data = hoursAndMinutes(input_data.weight_data.data_date)
            weight_temp.push(input_data.weight_data.data_type); weight_temp.push(input_data.weight_data.data_entry); weight_temp.push(date_of_data)
            final.push(weight_temp)
        }

        if (input_data.insulin_data){
            const insulin_temp = []
            const date_of_data = hoursAndMinutes(input_data.insulin_data.data_date)
            insulin_temp.push(input_data.insulin_data.data_type); insulin_temp.push(input_data.insulin_data.data_entry); insulin_temp.push(date_of_data)
            final.push(insulin_temp)
        }

        if (final.length==0){
            return {arr: final, empty: "true"};
        }
        else {
            return {arr: final, empty: "false"};
        }
    }
};

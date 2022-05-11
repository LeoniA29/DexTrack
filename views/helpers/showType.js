module.exports = function(handlebars) {
    return function(arr) {
        if (arr[0] == "glucose"){
            return ("/Glucose_Level.png")
        }

        else if (arr[0] == "insulin"){
            return ("/Insulin.png")
        }

        else if (arr[0] == "weight"){
            return ("/Weight.png")
        }
        
        else {
            return ("/Exercise.png")
        }
    };
}
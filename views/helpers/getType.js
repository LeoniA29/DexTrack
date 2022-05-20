module.exports = function(handlebars) {
    return function(arr, type) {
        if (arr[0] == type){
            return (true)
        } 
        return false
    };
}
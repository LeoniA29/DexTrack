module.exports = function(handlebars) {
    return function(patientData, thresh_list, data_type) {
     
        for (var i in thresh_list){
            
           if (thresh_list[i].type == data_type){
                
               return ( (patientData==null) && (thresh_list[i].th_required) )
            } 
        }
    }
};

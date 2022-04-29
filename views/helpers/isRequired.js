module.exports = function(handlebars) {
    return function(patientData, patient, data_type) {
     
        for (var i in patient){
            
           if (patient[i].type == data_type){
                
               return ( (patientData==null) && (patient[i].th_required) )
            } 
        }
    }
};

module.exports = function(handlebars) {
    return function(threshold_list, data, type) {
        th_boolean = false;
        
        for (var i in threshold_list) {

            // finds the threshold for that data input
            if ((threshold_list[i].type == 'glucose') && (type == 'glucose')) {
                // checks if data exceeds threshold or not and if threshold exists
                if ((data > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }

            if ((threshold_list[i].type == 'weight') && (type == 'weight')) {
                if ((data > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }

            if ((threshold_list[i].type == 'steps') && (type == 'steps')) {
                if ((data > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }

            if ((threshold_list[i].type == 'insulin') && (type == "insulin")) {
                if ((data > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }
        }
        //console.log(th_boolean)
        return (th_boolean);
    };
}
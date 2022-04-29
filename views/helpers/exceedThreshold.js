// helper function to check if data input by patient exceeds given threshold
module.exports = function(handlebars) {
    return function(threshold_list, data) {
        th_boolean = false;

        for (var i in threshold_list) {

            // finds the threshold for that data input
            if ((threshold_list[i].type == 'glucose') && (data.data_type == 'glucose')) {

                // checks if data exceeds threshold or not and if threshold exists
                if ((data.data_entry > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data.data_entry < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }

            if ((threshold_list[i].type == 'weight') && (data.data_type == 'weight')) {
                if ((data.data_entry > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data.data_entry < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }

            if ((threshold_list[i].type == 'steps') && (data.data_type == 'steps')) {
                if ((data.data_entry > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data.data_entry < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }

            if ((threshold_list[i].type == 'insulin') && (data.data_type == "insulin")) {
                if ((data.data_entry > threshold_list[i].high) && (threshold_list[i].high) ) {
                    th_boolean = true;
                } else if ((data.data_entry < threshold_list[i].low) && (threshold_list[i].low)) {
                    th_boolean = true;
                }
            }
        }
        return (th_boolean);
    };
}
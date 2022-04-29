// helper function to check if data input by patient exceeds given threshold
module.exports = function(handlebars) {
    return function(threshold_list, data) {
        th_boolean = false;

        for (var i in threshold_list) {

            // checks if threshold data exists
            if (threshold_list[i].high) {

            // finds the threshold for that data input
                if (threshold_list[i].type == 'glucose') {

                    // checks if data exceeds threshold or not
                    if (data > threshold_list[i].high) {
                        th_boolean = true;
                    }   
                }

                if (threshold_list[i].type == 'weight') {
                    if (data > threshold_list[i].high) {
                        th_boolean = true;
                    }
                }

                if (threshold_list[i].type == 'steps') {
                    if (data > threshold_list[i].high) {
                        th_boolean = true;
                    }   
                }

                if (threshold_list[i].type == 'insulin') {
                    if (data > threshold_list[i].high) {
                        th_boolean = true;
                    }
                }
            }
        }
        return (th_boolean);
    };
}
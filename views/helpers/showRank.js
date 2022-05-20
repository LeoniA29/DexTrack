module.exports = function(handlebars) {
    return function(rank) {
        if (rank == 1 ){
            return ("/rank1.png")
        }

        if (rank == 2 ){
            return ("/rank2.png")
        }

        if (rank == 3 ){
            return ("/rank3.png")
        }

        if (rank == 4){
            return ("/rank4.png")
        }

        if (rank == 5) {
            return ("/rank5.png")
        }
    }
};

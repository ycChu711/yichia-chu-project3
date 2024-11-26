const Schema = require('mongoose').Schema;

exports.PokemonSchema = new Schema({
    name: String,
    health: Number,
    /*
    health: {
        type: Number
    }
    */
    color: {
        type: String,
        default: "green",
        require: false,
    },
    username: { 
        type: String,
        require: true,
    }
}, { collection : 'myPokemonSpr2023' });


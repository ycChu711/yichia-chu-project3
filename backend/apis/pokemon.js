const express = require('express')
const router = express.Router();
const PokemonModel = require('../db/pokemon/pokemon.model');
const jwt = require('jsonwebtoken')


const pokemonDb = [
    {
        name: "pikachu",
        color: "yellow",
        health: 100,
    },
    {
        name: "charizard",
        color: "red",
        health: 200,
    },
    {
        name: "squirtle",
        color: "yellow",
        health: 150,
    },
]

// request.body should include name, color and health
// /api/pokemon/findColor/red
router.get('/findColor/:color', async function(request, response) {
    const color = request.params.color;

    const matchingPokemon = await PokemonModel.findPokemonByColor(color)
    response.send(matchingPokemon);
});

// POST localhost:8000/api/pokemon/
router.post('/', async function(request, response) {
    const newPokemon = request.body;

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }
    

    newPokemon.username = decryptedUsername;

    // if(!newPokemon.color || !newPokemon.name || !newPokemon.health) {
    //     return response.status(422).send("Missing argument to create new pokemon");
    // }

    try {
        const createPokemonResponse = await PokemonModel.createPokemon(newPokemon)
        console.log(createPokemonResponse)
        return response.send("Pokemon Successfully Created: " + createPokemonResponse)
    } catch (error) {
        return response.status(500).send(error)
    } 

    //    pokemonDb.push(newPokemon);

    //response.status(200).send("Pokemon " + newPokemon.name + " was created successfully");
})

router.get('/', function(request, response) {

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }
    

    PokemonModel.findPokemonByUsername(decryptedUsername)
        .then(function(dbResponse) {
            response.cookie("pokemonCount", dbResponse.length + 1)
            response.send(dbResponse)
        })
        .catch(function(error) {
            response.status(500).send(error)
        })

})

// http://localhost:8000/api/pokemon/pikachu
/*

    request.params = {
        name: pikachu
    }

*/
router.get('/:id', function(request, response) {
    const pokemonId = request.params.id;

    PokemonModel.getPokemonById(pokemonId)
    .then(function(dbResponse) {
        response.send(dbResponse)
    })
    .catch(function(error) {
        response.status(500).send(error)
    })

    // for(let i = 0; i < pokemonDb.length; i++) {
    //     const pokemon = pokemonDb[i];
    //     if (pokemon.name === pokemonName) {
    //         return response.send(pokemon);
    //     }
    // }

    // response.status(404).send("No pokemon with name " + pokemonName + " found.")

})

//http://localhost:8000/api/pokemon/find?color=yellow&size=large
/*
    req.query = {
        color: 'yellow',
        size: 'large',
    }
*/
router.get('/find', function(req, res) {
    const color = req.query.color;

    if(!color) {
        return res.send(pokemonDb);
    }

    const output = [];

    for(let pokemon of pokemonDb) {
        if(pokemon.color === color) {
            output.push(pokemon)
        }
    }

    res.send(output)

})

// http://localhost:8000 + /api/pokemon + /
router.get('/pikachu', function(req, res) {
    res.send("This is the pikachu")
})

router.get('/', function(req, res) {
    res.send("This is the the base pokemon route")
})

router.delete('/:pokemonId', async function(req, response) {
    const pokemonId = req.params.pokemonId;

    const deleteResponse = await PokemonModel.deletePokemon(pokemonId)
    return response.send("Successfully delete pokemon!")
})

router.post('/', function(req, res) {
    res.send("This is how you'll create new pokemon")
})

module.exports = router;
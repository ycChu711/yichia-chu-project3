import React, { useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';

export default function Pokemons() {

    const [pokemons, setPokemons] = useState([]);
    const [pokemonInput, setPokemonInput] = useState({
        name: '',
        color: '',
        health: 0,
    })

    async function getAllPokemons() {
        const response = await axios.get('/api/pokemon/');
        setPokemons(response.data);
    }


    const components = [];
    for(let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        const pokemonComponent = (<div><Link to={'/pokemon/' + pokemon._id}>{pokemon.name}</Link> {pokemon.color} - {pokemon.health}</div>); 
        components.push(pokemonComponent);
    }

    function setPokemonName(event) {
        const pokemonName = event.target.value;
        setPokemonInput({
            ...pokemonInput, 
            /*
            health: pokemonInput.health,
            color: pokemonInput.color,
            */
            name: pokemonName 
        })
    }

    function setPokemonColor(event) {
        const pokemonColor = event.target.value;
        setPokemonInput({
            ...pokemonInput, 
            /*
            health: pokemonInput.health,
            name: pokemonInput.name,
            */
            color: pokemonColor 
        })
    }

    function setPokemonHealth(event) {
        const pokemonHealth = event.target.value;
        setPokemonInput({
            ...pokemonInput, 
            /*
            health: pokemonInput.health,
            color: pokemonInput.color,
            */
            health: pokemonHealth, 
        })
    }

    /*
    element.setListener('input', function(event) {
        // do smething

    })
    */

    async function createNewPokemon() {
        const response = await axios.post('/api/pokemon/', pokemonInput);
        setPokemonInput({
            name: '', color: '', health: 0, 
        })
        await getAllPokemons();

    }

    return (
        <div>
            <Header />
            <div>{components}</div>
            <button onClick={getAllPokemons}>Click here to fetch Pokemons</button>
            <div>
                Name: <input value={pokemonInput.name} onInput={setPokemonName} type='text'></input>
                Color: <input value={pokemonInput.color} onInput={setPokemonColor} type='text'></input>
                Health: <input value={pokemonInput.health} onInput={setPokemonHealth} type='number'></input>
                <button onClick={createNewPokemon}>Submit New Pokemon</button>

            </div>
        </div>
    )

}
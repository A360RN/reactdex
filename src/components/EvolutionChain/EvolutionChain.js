import React from 'react';
import Pokemon from '../Pokemon/Pokemon';

import classes from './EvolutionChain.module.css';

const EvolutionChain = (props) => {
	const pokemons = props.pokemons.map(pokemon => {
		return (
			<Pokemon
				key={pokemon.id}
				id={pokemon.id}
				name={pokemon.name}
				sprite={pokemon.sprite}
				isSearched={pokemon.isSearched}
				types={pokemon.types}>
			</Pokemon>
		);
	});

	return (
		<div className={classes.EvolutionChain}>
			{pokemons}
		</div>
	);
};

export default EvolutionChain;
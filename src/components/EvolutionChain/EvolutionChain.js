import React from 'react';
import Pokemon from '../Pokemon/Pokemon';

import classes from './EvolutionChain.module.css';

const EvolutionChain = (props) => {
	let baseForm = null;

	if (props.baseForm && props.baseForm.id) {
		baseForm = (
			<Pokemon
				key={props.baseForm.id}
				id={props.baseForm.id}
				name={props.baseForm.name}
				sprite={props.baseForm.sprite}
				isSearched={props.baseForm.isSearched}
				types={props.baseForm.types}>				
			</Pokemon>
		);
	}

	const firstLayer = props.firstLayer.map(pokemon => {
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

	const secondLayer = props.secondLayer.map(pokemon => {
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
			<div>
				{baseForm}
			</div>
			<div>
				{firstLayer}
			</div>
			<div>
				{secondLayer}
			</div>
		</div>
	);
};

export default EvolutionChain;
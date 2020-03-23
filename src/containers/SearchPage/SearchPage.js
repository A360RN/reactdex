import React, { Component } from 'react';
import axios from 'axios';
import EvolutionChain from '../../components/EvolutionChain/EvolutionChain';

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pokemonsSearched: []
		};
		this.searchInput = React.createRef();
	}

	onSearchClicked = () => {
		const pokemonName = this.searchInput.current.value;
		if (pokemonName && pokemonName.length > 0) {
			axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`)
				.then(res => {
					if (res.status === 200) {
						const { data } = res;
						this.searchedPokemonId = data.id;
						this.getEvolutionChain(data.evolution_chain.url);
					}
				})
				.catch(err => {
					if (err.response && err.response.status) {
						console.log('Not found');
					}
				});
		}
	}

	getEvolutionChain = (evolutionChainUrl) => {
		axios.get(evolutionChainUrl)
			.then(res => {
				if (res.status === 200) {
					const { data } = res;
					const { chain } = data;
					let evolutionChainSpeciesUrl = [chain.species.url];
					let currentPokemon = chain.evolves_to && chain.evolves_to[0] ? chain.evolves_to[0] : null;
					while (currentPokemon) {
						evolutionChainSpeciesUrl.push(currentPokemon.species.url);
						currentPokemon = currentPokemon.evolves_to && currentPokemon.evolves_to[0] ? currentPokemon.evolves_to[0] : null;
					}
					this.getAllSpeciesPokemon(evolutionChainSpeciesUrl);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	getAllSpeciesPokemon(speciesUrl) {
		const httpRequestsSpecies = speciesUrl.map(item => axios.get(item));
		axios.all(httpRequestsSpecies)
			.then(axios.spread((...res) => {
				const pokemonsUrls = [];
				res.forEach(species => {
					pokemonsUrls.push(species.data.varieties.filter(variety => variety.is_default)[0].pokemon.url);
				});
				this.getEachPokemon(pokemonsUrls);
			}));
	}

	getEachPokemon(pokemonsUrls) {
		const httpRequestsPokemons = pokemonsUrls.map(item => axios.get(item));
		axios.all(httpRequestsPokemons)
			.then(axios.spread((...res) => {
				const pokemonsFound = [];
				res.forEach(pokemon => {
					const { data } = pokemon;
					const pokemonData = {
						id: data.id,
						name: data.name,
						sprite: data.sprites.front_default,
						isSearched: this.searchedPokemonId === data.id,
						types: data.types.map(type => type.type.name)
					};
					pokemonsFound.push(pokemonData);
				});
				this.setState({
					pokemonsSearched: pokemonsFound
				});
			}));
	}

	render() {
		return (
			<div>
				<input
					type="text"
					ref={this.searchInput}
					onChange={this.onSearchInputChange}
					placeholder="Search for a Pokemon">
				</input>
				<button
					onClick={this.onSearchClicked}>
					Search
        </button>
				<EvolutionChain
					pokemons={this.state.pokemonsSearched}>
				</EvolutionChain>
			</div>
		)
	}
}

export default SearchPage;
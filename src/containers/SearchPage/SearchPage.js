import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			evolutionChainFirstLayer: [],
			evolutionChainSecondLayer: [],
			searchedPokemon: {},
			searchedPokemonId: 0
		};
	}

	onSearchInputChange = (e) => {
		const value = e.target.value;
		this.searchedPokemonName = value;
	}

	onSearchClicked = () => {
		const pokemonName = this.searchedPokemonName;
		if (pokemonName && pokemonName.length > 0) {
			axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`)
				.then(res => {
					if (res.status === 200) {
						const { data } = res;
						this.getEvolutionChain(data.evolution_chain.url);
						this.setState({
							searchedPokemonId: data.id
						});
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
					const baseForm = data.chain;
					const baseFormSpeciesUrl = baseForm.species.url;
					const firstLayerSpeciesUrl = [];
					const secondLayerSpeciesUrl = []
					if (baseForm.evolves_to && baseForm.evolves_to.length > 0) {
						baseForm.evolves_to.forEach(firstEvolution => {
							firstLayerSpeciesUrl.push(firstEvolution.species.url);
							if (firstEvolution.evolves_to && firstEvolution.evolves_to.length > 0) {
								firstEvolution.evolves_to.forEach(secondEvolution => {
									secondLayerSpeciesUrl.push(secondEvolution.species.url);
								});
							}
						});
					}
					this.getAllPokemonSpecies(baseFormSpeciesUrl, firstLayerSpeciesUrl, secondLayerSpeciesUrl);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	getAllPokemonSpecies(baseFormSpeciesUrl, firstLayerSpeciesUrl, secondLayerSpeciesUrl) {
		let baseFormPokemonUrl;
		const firstLayerPokemonUrls = [];
		const secondLayerPokemonUrls = [];
		axios.get(baseFormSpeciesUrl)
			.then(res => {
				baseFormPokemonUrl = res.data.varieties.filter(variety => variety.is_default)[0].pokemon.url;
				const firstLayerSpeciesHttpRequests = firstLayerSpeciesUrl.map(item => axios.get(item));
				axios.all(firstLayerSpeciesHttpRequests)
					.then(axios.spread((...res) => {
						res.forEach(species => {
							firstLayerPokemonUrls.push(species.data.varieties.filter(variety => variety.is_default)[0].pokemon.url);
						});
						const secondLayerSpeciesHttpRequests = secondLayerSpeciesUrl.map(item => axios.get(item));
						axios.all(secondLayerSpeciesHttpRequests)
							.then(axios.spread((...res) => {
								res.forEach(species => {
									secondLayerPokemonUrls.push(species.data.varieties.filter(variety => variety.is_default)[0].pokemon.url);
								});
								this.getAllPokemon(baseFormPokemonUrl, firstLayerPokemonUrls, secondLayerPokemonUrls);
							}));
					}));
			});
		
	}

	getAllPokemon(baseFormPokemonUrl, firstLayerPokemonUrls, secondLayerPokemonUrls) {
		let searchedPokemon;
		const firstLayerPokemons = [];
		const secondLayerPokemons = [];
		axios.get(baseFormPokemonUrl)
			.then(pokemon => {
				const { data } = pokemon;
				searchedPokemon = {
						id: data.id,
						name: data.name,
						sprite: data.sprites.front_default,
						isSearched: true,
						types: data.types.map(type => type.type.name),
						height: data.height,
						weight: data.weight
				}
				const firstLayerPokemonHttpRequests = firstLayerPokemonUrls.map(item => axios.get(item));
				axios.all(firstLayerPokemonHttpRequests)
					.then(axios.spread((...res) => {
						res.forEach(pokemon => {
							const { data } = pokemon;
							firstLayerPokemons.push({
								id: data.id,
								name: data.name,
								sprite: data.sprites.front_default,
								isSearched: false,
								types: data.types.map(type => type.type.name),
								height: data.height,
								weight: data.weight
							});
						});
						const secondLayerPokemonHttpRequests = secondLayerPokemonUrls.map(item => axios.get(item));
						axios.all(secondLayerPokemonHttpRequests)
							.then(axios.spread((...res) => {
								res.forEach(pokemon => {
									const { data } = pokemon;
									secondLayerPokemons.push({
										id: data.id,
										name: data.name,
										sprite: data.sprites.front_default,
										isSearched: false,
										types: data.types.map(type => type.type.name),
										height: data.height,
										weight: data.weight
									});
								});
								this.setState({
									searchedPokemon: searchedPokemon,
									evolutionChainFirstLayer: firstLayerPokemons,
									evolutionChainSecondLayer: secondLayerPokemons
								});
							}));
					}));
			})
	}

	render() {
		return (
			<div>
				<input
					type="text"
					onChange={this.onSearchInputChange}
					placeholder="Search for a Pokemon">
				</input>
				<button
					onClick={this.onSearchClicked}>
					Search
        		</button>
				<Layout
					searchedPokemon={this.state.searchedPokemon}
					firstLayer={this.state.evolutionChainFirstLayer}
					secondLayer={this.state.evolutionChainSecondLayer}>
				</Layout>
			</div>
		)
	}
}

export default SearchPage;
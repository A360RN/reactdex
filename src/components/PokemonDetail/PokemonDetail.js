import React from 'react';
import Pokemon from '../Pokemon/Pokemon';

import classes from './PokemonDetail.module.css';

const PokemonDetail = (props) => {
    let pokemon = null;

    if (props.pokemon && props.pokemon.id) {
        pokemon = (
            <div>
                <Pokemon
				id={props.pokemon.id}
				name={props.pokemon.name}
				sprite={props.pokemon.sprite}
				isSearched={props.pokemon.isSearched}
				types={props.pokemon.types}>
                </Pokemon>
                <div className={classes.Chart}>
                    <div className={classes.Row}>
                        <div className={`${classes.Cell} ${classes.Header}`}>
                            <span>Height</span>
                        </div>
                        <div className={classes.Cell}>
                            <span>{props.pokemon.height}</span>
                        </div>
                    </div>
                    <div className={classes.Row}>
                        <div className={`${classes.Cell} ${classes.Header}`}>
                            <span>Weight</span>
                        </div>
                        <div className={classes.Cell}>
                            <span>{props.pokemon.weight}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }  

    return (
        <div className={classes.PokemonDetail}>
            {pokemon}
        </div>
    );
};

export default PokemonDetail;
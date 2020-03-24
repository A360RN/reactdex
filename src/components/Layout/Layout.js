import React from 'react';

import PokemonDetail from '../PokemonDetail/PokemonDetail';
import EvolutionChain from '../EvolutionChain/EvolutionChain';

import classes from './Layout.module.css';

const Layout = (props) => {
    return (
        <div className={classes.Layout}>
            <div>
                <PokemonDetail
                    pokemon={props.searchedPokemon}>
                </PokemonDetail>
            </div>
            <div className={`${classes.MediumMargin}`}>
                <EvolutionChain
                    baseForm={props.searchedPokemon}
                    firstLayer={props.firstLayer}
                    secondLayer={props.secondLayer}>
                </EvolutionChain>
			</div>
        </div>
    )
};

export default Layout;
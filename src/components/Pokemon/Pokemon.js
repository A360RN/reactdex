import React from 'react';

import classes from './Pokemon.module.css';

const Pokemon = (props) => {
	const capitalize = (stringToCapitalize) => {
		return stringToCapitalize[0].toUpperCase() + stringToCapitalize.substring(1).toLowerCase();
	};

	const types = props.types.map((type, i) => {
		return (
			<div key={i} className={`${classes.Type} ${classes[capitalize(type)]}`}>
				<span>{capitalize(type)}</span>
			</div>
		);
	});
	
	return (
		<div className={`${classes.Pokemon} ${props.isSearched ? classes.Searched : ''}`}>
			<p>{`#${props.id} ` + capitalize(props.name)}</p>
			<img src={props.sprite}></img>
			<div className={classes.Types}>
				{types}
			</div>
		</div>
	);
};

export default Pokemon;
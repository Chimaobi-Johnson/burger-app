import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredients';

const burger = (props) => {
    // Extract keys of state object to an array with javascript function Object.keys 
    let transformedIngredients = Object.keys(props.ingredients).map(igKey => { //igkey is ingredients key which map func loops in the array on each iteration
        /* return an empty array with length of the value of this.state.ingredients obj
         passed e.g this.state.ingredients[salad] returns 1 because 1 is the value*/
         return [...Array(props.ingredients[igKey])].map((_, i) => { // Underscore meaning the value is null, we only need the index
            return <BurgerIngredient key={igKey + i} type={igKey}/>
         }); 

    }).reduce((arr, el) => {
        return arr.concat(el)
    }, []);
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please Start Adding Ingredients</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
             {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;
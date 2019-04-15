import React from 'react';
import classes from './Input.module.css';

const input = (props) => {

    let inputElement = null;
    const inputClasses = [classes.InputElement]

    if(props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid)
    }
    let colorDynamic = 'red';
    if(props.inputLength === ' is ok') {
        colorDynamic = 'green';
    }
    else {
        colorDynamic = 'red'
    }

    switch (props.elementType) {
        case('input'):
             inputElement = <input 
             className={inputClasses.join(' ')} 
             {...props.elementConfig} 
             value={props.value}
             onChange={props.changed} />;
         break;
        case('textarea'): 
             inputElement = <textarea 
             className={classes.InputElement} 
             {...props.elementConfig} 
             value={props.value}
             onChange={props.changed} />;
         break;
         case('select'): 
         inputElement = <select 
         className={classes.InputElement}
         value={props.value}
         onChange={props.changed}>
         {props.elementConfig.options.map(option => (
             <option key={option.value} value={option.value}>
                 {option.displayValue}
             </option>
         ))} 
         </select>;
     break;
        default:
             inputElement = <input
             className={classes.InputElement}
             {...props.elementConfig} 
             value={props.value}
             onChange={props.changed}/>;

    }
    
    let spanDynamic = '';
    if(props.shouldValidate) {
        spanDynamic = <span style={{fontSize: '10px', fontWeight: 'bold', opacity: '0.8', color: colorDynamic}}>
        {props.isEmpty ? 'Sorry this field cannot be empty' : props.inputDisplay ? props.inputDisplay + props.inputLength : ''}
       </span>

    }
     

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            {spanDynamic}
        </div>
    );
    
}

export default input;
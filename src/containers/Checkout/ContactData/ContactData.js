import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
// import Aux from '../../../hoc/Auxillary/Auxillary';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 15
                },
                inputError: {
                    isEmpty: false,
                    inputDisplay: '',
                    inputLength: ''
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 33
                },
                inputError: {
                    isEmpty: false,
                    inputDisplay: '',
                    inputLength: ''
                },
                valid: false,
                touched: false
            },
            postalCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIPCODE'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 8
                },
                inputError: {
                    isEmpty: false,
                    inputDisplay: '',
                    inputLength: ''
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'COUNTRY'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 12
                },
                inputError: {
                    isEmpty: false,
                    inputDisplay: '',
                    inputLength: ''
                },
                valid: false,
                touched: false
            },
            email : {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 20
                },
                inputError: {
                    isEmpty: false,
                    inputDisplay: '',
                    inputLength: ''
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'},
                    ]
                },
                inputError: {
                    isEmpty: false
                },
                value: 'fastest',
                validation: {
                    required: false
                },
                valid: true
            }
        },
        formIsValid: false,
        loading: false,
        formErrors: []
    }

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {}
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value; // Creating key value pairs for formData object
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        console.log(order);
        this.props.onOrderBurger(order, this.props.token);
    }

    checkvalidity = (value, rules) => {
         let isValid = true;
        //  let formError = [];
        if(rules.required) {
            isValid = value.trim() !== '' && isValid
            // if(value === '') {
            //     formError.push({
            //         isEmpty: 'Sorry this field cannot be empty'
            //     })
            //     this.setState({formErrors: formError})
            // }
        }
        // if(rules.minLength) {
        //     isValid = value.length >= rules.minLength && isValid
        // }
        // if(rules.maxLength) {
        //     isValid = value.length <= rules.maxLength && isValid
        // }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkvalidity(updatedFormElement.value, updatedFormElement.validation);

        updatedOrderForm[inputIdentifier] = updatedFormElement;
        updatedFormElement.touched = true;
        updatedFormElement.inputError.inputDisplay = updatedFormElement.value;

        if(updatedFormElement.touched && event.target.value === '') {
            updatedFormElement.inputError.isEmpty = true;
        }
        else {
            updatedFormElement.inputError.isEmpty = false
        }
            
        if(updatedFormElement.touched && (event.target.value.length <= updatedFormElement.validation.minLength)) {
            updatedFormElement.inputError.inputLength = ' is still too short';
        } 
        if(updatedFormElement.touched && (event.target.value.length >= updatedFormElement.validation.maxLength)) {
            updatedFormElement.inputError.inputLength = ' is too long';

        }
        if(updatedFormElement.touched && (event.target.value.length > updatedFormElement.validation.minLength && event.target.value.length < updatedFormElement.validation.maxLength)) {
            updatedFormElement.inputError.inputLength = ' is ok';
        }

        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
            console.log(formIsValid);
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render() {
       const formElementsaArray = [];
        for(let key in this.state.orderForm){
            formElementsaArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        };
        let form = (
           
            <form onSubmit={this.orderHandler}>
                {
                formElementsaArray.map(formElement => (
                <Input key={formElement.id} elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    touched={formElement.config.touched}
                    shouldValidate={formElement.config.validation.required}
                    isEmpty={formElement.config.inputError.isEmpty}
                    inputDisplay={formElement.config.inputError.inputDisplay}
                    inputLength={formElement.config.inputError.inputLength}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
                ))}
                <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
           
        );
        if(this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
            {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token
        // price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
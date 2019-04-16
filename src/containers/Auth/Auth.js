import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner/Spinner';

import Classes from './Auth.module.css';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                    minLength: 3,
                    maxLength: 25
                },
                inputError: {
                    isEmpty: false,
                    inputDisplay: '',
                    inputLength: ''
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                    maxLength: 25
                },
                inputError: {
                    isEmpty: false,
                    inputDisplay: '',
                    inputLength: ''
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true
    }

    componentDidMount () {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath()
        }
    }

    checkvalidity = (value, rules) => {
        let isValid = true;
       //  let formError = [];
       if(rules.required) {
           isValid = value.trim() !== '' && isValid
       }

       return isValid;
   }

   inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                 ...this.state.controls[controlName],
                 value: event.target.value,
                 valid: this.checkvalidity(event.target.value, this.state.controls[controlName].validation),
                 touched: true
            }
        }
        this.setState({controls: updatedControls});
   }

   submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
   }

   switchAuthModeHandler = () => {
       this.setState(prevState => {
           return {isSignUp: !prevState.isSignUp};
       })
   }

    render() {
        const formElementsaArray = [];
        for(let key in this.state.controls){
            formElementsaArray.push({
                id: key,
                config: this.state.controls[key]
            });
        };

        let form = formElementsaArray.map(formElement => (
            <Input 
                key={formElement.id} 
                elementType={formElement.config.elementType} 
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                touched={formElement.config.touched}
                shouldValidate={formElement.config.validation.required}
                isEmpty={formElement.config.inputError.isEmpty}
                inputDisplay={formElement.config.inputError.inputDisplay}
                inputLength={formElement.config.inputError.inputLength}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
        ));

        if(this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;
        if(this.props.error) {
            errorMessage = (
            <p>{this.props.error.message}</p>
            )
        }
        let authRedirect = null;
        if(this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={Classes.Auth}>
            {authRedirect}
            {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button clicked={this.switchAuthModeHandler} btnType="Danger">{this.state.isSignUp ? 'SWITCH TO SIGN IN' : 'SWITCH TO SIGN UP'}</Button>
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
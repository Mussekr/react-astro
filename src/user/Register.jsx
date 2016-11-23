import React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Col, ControlLabel, FormControl, Button, HelpBlock } from 'react-bootstrap';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { push } from 'react-router-redux';
import store from '../store/store';

const mapStateToProps = state => state.users.toJS();
const mapDispatchToProps = dispatch => ({
    onAdd: (username, password) => dispatch(createAction(Actions.ADD_USER, {
        username,
        password
    }))
});

const Register = React.createClass({
    propTypes: {
        onAdd: React.PropTypes.func.isRequired,
        registerError: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            username: '',
            password: '',
            passwordValidate: ''
        };
    },
    handleTextChange: function(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    },
    validatePassword: function() {
        if(this.state.password !== this.state.passwordValidate || !this.state.password) {
            return false;
        } else {
            return true;
        }
    },
    validate: function() {
        if(this.state.password.length > 4) {
            return true;
        } else {
            return false;
        }
    },
    onSubmit: function(event) {
        event.preventDefault();
        if(this.state.password === this.state.passwordValidate) {
            this.props.onAdd(this.state.username, this.state.password);
        }
    },
    redirectIfSuccessful: function() {
        if(this.props.registerError.success === true) {
            store.dispatch(push('/'));
            return 'Successful';
        } else {
            return null;
        }
    },
    render: function() {
        let registerError = null;
        if(!this.props.registerError.success) {
            registerError = this.props.registerError.error;
        }
        return (
            <Form horizontal onSubmit={this.onSubmit}>
                <FormGroup controlId="formHorizontalUsername">
                    <Col componentClass={ControlLabel} sm={2}>
                        Username
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" name="username" placeholder="Username" onChange={this.handleTextChange} required />
                    </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalPassword" validationState={this.validate() ? 'success' : 'error'}>
                    <Col componentClass={ControlLabel} sm={2}>
                        Password
                    </Col>
                    <Col sm={10}>
                        <FormControl type="password" name="password" placeholder="Password" onChange={this.handleTextChange} />
                        <FormControl.Feedback />
                        <HelpBlock>Password must be at least 5 characters long.</HelpBlock>
                    </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalPasswordValidate" validationState={this.validatePassword() ? 'success' : 'error'}>
                    <Col componentClass={ControlLabel} sm={2}>
                        Password (confirm)
                    </Col>
                    <Col sm={10}>
                        <FormControl type="password" name="passwordValidate" placeholder="Password" onChange={this.handleTextChange} />
                        <FormControl.Feedback />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button type="submit" disabled={!this.validatePassword() || !this.validate()}>
                            Register
                        </Button>
                    </Col>
                </FormGroup>
                {this.redirectIfSuccessful()}
                {registerError}
            </Form>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

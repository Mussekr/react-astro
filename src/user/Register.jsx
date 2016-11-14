import React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';

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
    validate: function(field) {
        return Boolean(this.state[field]);
    },
    onSubmit: function(event) {
        event.preventDefault();
        if(this.state.password === this.state.passwordValidate) {
            this.props.onAdd(this.state.username, this.state.password);
        }
    },
    render: function() {
        let registerError = null;
        if(!this.props.registerError.success) {
            registerError = this.props.registerError.error;
        }
        return (
            <Form horizontal onSubmit={this.onSubmit}>
                <FormGroup controlId="formHorizontalUsername" validationState={this.validate('username') ? 'success' : 'error'}>
                    <Col componentClass={ControlLabel} sm={2}>
                        Username
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" name="username" placeholder="Username" onChange={this.handleTextChange} />
                    </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalPassword" validationState={this.validate('password') ? 'success' : 'error'}>
                    <Col componentClass={ControlLabel} sm={2}>
                        Password
                    </Col>
                    <Col sm={10}>
                        <FormControl type="password" name="password" placeholder="Password" onChange={this.handleTextChange} />
                    </Col>
                </FormGroup>
                <FormGroup controlId="formHorizontalPasswordValidate" validationState={this.validatePassword() ? 'success' : 'error'}>
                    <Col componentClass={ControlLabel} sm={2}>
                        Password (confirm)
                    </Col>
                    <Col sm={10}>
                        <FormControl type="password" name="passwordValidate" placeholder="Password" onChange={this.handleTextChange} />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button type="submit" disabled={!this.validatePassword() || !this.validate('username')}>
                            Register
                        </Button>
                    </Col>
                </FormGroup>
                {registerError}
            </Form>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

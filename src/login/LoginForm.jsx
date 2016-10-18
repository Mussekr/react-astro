import React from 'react';
import {
    Form,
    FormGroup,
    FormControl,
    Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Maybe } from 'monet';
import { Maybe as MaybeType } from '../utils/PropTypes';
require('./LoginForm.scss');

const LoginForm = React.createClass({
    propTypes: {
        user: MaybeType.isRequired
    },
    displayName: 'LoginForm',
    getDefaultProps: function() {
        return {
            user: Maybe.None()
        };
    },
    render: function() {
        const logged = this.props.user.map(user => user.logged).orSome(false);
        console.log(this.props.user.map(user => user.logged));
        if (logged === null) {
            return <div className="user">Loading</div>;
        } else if (logged === true) {
            return (
                <div className="user">
                    <Form inline action="/api/logout" method="post">
                        <Button bsSize="small" type="submit">Logout</Button>
                    </Form>
                </div>
            );
        } else {
            return (
                <Form className="login" inline action="/api/login" method="post">
                    <FormGroup controlId="username">
                        <FormControl name="username" type="text" placeholder="Username" />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <FormControl name="password" type="password" placeholder="Password" />
                    </FormGroup>
                    <Button type="submit">
                        Login
                    </Button>
                </Form>
            );
        }
    }
});

module.exports = connect()(LoginForm);

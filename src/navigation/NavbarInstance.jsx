import React from 'react';
import LoginForm from '../login/LoginForm';
import { Maybe } from '../utils/PropTypes';
import {
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavbarInstance = React.createClass({
    displayName: 'NavbarInstance',
    propTypes: {
        user: Maybe.isRequired
    },
    isLoggedIn: function() {
        return this.props.user.isSome();
    },
    printUsername: function() {
        return this.props.user.map(user => user.username).some();
    },
    logout: function() {
        console.log('Logout');
    },
    render: function() {
        return (
            <Navbar inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/"><b>Astrogallery</b></a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/"><NavItem>Home</NavItem></LinkContainer>
                        {this.isLoggedIn() ? <LinkContainer to="/upload"><NavItem>Upload</NavItem></LinkContainer> : null}
                    </Nav>
                    <Nav>
                        {this.isLoggedIn() ? <DropdownMenu logoutFunc={this.logout} user={this.printUsername()} /> : null}
                    </Nav>
                    <Navbar.Form>
                        <LoginForm user={this.props.user} />
                    </Navbar.Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});

const DropdownMenu = React.createClass({
    propTypes: {
        user: React.PropTypes.string.isRequired,
        logoutFunc: React.PropTypes.func
    },
    render: function() {
        return (
            <NavDropdown eventKey={3} title={this.props.user} id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.3}>
                    <Button onClick={this.props.logoutFunc} bsSize="small" type="submit">Logout</Button>
                </MenuItem>
            </NavDropdown>
        );
    }
});

module.exports = NavbarInstance;

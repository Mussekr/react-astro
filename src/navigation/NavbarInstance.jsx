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
        user: Maybe.isRequired,
        logout: React.PropTypes.func.isRequired
    },
    isLoggedIn: function() {
        return this.props.user.isSome();
    },
    printUsername: function() {
        return this.props.user.map(user => user.username).some();
    },
    isAdmin: function() {
        return this.props.user.map(user => user.role === 'admin').orSome(false);
    },
    render: function() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/"><b>Astrogallery</b></a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/"><NavItem>Home</NavItem></LinkContainer>
                    </Nav>
                    <Nav>
                        {this.isLoggedIn() ? <LinkContainer to="/upload"><NavItem>Upload</NavItem></LinkContainer>
                        : <LinkContainer to="/register"><NavItem>Register</NavItem></LinkContainer>}
                    </Nav>
                    <Nav>
                        {this.isLoggedIn() ? <DropdownMenu logoutFunc={this.props.logout} user={this.printUsername()} /> : null}
                    </Nav>
                    {this.isAdmin() ? <Nav><AdminDropdownMenu /></Nav> : null}
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
                <LinkContainer to={'/user/' + this.props.user}>
                    <MenuItem eventKey={3.1}>Profile</MenuItem>
                </LinkContainer>
                <LinkContainer to="/gear">
                    <MenuItem eventKey={3.2}>Gear</MenuItem>
                </LinkContainer>
                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.3}>
                    <Button onClick={this.props.logoutFunc} bsSize="small" type="submit">Logout</Button>
                </MenuItem>
            </NavDropdown>
        );
    }
});

const AdminDropdownMenu = React.createClass({
    render: function() {
        return (
            <NavDropdown eventKey={4} title="Admin menu" id="basic-nav-dropdown">
                <LinkContainer to="/admin/users">
                    <MenuItem eventKey={4.1}>Users</MenuItem>
                </LinkContainer>
                <LinkContainer to="/admin/categories">
                    <MenuItem eventKey={4.2}>Categories</MenuItem>
                </LinkContainer>
            </NavDropdown>
        );
    }
});

module.exports = NavbarInstance;

var React = require('react');
var ReactDOM = require('react-dom');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Image = require('react-bootstrap').Image;
var Form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;
var Collapse = require('react-bootstrap').Collapse;
/*
var Hello = React.createClass({
	displayName: 'Hello',
	getInitialState: function() {
		return {greeting: 'Hello'};
	},
	toggleGreeting: function() {
		this.setState({greeting: this.state.greeting === 'Hello' ? 'Howdy' : 'Hello'});
	},
	render: function() {
		return (
			<div>
				{this.state.greeting} {this.props.value}
				<button onClick={this.toggleGreeting}>Toggle greeting</button>
			</div>
		);
	}
});

ReactDOM.render(
	<Hello value="World" />,
	document.getElementById('container')
);*/
var LoginForm = React.createClass({
	render: function() {
		return (
			<Form inline>
				<FormGroup controlId="username">
					<FormControl type="text" placeholder="Username" />
				</FormGroup>
				<FormGroup controlId="password">
					<FormControl type="password" placeholder="Password" />
				</FormGroup>
				<Button type="submit">
					Login
				</Button>
			</Form>
		);
	}
});
var GridInstance = React.createClass({
	displayName: 'GridInstance',
	render: function() {
		return (
			<Grid>
				<Row>
					<Col xs={0} md={0}></Col>
					<Col xs={12} md={12} bsClass="col-centered"><NavbarInstance username="Musse" /></Col>
					<Col xs={0} md={0}></Col>
				</Row>
				<Row>
					<Col xs={0} md={0}></Col>
					<Col xs={12} md={12}><div className="col-centered"><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/3/thumbnail" /><ImageThumbnail image="/api/image/3/thumbnail" /><ImageThumbnail image="/api/image/3/thumbnail" /><ImageThumbnail image="/api/image/3/thumbnail" /><ImageThumbnail image="/api/image/3/thumbnail" /></div></Col>
					<Col xs={0} md={0}></Col>
				</Row>
			</Grid>
		);
	}
});

var ImageThumbnail = React.createClass({
	displayName: 'Image',
	render: function() {
		return (
			<Image src={this.props.image} thumbnail responsive />
		);
	}
});
var NavbarInstance = React.createClass({
	displayName: 'NavbarInstance',
	getInitialState: function() {
		return {open: false};
	},
	render: function() {
		return (
			<Navbar inverse>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="#"><b>Astrogallery</b></a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav>
					<NavItem eventKey={1} href="#">Link</NavItem>
					<NavItem eventKey={2} href="#">Link</NavItem>
				</Nav>
				<Nav>
					<NavDropdown eventKey={3} title={this.props.username} id="basic-nav-dropdown">
						<MenuItem eventKey={3.1}>Action</MenuItem>
						<MenuItem eventKey={3.2}>Another action</MenuItem>
						<MenuItem eventKey={3.3}>Something else here</MenuItem>
						<MenuItem divider />
						<MenuItem eventKey={3.3}>Separated link</MenuItem>
					</NavDropdown>
				</Nav>
				<Nav>
					<NavItem href="#" eventKey={4} onClick={ ()=> this.setState({ open: !this.state.open })}>login</NavItem>
				</Nav>
				<Collapse in={this.state.open}>
					<LoginForm />
				</Collapse>
			</Navbar.Collapse>
			</Navbar>
		);
	}
});

ReactDOM.render(
	<GridInstance />,
	document.getElementById('app')
 );

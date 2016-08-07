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
var GridInstance = React.createClass({
	displayName: 'GridInstance',
	render: function() {
		return (
			<Grid>
				<Row>
					<Col md={1}></Col>
					<Col md={10}><NavbarInstance username="Musse" /></Col>
					<Col md={1}></Col>
				</Row>
				<Row>
					<Col md={1}></Col>
					<Col md={10}><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /><ImageThumbnail image="/api/image/1/thumbnail" /></Col>
					<Col md={1}></Col>
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
			</Navbar.Collapse>
			</Navbar>
		);
	}
});

ReactDOM.render(
	<GridInstance />,
	document.getElementById('container')
 );

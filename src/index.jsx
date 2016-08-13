const React = require('react');
const ReactDOM = require('react-dom');
const {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Grid,
  Row,
  Col,
  Image,
  Form,
  FormGroup,
  FormControl,
  Button,
  Collapse
} = require('react-bootstrap');

const LoginForm = React.createClass({
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
const GridInstance = React.createClass({
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
          <Col xs={12} md={12}>
            <div className="col-centered">
              <ImageThumbnail image="1" />
              <ImageThumbnail image="1" />
              <ImageThumbnail image="1" />
              <ImageThumbnail image="1" />
              <ImageThumbnail image="1" />
              <ImageThumbnail image="4" />
              <ImageThumbnail image="5" />
              <ImageThumbnail image="6" />
              <ImageThumbnail image="3" />
              <ImageThumbnail image="3" />
            </div>
          </Col>
          <Col xs={0} md={0}></Col>
        </Row>
      </Grid>
    );
  }
});

const ImageThumbnail = React.createClass({
  displayName: 'Image',
  propTypes: {
    image: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <Image src={'/api/image/' + this.props.image + '/thumbnail'} thumbnail responsive />
    );
  }
});
const NavbarInstance = React.createClass({
  displayName: 'NavbarInstance',
  propTypes: {
    username: React.PropTypes.string.isRequired
  },
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
          <NavItem href="#" eventKey={4} onClick={ () => this.setState({ open: !this.state.open })}>login</NavItem>
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

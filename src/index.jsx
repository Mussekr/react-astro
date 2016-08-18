require('./scss/imagehover.scss');
require('./scss/style.scss');
const React = require('react');
const ReactDOM = require('react-dom');
const fetch = require('whatwg-fetch');
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
const NewestImages = React.createClass({
  displayName: 'NewestImages',
  loadImagesFromServer: function() {
    fetch('/api/image/newest').then(function(response) {
      return response.json();
    }).then(function(json) {
      this.setState({data: json});
    }).catch(function(ex) {
      console.log('parsing failed', ex);
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      <div>
        <ImageThumbnail image="1" author="Musse2" object="IC 5146" date="21.8.2015" />
        <ImageThumbnail image="1" author="Musse" object="IC 5146" date="21.8.2015"/>
        <ImageThumbnail image="1" author="Musse" object="IC 5146" date="21.8.2015"/>
        <ImageThumbnail image="1" author="Musse" object="IC 5146" date="21.8.2015"/>
        <ImageThumbnail image="1" author="Musse" object="IC 5146" date="21.8.2015"/>
      </div>
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
          <Col xs={12} md={12}><NavbarInstance username="Musse" /></Col>
          <Col xs={0} md={0}></Col>
        </Row>
        <Row>
          <Col xs={0} md={0}></Col>
          <Col xs={12} md={12}>
          <h2>Newest images</h2>
            <div className="flexbox-images">
              <NewestImages />
            </div>
            <h2>Categories</h2>
            <div className="flexbox-images">
              <CategoryThumbnail link="/category/1" image="3" name="Nebulae" />
              <CategoryThumbnail link="/category/2" image="4" name="Galaxies" />
              <CategoryThumbnail link="/category/3" image="6" name="Best of" />
            </div>
          </Col>
          <Col xs={0} md={0}></Col>
        </Row>
      </Grid>
    );
  }
});
const CategoryThumbnail = React.createClass({
  displayName: 'CategoryThumbnail',
  propTypes: {
    image: React.PropTypes.string.isRequired,
    link: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <a className="category-padding" href={this.props.link}>
        <Image src={'/api/image/' + this.props.image + '/thumbnail'} thumbnail responsive />
        <h3 className="category-margin">{this.props.name}</h3>
      </a>
    );
  }
});
const ImageThumbnail = React.createClass({
  displayName: 'Image',
  propTypes: {
    image: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    object: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <figure className="imghvr-shutter-out-vert img-responsive img-thumbnail">
        <Image src={'/api/image/' + this.props.image + '/thumbnail'} responsive />
        <figcaption>
          <li>{this.props.author}</li>
          <li>{this.props.object}</li>
          <li>{this.props.date}</li>
        </figcaption>
        <a href="#"></a>
      </figure>
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

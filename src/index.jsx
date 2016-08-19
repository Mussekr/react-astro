require('./scss/imagehover.scss');
require('./scss/style.scss');
require('whatwg-fetch');
const moment = require('moment');
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
  Collapse
} = require('react-bootstrap');
const LoginForm = require('./login/LoginForm');

const NewestImages = React.createClass({
  displayName: 'NewestImages',
  propTypes: {
    pollInterval: React.PropTypes.number.isRequired
  },
  loadImagesFromServer: function() {
    fetch('/api/image/newest').then(function(response) {
      return response.json();
    }).then(json => {
      this.setState({data: json});
    }).catch(function(ex) {
      console.log('parsing failed', ex);
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadImagesFromServer();
    setInterval(this.loadImagesFromServer, this.props.pollInterval);
  },
  render: function() {
    let data = this.state.data.map(function(image) {
      return <ImageThumbnail key={image.id} image={image.id} author={image.username} name={image.name} date={moment(image.created).fromNow()} />;
    });
    return (
      <div>
        {data}
      </div>
    );
  }
});
const Categories = React.createClass({
  displayName: 'Categories',
  propTypes: {
    pollInterval: React.PropTypes.number.isRequired
  },
  loadCategoriesFromServer: function() {
    fetch('/api/categories').then(function(response) {
      return response.json();
    }).then(json => {
      this.setState({data: json});
    }).catch(function(ex) {
      console.log('parsing failed', ex);
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCategoriesFromServer();
    setInterval(this.loadCategoriesFromServer, this.props.pollInterval);
  },
  render: function() {
    let data = this.state.data.map(function(category) {
      return <CategoryThumbnail key={category.id} image={category.image} link={category.id} name={category.name} />;
    });
    return(
      <div>
        {data}
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
              <NewestImages pollInterval={30000} />
            </div>
            <h2>Categories</h2>
            <div className="flexbox-images">
              <Categories pollInterval={30000} />
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
    image: React.PropTypes.number.isRequired,
    link: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <a href={'/category/' + this.props.link}>
        <Image src={'/api/image/' + this.props.image + '/thumbnail'} thumbnail responsive />
        <h3 className="category-margin">{this.props.name}</h3>
      </a>
    );
  }
});
const ImageThumbnail = React.createClass({
  displayName: 'Image',
  propTypes: {
    image: React.PropTypes.number.isRequired,
    author: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <figure className="imghvr-shutter-out-vert img-responsive img-thumbnail">
        <Image src={'/api/image/' + this.props.image + '/thumbnail'} responsive />
        <figcaption>
          <li>{this.props.author}</li>
          <li>{this.props.name}</li>
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

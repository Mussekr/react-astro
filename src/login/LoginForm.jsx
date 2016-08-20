const React = require('react');
const {
  Form,
  FormGroup,
  FormControl,
  Button
} = require('react-bootstrap');
const api = require('../utils/api');
require('./LoginForm.scss');

const LoginForm = React.createClass({
  getInitialState: function() {
    return {
      logged: null,
      username: null
    };
  },
  updateUser: function() {
    api.json('/api/user').then(json => this.setState(json));
  },
  componentDidMount: function() {
    this.updateUser();
  },
  render: function() {
    if (this.state.logged === null) {
      return <div className="user">Loading</div>;
    } else if (this.state.logged === true) {
      return (
        <div className="user">
          Hello, {this.state.username}
          <Form inline action="/api/logout" method="post">
            <Button type="submit">Logout</Button>
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

module.exports = LoginForm;

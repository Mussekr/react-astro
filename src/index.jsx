var React = require('react');
var ReactDOM = require('react-dom');

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
);

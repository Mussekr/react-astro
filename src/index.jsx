import './scss/imagehover.scss';
import './scss/style.scss';
import 'whatwg-fetch';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createAction } from './utils/ActionCreator';
import Actions from './constants/actions';
import store from './store/store';
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import NewestImages from './images/NewestImages';
import Categories from './images/Categories';
import NavbarInstance from './navigation/NavbarInstance';
import UserPage from './user/UserPage';
import ImageDetail from './images/ImageDetail';
import CategoryPage from './images/CategoryPage';
import UploadImageVanilla from './images/UploadImageVanilla';

const GridInstance = React.createClass({
    displayName: 'GridInstance',
    propTypes: {
        user: React.PropTypes.object.isRequired,
        requestUserInfo: React.PropTypes.func.isRequired,
        children: React.PropTypes.element.isRequired
    },
    componentDidMount: function() {
        this.props.requestUserInfo();
    },
    render: function() {
        return (
            <Grid>
                <Row>
                    <Col xs={0} md={0}></Col>
                    <Col xs={12} md={12}><NavbarInstance user={this.props.user} /></Col>
                    <Col xs={0} md={0}></Col>
                </Row>
                <Row>
                    <Col xs={0} md={0}></Col>
                    <Col xs={12} md={12}>
                        {this.props.children}
                    </Col>
                    <Col xs={0} md={0}></Col>
                </Row>
            </Grid>
        );
    }
});

const Home = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Newest images</h2>
                <div className="flexbox-images">
                    <NewestImages />
                </div>
                <h2>Categories</h2>
                <div className="flexbox-images">
                    <Categories />
                </div>
            </div>
        );
    }
});

const mapStateToProps = state => state.main.toJS();
const mapDispatchToProps = dispatch => ({requestUserInfo: () => dispatch(createAction(Actions.REQUEST_USER_INFO))});

const App = connect(mapStateToProps, mapDispatchToProps)(GridInstance);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="image/(:id)" component={ImageDetail} />
                <Route path="user/:username" component={UserPage} />
                <Route path="category/(:name)/(:id)" component={CategoryPage} />
                <Route path="/upload" component={UploadImageVanilla} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
 );

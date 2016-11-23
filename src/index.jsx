import './scss/imagehover.scss';
import './scss/style.scss';
import 'font-awesome/css/font-awesome.css';
import './bootstrap/css/bootstrap.css';
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
  Col,
  Image
} from 'react-bootstrap';
import NewestImages from './images/NewestImages';
import Categories from './images/Categories';
import NavbarInstance from './navigation/NavbarInstance';
import UserPage from './user/UserPage';
import ImageDetail from './images/ImageDetail';
import ImageFull from './images/ImageFull';
import CategoryPage from './images/CategoryPage';
import UploadImage from './images/UploadImage';
import UploadImageDetails from './images/UploadImageDetails';
import UploadFilters from './images/UploadFilters';
import Register from './user/Register';
import Gear from './user/Gear';
import AdminCategories from './admin/AdminCategories';
import AdminUsers from './admin/AdminUsers';

const GridInstance = React.createClass({
    displayName: 'GridInstance',
    propTypes: {
        user: React.PropTypes.object.isRequired,
        requestUserInfo: React.PropTypes.func.isRequired,
        children: React.PropTypes.element.isRequired,
        logout: React.PropTypes.func.isRequired
    },
    componentDidMount: function() {
        this.props.requestUserInfo();
    },
    render: function() {
        return (
            <Grid>
                <Row>
                    <Col xs={0} md={0}></Col>
                    <Col xs={12} md={12}><NavbarInstance user={this.props.user} logout={this.props.logout} /></Col>
                    <Col xs={0} md={0}></Col>
                </Row>
                <Row className="header-row">
                    <Col xs={0} md={0} />
                    <Col xs={12} md={12}>
                        <header>
                            <Image src="/img/placeholder-header.png" responsive rounded />
                        </header>
                    </Col>
                    <Col xs={0} md={0} />
                </Row>
                <Row>
                    <Col xs={0} md={0}></Col>
                    <Col xs={12} md={12}>
                        {this.props.children}
                    </Col>
                    <Col xs={0} md={0}></Col>
                </Row>
                <Row className="footer">
                    <Col xs={0} md={0}></Col>
                    <Col xs={12} md={12}>
                        <div className="flexbox-images">
                            <span>
                                Written by Rasmus Kröger. Code available at <a href="http://github.com/mussekr/react-astro">mussekr/react-astro</a>
                            </span>
                        </div>
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

const mapStateToProps = state => state.users.toJS();
const mapDispatchToProps = dispatch => ({
    requestUserInfo: () => dispatch(createAction(Actions.REQUEST_USER_INFO)),
    logout: () => dispatch(createAction(Actions.LOGOUT))
});

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
                <Route path="/upload" component={UploadImage} />
                <Route path="/upload/:id" component={UploadImageDetails} />
                <Route path="/upload/filters/:id" component={UploadFilters} />
                <Route path="/register" component={Register} />
                <Route path="/gear" component={Gear} />
                <Route path="/admin/categories" component={AdminCategories} />
                <Route path="/admin/users" component={AdminUsers} />
            </Route>
            <Route path="/image/(:id)/full" component={ImageFull} />
        </Router>
    </Provider>,
    document.getElementById('app')
 );

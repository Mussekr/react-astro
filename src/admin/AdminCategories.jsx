import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { Maybe } from '../utils/PropTypes';

const renderCategory = (id, name, changeImage, onDelete) => (
    <tr key={id}>
        <td>{id}</td>
        <td>{name}</td>
        <td><Button bsStyle="info" title="Change image" onClick={changeImage}>Change image</Button></td>
        <td><Button bsStyle="danger" title="Delete this user" onClick={onDelete}>✕</Button></td>
    </tr>
);

const AdminCategories = React.createClass({
    propTypes: {
        categories: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        loadCategories: React.PropTypes.func.isRequired,
        requestUserInfo: React.PropTypes.func.isRequired,
        user: Maybe.isRequired
    },
    getDefaultProps: function() {
        return {
            categories: []
        };
    },
    componentDidMount: function() {
        this.props.loadCategories();
        this.props.requestUserInfo();
    },
    isAdmin: function() {
        return this.props.user.map(user => user.role === 'admin').orSome(false);
    },
    changeImage: function(id) {
        console.log(id);
    },
    onDelete: function(id) {
        console.log(id);
    },
    render: function() {
        if(this.isAdmin()) {
            return (
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.categories.map(category =>
                            renderCategory(category.id, category.name, this.changeImage(category.id), this.onDelete(category.id))
                        )}
                    </tbody>
                </Table>
            );
        } else {
            return (
                <h1>Insufficient privileges</h1>
            );
        }
    }
});

const mapStateToProps = state => Object.assign(state.main.toJS(), {user: state.users.get('user')});
const mapDispatchToProps = dispatch => ({
    loadCategories: () => dispatch(createAction(Actions.REQUEST_CATEGORIES_LIST)),
    requestUserInfo: () => dispatch(createAction(Actions.REQUEST_USER_INFO))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategories);

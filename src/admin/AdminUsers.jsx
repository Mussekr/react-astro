import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { Maybe } from '../utils/PropTypes';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';

const renderUser = (id, username, role, onDelete, isCurrentUser, updateGroup) => (
    <tr key={id}>
        <td>{username}</td>
        <td>{role}</td>
        {isCurrentUser ? null : <td>{role === 'admin' ? <Button bsStyle="info" title="Demote this user" onClick={updateGroup}>Demote</Button>
            : <Button bsStyle="warning" title="Promote this user" onClick={updateGroup}>Promote</Button>}</td>}
        {isCurrentUser ? null
            : <td><Button bsStyle="danger" title="Delete this user" onClick={onDelete}>✕</Button></td>}
    </tr>
);

const AdminUsers = React.createClass({
    propTypes: {
        users: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        fetchUserList: React.PropTypes.func.isRequired,
        deleteUser: React.PropTypes.func.isRequired,
        updateGroup: React.PropTypes.func.isRequired,
        user: Maybe.isRequired
    },
    getDefaultProps: function() {
        return {
            users: []
        };
    },
    isAdmin: function() {
        return this.props.user.map(user => user.role === 'admin').orSome(false);
    },
    componentDidMount: function() {
        if(this.isAdmin()) {
            this.props.fetchUserList();
        }
    },
    onDelete: function(id) {
        if(confirm('Are you sure?')) {
            this.props.deleteUser(id);
        }
    },
    updateGroup: function(id, newGroup) {
        if(confirm('Are you sure?')) {
            this.props.updateGroup(id, newGroup);
        }
    },
    render: function() {
        const isCurrentUser = username =>
            this.props.user.map(user => user.username === username).orSome(false);
        if(this.isAdmin()) {
            return (
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users.map(u =>
                            renderUser(u.id, u.username, u.role, () => this.onDelete(u.id), isCurrentUser(u.username),
                            () => this.updateGroup(u.id, u.role === 'admin' ? 'user' : 'admin')))}
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

const mapStateToProps = state => state.users.toJS();
const mapDispatchToProps = dispatch => ({
    fetchUserList: () => dispatch(createAction(Actions.REQUEST_USER_LIST)),
    deleteUser: id => dispatch(createAction(Actions.DELETE_USER, {id: id})),
    updateGroup: (id, group) => dispatch(createAction(Actions.UPDATE_GROUP, {id, group}))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);

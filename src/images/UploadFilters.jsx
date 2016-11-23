import React from 'react';
import { connect } from 'react-redux';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { Maybe } from '../utils/PropTypes';

const mapStateToProps = state => Object.assign(state.gear.toJS(), {user: state.users.get('user')});

const mapDispatchToProps = dispatch => ({
    loadGear: () => dispatch(createAction(Actions.REQUEST_GEAR_LIST))
});

const UploadFilters = React.createClass({
    propTypes: {
        user: Maybe.isRequired,
        loadGear: React.PropTypes.func.isRequired,
        filter: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    isLoggedIn: function() {
        return this.props.user.isSome();
    },
    componentDidMount: function() {
        this.props.loadGear();
    },
    render: function() {
        if(this.isLoggedIn()) {
            return (
                <div>
                    <h1>Fill image filter details</h1>
                </div>
            );
        } else {
            return (
                <h1>Please login</h1>
            );
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFilters);

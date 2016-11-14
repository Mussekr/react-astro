import React from 'react';
import { connect } from 'react-redux';
import Actions from '../constants/actions';
import { createAction } from '../utils/ActionCreator';
import ImageThumbnail from '../images/ImageThumbnail';
import moment from 'moment';

const UserPage = React.createClass({
    propTypes: {
        routeParams: React.PropTypes.object.isRequired,
        loadUserImages: React.PropTypes.func.isRequired,
        userImages: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    componentDidMount: function() {
        this.props.loadUserImages(this.props.routeParams.username);
    },
    render: function() {
        const data = this.props.userImages.map(function(image) {
            return <ImageThumbnail key={image.id} image={image.id} author={image.username} name={image.name} date={moment(image.created).fromNow()} />;
        });
        return (
            <div>
                <h1>{this.props.routeParams.username}</h1>
                <div className="flexbox-images">
                    {data}
                </div>
            </div>
        );
    }
});

const mapStateToProps = state => state.main.toJS();
const mapDispatchToProps = dispatch => ({
    loadUserImages: username => dispatch(createAction(Actions.REQUEST_USER_IMAGES_LIST, {
        username: username
    }))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

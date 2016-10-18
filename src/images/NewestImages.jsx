import React from 'react';
import ImageThumbnail from './ImageThumbnail';
import moment from 'moment';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { connect } from 'react-redux';

const NewestImages = React.createClass({
    displayName: 'NewestImages',
    propTypes: {
        loadImages: React.PropTypes.func.isRequired,
        newestImages: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    getDefaultProps: function() {
        return {
            newestImages: []
        };
    },
    componentDidMount: function() {
        this.props.loadImages();
    },
    render: function() {
        const data = this.props.newestImages.map(function(image) {
            return <ImageThumbnail key={image.id} image={image.id} author={image.username} name={image.name} date={moment(image.created).fromNow()} />;
        });
        return (
            <div>
                {data}
            </div>
        );
    }
});

const mapStateToProps = state => state.main.toJS();
const mapDispatchToProps = dispatch => ({loadImages: () => dispatch(createAction(Actions.REQUEST_NEWEST_IMAGES_LIST))});

export default connect(mapStateToProps, mapDispatchToProps)(NewestImages);

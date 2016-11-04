import React from 'react';
import { connect } from 'react-redux';
import Actions from '../constants/actions';
import { createAction } from '../utils/ActionCreator';
import ImageThumbnail from './ImageThumbnail';
import moment from 'moment';

function mapStateToProps(state, ownProps) {
    return {
        id: ownProps.params.id,
        name: ownProps.params.name,
        main: state.main.toJS()
    };
}
const mapDispatchToProps = dispatch => ({
    requestCategoryImages: id => dispatch(createAction(Actions.REQUEST_CATEGORIES_IMAGES_LIST, {
        id
    }))
});

const CategoryPage = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        requestCategoryImages: React.PropTypes.func.isRequired,
        main: React.PropTypes.object.isRequired
    },
    getDefaultProps: function() {
        return {
            categoriesImages: []
        };
    },
    componentDidMount: function() {
        this.props.requestCategoryImages(this.props.id);
    },
    render: function() {
        const data = this.props.main.categoriesImages.map(function(image) {
            return <ImageThumbnail key={image.id} image={image.id} author={image.username} name={image.name} date={moment(image.created).fromNow()} />;
        });
        return (
            <div>
                <h1>{this.props.name}</h1>
                <div className="flexbox-images">
                    {data}
                </div>
            </div>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);

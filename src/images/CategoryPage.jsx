import React from 'react';
import { connect } from 'react-redux';
import Actions from '../constants/actions';
import { createAction } from '../utils/ActionCreator';
import ImageThumbnail from './ImageThumbnail';
import moment from 'moment';


const mapStateToProps = (state, ownProps) => Object.assign(state.main.toJS(), {name: ownProps.params.name, id: ownProps.params.id});
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
        categoriesImages: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    getDefaultProps: function() {
        return {
            categoriesImages: []
        };
    },
    componentDidMount: function() {
        this.props.requestCategoryImages(this.props.name);
    },
    render: function() {
        const data = this.props.categoriesImages.map(function(image) {
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

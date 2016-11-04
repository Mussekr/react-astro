import React from 'react';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router';

const Categories = React.createClass({
    displayName: 'Categories',
    propTypes: {
        loadCategories: React.PropTypes.func.isRequired,
        categories: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    getDefaultProps: function() {
        return {
            categories: []
        };
    },
    componentDidMount: function() {
        this.props.loadCategories();
    },
    render: function() {
        const data = this.props.categories.map(function(category) {
            return <CategoryThumbnail key={category.id} image={category.image} link={category.id} name={category.name} />;
        });
        return(
            <div>
                {data}
            </div>
        );
    }
});

const CategoryThumbnail = React.createClass({
    displayName: 'CategoryThumbnail',
    propTypes: {
        image: React.PropTypes.string.isRequired,
        link: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            <Link className="category-links" to={'/category/' + this.props.name + '/' + this.props.link}>
                <Image className="thumbnail-size" src={'/api/image/' + this.props.image + '/thumbnail'} thumbnail responsive />
                <h3 className="category-margin">{this.props.name}</h3>
            </Link>
        );
    }
});

const mapStateToProps = state => state.main.toJS();
const mapDispatchToProps = dispatch => ({loadCategories: () => dispatch(createAction(Actions.REQUEST_CATEGORIES_LIST))});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);

import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router';
import './ImageFull.scss';

const ImageFull = React.createClass({
    propTypes: {
        routeParams: React.PropTypes.object.isRequired
    },
    render: function() {
        return (
            <div className="flexbox-images image-full">
                <Link to={'/image/' + this.props.routeParams.id}>
                    <Image src={'/api/image/' + this.props.routeParams.id} rounded responsive className="image-full-img" />
                </Link>
            </div>
        );
    }
});

export default connect()(ImageFull);

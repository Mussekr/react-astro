import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router';
import ProgressiveImage from 'react-progressive-image';
import './ImageFull.scss';

const ImageFull = React.createClass({
    propTypes: {
        routeParams: React.PropTypes.object.isRequired
    },
    render: function() {
        return (
            <div className="flexbox-images image-full">
                <Link to={'/image/' + this.props.routeParams.id}>
                    <ProgressiveImage src={'/api/image/' + this.props.routeParams.id} placeholder={'/api/image/' + this.props.routeParams.id + '/blur'}>
                        {src => <Image src={src} className="image-full-img" responsive rounded />}
                    </ProgressiveImage>
                </Link>
            </div>
        );
    }
});

export default connect()(ImageFull);

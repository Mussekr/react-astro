import React from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router';

const ImageThumbnail = React.createClass({
    displayName: 'Image',
    propTypes: {
        image: React.PropTypes.number.isRequired,
        author: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        date: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            <figure className="imghvr-shutter-out-vert img-responsive img-thumbnail">
                <Image className="thumbnail-size" src={'/api/image/' + this.props.image + '/thumbnail'} responsive />
                <figcaption>
                    <li>{this.props.author}</li>
                    <li>{this.props.name}</li>
                    <li>{this.props.date}</li>
                </figcaption>
                <Link to={'/image/' + this.props.image}></Link>
            </figure>
        );
    }
});

module.exports = ImageThumbnail;

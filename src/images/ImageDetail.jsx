import React from 'react';

const ImageDetail = React.createClass({
    propTypes: {
        imageId: React.PropTypes.number.isRequired
    },
    render: function() {
        return (
            <div className="flexbox-images">
                <Image src={'/api/image/' + this.props.imageId} rounded />
            </div>
        );
    }
});

module.exports = ImageDetail;

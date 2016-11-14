import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router';

function mapStateToProps(state, ownProps) {
    return {
        id: ownProps.params.id
    };
}

const ImageDetail = React.createClass({
    propTypes: {
        id: React.PropTypes.string
    },
    render: function() {
        return (
            <div>
            <div className="flexbox-images">
                <Link to={'/image/' + this.props.id + '/full'}><Image className="image-detail" src={'/api/image/' + this.props.id} rounded responsive /></Link>
            </div>
            <div className="flexbox-images"><h2>Name of image</h2></div>
            <div className="flexbox-images">
                <div className="col-xs-2" />
                <div className="col-xs-4">
                    <dl className="dl-horizontal">
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                    </dl>
                </div>
                <div className="col-xs-4">
                    <dl className="dl-horizontal">
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                        <dt>Camera</dt>
                        <dd>Nice camera</dd>
                    </dl>
                </div>
                <div className="col-xs-2" />
            </div>
            </div>
        );
    }
});

export default connect(mapStateToProps)(ImageDetail);

import React from 'react';
import { connect } from 'react-redux';
import { Col, Image } from 'react-bootstrap';
import { Link } from 'react-router';
import ProgressiveImage from 'react-progressive-image';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import __ from 'lodash';
import moment from 'moment';

const mapStateToProps = (state, ownProps) => Object.assign(state.gear.toJS(), { id: ownProps.params.id, imageDetails: state.main.get('imageDetails').toJS() });

const mapDispatchToProps = dispatch => ({
    loadGear: id => dispatch(createAction(Actions.REQUEST_IMAGE_GEAR, {id})),
    loadDetails: id => dispatch(createAction(Actions.REQUEST_IMAGE_DETAILS, {id}))
});

const ImageDetail = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        loadGear: React.PropTypes.func.isRequired,
        loadDetails: React.PropTypes.func.isRequired,
        imageDetails: React.PropTypes.oneOfType([React.PropTypes.array.isRequired, React.PropTypes.object.isRequired]).isRequired,
        telescope: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        mount: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        imagingCamera: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        guideCamera: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        misc: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    componentDidMount: function() {
        this.props.loadGear(this.props.id);
        this.props.loadDetails(this.props.id);
    },
    render: function() {
        return (
            <div>
            <div className="flexbox-images">
                <Link to={'/image/' + this.props.id + '/full'}>
                    <ProgressiveImage src={'/api/image/' + this.props.id} placeholder={'/api/image/' + this.props.id + '/blur'}>
                        {src => <Image src={src} className="image-detail" responsive rounded />}
                    </ProgressiveImage>
                </Link>
            </div>
            <div className="flexbox-images">
                <h2>
                    {__.get(this.props.imageDetails[0], 'name')} by
                    <Link to={'/user/' + __.get(this.props.imageDetails[0], 'username')}> {__.get(this.props.imageDetails[0], 'username')}</Link>
                </h2>
            </div>
            <div className="flexbox-images">
                <Col xs={2} />
                <Col xs={4}>
                    <dl className="dl-horizontal">
                        <dt>Telescope</dt>
                        <dd>{__.get(this.props.telescope[0], 'name')}</dd>
                        <dt>Mount</dt>
                        <dd>{__.get(this.props.mount[0], 'name')}</dd>
                        <dt>Imaging camera</dt>
                        <dd>{__.get(this.props.imagingCamera[0], 'name')}</dd>
                        <dt>Guide camera</dt>
                        <dd>{__.get(this.props.guideCamera[0], 'name')}</dd>
                        <dt>Misc</dt>
                        <dd>{this.props.misc.map(item => ', ' + item.name)}</dd>
                    </dl>
                </Col>
                <Col xs={4}>
                    <dl className="dl-horizontal">
                        <dt>Upload date</dt>
                        <dd>{moment(__.get(this.props.imageDetails[0], 'created')).format('lll')}</dd>
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
                </Col>
                <Col xs={2} />
            </div>
            <Col xs={2} />
            <Col xs={8}>
                <div><h3><i className="fa fa-list"></i> Description</h3></div>
                <div>
                    {__.get(this.props.imageDetails[0], 'description')}
                </div>
            </Col>
            </div>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageDetail);

import React from 'react';
import { connect } from 'react-redux';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { FormGroup, ControlLabel, FormControl, Image, Col, Button } from 'react-bootstrap';
import Select from 'react-normalized-select';
import { Maybe } from '../utils/PropTypes';

const mapStateToProps = (state, ownProps) => Object.assign(state.gear.toJS(), {
    id: ownProps.params.id,
    categories: state.main.get('categories').toJS(),
    user: state.users.get('user')
});
const mapDispatchToProps = dispatch => ({
    loadGear: () => dispatch(createAction(Actions.REQUEST_GEAR_LIST)),
    addGear: (gearArray, id) => dispatch(createAction(Actions.ADD_IMAGE_GEAR, {gearArray, id}))
});

const UploadImageDetails = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        loadGear: React.PropTypes.func.isRequired,
        addGear: React.PropTypes.func.isRequired,
        user: Maybe.isRequired,
        categories: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        telescope: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        mount: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        imagingCamera: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        guideCamera: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        filter: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        misc: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    componentDidMount: function() {
        this.props.loadGear();
    },
    getInitialState: function() {
        return {
            telescope: '',
            mount: '',
            imagingCamera: '',
            guideCamera: '',
            misc: []
        };
    },
    handleField(name, value) {
        this.setState({[name]: value});
    },
    isLoggedIn: function() {
        return this.props.user.isSome();
    },
    onSubmit: function(event) {

        /* eslint-disable camelcase */
        event.preventDefault();
        const gearArray = [];
        gearArray.push({image_id: this.props.id, gear_id: this.state.telescope});
        gearArray.push({image_id: this.props.id, gear_id: this.state.mount});
        gearArray.push({image_id: this.props.id, gear_id: this.state.imagingCamera});
        gearArray.push({image_id: this.props.id, gear_id: this.state.guideCamera});
        this.state.misc.forEach(item => gearArray.push({image_id: this.props.id, gear_id: item}));
        this.props.addGear(gearArray, this.props.id);

        /* eslint-enable camelcase */
    },
    render: function() {
        if(this.isLoggedIn()) {
            return (
                <div className="flexbox-images">
                    <Col xs={4} md={4}>
                        <h2>Fill image gear details</h2>
                        <div className="flexbox-images">
                            <Image className="thumbnail-size img-rounded" src={'/api/image/' + this.props.id + '/thumbnail'} responsive />
                        </div>
                        <GearList data={this.props.telescope} name="Telescope" onChange={ev => this.handleField('telescope', ev.target.value)} />
                        <GearList data={this.props.mount} name="Mount" onChange={ev => this.handleField('mount', ev.target.value)} />
                        <GearList data={this.props.imagingCamera} name="Imaging camera" onChange={ev => this.handleField('imagingCamera', ev.target.value)} />
                        <GearList data={this.props.guideCamera} name="Guide camera" onChange={ev => this.handleField('guideCamera', ev.target.value)} />
                        <GearListMultiple data={this.props.misc} value={this.state.misc} name="Misc" onChange={e => this.setState({misc: e.target.value})} />
                        <Button onClick={this.onSubmit} type="submit">Submit</Button>
                    </Col>
                </div>
            );
        } else {
            return (
                <h1>You must be logged in to access this page!</h1>
            );
        }
    }
});

const GearListMultiple = React.createClass({
    propTypes: {
        data: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        name: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.array.isRequired
    },
    render: function() {
        const data = this.props.data.map(function(data) {
            return <option key={data.id} value={data.id}>{data.name}</option>;
        });
        return (
            <FormGroup controlId="formControlsSelectMultiple">
                <ControlLabel>{this.props.name}</ControlLabel>
                <Select id="formControlsSelectMultiple" className="form-control"
                multiple={true} size={5} value={this.props.value} onChange={this.props.onChange}>
                    {data}
                </Select>
            </FormGroup>
        );
    }
});

const GearList = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        name: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    getDefaultProps: function() {
        return {
            data: {}
        };
    },
    render: function() {
        const data = this.props.data.map(function(data) {
            return <option key={data.id} value={data.id}>{data.name}</option>;
        });
        return (
            <FormGroup controlId="formControlsSelectMultiple">
                <ControlLabel>{this.props.name}</ControlLabel>
                <FormControl componentClass="select" onChange={this.props.onChange}>
                    <option value="null">--</option>
                    {data}
                </FormControl>
            </FormGroup>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageDetails);

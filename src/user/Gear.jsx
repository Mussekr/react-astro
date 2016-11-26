import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button, Col } from 'react-bootstrap';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { Maybe } from '../utils/PropTypes';

const Gear = React.createClass({
    propTypes: {
        loadGear: React.PropTypes.func.isRequired,
        deleteGear: React.PropTypes.func.isRequired,
        addGear: React.PropTypes.func.isRequired,
        user: Maybe.isRequired,
        telescope: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        mount: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        imagingCamera: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        guideCamera: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        filter: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        misc: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    getInitialState: function() {
        return {
            telescope: '',
            telescopeSelect: '',
            mount: '',
            mountSelect: '',
            imagingCamera: '',
            imagingCameraSelect: '',
            guideCamera: '',
            guideCameraSelect: '',
            filter: '',
            filterSelect: '',
            misc: '',
            miscSelect: ''
        };
    },
    isLoggedIn: function() {
        return this.props.user.isSome();
    },
    componentDidMount: function() {
        this.props.loadGear();
    },
    handleChange: function(field, value) {
        this.setState({[field]: value});
    },
    onDelete: function(field) {
        if(confirm('Are you sure?')) {
            this.props.deleteGear(this.state[field]);
        }
    },
    onAdd: function(field) {
        this.props.addGear(field, this.state[field]);
        this.setState({[field]: ''});
    },
    render: function() {
        if(this.isLoggedIn()) {
            return (
                <div className="flexbox-images">
                    <Col xs={4} md={4}>
                        <h1>Add Gear</h1>
                        <GearList data={this.props.telescope} name="Telescopes"onChange={ev => this.handleChange('telescopeSelect', ev.target.value)}
                        onChangeText={ev => this.handleChange('telescope', ev.target.value)} inputValue={this.state.telescope}
                        onDelete={() => this.onDelete('telescopeSelect')} onAdd={() => this.onAdd('telescope')} />
                        <GearList data={this.props.mount} name="Mounts" onChange={ev => this.handleChange('mountSelect', ev.target.value)}
                        onChangeText={ev => this.handleChange('mount', ev.target.value)} inputValue={this.state.mount}
                        onDelete={() => this.onDelete('mountSelect')} onAdd={() => this.onAdd('mount')} />
                        <GearList data={this.props.imagingCamera} name="Imaging cameras"
                        onChange={ev => this.handleChange('imagingCameraSelect', ev.target.value)}
                        onChangeText={ev => this.handleChange('imagingCamera', ev.target.value)} inputValue={this.state.imagingCamera}
                        onDelete={() => this.onDelete('imagingCameraSelect')} onAdd={() => this.onAdd('imagingCamera')} />
                        <GearList data={this.props.guideCamera} name="Guide cameras" onChange={ev => this.handleChange('guideCameraSelect', ev.target.value)}
                        onChangeText={ev => this.handleChange('guideCamera', ev.target.value)} inputValue={this.state.guideCamera}
                        onDelete={() => this.onDelete('guideCameraSelect')} onAdd={() => this.onAdd('guideCamera')} />
                        <GearList data={this.props.filter} name="Filters" onChange={ev => this.handleChange('filterSelect', ev.target.value)}
                        onChangeText={ev => this.handleChange('filter', ev.target.value)} inputValue={this.state.filter}
                        onDelete={() => this.onDelete('filterSelect')} onAdd={() => this.onAdd('filter')} />
                        <GearList data={this.props.misc} name="Misc" onChange={ev => this.handleChange('miscSelect', ev.target.value)}
                        onChangeText={ev => this.handleChange('misc', ev.target.value)} inputValue={this.state.misc}
                        onDelete={() => this.onDelete('miscSelect')} onAdd={() => this.onAdd('misc')} />
                    </Col>
                </div>
            );
        } else {
            return (
                <h1>Login to add gear</h1>
            );
        }
    }
});

const GearList = React.createClass({
    propTypes: {
        data: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        name: React.PropTypes.string.isRequired,
        inputValue: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onChangeText: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onAdd: React.PropTypes.func.isRequired
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
                <FormControl componentClass="select" multiple onChange={this.props.onChange}>
                    {data}
                </FormControl>
                <Button bsStyle="danger" onClick={this.props.onDelete}>Delete selected</Button>
                <FormControl
                    type="text"
                    placeholder="Gear Name"
                    onChange={this.props.onChangeText}
                    value={this.props.inputValue}
                    required
                />
                <Button bsStyle="success" onClick={this.props.onAdd}>Add</Button>
            </FormGroup>
        );
    }
});

const mapStateToProps = state => Object.assign(state.gear.toJS(), {user: state.users.get('user')});
const mapDispatchToProps = dispatch => ({
    loadGear: () => dispatch(createAction(Actions.REQUEST_GEAR_LIST)),
    deleteGear: id => dispatch(createAction(Actions.DELETE_GEAR, {id})),
    addGear: (field, value) => dispatch(createAction(Actions.ADD_GEAR, {gearType: field, gearName: value}))
});

export default connect(mapStateToProps, mapDispatchToProps)(Gear);

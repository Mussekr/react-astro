import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button, Col } from 'react-bootstrap';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';

/*
    1 -- telescope
    2 -- mounts
    3 -- imaging camera
    4 -- guiding camera
    5 -- filters
    6 -- misc
*/

const Gear = React.createClass({
    propTypes: {
        loadGear: React.PropTypes.func.isRequired,
        gearList: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        return {
            data:
            [{
                id: 1,
                name: 'GSO XXXXXXX'
            },
                {
                    id: 2,
                    name: 'GSO 2'
                }],
            telescope: ''
        };
    },
    componentDidMount: function() {
        this.props.loadGear();
    },
    render: function() {
        console.log(this.props.gearList);
        return (
            <div className="flexbox-images">
                <Col xs={4} md={4}>
                    <h1>Add Gear</h1>
                    <GearList data={this.props.gearList} name="Telescope" onChange={this.handleField} />
                </Col>
            </div>
        );
    }
});

const GearList = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
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
                <FormControl componentClass="select" multiple onChange={this.props.onChange}>
                    {data}
                </FormControl>
                <Button bsStyle="danger">Delete selected</Button>
                <FormControl
                    type="text"
                    placeholder="Gear Name"
                    onChange={this.props.onChange}
                    required
                />
            </FormGroup>
        );
    }
});

const mapStateToProps = state => state.main.toJS();
const mapDispatchToProps = dispatch => ({
    loadGear: () => dispatch(createAction(Actions.REQUEST_GEAR_LIST))
});

export default connect(mapStateToProps, mapDispatchToProps)(Gear);

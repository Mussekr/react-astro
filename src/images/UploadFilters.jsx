import React from 'react';
import { connect } from 'react-redux';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { Maybe } from '../utils/PropTypes';
import { FormGroup, ControlLabel, FormControl, Form, Col, Row, Button } from 'react-bootstrap';
import __ from 'lodash';

const mapStateToProps = (state, ownProps) => Object.assign(state.gear.toJS(), {user: state.users.get('user'), id: ownProps.params.id});

const mapDispatchToProps = dispatch => ({
    loadGear: () => dispatch(createAction(Actions.REQUEST_GEAR_LIST)),
    onAdd: (id, filterArray) => dispatch(createAction(Actions.ADD_IMAGE_FILTERS, {id: id, filterArray: filterArray}))
});

const UploadFilters = React.createClass({
    propTypes: {
        user: Maybe.isRequired,
        loadGear: React.PropTypes.func.isRequired,
        onAdd: React.PropTypes.func.isRequired,
        filter: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        id: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            channels: 1
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
    onSubmit: function(ev) {

        /* eslint-disable camelcase */
        ev.preventDefault();
        const data = [];
        __.range(this.state.channels).map(id => data.push({
            filter: this.state['filter' + id], subframes: this.state['subframes' + id], exposure: this.state['exposure' + id], image_id: this.props.id
        }));
        this.props.onAdd(this.props.id, data);

        /* eslint-enable camelcase */
    },
    render: function() {
        const filterForms = __.range(this.state.channels).map(id => <FilterForm key={id} id={id} filter={this.props.filter}
        onChange={ev => this.handleChange(ev.target.name, ev.target.value)} />);
        if(this.isLoggedIn()) {
            return (
                <div>
                    <h1>Fill image filter details</h1>
                    <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Select number of channels</ControlLabel>
                        <FormControl componentClass="select" placeholder="select" onChange={ev => this.handleChange('channels', ev.target.value)} required>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </FormControl>
                    </FormGroup>
                    <Form horizontal onSubmit={this.onSubmit}>
                        {filterForms}
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button type="submit">
                                    Submit
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            );
        } else {
            return (
                <h1>Please login</h1>
            );
        }
    }
});

const FilterForm = React.createClass({
    propTypes: {
        filter: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        onChange: React.PropTypes.func.isRequired,
        id: React.PropTypes.number.isRequired
    },
    render: function() {
        return (
            <Row>
            <Col xs={1} md={1} />
            <Col className="filter-div" xs={8} md={8}>
            <FilterList filter={this.props.filter} onChange={this.props.onChange} id={this.props.id} />
            <FormGroup controlId="formInputSub" className="filter-form-group">
                <ControlLabel>Number of sub frames</ControlLabel>
                <FormControl type="number" placeholder="Sub frames" min={0} onChange={this.props.onChange} required name={'subframes' + this.props.id} />
            </FormGroup>
            <FormGroup controlId="formInputSub" className="filter-form-group">
                <ControlLabel>Exposure of sub frame</ControlLabel>
                <FormControl type="number" placeholder="Exposure" min={0} onChange={this.props.onChange} required name={'exposure' + this.props.id} />
            </FormGroup>
            </Col>
            <Col xs={3} md={3} />
            </Row>
        );
    }
});

const FilterList = React.createClass({
    propTypes: {
        filter: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        onChange: React.PropTypes.func.isRequired,
        id: React.PropTypes.number.isRequired
    },
    render: function() {
        const data = this.props.filter.map(filter =>
                <option key={filter.id} value={filter.id}>{filter.name}</option>
        );
        return (
            <FormGroup controlId="formControlsSelect" className="filter-form-group">
                <ControlLabel>Select filter</ControlLabel>
                <FormControl componentClass="select" placeholder="select" onChange={this.props.onChange} name={'filter' + this.props.id} required>
                    <option value="null">--</option>
                    {data}
                </FormControl>
            </FormGroup>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFilters);

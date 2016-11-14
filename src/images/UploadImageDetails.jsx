import React from 'react';
import { connect } from 'react-redux';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { FormGroup, ControlLabel, FormControl, Image, Col } from 'react-bootstrap';

function mapStateToProps(state, ownProps) {
    return {
        id: ownProps.params.id,
        main: state.main.toJS()
    };
}
const mapDispatchToProps = dispatch => ({
    loadCategories: () => dispatch(createAction(Actions.REQUEST_CATEGORIES_LIST))
});

const UploadImageDetails = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        loadCategories: React.PropTypes.func.isRequired,
        main: React.PropTypes.object.isRequired
    },
    componentDidMount: function() {
        this.props.loadCategories();
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
            telescope: '',
            category: ''
        };
    },
    handleField(name, value) {
        this.setState({[name]: value});
    },
    render: function() {
        return (
            <div className="flexbox-images">
                <Col xs={4} md={4}>
                    <h1>Fill image details</h1>
                    <div className="flexbox-images"><Image className="thumbnail-size" src={'/api/image/' + this.props.id + '/thumbnail'} responsive /></div>
                    <CategoryList categories={this.props.main.categories} onChange={ev => this.handleField('category', ev.target.value)} />
                    <GearList data={this.state.data} name="Telescope" onChange={ev => this.handleField('telescope', ev.target.value)} />
                </Col>
            </div>
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
                <FormControl componentClass="select" multiple onChange={this.props.onChange}>
                    {data}
                </FormControl>
            </FormGroup>
        );
    }
});

const CategoryList = React.createClass({
    propTypes: {
        categories: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    render: function() {
        const data = this.props.categories.map(function(category) {
            return (
                <option key={category.id} value={category.id}>{category.name}</option>
            );
        });
        return (
            <FormGroup controlId="formControlsSelect">
                <ControlLabel>Select category</ControlLabel>
                <FormControl componentClass="select" placeholder="select" onChange={this.props.onChange}>
                    <option value="null">--</option>
                    {data}
                </FormControl>
            </FormGroup>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageDetails);

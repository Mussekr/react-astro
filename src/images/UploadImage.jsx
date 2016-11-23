import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Actions from '../constants/actions';
import { createAction } from '../utils/ActionCreator';
import { Maybe } from '../utils/PropTypes';
import { FormGroup, ControlLabel, FormControl, Button, Alert } from 'react-bootstrap';

const mapStateToProps = state => Object.assign(state.users.toJS(), {
    imageLoadingIcon: state.main.get('imageLoadingIcon'),
    categories: state.main.get('categories').toJS()
});
const mapDispatchToProps = dispatch => ({
    requestUserInfo: () => dispatch(createAction(Actions.REQUEST_USER_INFO)),
    loadCategories: () => dispatch(createAction(Actions.REQUEST_CATEGORIES_LIST)),
    onAdd: (image, category, description, name) => dispatch(createAction(Actions.ADD_IMAGE, {
        image,
        category,
        description,
        name
    }))
});

const UploadImage = React.createClass({
    propTypes: {
        requestUserInfo: React.PropTypes.func.isRequired,
        user: Maybe.isRequired,
        onAdd: React.PropTypes.func.isRequired,
        loadCategories: React.PropTypes.func.isRequired,
        imageLoadingIcon: React.PropTypes.bool.isRequired,
        categories: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
    },
    isLoggedIn: function() {
        return this.props.user.isSome();
    },
    componentDidMount: function() {
        this.props.requestUserInfo();
        this.props.loadCategories();
    },
    getInitialState: function() {
        return {
            files: '',
            name: '',
            category: '',
            description: '',
            noFile: false
        };
    },
    onDrop: function (files) {
        this.setState({
            files: files
        });
    },
    handleField: function(field, value) {
        this.setState({
            [field]: value
        });
    },
    onSubmitImage: function(event) {
        event.preventDefault();
        if(this.state.files) {
            this.setState({
                noFile: false
            });
            this.props.onAdd(this.state.files[0], this.state.category, this.state.description, this.state.name);
        } else {
            this.setState({
                noFile: true
            });
        }
    },
    validateCategory: function() {
        if(!this.state.category || this.state.category === 'null') {
            return false;
        } else {
            return true;
        }
    },
    render: function() {
        if(this.isLoggedIn()) {
            return (
                <div>
                <div className="flexbox-images">
                    <h1>Upload new image</h1>
                </div>
                <div className="flexbox-images">
                    <form onSubmit={this.onSubmitImage}>
                        <Dropzone accept="image/*" maxSize={25000000} className="dropzone" onDrop={this.onDrop}>
                            {this.state.files ? <div>
                            <div>{this.state.files.map(file => <img key={Math.random()} className="preview" src={file.preview} />)}</div>
                            </div> : <div>Drop here image or click to select image to upload.</div>}
                        </Dropzone>
                        <br />
                        <NoFileError show={this.state.noFile} />
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <ControlLabel>Image name</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Image name"
                                onChange={ev => this.handleField('name', ev.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                rows={5}
                                placeholder="Brief description of image"
                                onChange={ev => this.handleField('description', ev.target.value)}
                            />
                        </FormGroup>
                        <CategoryList categories={this.props.categories} onChange={ev => this.handleField('category', ev.target.value)} />
                        {this.props.imageLoadingIcon ? <Button type="submit" disabled>Upload <i className="fa fa-spinner fa-pulse fa-fw"></i></Button>
                        : <Button type="submit" disabled={!this.validateCategory()}>Upload</Button>}
                    </form>
                </div>
                </div>
            );
        } else {
            return (
                <div className="flexbox-images"><h1>You have to log in to upload image!</h1></div>
            );
        }
    }
});
const NoFileError = React.createClass({
    propTypes: {
        show: React.PropTypes.bool.isRequired
    },
    render: function() {
        if(this.props.show) {
            return (
                <Alert bsStyle="danger">
                    <strong>Error!</strong> No image found. Please check image field!
                </Alert>
            );
        } else {
            return null;
        }
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
                <FormControl componentClass="select" placeholder="select" onChange={this.props.onChange} required>
                    <option value="null">--</option>
                    {data}
                </FormControl>
            </FormGroup>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage);

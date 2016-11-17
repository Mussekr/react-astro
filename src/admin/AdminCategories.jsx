import './AdminCategories.scss';
import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, Image, FormGroup, FormControl } from 'react-bootstrap';
import { createAction } from '../utils/ActionCreator';
import Actions from '../constants/actions';
import { Maybe } from '../utils/PropTypes';
import moment from 'moment';

const renderCategory = (id, name, changeImage, onDelete) => (
    <tr key={id}>
        <td>{id}</td>
        <td>{name}</td>
        <td><Button bsStyle="info" title="Change image" onClick={changeImage}>Change image</Button></td>
        <td><Button bsStyle="danger" title="Delete this user" onClick={onDelete}>✕</Button></td>
    </tr>
);

const renderAddForm = (onChange, onAdd, validator) => (
    <tr>
        <td></td>
        <td>
            <FormGroup validationState={validator('name') ? 'success' : 'error'}>
                <FormControl
                    name="name"
                    autoFocus
                    required
                    placeholder="Name"
                    onKeyPress={ev => ev.key === 'Enter' ? onAdd() : null}
                    onChange={ev => onChange('name', ev.target.value)}
                />
            </FormGroup>
        </td>
        <td>
            <FormGroup validationState={validator('image') ? 'success' : 'error'}>
                <FormControl
                    type="number"
                    name="image"
                    required
                    placeholder="ID of image"
                    onKeyPress={ev => ev.key === 'Enter' ? onAdd() : null}
                    onChange={ev => onChange('image', ev.target.value)}
                />
            </FormGroup>
        </td>
        <td>
            <Button
                bsStyle="primary"
                onClick={onAdd}
                disabled={!validator('name') || !validator('image')}>
                    Add category
            </Button>
        </td>
    </tr>
);

const AdminCategories = React.createClass({
    propTypes: {
        categories: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        categoriesImages: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        loadCategories: React.PropTypes.func.isRequired,
        requestUserInfo: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        requestCategoryImages: React.PropTypes.func.isRequired,
        onImageChange: React.PropTypes.func.isRequired,
        onCategoryAdd: React.PropTypes.func.isRequired,
        user: Maybe.isRequired
    },
    getDefaultProps: function() {
        return {
            categories: [],
            categoriesImages: []
        };
    },
    getInitialState: function() {
        return {
            showChangeImageModal: false,
            currentId: '',
            name: '',
            image: ''
        };
    },
    componentDidMount: function() {
        this.props.loadCategories();
        this.props.requestUserInfo();
    },
    isAdmin: function() {
        return this.props.user.map(user => user.role === 'admin').orSome(false);
    },
    changeImage: function(id) {
        this.props.requestCategoryImages(id);
        this.setState({showChangeImageModal: true, currentId: id});
    },
    onHideChangeModal: function() {
        this.setState({showChangeImageModal: false});
    },
    onDelete: function(id) {
        if(confirm('Are you sure?')) {
            this.props.onDelete(id);
        }
    },
    validate: function(field) {
        return Boolean(this.state[field]);
    },
    handleOnChange: function(field, value) {
        this.setState({[field]: value});
    },
    onSubmit: function() {
        this.props.onCategoryAdd(this.state.name, this.state.image);
    },
    render: function() {
        if(this.isAdmin()) {
            return (
                <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.categories.map(category =>
                            renderCategory(category.id, category.name, () => this.changeImage(category.name), () => this.onDelete(category.id))
                        )}
                        {renderAddForm(this.handleOnChange, this.onSubmit, this.validate)}
                    </tbody>
                </Table>
                <ChangeImageModal show={this.state.showChangeImageModal} onHide={this.onHideChangeModal} categoriesImages={this.props.categoriesImages}
                categoryName={this.state.currentId} updateFunc={this.props.onImageChange} />
                </div>
            );
        } else {
            return (
                <h1>Insufficient privileges</h1>
            );
        }
    }
});

const ChangeImageModal = React.createClass({
    propTypes: {
        show: React.PropTypes.bool.isRequired,
        onHide: React.PropTypes.func.isRequired,
        categoriesImages: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
        updateFunc: React.PropTypes.func.isRequired,
        categoryName: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            selectedImage: ''
        };
    },
    selectImage: function(id) {
        this.setState({selectedImage: id});
    },
    render: function() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Select thumbnail image for category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flexbox-images">
                        {this.props.categoriesImages.map(image =>
                            <ImageThumbnailChange key={image.id} image={image.id} selected={this.state.selectedImage === image.id}
                            onClick={() => this.selectImage(image.id)} author={image.username}
                            name={image.name} date={moment(image.created).fromNow()} />)}
                    </div>
                    <Button disabled={Boolean(!this.state.selectedImage)}
                    onClick={() => this.props.updateFunc(this.props.categoryName, this.state.selectedImage)} bsStyle="success">Save</Button>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Body>
            </Modal>
        );
    }
});

const ImageThumbnailChange = React.createClass({
    displayName: 'Image',
    propTypes: {
        image: React.PropTypes.number.isRequired,
        author: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        date: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool.isRequired
    },
    render: function() {
        return (
            <figure className={this.props.selected ? 'imghvr-shutter-out-vert img-responsive img-thumbnail img-selected'
            : 'imghvr-shutter-out-vert img-responsive img-thumbnail'} onClick={this.props.onClick}>
                <Image className="thumbnail-size" src={'/api/image/' + this.props.image + '/thumbnail'} responsive />
                <figcaption>
                    <li>{this.props.author}</li>
                    <li>{this.props.name}</li>
                    <li>{this.props.date}</li>
                </figcaption>
            </figure>
        );
    }
});

const mapStateToProps = state => Object.assign(state.main.toJS(), {user: state.users.get('user')});
const mapDispatchToProps = dispatch => ({
    loadCategories: () => dispatch(createAction(Actions.REQUEST_CATEGORIES_LIST)),
    requestUserInfo: () => dispatch(createAction(Actions.REQUEST_USER_INFO)),
    onDelete: id => dispatch(createAction(Actions.DELETE_CATEGORY, {id: id})),
    requestCategoryImages: id => dispatch(createAction(Actions.REQUEST_CATEGORIES_IMAGES_LIST, {id: id})),
    onImageChange: (id, image) => dispatch(createAction(Actions.UPDATE_CATEGORY_IMAGE, {id: id, image: image})),
    onCategoryAdd: (name, image) => dispatch(createAction(Actions.ADD_CATEGORY, {name: name, image: image}))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategories);

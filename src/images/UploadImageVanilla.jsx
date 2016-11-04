import React from 'react';
import { connect } from 'react-redux';
import Actions from '../constants/actions';
import { createAction } from '../utils/ActionCreator';
import { Maybe } from '../utils/PropTypes';
import { FormGroup, ControlLabel, FormControl, Button, Alert } from 'react-bootstrap';

const mapStateToProps = state => state.main.toJS();
const mapDispatchToProps = dispatch => ({
    requestUserInfo: () => dispatch(createAction(Actions.REQUEST_USER_INFO)),
    onAdd: (image, name) => dispatch(createAction(Actions.ADD_IMAGE, {
        image,
        name
    }))
});

const UploadImageVanilla = React.createClass({
    propTypes: {
        requestUserInfo: React.PropTypes.func.isRequired,
        user: Maybe.isRequired,
        onAdd: React.PropTypes.func.isRequired
    },
    isLoggedIn: function() {
        return this.props.user.isSome();
    },
    componentDidMount: function() {
        this.props.requestUserInfo();
    },
    getInitialState: function() {
        return {
            file: '',
            imagePreviewUrl: '',
            name: '',
            noFile: false
        };
    },
    handleImageChange: function (event) {
        event.preventDefault();
        const reader = new FileReader();
        const file = event.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };
        reader.readAsDataURL(file);
    },
    handleNameChange: function(event) {
        this.setState({
            name: event.target.value
        });
    },
    onSubmitImage: function(event) {
        event.preventDefault();
        if(this.state.file) {
            this.setState({
                noFile: false
            });
            this.props.onAdd(this.state.file, this.state.name);
        } else {
            this.setState({
                noFile: true
            });
        }
    },
    render: function() {
        if(this.isLoggedIn()) {

            const {imagePreviewUrl} = this.state;
            let $imagePreview = null;
            if (imagePreviewUrl) {
                $imagePreview = <img className="preview" src={imagePreviewUrl} />;
            } else {
                $imagePreview = <div className="preview">Please select an Image for Preview</div>;
            }
            return (
                <div>
                <div className="flexbox-images">
                    <h1>Upload new image</h1>
                </div>
                <div className="flexbox-images">
                    <form onSubmit={this.onSubmitImage} encType="multipart/form-data">
                        <input className="fileInput" type="file" onChange={event => this.handleImageChange(event)} />
                        <br />
                        {$imagePreview}
                        <NoFileError show={this.state.noFile} />
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <ControlLabel>Image name</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Image name"
                                onChange={this.handleNameChange}
                                required
                            />
                        </FormGroup>
                        <Button type="submit">
                            Upload
                        </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageVanilla);

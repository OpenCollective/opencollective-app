import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import isFunction from 'lodash/lang/isFunction';

class ImageUpload extends Component {

  constructor(props) {
    super(props);
    this.state = { isUploading: false, file: {} };
  }

  render() {
    const {customClassName } = this.props;
    const isUploading = this.state.isUploading;

    return (
      <div className={customClassName || 'ImageUpload'} onClick={this.clickInput.bind(this, isUploading)}>
        { this.content({...this.props, file: this.state.file}) }
        <span>
          <input type='file' name='file' ref='file' className='ImageUpload-input' onChange={this.handleChange.bind(this)} />
        </span>
      </div>
    );
  }

  content({value, file, isUploading, uploading, template}) {

    const defaultTemplate = isFunction(template) ? template : () => (
        <div className={className}>
          <img src={imgsrc} />
        <label>{label}</label>
        </div>
    );

    const uploadingTemplate = isFunction(uploading) ? uploading : defaultTemplate;

    let className='placeholder';
    let imgsrc = '/static/images/uploading.png';
    let label = 'Upload receipt (photo or PDF)';

    if (value) {
      if (value.match(/\.pdf$/)) {
        imgsrc = '/static/images/mime-pdf.png';
        label = file.name;
      } else {
        imgsrc = value;
        label = ''
        className = 'imagePreview';
      }
    }

    if (isUploading) {
      label = 'Uploading...';
      return uploadingTemplate();
    } else {
      return defaultTemplate();
    }

  }

  handleChange() {
    const { onFinished, uploadImage } = this.props;
    const file = ReactDOM.findDOMNode(this.refs.file).files[0];

    const formData = new FormData();
    formData.append('file', file);

    this.setState({
      file,
      isUploading: true
    });

    uploadImage(formData)
    .then(res => onFinished(res.response))
    .then(() => this.setState({
      isUploading: false
    }))

  }

  clickInput(isUploading) {
    if (!isUploading) {
      ReactDOM.findDOMNode(this.refs.file).click();
    }
  }
}

ImageUpload.propTypes = {
  onFinished: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  value: PropTypes.string,
};


export default ImageUpload;

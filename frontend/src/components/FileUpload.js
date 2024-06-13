import React from 'react';
import axios from 'axios';

class JsonFileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null, 
            filename: ''
        };
    }

    onFileChange = event => {
        const file = event.target.files[0]
        this.setState({ selectedFile: file, fileName: file.name });
    };

    productUpdate = (products) => {
        const { updateProducts } = this.props;
        for (const key in products) {
            if (products.hasOwnProperty(key)) {
                updateProducts(key, products[key])
            }
        }
    }

    optionUpdate = (options) => {
        const { updateOptions } = this.props;
        for (const option in options) {
            updateOptions(option)
        }
    }

    onFileUpload = () => {
        const { selectedFile } = this.state;
        const formData = new FormData();
        formData.append('file', selectedFile);

        axios.post('/upload-json', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('File uploaded successfully', response.data);
            this.optionUpdate(response.data.allOptions)
            this.productUpdate(response.data.allProducts)
        })
        .catch(error => {
            console.error('There was an error uploading the file', error);
        });
    };

    render() {
        const {fileName} = this.state;
        return (
            <div>
                <h2>Upload your own JSON file:</h2>
                <input type="file" onChange={this.onFileChange} accept=".json" />
                <button onClick={this.onFileUpload}>Upload</button>
            </div>
        )
    }
}

export default JsonFileUpload
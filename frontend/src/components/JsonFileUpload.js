import React from 'react';

class JsonFileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    onFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target.result);
                    if (Array.isArray(content)) {
                        this.setState({ error: ''});
                        this.props.onFileUpload(content);
                        this.props.uploaded();
                    } else {
                        this.setState({ fileContent: null, error: 'Uploaded file is invalid.'});
                    }
                } catch (err) {
                    this.setState({ fileContent: null, error: 'Invalid JSON format.' });
                }
            };
            reader.readAsText(file);
        }
    }


    render() {
        const { error } = this.state;

        return (
            <div>
                <h2>Upload a JSON File: </h2>
                <input type="file" onChange={this.onFileChange} accept=".json" />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        )
    }
}

export default JsonFileUpload;
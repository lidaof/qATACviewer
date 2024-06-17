import React from 'react';

class UrlFetcher extends React.Component {
    componentDidMount() {
        const queryParams = new URLSearchParams(window.location.search); 
        const dataSourceUrl = queryParams.get('dataSrouce');

        if (dataSourceUrl) {
            fetch(dataSourceUrl)
                .then(response => response.json())
                .then(data => {
                    this.props.onDataFetch(data);
                    this.props.setUrl();
                })
                .catch(error => {
                    this.props.onError('Error fetching the JSON file');
                    console.error('Error fetching the JSON data', error);
                })
        }
    }

    render() {
        return (
            <div>
                <h2>Fetched Data</h2>
            </div>
        )
    }
}

export default UrlFetcher;
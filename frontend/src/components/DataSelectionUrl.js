import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import UrlFetcher from './UrlFetcher';

const columns = [{
    dataField: 'id', 
    text: 'ID'
}, {
    dataField: 'assay', 
    text: 'Assay'
}, {
    dataField: 'sample', 
    text: 'Sample'
}]

class DataSelectionUrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [], 
            error: null, 
            selectedGenome: 'mm10', 
            urlArray: [],
            selectedOptions: [], 
        }
    }

    renderError() {
        return (
            <div>
                Something went wrong: {this.state.error.message}
            </div>
        )
    }

    handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState(() => ({
                selected: [...this.state.selected, row.id]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row.id)
            }));
        }
        this.props.onHandleChange(this.state.selectedUploads);
        this.props.onNewSelection(row, isSelect);
    }

    handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r.id);
        if (isSelect) {
            this.setState(() => ({
                selected: ids,
            }));
        } else {
            this.setState(() => ({
                selected: []
            }));
        }
        this.props.onAllSelection(isSelect, rows);
    }

    handleClick = () => {
        this.props.onHandleClick();
    }

    handleError = (error) => {
        this.setState({ error })
    };

    handleGenomeChange = (selectedOption) => {
        this.setState({selectedGenome: selectedOption.value})
        this.props.changeGenome(selectedOption.value);
    }

    handleUrlFetch = (data) => {
        this.setState({ data });
    }

    setUrl = () => {
        this.setState({ hasUrl: true })
        this.props.onHandleChange(this.state.urlArray)
    }

    renderSelection() {
        const { urlArray } = this.state;
        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            bgColor: '#00BFFF',
            selected: this.state.selected,
            onSelect: this.handleOnSelect,
            onSelectAll: this.handleOnSelectAll
        }

        return (
            <div>
                <div>
                    <UrlFetcher onUrlFetch={this.handleUrlFetch} onError={this.handleError} setUrl={this.setUrl}/> 
                    <BootstrapTable
                        keyField='id'
                        data={ urlArray }
                        columns={ columns }
                        selectRow={ selectRow }
                        striped
                        hover
                        condensed
                    />
                </div>
                <h2>Choose genome assembly:</h2>
                        <Select
                        name="genome-field-name"
                        value={this.state.selectedGenome}
                        onChange={this.handleGenomeChange}
                        options={[
                            { value: 'mm10', label: 'Mouse mm10' }, 
                            { value: 'hg19', label: 'Human hg19' },
                            { value: 'hg38', label: 'Human hg38' },
                            { value: 'rn6', label: 'Rat rn6' },
                        ]}
                        />
                <div>
                    {this.props.labels.length > 0 && <p>Current selected: {this.props.labels.join()}</p>}
                </div>
                <div>
                    <button style={{display: this.state.isUploaded ? undefined : "none"}} type="button" className="btn btn-primary" onClick={this.handleClick}>Update</button>
                </div>
            </div>   
        )
    }

    render() {
        return (
            <div>
                {this.renderSelection()}
            </div>
        )
    }

}

export default DataSelectionUrl;
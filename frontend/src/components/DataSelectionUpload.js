import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import JsonFileUpload from './JsonFileUpload';

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

class DataSelectionUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [], // is this one needed?
            selectedValue: null, 
            error: null, 
            allProducts: null, 
            allOptions: null, 
            selectedGenome: 'mm10', 
            uploadedArray: [], 
            selectedUploads: [], 
            isUploaded: false, 
        };
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

    // handleChange = (selectedOption) => {
    //     console.log("handling change")
    //     this.setState({
    //         selectedValue: selectedOption.value, 
    //         selected: []
    //     })
    //     this.props.onHandleChange(this.state.uploadedArray)
    // }

    handleClick = () => {
        this.props.onHandleClick();
    }

    handleGenomeChange = (selectedOption) => {
        this.setState({selectedGenome: selectedOption.value})
        this.props.changeGenome(selectedOption.value);
    }

    handleFileUpload = (fileContent) => {
        this.setState({ uploadedArray: fileContent });
    }

    uploaded = () => {
        this.props.onHandleChange(this.state.uploadedArray)
        this.setState({ isUploaded: true })
    }

    renderSelection() {
        const { uploadedArray } = this.state;
        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            bgColor: '#00BFFF',
            selected: this.state.selected,
            onSelect: this.handleOnSelect,
            onSelectAll: this.handleOnSelectAll
        };

        return (
            <div>
                <div>
                    <JsonFileUpload onFileUpload={this.handleFileUpload} uploaded={this.uploaded}/>
                    {this.state.isUploaded && 
                    <BootstrapTable
                        keyField='id'
                        data={ uploadedArray }
                        columns={ columns }
                        selectRow= { selectRow }
                        striped
                        hover
                        condensed
                    />}
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

export default DataSelectionUpload;
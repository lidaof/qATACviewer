
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import axios from 'axios';
import JsonFileUpload from './JsonFileUpload';

//import {allProducts, allOptions} from '../data';

const DATA = "https://wangftp.wustl.edu/~dli/qATACviewer/data.json";

const columns = [{
    dataField: 'id',
    text: 'ID'
  }, {
    dataField: 'assay',
    text: 'Assay'
  }, {
    dataField: 'sample',
    text: 'Sample'
  }];

class DataSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        selected: [], 
        selectedValue: null,
        loading: true,
        error: null,
        allProducts: null,
        allOptions: null,
        selectedGenome: 'mm10', 
        uploadedArray: [], 
        isUploaded: false,
        selectedUploads: [],
        uploadsSelected: false
    };
  }

  componentDidMount(){
    axios.get(DATA)
      .then((response) => {
        //console.log(response);
        this.setState({
        allProducts: response.data.allProducts, 
        allOptions: response.data.allOptions, 
        loading: false,
        error: null
      })}
    ).catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
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
    this.props.onNewSelection(row, isSelect);
  }

  handleOnSelectUploads = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selectedUploads: [...this.state.selectedUploads, row.id],
        uploadsSelected: true
      }));
    } else {
      this.setState(() => ({
        selectedUploads: this.state.selectedUploads.filter(x => x !== row.id)
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

  handleOnSelectAllUploads = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selectedUploads: ids,
        uploadsSelected: true
      }));
    } else {
      this.setState(() => ({
        selectedUploads: [],
        uploadsSelected: false
      }));
    }
    this.props.onHandleChange(this.state.selectedUploads);
    this.props.onAllSelection(isSelect, rows);
  }

  handleChange = (selectedOption) => {
    //saved options are an array of previously selected products
    console.log("handling change")
    this.setState({ 
      selectedValue: selectedOption.value,
    });
  }

  handleClick = () => {
      this.props.onHandleClick();
  }

  handleGenomeChange = (selectedOption) => {
    this.setState({selectedGenome: selectedOption.value})
    this.props.changeGenome(selectedOption.value);
  }

  handleFileUpload = (fileContent) => {
    this.setState({ uploadedArray: fileContent });
  };

  uploaded = () => {
    this.setState({ isUploaded: true});
  };
  
  renderSelection() {

    const {allOptions, allProducts} = this.state;
    const { uploadedArray } = this.state;
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: '#00BFFF',
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };
    const selectRow2 = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: '#00BFFF',
      selected: this.state.selectedUploads,
      onSelect: this.handleOnSelectUploads,
      onSelectAll: this.handleOnSelectAllUploads
    };
    return (
      <div>
        <div>
          <h2>Choose data source:</h2>
          <Select
            name="form-field-name"
            value={this.state.selectedValue}
            onChange={this.handleChange}
            clearable={false}
            options={allOptions}
          />
        </div>
        <div>
            {this.state.selectedValue &&
            <BootstrapTable
              keyField='id'
              data={ allProducts[this.state.selectedValue] }
              columns={ columns }
              selectRow={ selectRow }
              striped
              hover
              condensed
            />
            }
        </div>
        <div>
            <JsonFileUpload onFileUpload={this.handleFileUpload} uploaded={this.uploaded}/>
            {this.state.isUploaded &&
            <BootstrapTable 
              keyField='id'
              data={ uploadedArray }
              columns= { columns }
              selectRow={ selectRow2 }
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
            {this.props.labels.length > 0 &&
              <p>Current selected: {this.props.labels.join()}</p>
            }
          </div>
        <div>
          <button style={{display: this.state.selectedValue || this.state.uploadsSelected ? undefined : "none"}} type="button" className="btn btn-primary" onClick={this.handleClick}>Update</button>
        </div>
      </div>
    );
  }

  render(){
    const { loading } = this.state;

    return (
      <div>
        {loading ? this.renderLoading() : this.renderSelection()}
      </div>
    );
  }
}

export default DataSelection;

import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {allProducts, allOptions} from '../data';

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
        selectedValue: null
    };
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
    this.props.onNewSlection(row, isSelect);
  }

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
    this.props.onAllSelection(isSelect, rows);
  }

  handleChange = (selectedOption) => {
    this.setState({ 
      selected: [],
      selectedValue: selectedOption.value,
    });
    this.props.onHandleChange(allProducts[selectedOption.value]);
  }

  handleClick = () => {
      this.props.onHandleClick();
  }

  render() {
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
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
          <button style={{display: this.state.selectedValue ? undefined : "none"}} type="button" className="btn btn-primary" onClick={this.handleClick}>Update</button>
        </div>
      </div>
    );
  }
}

export default DataSelection;
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

const columns = [{
  dataField: 'id',
  text: 'ID'
}, {
  dataField: 'name',
  text: 'Name'
}, {
  dataField: 'sample',
  text: 'Sample'
}];

const products = [
  {id:0,name:'GM-AM-6S-GM-172',sample:'Liver',file:'GM-AM-6S-GM-172_S1_L007_R1_001_report.txt'},
  {id:1,name:'GM-AM-6S-GM-173',sample:'Liver',file:'GM-AM-6S-GM-173_S2_L007_R1_001_report.txt'},
  {id:2,name:'GM-AM-6S-GM-174',sample:'Liver',file:'GM-AM-6S-GM-174_S3_L007_R1_001_report.txt'},
  {id:3,name:'GM-AM-6S-GM-175',sample:'Liver',file:'GM-AM-6S-GM-175_S4_L007_R1_001_report.txt'},
  {id:4,name:'GM-AM-6S-GM-176',sample:'Lung',file:'GM-AM-6S-GM-176_S5_L007_R1_001_report.txt'},
  {id:5,name:'GM-AM-6S-GM-177',sample:'Lung',file:'GM-AM-6S-GM-177_S6_L007_R1_001_report.txt'},
];

class App extends Component {
    constructor(props) {
      super(props);
      this.state = { value: [], data:null };
      this.handleClick = this.handleClick.bind(this);
    }

  async handleClick() {
    //let req = this.state.value.join();
    //let response = await axios.get(`/report/${req}`);
    let response = await axios.post('/rep',{flist: this.state.value});
    this.setState({data: response.data});
  }

   render() {
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: '#00BFFF',
      onSelect: (row, isSelect, rowIndex) => {
        //console.log(row);
        let newValue = [...this.state.value];
        if(isSelect){
          if (!newValue.includes(row.file)){
            newValue.push(row.file)
          }
        }else{
          if (newValue.includes(row.file)){
            let index = newValue.indexOf(row.file);
            if (index > -1) {
              newValue.splice(index, 1);
            }
          }
        }
        this.setState({value: newValue});
      },
      onSelectAll: (isSelect, results) => {
        if(isSelect){
          let newValue = [];
          for(let row of results){
            newValue.push(row.file);
          }
          this.setState({value: newValue});
        }else{
          this.setState({value:[]});
        }
      }
    };
    return (
      <div>
        <div>
          <BootstrapTable
            keyField='id'
            data={ products }
            columns={ columns }
            selectRow={ selectRow }
            striped
            hover
            condensed
          />
        </div>
        <div>
          <p className="lead">Current selected: {this.state.value.join()} </p>
          <button type="button" className="btn btn-primary" onClick={this.handleClick}>Update</button>
        </div>
        {this.state.data &&
          <div>
            <h1>Mapping</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data.mapping}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="Total reads" fill="#a6cee3" />
                  <Bar dataKey="Mapped reads" fill="#1f78b4" />
                  <Bar dataKey="Non-redundant uniquely mapped reads" fill="#b2df8a" />
                  <Bar dataKey="Useful reads" fill="#33a02c" />
              </BarChart>
            </div>
            <h1>chrM rate</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data['chrM rate']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="Percentage of uniquely mapped reads in chrM" fill="#a6cee3" />
                  <Bar dataKey="Percentage of reads in chrX" fill="#1f78b4" />
              </BarChart>
            </div>
            <h1>Library Complexity</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data['library complexity']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="Before alignment library duplicates percentage" fill="#a6cee3" />
                  <Bar dataKey="After alignment PCR duplicates percentage" fill="#1f78b4" />
              </BarChart>
            </div>
            <h1>Enrichment</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data['enrichment']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="Useful reads ratio" fill="#a6cee3" />
                  <Bar dataKey="Percentage of background RPKM smaller than 0.3777" fill="#1f78b4" />
              </BarChart>
            </div>
            <h1>Peaks</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data['peaks']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8"/>
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d"/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar yAxisId="left" dataKey="Number of peaks" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="Reads under peaks ratio" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
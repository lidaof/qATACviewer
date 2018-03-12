import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis} from 'recharts';
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
  {id:0,name:'GM-AM-6S-GM-172',sample:'Liver',file:'GM-AM-6S-GM-172_S1_L007_R1_001.json'},
  {id:1,name:'GM-AM-6S-GM-173',sample:'Liver',file:'GM-AM-6S-GM-173_S2_L007_R1_001.json'},
  {id:2,name:'GM-AM-6S-GM-174',sample:'Liver',file:'GM-AM-6S-GM-174_S3_L007_R1_001.json'},
  {id:3,name:'GM-AM-6S-GM-175',sample:'Liver',file:'GM-AM-6S-GM-175_S4_L007_R1_001.json'},
  {id:4,name:'GM-AM-6S-GM-176',sample:'Lung',file:'GM-AM-6S-GM-176_S5_L007_R1_001.json'},
  {id:5,name:'GM-AM-6S-GM-177',sample:'Lung',file:'GM-AM-6S-GM-177_S6_L007_R1_001.json'},
];

class App extends Component {
    constructor(props) {
      super(props);
      this.state = { value: [], data:null };
      this.handleClick = this.handleClick.bind(this);
      this.renderTooltip = this.renderTooltip.bind(this);
    }

  async handleClick() {
    //let req = this.state.value.join();
    //let response = await axios.get(`/report/${req}`);
    //let response = await axios.post('/rep',{flist: this.state.value});
    let response = await axios.post('/rep1',{flist: this.state.value});
    this.setState({data: response.data});
  }

  renderTooltip(props) {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div style={{ backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
          <p>{data.chromosome}</p>
          <p><span>value: </span>{data.value}</p>
        </div>
      );
    }

    return null;
  }

   render() {
    const domain = [0,0.08];
    const range = [16, 225];
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
              <BarChart width={1200} height={400} data={this.state.data['mapping_stats']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="total_reads" fill="#a6cee3" />
                  <Bar dataKey="mapped_reads" fill="#1f78b4" />
                  <Bar dataKey="non-redundant_mapped_reads" fill="#b2df8a" />
                  <Bar dataKey="useful_reads" fill="#33a02c" />
              </BarChart>
            </div>
            <h1>Mapping distribution</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data['mapping_distribution']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="percentage_of_uniquely_mapped_reads_in_chrM" fill="#a6cee3" />
                  <Bar dataKey="percentage_of_non-redundant_uniquely_mapped_reads_in_chrX" fill="#1f78b4" />
                  <Bar dataKey="percentage_of_non-redundant_uniquely_mapped_reads_in_chrY" fill="#b2df8a" />
              </BarChart>
            </div>
          <h3>Autosome mapping distribution</h3>
          <div>
          
          {
            
            Object.entries(this.state.data['autosome_distribution']).map((entry, entryIdx) =>{
            const fontSize = entryIdx === Object.entries(this.state.data['autosome_distribution']).length - 1 ? 14 : 0;
            return <ScatterChart width={1000} height={60} margin={{ top: 10, right: 0, bottom: 0, left: 100 }} key={entryIdx}>
              <XAxis type="category" dataKey="chromosome" interval={0} tick={{ fontSize: fontSize }} tickLine={{ transform: 'translate(0, -6)' }} />
              <YAxis type="number" dataKey="index" name={entry[0]} height={10} width={80} tick={false} tickLine={false} axisLine={false} label={{ value: entry[0], position: 'insideRight' }} />
              <ZAxis type="number" dataKey="value" domain={domain} range={range} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
              <Scatter data={entry[1]} fill='#8884d8' />
            </ScatterChart>
          })
          } 
          </div>

            <h1>Library Complexity</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data['library_complexity']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="before_alignment_library_duplicates_percentage" fill="#a6cee3" />
                  <Bar dataKey="after_alignment_PCR_duplicates_percentage" fill="#1f78b4" />
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
                  <Bar dataKey="enrichment_ratio_in_coding_promoter_regions" fill="#a6cee3" />
                  <Bar dataKey="percentage_of_background_RPKM_larger_than_0.3777" fill="#1f78b4" />
              </BarChart>
            </div>
            <h1>Peaks</h1>
            <div>
              <BarChart width={1200} height={400} data={this.state.data['peak_analysis']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8"/>
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d"/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar yAxisId="left" dataKey="reads_number_under_peaks" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="reads_percentage_under_peaks" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
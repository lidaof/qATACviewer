import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '', data:null };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    componentWillMount() {
      axios
      .get('/report/GM-AM-6S-GM-172_S1_L007_R1_001_report.txt,GM-AM-6S-GM-174_S3_L007_R1_001_report.txt,GM-AM-6S-GM-173_S2_L007_R1_001_report.txt')
      .then(res => this.setState({ data: res.data }))
      .catch(err => console.log(err))
  }

   render() {
     //console.log(this.state);
    return (
      <div>
        
    <form onSubmit={this.handleSubmit}>
      <label>
        Choose your samples:
        <select multiple={true} value={this.state.value} onChange={this.handleChange}>
            <option value="GM-AM-6S-GM-172_S1_L007_R1_001_report.txt">GM-AM-6S-GM-172</option>
            <option value="GM-AM-6S-GM-174_S3_L007_R1_001_report.txt">GM-AM-6S-GM-174</option>
            <option value="GM-AM-6S-GM-173_S2_L007_R1_001_report.txt">GM-AM-6S-GM-173</option>
          </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
    
    {this.state.data &&
      <div>
        <h1>Mapping</h1>
        <div>
          <BarChart width={800} height={400} data={this.state.data.mapping}
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
          <BarChart width={800} height={400} data={this.state.data['chrM rate']}
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
          <BarChart width={800} height={400} data={this.state.data['library complexity']}
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
          <BarChart width={800} height={400} data={this.state.data['enrichment']}
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
          <BarChart width={800} height={400} data={this.state.data['peaks']}
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
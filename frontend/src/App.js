import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine, LineChart, Line} from 'recharts';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {allProducts, allOptions} from './data';

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


const fileColors = {
'GM-AM-6S-GM-172_S1_L007_R1_001.json':'#b2182b',
'GM-AM-6S-GM-173_S2_L007_R1_001.json':'#ef8a62',
'GM-AM-6S-GM-174_S3_L007_R1_001.json':'#fddbc7',
'GM-AM-6S-GM-175_S4_L007_R1_001.json':'#d1e5f0',
'GM-AM-6S-GM-176_S5_L007_R1_001.json':'#67a9cf',
'GM-AM-6S-GM-177_S6_L007_R1_001.json':'#2166ac'
};



class App extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        value: [], 
        data: null,
        radioChecked: {
          mapping: 'useful',
          enrich: 'enrichment_ratio_in_coding_promoter_regions'
        },
        chartHeight: 400,
        chartWidth: 1000,
        selectedOption: '',
        products: null,
        error: [],
        noDataFromAPI: false
      };
      this.handleClick = this.handleClick.bind(this);
      this.renderTooltip = this.renderTooltip.bind(this);
      this.hubGenerator = this.hubGenerator.bind(this);
      this.handleRadioChange = this.handleRadioChange.bind(this);
      this.handleWidthChange = this.handleWidthChange.bind(this);
      this.handleHeightChange = this.handleHeightChange.bind(this);
    }

  async handleClick() {
    //let req = this.state.value.join();
    //let response = await axios.get(`/report/${req}`);
    //let response = await axios.post('/rep',{flist: this.state.value});
    let response = await axios.post('/rep1',{flist: this.state.value});
    if (response.data.error){
      if(response.data.error.length === this.state.value.length){
        this.setState({noDataFromAPI: true});
      }
      let fvalue = [...this.state.value];
      this.setState({value: _.without(fvalue, ...response.data.error), error: response.data.error});
      
    }
    this.setState({data: response.data});
    
    //file the encode standards
    // let ref = {
    //   mapping: {
    //     total: {
    //       good: this.state.data.ref.mapping.total.mean,
    //       ok: this.state.data.ref.mapping.total.mean - this.state.ref.mapping.total.sd
    //     },
    //     mapped: {
    //       good: this.state.data.ref.mapping.mapped.mean,
    //       ok: this.state.data.ref.mapping.mapped.mean - this.state.ref.mapping.mapped.sd
    //     },
    //     nonredant: {
    //       selected: false,
    //       good: this.state.data.ref.mapping.nonredant.mean,
    //       ok: this.state.data.ref.mapping.nonredant.mean - this.state.ref.mapping.nonredant.sd
    //     },
    //     useful: {
    //       good: this.state.data.ref.mapping.useful.mean,
    //       ok: this.state.data.ref.mapping.useful.mean - this.state.ref.mapping.useful.sd
    //     }
    //   }
    // }
    // this.setState({ref: ref});
    const frame = document.getElementById('frame');
    frame.contentWindow.drawBrowser(this.hubGenerator(this.state.products, this.state.value));
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

  hubGenerator(products, filterlist){
    let hub = {};
    hub.genome='mm10';
    let content = [];
    let samples = [];
    let assays = [];
    products.forEach(product => {
      if(filterlist.includes(product.file)){
        content.push({
          type:'bigWig',
          mode:'show',
          url: product.url,
          height:40,
          name: product.name || `${product.assay} of ${product.sample}`, //use name should
          metadata: [product.sample, product.assay]
        });
        samples.push(product.sample);
        assays.push(product.assay);
      }
    });
    content.push({"type":"native_track","list":[{"name":"refGene","mode":"full"}]});
    content.push({
      type:'metadata',
      vocabulary: {
        sample: {samples: _.uniq(samples)},
        assay: {assays: _.uniq(assays)}
      },
      show: ['sample','assay']
    });
    hub.content = content;
    //console.log(hub);
    return hub
  }

  /**
   * 
   * @param {object} a  say a.chromosome = chr1, 
   * @param {object} b  say b.chromosome = chr2
   */
  sortChromosome(a, b){
    return Number.parseInt(a.chromosome.replace('chr',''), 10) - Number.parseInt(b.chromosome.replace('chr',''), 10);
  }

  handleRadioChange(e) {
    const checked = {...this.state.radioChecked};
    const {name, value} = e.target;
    checked[name] = value;
    this.setState({radioChecked: checked});
  }

  handleWidthChange = (event) => {
    this.setState({ chartWidth: Number.parseInt(event.target.value, 10) });
  };

  handleHeightChange = (event) => {
    this.setState({ chartHeight: Number.parseInt(event.target.value, 10) });
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption: selectedOption, products: allProducts[selectedOption.value] });
    // console.log(`Selected: ${selectedOption.label}`);
    // console.log(allProducts[selectedOption.value]);
    // console.log(this.state.selectedOption);
  }

   render() {
    if(this.state.noDataFromAPI){
      return <div className="lead alert alert-danger">Error! No report could be loaded from the selected datasets!</div>
    }
    let domain = [0,0.08];
    if (this.state.data) {
      domain = [0, _.max(_.map( _.map(this.state.data["autosome_distribution"], function(n) { return _.maxBy(n, 'value') } ), 'value' ))];
    }
    let mapping_good = 0, mapping_ok=0; // mapping
    let after_good = 0, after_ok = 0; //after_alignment_PCR_duplicates_percentage
    let peakpct_good = 0, peakpct_ok = 0; //reads_percentage_under_peaks
    let bk_good = 0, bk_ok = 0; //percentage_of_background_RPKM_larger_than_0.3777
    let enrich_good = 0, enrich_ok = 0; // enrichment
    let peakpct_domain = [0,0.5];
    let bk_domain = [0,0.5];
    let map_domain = [0,55000000];
    let after_domain = [0,0.3];
    if(this.state.data && this.state.data.ref){
      mapping_good = Math.round(this.state.data.ref.mapping[this.state.radioChecked.mapping].mean);
      mapping_ok = Math.round(this.state.data.ref.mapping[this.state.radioChecked.mapping].mean - this.state.data.ref.mapping[this.state.radioChecked.mapping].sd);
      after_good = this.state.data.ref['library_complexity']['after'].mean;
      after_ok = this.state.data.ref['library_complexity']['after'].mean + this.state.data.ref['library_complexity']['after'].sd
      peakpct_good = this.state.data.ref['peak_analysis']['reads_percentage_under_peaks'].mean;
      peakpct_ok = this.state.data.ref['peak_analysis']['reads_percentage_under_peaks'].mean - this.state.data.ref['peak_analysis']['reads_percentage_under_peaks'].sd;
      bk_good = this.state.data.ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'].mean;
      bk_ok = this.state.data.ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'].mean + this.state.data.ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'].sd;
      enrich_good = this.state.data.ref.enrichment[this.state.radioChecked.enrich].mean;
      enrich_ok = this.state.data.ref.enrichment[this.state.radioChecked.enrich].mean - this.state.data.ref.enrichment[this.state.radioChecked.enrich].sd;
      peakpct_domain = [0, _.max(_.flatten([this.state.data['peak_analysis']['reads_percentage_under_peaks'],peakpct_good]))];
      bk_domain = [0, _.max(_.flatten([this.state.data['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'],bk_ok]))];
      map_domain = [0, _.max(_.flatten([this.state.data['mapping_stats']['total_reads'], mapping_good]))];
      after_domain = [0, _.max(_.flatten([this.state.data['library_complexity']['after_alignment_PCR_duplicates_percentage'], after_ok]))];

    }
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
    //dropdown data selection
    // const { selectedOption } = this.state;
    // const datValue = selectedOption && selectedOption.value;
    // const products = allProducts[datValue];
    return (
      <div>
        <div>
          <h2>Choose data source:</h2>
          <Select
            name="form-field-name"
            value={this.state.selectedOption.value}
            onChange={this.handleChange}
            clearable={false}
            options={allOptions}
          />
        </div>
        <div>
          {
            this.state.products &&
            <BootstrapTable
              keyField='id'
              data={ this.state.products }
              columns={ columns }
              selectRow={ selectRow }
              striped
              hover
              condensed
            />
          }
          
        </div>
        <div>
          <p className="lead">Current selected: {this.state.value.join()} </p>
          <button type="button" className="btn btn-primary" onClick={this.handleClick}>Update</button>
        </div>
        <div>
        <form>
        <label>
          Chart width:
          <input type="text" name="chartwidth" value={this.state.chartWidth} onChange = {this.handleWidthChange} />px
        </label> <br/>
        <label>
          Chart height:
          <input type="text" name="chartheight" value={this.state.chartHeight} onChange = {this.handleHeightChange} />px
        </label>
      </form>
        </div>
        <div>
          {this.state.error &&
            this.state.error.map((item)=> <div className="lead alert alert-danger">Report {item} is not loaded properly, please check your path and report format.</div>)
          }
        </div>
        {this.state.data &&
          <div>
            <h1>Mapping</h1>
            <div className="row">
              <div className="lead col-md-2">Set ENCODE standards based on: </div>
            <div className="col-md-2">
            <label>
              Total reads: 
              <input type="radio" name="mapping"  value="total" checked={this.state.radioChecked.mapping === 'total'} onChange={this.handleRadioChange} />
            </label>
            </div>
            <div className="col-md-2">
            <label>
              Mapped reads: 
              <input type="radio" name="mapping" value="mapped" checked={this.state.radioChecked.mapping === 'mapped'} onChange={this.handleRadioChange} />
            </label>
            </div>
            <div className="col-md-2">
            <label>
              Uniquely mapped reads: 
              <input type="radio" name="mapping" value="unimap" checked={this.state.radioChecked.mapping === 'unimap'} onChange={this.handleRadioChange} />
            </label>
            </div>
            <div className="col-md-2">
            <label>
            Non-redundant Mapped_reads: 
              <input type="radio" name="mapping" value="nonredant" checked={this.state.radioChecked.mapping === 'nonredant'} onChange={this.handleRadioChange} />
            </label>
            </div>
            <div className="col-md-2">
            <label>
              Useful reads: 
              <input type="radio" name="mapping" value="useful" checked={this.state.radioChecked.mapping === 'useful'} onChange={this.handleRadioChange} />
            </label>
            </div>
          </div>
          <div className="lead">Good: {mapping_good}, Acceptable: {mapping_ok}</div>
            <div>
              <BarChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['mapping_stats']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis domain={map_domain} />
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="total_reads" fill="#a6cee3" />
                  <Bar dataKey="mapped_reads" fill="#1f78b4" />
                  <Bar dataKey="uniquely_mapped_reads" fill="#a8ddb5" />
                  <Bar dataKey="non-redundant_mapped_reads" fill="#b2df8a" />
                  <Bar dataKey="useful_reads" fill="#33a02c" />
                  <ReferenceLine y={mapping_good} label="Good" stroke="darkgreen" />
                  <ReferenceLine y={mapping_ok} label="Acceptable" stroke="red" />
              </BarChart>
            </div>
            <h1>chrM rate</h1>
            <div>
              <BarChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['mapping_distribution']}
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
          <h2>Autosome mapping distribution</h2>
            <div>     
            {
              Object.entries(this.state.data['autosome_distribution']).map((entry, entryIdx) =>{
              const fontSize = entryIdx === Object.entries(this.state.data['autosome_distribution']).length - 1 ? 14 : 0;
              return <ScatterChart width={this.state.chartWidth} height={60} margin={{ top: 10, right: 0, bottom: 0, left: 100 }} key={entryIdx} >
                <XAxis type="category" dataKey="chromosome" interval={0} tick={{ fontSize: fontSize }} tickLine={{ transform: 'translate(0, -6)' }} />
                <YAxis type="number" dataKey="index" name={entry[0]} height={10} width={80} tick={false} tickLine={false} axisLine={false} label={{ value: entry[0], position: 'insideRight' }} />
                <ZAxis type="number" dataKey="value" domain={domain} range={range} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
                <Scatter data={entry[1].sort(this.sortChromosome)} fill='#8884d8' />
              </ScatterChart>
            })
            } 
            </div>
          <h1>Library Complexity</h1>
          <div className="lead">Encode standards for after_alignment_PCR_duplicates_percentage: Good: {after_good}, Acceptable: {after_ok}</div>
            <div>
              <BarChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['library_complexity']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis domain={after_domain}/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="before_alignment_library_duplicates_percentage" fill="#a6cee3" />
                  <Bar dataKey="after_alignment_PCR_duplicates_percentage" fill="#1f78b4" />
                  <ReferenceLine y={after_good} label="Good" stroke="darkgreen" />
                  <ReferenceLine y={after_ok} label="Acceptable" stroke="red" />
              </BarChart>
            </div>
            <h1>Insert size distribution</h1>
            <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['insert_distribution']}
              margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              {
                _.without(Object.keys(this.state.data['insert_distribution'][0]), 'name').map(entry => {
                  return <Line type='monotone' dot={false} dataKey={entry} stroke={fileColors[entry]} fill={fileColors[entry]} key={entry} />
                })
              }
            </LineChart>
            <h1>Enrichment</h1>
            <div className="row">
              <div className="lead col-md-2">Set ENCODE standards based on: </div>
            <div className="col-md-3">
            <label>
            enrichment_ratio_in_coding_promoter_regions: 
              <input type="radio" name="enrich"  value="enrichment_ratio_in_coding_promoter_regions" checked={this.state.radioChecked.enrich === 'enrichment_ratio_in_coding_promoter_regions'} onChange={this.handleRadioChange} />
            </label>
            </div>
            <div className="col-md-3">
            <label>
            subsampled_10M_enrichment_ratio: 
              <input type="radio" name="enrich" value="subsampled_10M_enrichment_ratio" checked={this.state.radioChecked.enrich === 'subsampled_10M_enrichment_ratio'} onChange={this.handleRadioChange} />
            </label>
            </div>
            
          </div>
          <div className="lead">Good: {enrich_good}, Acceptable: {enrich_ok}</div>
            <div>
              <BarChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['enrichment']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="enrichment_ratio_in_coding_promoter_regions" fill="#a6cee3" />
                  <Bar dataKey="subsampled_10M_enrichment_ratio" fill="#666" />
                  <ReferenceLine y={enrich_good} label="Good" stroke="darkgreen" />
                  <ReferenceLine y={enrich_ok} label="Acceptable" stroke="red" />
              </BarChart>
            </div>
            <h1>Background</h1>
            <div className="lead">Encode standards for percentage_of_background_RPKM_larger_than_0.3777: Good: {bk_good}, Acceptable: {bk_ok}</div>
            <div>
              <BarChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['enrichment']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis domain={bk_domain} />
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="percentage_of_background_RPKM_larger_than_0.3777" fill="#1f78b4" />
                  <ReferenceLine y={bk_good} label="Good" stroke="darkgreen" />
                  <ReferenceLine y={bk_ok} label="Acceptable" stroke="red" />
              </BarChart>
            </div>
            <h1>Yield distribution</h1>
            <h2>expected distinction</h2>
            <div>
            <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['yield_distro']}
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {
                _.without(Object.keys(this.state.data['yield_distro'][0]), 'name').map(entry => {
                  return <Line type="monotone" dataKey={entry} stroke={fileColors[entry]} activeDot={{ r: 8 }} key={entry} />
                })
              }
            </LineChart>
            </div>
            <h2>lower 0.95 confidnece interval</h2>
            <div>
            <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['yield_distro_lower']}
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {
                _.without(Object.keys(this.state.data['yield_distro_lower'][0]), 'name').map(entry => {
                  return <Line type="monotone" dataKey={entry} stroke={fileColors[entry]} activeDot={{ r: 8 }} key={entry} />
                })
              }
            </LineChart>
            </div>
            <h2>upper 0.95 confidnece interval</h2>
            <div>
            <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['yield_distro_upper']}
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {
                _.without(Object.keys(this.state.data['yield_distro_upper'][0]), 'name').map(entry => {
                  return <Line type="monotone" dataKey={entry} stroke={fileColors[entry]} activeDot={{ r: 8 }} key={entry} />
                })
              }
            </LineChart>
            </div>
            <h1>Peaks</h1>
            <h2>Peak numbers</h2>
            <div>
              <BarChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['peak_analysis']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8"/>
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d"/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar yAxisId="left" dataKey="reads_number_under_peaks" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="peaks_number_in_promoter_regions" fill="#d73027" />
                  <Bar yAxisId="right" dataKey="peaks_number_in_non-promoter_regions" fill="#fee090" />
              </BarChart>
            </div>
            <h2>Reads percentage under peaks</h2>
            <div className="lead">Encode standards for reads_percentage_under_peaks: Good: {peakpct_good}, Acceptable: {peakpct_ok}</div>
             <div>
              <BarChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['peak_analysis']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis domain={peakpct_domain} />
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Bar dataKey="reads_percentage_under_peaks" fill="#82ca9d" />
                  <ReferenceLine y={peakpct_good} label="Good" stroke="darkgreen" />
                  <ReferenceLine y={peakpct_ok} label="Acceptable" stroke="red" />
              </BarChart>
            </div>
            <h2>Peak size distribution</h2>
            <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['peak_distribution']}
              margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              {
                _.without(Object.keys(this.state.data['peak_distribution'][0]), 'name').map(entry => {
                  return <Line type='monotone' dot={false} dataKey={entry} stroke={fileColors[entry]} fill={fileColors[entry]} key={entry} />
                })
              }
            </LineChart>
            <h1>Saturation</h1>
            <h2>saturation by peaks number</h2>
            <div>
            <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['saturation_peaks']}
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {
                _.without(Object.keys(this.state.data['saturation_peaks'][0]), 'name').map(entry => {
                  return <Line type="monotone" dataKey={entry} stroke={fileColors[entry]} activeDot={{ r: 8 }} key={entry} />
                })
              }
            </LineChart>
            </div>
            <h2>saturation by percentage of peaks recaptured</h2>
            <div>
            <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.data['saturation_peaks_pct']}
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {
                _.without(Object.keys(this.state.data['saturation_peaks_pct'][0]), 'name').map(entry => {
                  return <Line type="monotone" dataKey={entry} stroke={fileColors[entry]} activeDot={{ r: 8 }} key={entry} />
                })
              }
            </LineChart>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
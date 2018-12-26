import React from 'react';
import ReBarChart from './ReBarChart';
// import ScoreTable from './ScoreTable';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line} from 'recharts';
import _ from 'lodash';
import { COLORS } from '../utils';


class ATACseqReport extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
          radioChecked: {
            //mapping: 'useful_single',
            enrich: 'subsampled_10M_enrichment_score'
          },
        };
        this.renderTooltip = this.renderTooltip.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);


    }

    renderTooltip(props) {
        const { active, payload } = props;

        if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
            <p>{data.chromosome}</p>
            <p><span>Value: </span>{data.value}</p>
            </div>
        );
        }

        return null;
    }

    handleRadioChange(e) {
      const checked = {...this.state.radioChecked};
      const {name, value} = e.target;
      checked[name] = value;
      this.setState({radioChecked: checked});
    }

    render() {
        const {errorMsg, renderError, noDataFromAPI, data, error, chartHeight, chartWidth, handleWidthChange, handleHeightChange, increaseHeight, decreaseHeight, increaseWidth, decreaseWidth} = this.props;
        if(errorMsg) {
          return renderError();
        }
        if(noDataFromAPI){
          return <div className="lead alert alert-danger">Error! No report could be loaded from the selected datasets!</div>
        }
        let dataATAC = null;
        if (data){
          dataATAC = data['atac'];
        }
        let domain = [0,0.08];
        if (dataATAC) {
          domain = [0, _.max(_.map( _.map(dataATAC["autosome_distribution"], function(n) { return _.maxBy(n, 'value') } ), 'value' ))];
        }
        let mapping_good = 0, mapping_ok=0; // mapping
        //let after_good = 0, after_ok = 0; //after_alignment_PCR_duplicates_percentage
        let peakpct_good = 0, peakpct_ok = 0; //reads_percentage_under_peaks
        let bk_good = 0, bk_ok = 0; //percentage_of_background_RPKM_larger_than_0.3777
        let enrich_good = 0, enrich_ok = 0; // enrichment
        let peakpct_domain = [0,0.5];
        let bk_domain = [0,0.5];
        let map_domain = [0,55000000];
        //let after_domain = [0,0.3];
        let enrich_domain = [0,18];
        if(dataATAC && dataATAC.ref){
          // mapping_good = Math.round(dataATAC.ref.mapping[radioChecked.mapping].mean);
          // mapping_ok = Math.round(dataATAC.ref.mapping[radioChecked.mapping].mean - dataATAC.ref.mapping[radioChecked.mapping].sd);
          mapping_good = Math.round(dataATAC.ref.mapping['useful_single'].mean);
          mapping_ok = Math.round(dataATAC.ref.mapping['useful_single'].mean - dataATAC.ref.mapping['useful_single'].sd);
          // after_good = dataATAC.ref['library_complexity']['after'].mean;
          // after_ok = dataATAC.ref['library_complexity']['after'].mean + dataATAC.ref['library_complexity']['after'].sd
          peakpct_good = dataATAC.ref['peak_analysis']['reads_percentage_under_peaks'].mean;
          peakpct_ok = parseFloat((dataATAC.ref['peak_analysis']['reads_percentage_under_peaks'].mean - dataATAC.ref['peak_analysis']['reads_percentage_under_peaks'].sd).toFixed(2));
          bk_good = dataATAC.ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'].mean;
          bk_ok = dataATAC.ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'].mean + dataATAC.ref['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'].sd;
          enrich_good = dataATAC.ref.enrichment[this.state.radioChecked.enrich].mean;
          enrich_ok = dataATAC.ref.enrichment[this.state.radioChecked.enrich].mean - dataATAC.ref.enrichment[this.state.radioChecked.enrich].sd;
          peakpct_domain = [0, _.max(_.flatten([dataATAC['peak_analysis']['reads_percentage_under_peaks'],peakpct_good]))];
          bk_domain = [0, _.max(_.flatten([dataATAC['enrichment']['percentage_of_background_RPKM_larger_than_0.3777'],bk_ok]))];
          map_domain = [0, _.max(_.flatten([dataATAC['mapping_stats']['total_reads'], mapping_good]))];
          //after_domain = [0, _.max(_.flatten([dataATAC['library_complexity']['after_alignment_PCR_duplicates_percentage'], after_ok]))];
          enrich_domain = [0, _.max(_.flatten([dataATAC['enrichment']['subsampled_10M_enrichment_score'], enrich_good]))];
    
        }
        const range = [16, 225];
        
        return (
          <div>
            <div>
              {error &&
                error.map((item)=> <div className="alert alert-danger" key={item}>Report {item} is not loaded properly, please check your path and report format.</div>)
              }
            </div>
            {dataATAC &&
              <div>
                <div>
                  <form>
                    <label>
                      Chart width:
                      <input type="text" name="chartwidth" value={chartWidth} onChange = {handleWidthChange} />px
                    </label> <button onClick={increaseWidth}>+</button> <button onClick={decreaseWidth}>-</button> <br/>
                    
                    <label>
                      Chart height:
                      <input type="text" name="chartheight" value={chartHeight} onChange = {handleHeightChange} />px
                    </label> <button onClick={increaseHeight}>+</button> <button onClick={decreaseHeight}>-</button>
                  </form>
                </div>
                {/* <h1>Quality overview</h1> */}
                {/* <div>
                  <p>Data with score >= 5 passed quality standards, marked with green, otherwise marked with yellow.</p>
                  <ScoreTable data={dataATAC['scores']} />
                </div> */}
                <h1>Mapping</h1>
                {/* <div className="row">
                  <div className="lead col-md-2">Set standards based on: </div>
                <div className="col-md-2">
                <label>
                  Total reads: 
                  <input type="radio" name="mapping"  value="total" checked={radioChecked.mapping === 'total'} onChange={this.handleRadioChange} />
                </label>
                </div>
                <div className="col-md-2">
                <label>
                  Mapped reads: 
                  <input type="radio" name="mapping" value="mapped" checked={radioChecked.mapping === 'mapped'} onChange={this.handleRadioChange} />
                </label>
                </div>
                <div className="col-md-2">
                <label>
                  Uniquely mapped reads: 
                  <input type="radio" name="mapping" value="unimap" checked={radioChecked.mapping === 'unimap'} onChange={this.handleRadioChange} />
                </label>
                </div>
                <div className="col-md-2">
                <label>
                Non-redundant Mapped_reads: 
                  <input type="radio" name="mapping" value="nonredant" checked={radioChecked.mapping === 'nonredant'} onChange={this.handleRadioChange} />
                </label>
                </div>
                <div className="col-md-2">
                <label>
                  Useful reads: 
                  <input type="radio" name="mapping" value="useful" checked={radioChecked.mapping === 'useful'} onChange={this.handleRadioChange} />
                </label>
                </div>
                <div className="col-md-2">
                <label>
                  Useful single reads: 
                  <input type="radio" name="mapping" value="useful_single" checked={radioChecked.mapping === 'useful_single'} onChange={this.handleRadioChange} />
                </label>
                </div>
              </div> */}
              <div className="lead">Standards based on useful single ends, Good: {mapping_good}, Acceptable: {mapping_ok}</div>
                <div>
                  <ReBarChart 
                    data={dataATAC['mapping_stats']} 
                    width={chartWidth} 
                    height={chartHeight}
                    xDataKey="name"
                    yDomain={map_domain}
                    dataKeysAndFills={[
                      {dataKey:'total_reads',fill:'#a6cee3'},
                      {dataKey:'mapped_reads',fill:'#1f78b4'},
                      {dataKey:'uniquely_mapped_reads',fill:'#a8ddb5'},
                      {dataKey:'non-redundant_mapped_reads',fill:'#b2df8a'},
                      {dataKey:'useful_reads',fill:'#33a02c'},
                      {dataKey:'useful_single_ends',fill:'#984ea3'},
                    ]}
                    yRefGood={mapping_good} 
                    yRefOk={mapping_ok}
                  /> 
                </div>
                <h1>chrM rate</h1>
                <div>
                <ReBarChart 
                    data={dataATAC['mapping_distribution']} 
                    width={chartWidth} 
                    height={chartHeight}
                    xDataKey="name"
                    dataKeysAndFills={[
                      {dataKey:'percentage_of_uniquely_mapped_reads_in_chrM',fill:'#a6cee3'},
                      {dataKey:'percentage_of_non-redundant_uniquely_mapped_reads_in_chrX',fill:'#1f78b4'},
                      {dataKey:'percentage_of_non-redundant_uniquely_mapped_reads_in_chrY',fill:'#b2df8a'},
                    ]}
                  />
                </div>
              <h2>Autosome mapping distribution</h2>
                <div>     
                {
                  Object.entries(dataATAC['autosome_distribution']).map((entry, entryIdx) =>{
                  const fontSize = entryIdx === Object.entries(dataATAC['autosome_distribution']).length - 1 ? 14 : 0;
                  return <ScatterChart width={chartWidth} height={60} margin={{ top: 10, right: 0, bottom: 0, left: 100 }} key={entryIdx} >
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
              {/* <div className="lead">Standards for PCR duplicates percentage after alignment, Good: {after_good}, Acceptable: {after_ok}</div> */}
                <div>
                <ReBarChart 
                    data={dataATAC['library_complexity']} 
                    width={chartWidth} 
                    height={chartHeight}
                    xDataKey="name"
                    //yDomain={after_domain}
                    dataKeysAndFills={[
                      {dataKey:'before_alignment_library_duplicates_percentage',fill:'#a6cee3'},
                      {dataKey:'after_alignment_PCR_duplicates_percentage',fill:'#1f78b4'},
                    ]}
                    // yRefGood={after_good} 
                    // yRefOk={after_ok}
                  />
                </div>
                <h1>Insert size distribution</h1>
                <LineChart width={chartWidth} height={chartHeight} data={dataATAC['insert_distribution']}
                  margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  {
                    _.without(Object.keys(dataATAC['insert_distribution'][0]), 'name').map((entry,idx) => {
                      return <Line type='monotone' dot={false} dataKey={entry} stroke={COLORS[idx]} fill={COLORS[idx]} key={entry} />
                    })
                  }
                </LineChart>
                <h1>Enrichment</h1>
                <div className="row">
                  <div className="lead col-md-2">Set standards based on: </div>
                <div className="col-md-3">
                <label>
                Enrichment ratio in coding promoter regions: &nbsp; &nbsp; 
                  <input type="radio" name="enrich"  value="enrichment_score_in_coding_promoter_regions" checked={this.state.radioChecked.enrich === 'enrichment_score_in_coding_promoter_regions'} onChange={this.handleRadioChange} />
                </label>
                </div>
                <div className="col-md-3">
                <label>
                Subsampled 10M enrichment ratio:  &nbsp; &nbsp; 
                  <input type="radio" name="enrich" value="subsampled_10M_enrichment_score" checked={this.state.radioChecked.enrich === 'subsampled_10M_enrichment_score'} onChange={this.handleRadioChange} />
                </label>
                </div>
                
              </div>
              <div className="lead">Good: {enrich_good}, Acceptable: {enrich_ok}</div>
                <div>
                <ReBarChart 
                    data={dataATAC['enrichment']} 
                    width={chartWidth} 
                    height={chartHeight}
                    xDataKey="name"
                    yDomain={enrich_domain}
                    dataKeysAndFills={[
                      {dataKey:'enrichment_score_in_coding_promoter_regions',fill:'#a6cee3'},
                      {dataKey:'subsampled_10M_enrichment_score',fill:'#1f78b4'},
                    ]}
                    yRefGood={enrich_good} 
                    yRefOk={enrich_ok}
                  />
                </div>
                <h1>Background</h1>
                <div className="lead">Standards for background, Good: {bk_good}, Acceptable: {bk_ok}</div>
                <div>
                <ReBarChart 
                    data={dataATAC['enrichment']} 
                    width={chartWidth} 
                    height={chartHeight}
                    xDataKey="name"
                    yDomain={bk_domain}
                    dataKeysAndFills={[
                      {dataKey:'percentage_of_background_RPKM_larger_than_0.3777',fill:'#a6cee3'},
                    ]}
                    yRefGood={bk_good} 
                    yRefOk={bk_ok}
                  />
                  {/* <BarChart width={chartWidth} height={chartHeight} data={data['enrichment']}
                                margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                      <XAxis dataKey="name"/>
                      <YAxis domain={bk_domain} />
                      <CartesianGrid strokeDasharray="3 3"/>
                      <Tooltip/>
                      <Legend />
                      <Bar dataKey="percentage_of_background_RPKM_larger_than_0.3777" fill="#1f78b4" />
                      <ReferenceLine y={bk_good} label="Good" stroke="darkgreen" />
                      <ReferenceLine y={bk_ok} label="Acceptable" stroke="red" />
                  </BarChart> */}
                </div>
                <h1>Yield distribution</h1>
                <h2>expected distinction</h2>
                <div>
                <LineChart width={chartWidth} height={chartHeight} data={dataATAC['yield_distro']}
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {
                    _.without(Object.keys(dataATAC['yield_distro'][0]), 'name').map((entry,idx) => {
                      return <Line type="monotone" dataKey={entry} stroke={COLORS[idx]} activeDot={{ r: 8 }} key={entry} />
                    })
                  }
                </LineChart>
                </div>
                <h2>lower 0.95 confidnece interval</h2>
                <div>
                <LineChart width={chartWidth} height={chartHeight} data={dataATAC['yield_distro_lower']}
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {
                    _.without(Object.keys(dataATAC['yield_distro_lower'][0]), 'name').map((entry,idx) => {
                      return <Line type="monotone" dataKey={entry} stroke={COLORS[idx]} activeDot={{ r: 8 }} key={entry} />
                    })
                  }
                </LineChart>
                </div>
                <h2>upper 0.95 confidnece interval</h2>
                <div>
                <LineChart width={chartWidth} height={chartHeight} data={dataATAC['yield_distro_upper']}
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {
                    _.without(Object.keys(dataATAC['yield_distro_upper'][0]), 'name').map((entry,idx) => {
                      return <Line type="monotone" dataKey={entry} stroke={COLORS[idx]} activeDot={{ r: 8 }} key={entry} />
                    })
                  }
                </LineChart>
                </div>
                <h1>Peaks</h1>
                <h2>Peak numbers</h2>
                <div>
                  <BarChart width={chartWidth} height={chartHeight} data={dataATAC['peak_analysis']}
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
                <div className="lead">Standards for reads percentage under peaks, Good: {peakpct_good}, Acceptable: {peakpct_ok}</div>
                 <div>
                 <ReBarChart 
                    data={dataATAC['peak_analysis']} 
                    width={chartWidth} 
                    height={chartHeight}
                    xDataKey="name"
                    yDomain={peakpct_domain}
                    dataKeysAndFills={[
                      {dataKey:'reads_percentage_under_peaks',fill:'#a6cee3'},
                    ]}
                    yRefGood={peakpct_good} 
                    yRefOk={peakpct_ok}
                  />
                  {/* <BarChart width={chartWidth} height={chartHeight} data={data['peak_analysis']}
                                margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                      <XAxis dataKey="name"/>
                      <YAxis domain={peakpct_domain} />
                      <CartesianGrid strokeDasharray="3 3"/>
                      <Tooltip/>
                      <Legend />
                      <Bar dataKey="reads_percentage_under_peaks" fill="#82ca9d" />
                      <ReferenceLine y={peakpct_good} label="Good" stroke="darkgreen" />
                      <ReferenceLine y={peakpct_ok} label="Acceptable" stroke="red" />
                  </BarChart> */}
                </div>
                <h2>Peak size distribution</h2>
                <LineChart width={chartWidth} height={chartHeight} data={dataATAC['peak_distribution']}
                  margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  {
                    _.without(Object.keys(dataATAC['peak_distribution'][0]), 'name').map((entry,idx) => {
                      return <Line type='monotone' dot={false} dataKey={entry} stroke={COLORS[idx]} fill={COLORS[idx]} key={entry} />
                    })
                  }
                </LineChart>
                <h1>Saturation</h1>
                <h2>saturation by peaks number</h2>
                <div>
                <LineChart width={chartWidth} height={chartHeight} data={dataATAC['saturation_peaks']}
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {
                    _.without(Object.keys(dataATAC['saturation_peaks'][0]), 'name').map((entry,idx) => {
                      return <Line type="monotone" dataKey={entry} stroke={COLORS[idx]} activeDot={{ r: 8 }} key={entry} />
                    })
                  }
                </LineChart>
                </div>
                <h2>saturation by percentage of peaks recaptured</h2>
                <div>
                <LineChart width={chartWidth} height={chartHeight} data={dataATAC['saturation_peaks_pct']}
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {
                    _.without(Object.keys(dataATAC['saturation_peaks_pct'][0]), 'name').map((entry,idx) => {
                      return <Line type="monotone" dataKey={entry} stroke={COLORS[idx]} activeDot={{ r: 8 }} key={entry} />
                    })
                  }
                </LineChart>
                </div>
                {/* <h2>Embedded browser view</h2> */}
              </div>
            }
          </div>
        );
      }
}

export default ATACseqReport;
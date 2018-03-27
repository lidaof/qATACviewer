import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine, LineChart, Line} from 'recharts';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import _ from 'lodash';

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

// const products = [
//   {id:0,name:'GM-AM-6S-GM-172',sample:'Liver',file:'GM-AM-6S-GM-172_S1_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-172_S1_L007_R1_001.bigWig'},
//   {id:1,name:'GM-AM-6S-GM-173',sample:'Liver',file:'GM-AM-6S-GM-173_S2_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-173_S2_L007_R1_001.bigWig'},
//   {id:2,name:'GM-AM-6S-GM-174',sample:'Liver',file:'GM-AM-6S-GM-174_S3_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-174_S3_L007_R1_001.bigWig'},
//   {id:3,name:'GM-AM-6S-GM-175',sample:'Liver',file:'GM-AM-6S-GM-175_S4_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-175_S4_L007_R1_001.bigWig'},
//   {id:4,name:'GM-AM-6S-GM-176',sample:'Lung', file:'GM-AM-6S-GM-176_S5_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-176_S5_L007_R1_001.bigWig'},
//   {id:5,name:'GM-AM-6S-GM-177',sample:'Lung', file:'GM-AM-6S-GM-177_S6_L007_R1_001.json',assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/mutlu/step3.2_Normalized_per_10M_GM-AM-6S-GM-177_S6_L007_R1_001.bigWig'},
// ];

// const products = [
// {id:0, name:'K1-mock', sample: 'K1-mock', file:'TW984_K1-mock_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW984_K1-mock_ATAC.R1.bigWig'},
// {id:1, name:'K2-ITF', sample: 'K2-ITF', file:'TW985_K2-ITF_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW985_K2-ITF_ATAC.R1.bigWig'},
// {id:2, name:'K3-Aza', sample: 'K3-Aza', file:'TW986_K3-Aza_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW986_K3-Aza_ATAC.R1.bigWig'},
// {id:3, name:'K4-AzaITF', sample: 'K4-AzaITF', file:'TW987_K4-AzaITF_ATAC.R1.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_TW987_K4-AzaITF_ATAC.R1.bigWig'},
// {id:4, name:'A2780-mock', sample: 'A2780-mock', file:'WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.json', assay: 'ATAC-seq', url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.bigWig'}
// ];

const products = [
  {id:0, file:'http://wangftp.wustl.edu/~dli/hub/kate/WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.json', sample:'A2780-mock', assay:'ATAC-seq',url:'http://wangftp.wustl.edu/~dli/hub/kate/step3.2_Normalized_per_10M_WangT_A2780-mock-atac_N703_AGGCAGAAAT_S13_R1_001.bigWig'},
  {id:1, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_A27802-ITF_i7N703_i5N503_AGGCAGAA_AGAGGATA_S3_R1_001.json', sample:'A27802-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_A27802-ITF_i7N703_i5N503_AGGCAGAA_AGAGGATA_S3_R1_001.bigWig'},
  {id:2, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_A27803-Aza_i7N703_i5N504_AGGCAGAA_TCTACTCT_S4_R1_001.json', sample:'A27803-Aza', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_A27803-Aza_i7N703_i5N504_AGGCAGAA_TCTACTCT_S4_R1_001.bigWig'},
  {id:3, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_A27804-Aza-ITF_i7N703_i5N517_AGGCAGAA_TCTTACGC_S5_R1_001.json', sample:'A27804-Aza-ITF', assay:'ATAC-seq',url:'json https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_A27804-Aza-ITF_i7N703_i5N517_AGGCAGAA_TCTTACGC_S5_R1_001.bigWig'},
  {id:4, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey1-Mock_i7N701_i5N502_TAAGGCGA_ATAGAGAG_S10_R1_001.json', sample:'Hey1-Mock', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey1-Mock_i7N701_i5N502_TAAGGCGA_ATAGAGAG_S10_R1_001.bigWig'},
  {id:5, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey2-ITF_i7N701_i5N503_TAAGGCGA_AGAGGATA_S11_R1_001.json', sample:'Hey2-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey2-ITF_i7N701_i5N503_TAAGGCGA_AGAGGATA_S11_R1_001.bigWig'},
  {id:6, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey3-Aza_i7N701_i5N504_TAAGGCGA_TCTACTCT_S12_R1_001.json', sample:'Hey3-Aza', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey3-Aza_i7N701_i5N504_TAAGGCGA_TCTACTCT_S12_R1_001.bigWig'},
  {id:7, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_Hey4-Aza-ITF_i7N701_i5N517_TAAGGCGA_TCTTACGC_S13_R1_001.json', sample:'Hey4-Aza-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_Hey4-Aza-ITF_i7N701_i5N517_TAAGGCGA_TCTTACGC_S13_R1_001.bigWig'},
  {id:8, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu1-Mock_i7N702_i5N502_CGTACTAG_ATAGAGAG_S6_R1_001.json', sample:'TykNu1-Mock', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu1-Mock_i7N702_i5N502_CGTACTAG_ATAGAGAG_S6_R1_001.bigWig'},
  {id:9, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu2-ITF_i7N702_i5N503_CGTACTAG_AGAGGATA_S7_R1_001.json', sample:'TykNu1-Mock', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu2-ITF_i7N702_i5N503_CGTACTAG_AGAGGATA_S7_R1_001.bigWig'},
  {id:10, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu3-Aza_i7N702_i5N504_CGTACTAG_TCTACTCT_S8_R1_001.json', sample:'TykNu3-Aza', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu3-Aza_i7N702_i5N504_CGTACTAG_TCTACTCT_S8_R1_001.bigWig'},
  {id:11, file:'https://htcf.wustl.edu/files/NeAv89X2/WangT_TykNu4-Aza-ITF_i7N702_i5N517_CGTACTAG_TCTTACGC_S9_R1_001.json', sample:'TykNu4-Aza-ITF', assay:'ATAC-seq',url:'https://htcf.wustl.edu/files/NeAv89X2/step3.2_Normalized_per_10M_WangT_TykNu4-Aza-ITF_i7N702_i5N517_CGTACTAG_TCTTACGC_S9_R1_001.bigWig'},  
];

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
        data:null,
        radioChecked: {
          mapping: 'useful',
          enrich: 'enrichment_ratio_in_coding_promoter_regions'
        }
      };
      this.handleClick = this.handleClick.bind(this);
      this.renderTooltip = this.renderTooltip.bind(this);
      this.hubGenerator = this.hubGenerator.bind(this);
      this.handleRadioChange = this.handleRadioChange.bind(this);
    }

  async handleClick() {
    //let req = this.state.value.join();
    //let response = await axios.get(`/report/${req}`);
    //let response = await axios.post('/rep',{flist: this.state.value});
    let response = await axios.post('/rep1',{flist: this.state.value});
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
    frame.contentWindow.drawBrowser(this.hubGenerator(products, this.state.value));
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
          name: product.sample, //use name should
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

   render() {
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
    if(this.state.data){
      mapping_good = this.state.data.ref.mapping[this.state.radioChecked.mapping].mean;
      mapping_ok = this.state.data.ref.mapping[this.state.radioChecked.mapping].mean - this.state.data.ref.mapping[this.state.radioChecked.mapping].sd;
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
                  <ReferenceLine y={mapping_good} label="Good" stroke="darkgreen" />
                  <ReferenceLine y={mapping_ok} label="Acceptable" stroke="red" />
              </BarChart>
            </div>
            <h1>chrM rate</h1>
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
          <h2>Autosome mapping distribution</h2>
            <div>     
            {
              Object.entries(this.state.data['autosome_distribution']).map((entry, entryIdx) =>{
              const fontSize = entryIdx === Object.entries(this.state.data['autosome_distribution']).length - 1 ? 14 : 0;
              return <ScatterChart width={1200} height={60} margin={{ top: 10, right: 0, bottom: 0, left: 100 }} key={entryIdx} >
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
              <BarChart width={1200} height={400} data={this.state.data['library_complexity']}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
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
            <LineChart width={800} height={400} data={this.state.data['insert_distribution']}
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
              <BarChart width={1200} height={400} data={this.state.data['enrichment']}
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
              <BarChart width={1200} height={400} data={this.state.data['enrichment']}
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
            <LineChart width={800} height={400} data={this.state.data['yield_distro']}
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
            <LineChart width={800} height={400} data={this.state.data['yield_distro_lower']}
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
            <LineChart width={800} height={400} data={this.state.data['yield_distro_upper']}
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
              <BarChart width={1200} height={400} data={this.state.data['peak_analysis']}
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
              <BarChart width={1200} height={400} data={this.state.data['peak_analysis']}
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
            <LineChart width={800} height={400} data={this.state.data['peak_distribution']}
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
            <LineChart width={800} height={400} data={this.state.data['saturation_peaks']}
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
            <LineChart width={800} height={400} data={this.state.data['saturation_peaks_pct']}
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
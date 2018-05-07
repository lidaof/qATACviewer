import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import _ from 'lodash';
import DataSelection from './components/DataSelection';
import ATACseqReport from './components/ATACseqReport';



class App extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        values: [],
        labels: [],
        assays: [],
        data: null,
        radioChecked: {
          //mapping: 'useful_single',
          enrich: 'subsampled_10M_enrichment_ratio'
        },
        chartHeight: 400,
        chartWidth: 1200,
        products: null,
        error: [],
        noDataFromAPI: false,
        loading: false,
        errorMsg: null,
        loadingMsg: ''
      };
      this.handleClick = this.handleClick.bind(this);
      this.hubGenerator = this.hubGenerator.bind(this);
      this.handleRadioChange = this.handleRadioChange.bind(this);
      this.handleWidthChange = this.handleWidthChange.bind(this);
      this.handleHeightChange = this.handleHeightChange.bind(this);
      this.renderError = this.renderError.bind(this);
      this.renderLoading = this.renderLoading.bind(this);
    }

  async handleClick() {
    this.setState({loadingMsg: 'Loading'});
    this.setState({loading: true});
    try {
      let response = await axios.post('/rep1',{flist: this.state.values, labels: this.state.labels, assays: this.state.assays });
      if (response.data.error){
        if(response.data.error.length === this.state.values.length){
          this.setState({noDataFromAPI: true});
        }else{
          this.setState({noDataFromAPI: false});
        }
        //seems not a good idea to modify state.values here
        //let fvalues = [...this.state.values];
        //this.setState({values: _.without(fvalues, ...response.data.error), error: response.data.error});
        this.setState({error: response.data.error});
        
      }
      this.setState({data: response.data, loading: false, errorMsg: null, loadingMsg: ''});
    }catch(e){
      this.setState({errorMsg: e.response, loading: false, loadingMsg: 'Failed!'});
    }
    const frame = document.getElementById('frame');
    frame.contentWindow.drawBrowser(this.hubGenerator(this.state.products, this.state.values));
    //frame.contentWindow.parent.document.getElementById('root').style.display='block'
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



  renderLoading() {
    return <div className="lead alert alert-info">{this.state.loadingMsg}</div>;
  }

  renderError() {
    return (
      <div className="lead alert alert-info">
        Something went wrong: {this.state.errorMsg.message}
      </div>
    );
  }

  increaseWidth = (e) => {
    e.preventDefault();
    let width = this.state.chartWidth;
    width += 100;
    this.setState({chartWidth: width});
  }

  decreaseWidth = (e) => {
    e.preventDefault();
    let width = this.state.chartWidth;
    width -= 100;
    this.setState({chartWidth: width});
  }

  increaseHeight = (e) => {
    e.preventDefault();
    let height = this.state.chartHeight;
    height += 50;
    this.setState({chartHeight: height});
  }

  decreaseHeight = (e) => {
    e.preventDefault();
    let height = this.state.chartHeight;
    height -= 50;
    this.setState({chartHeight: height});
  }


  onNewSelection = (row, isSelect) => {
    let newValues = [...this.state.values];
    let newLables = [...this.state.labels];
    let newAssays = [...this.state.assays];
    if(isSelect){
      if (!newValues.includes(row.file)){
        newValues.push(row.file);
        newLables.push(row.name||`${row.sample} ${row.assay}`);
        newAssays.push(row.assay);
      }
    }else{
      if (newValues.includes(row.file)){
        let index = newValues.indexOf(row.file);
        if (index > -1) {
          newValues.splice(index, 1);
          newLables.splice(index, 1);
          newAssays.splice(index, 1);
        }
      }
    }
    this.setState({values: newValues, labels: newLables, assays: newAssays});
  }

  onAllSelection = (isSelect, rows) => {
        if(isSelect){
          let newValues = [], newLables = [], newAssays = [];
          for(let row of rows){
            newValues.push(row.file);
            newLables.push(row.name||`${row.sample} ${row.assay}`);
            newAssays.push(row.assay);
          }
          this.setState({values: newValues, labels: newLables, assays: newAssays});
        }else{
          this.setState({values:[], labels: [], assays: []});
        }
  }

  handleChangeCallBack = (products) => {
    this.setState({values: [], labels: [], assays: [], products: products});
  }

  render(){
    const { loading} = this.state;
    return (
      <div>
        <div style={{display: this.state.isHidden ? "none" : undefined}}>
          <DataSelection 
            onNewSelection={this.onNewSelection} 
            onAllSelection={this.onAllSelection} 
            onHandleChange={this.handleChangeCallBack}
            onHandleClick={this.handleClick}
            labels={this.state.labels}
          />
          <div>
            {loading ? this.renderLoading() : <ATACseqReport errorMsg={this.state.errorMsg} 
                                                             noDataFromAPI={this.state.noDataFromAPI}
                                                             data={this.state.data}
                                                             error={this.state.error} 
                                                             radioChecked={this.state.radioChecked} 
                                                             chartHeight={this.state.chartHeight} 
                                                             chartWidth={this.state.chartWidth}
                                                             increaseWidth={this.increaseWidth}
                                                             decreaseWidth={this.decreaseWidth}
                                                             increaseHeight={this.increaseHeight}
                                                             decreaseHeight={this.decreaseHeight}
                                                             handleHeightChange={this.handleHeightChange}
                                                             handleWidthChange={this.handleWidthChange}
                                                             handleRadioChange={this.handleRadioChange}
                                                             />
            }
          </div>
        </div>
        {this.state.data &&
            <button type="button" className="btn btn-primary" onClick={() => this.setState({isHidden: !this.state.isHidden})}>Toggle full screen</button>
          }
      </div>
    );
  }
}

export default App;

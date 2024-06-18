import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import _ from 'lodash';
import DataSelection from './components/DataSelection';
import ATACseqReport from './components/ATACseqReport';
import RNAseqReport from './components/RNAseqReport';
import DataSelectionUpload from './components/DataSelectionUpload';
import NavBar from './components/NavBar';
import DataSelectionUrl from './components/DataSelectionUrl';

class App extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        values: [],
        labels: [],
        assays: [],
        data: null,
        chartHeight: 400,
        chartWidth: 1200,
        products: null,
        error: [],
        noDataFromAPI: false,
        loading: false,
        errorMsg: null,
        loadingMsg: '',
        genome: 'mm10', 
        upload: false,
        existing: true, 
        url: false, 
        path: false, 
      };
      this.handleClick = this.handleClick.bind(this);
      this.hubGenerator = this.hubGenerator.bind(this);
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
    frame.contentWindow.drawBrowser(this.hubGenerator(this.state.genome, this.state.products, this.state.values));
    //frame.contentWindow.parent.document.getElementById('root').style.display='block'
  }

  changeGenome = (genome) => {
    this.setState({genome});
  }

  hubGenerator(genome, products, filterlist){
    let hub = {};
    hub.genome=genome;
    let content = [];
    let samples = [];
    let assays = [];
    products.forEach(product => {
      if(filterlist.includes(product.file)){
        let trackObj = {};
        if(product.url.endsWith('.gz')){
          trackObj['type'] = 'bedGraph';
          trackObj['colorpositive'] = '#000099';
          trackObj['colornegative'] = '#804000';
        }else{
          trackObj['type'] = 'bigWig';
        }
        trackObj['mode'] = 'show';
        trackObj['url'] = product.url;
        trackObj['height'] = 40;
        trackObj['name'] = product.name || `${product.assay} of ${product.sample}`; //use name should
        trackObj['metadata'] = [product.sample, product.assay];
        trackObj['qtc'] = {'smooth': 7};
        content.push(trackObj);
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
    let newValues = this.state.values.slice();
    let newLabels = this.state.labels.slice();
    let newAssays = this.state.assays.slice();
    //let newValues = this.state.values, newLabels = this.state.labels, newAssays = this.state.assays;
        if(isSelect){
          for(let row of rows){
            newValues.push(row.file);
            newLabels.push(row.name||`${row.sample} ${row.assay}`);
            newAssays.push(row.assay);
          }
          this.setState({dataValues: newValues, dataLabels: newLabels, dataAssays: newAssays});
          this.setState({values: newValues.slice(), labels: newLabels.slice(), assays: newAssays.slice()});
        }else{
          for (let values in this.state.dataValues) {
            let index = newValues.indexOf(values)
            newValues.splice(index, 1);
            newLabels.splice(index, 1);
            newAssays.splice(index, 1);
          }
          this.setState({dataValues:[], dataLabels: [], dataAssays: []});
          this.setState({values: newValues.slice(), labels: newLabels.slice(), assays: newAssays.slice()});
          //Same as below
          // console.log("hitting else statement")
          // this.setState({dataValues:[], dataLabels: [], dataAssays: []});
          // console.log(this.state.values)
          // console.log(this.state.uValues)
          // this.setState({
          //   values: [...this.state.uValues], 
          //   labels: [...this.state.uLabels],
          //   assays: [...this.state.uAssays], 
          // })
          // console.log(this.state.uValues)
        }
  }

  handleChangeCallBack = (products) => {
    this.setState({values: [], labels: [], assays: [], products: products});
  }

  renderReport = () => {
    const {errorMsg, noDataFromAPI, data, error, chartHeight, chartWidth} = this.state;
    const {increaseWidth, decreaseWidth, increaseHeight, decreaseHeight, handleHeightChange, handleWidthChange, renderError} = this;
    const propsToPass = {
      errorMsg, noDataFromAPI, data, error, chartHeight, chartWidth,
      increaseWidth, decreaseWidth, increaseHeight, decreaseHeight, handleHeightChange, handleWidthChange, renderError
    };
    return <div>
      {this.state.data && this.state.data.atac && <ATACseqReport {...propsToPass} />}
      {this.state.data && this.state.data.rna && <RNAseqReport {...propsToPass} />}
    </div>

    // return (
    //   <div>
    //     {this.state.data && this.state.data.atac ? <ATACseqReport errorMsg={this.state.errorMsg} 
    //                                                          noDataFromAPI={this.state.noDataFromAPI}
    //                                                          data={this.state.data}
    //                                                          error={this.state.error} 
    //                                                          chartHeight={this.state.chartHeight} 
    //                                                          chartWidth={this.state.chartWidth}
    //                                                          increaseWidth={this.increaseWidth}
    //                                                          decreaseWidth={this.decreaseWidth}
    //                                                          increaseHeight={this.increaseHeight}
    //                                                          decreaseHeight={this.decreaseHeight}
    //                                                          handleHeightChange={this.handleHeightChange}
    //                                                          handleWidthChange={this.handleWidthChange}
    //                                                          renderError = {this.renderError}
    //                                                          /> : null }
    //     {this.state.data && this.state.data.rna ? <RNAseqReport errorMsg={this.state.errorMsg} 
    //                                                          noDataFromAPI={this.state.noDataFromAPI}
    //                                                          data={this.state.data}
    //                                                          error={this.state.error} 
    //                                                          chartHeight={this.state.chartHeight} 
    //                                                          chartWidth={this.state.chartWidth}
    //                                                          increaseWidth={this.increaseWidth}
    //                                                          decreaseWidth={this.decreaseWidth}
    //                                                          increaseHeight={this.increaseHeight}
    //                                                          decreaseHeight={this.decreaseHeight}
    //                                                          handleHeightChange={this.handleHeightChange}
    //                                                          handleWidthChange={this.handleWidthChange}
    //                                                          renderError = {this.renderError}
    //                                                          /> : null}
    //   </div>
    // );
  }

  handleDataFetch = (data) => {
    this.setState({ data });
  }

  handleError = (error) => {
    this.setState({ error });
  }

  changeOption = (option) => {
    if (option === 1) {
      this.setState({
        url : true, 
        existing : false, 
        upload : false
      })
    }
    if (option === 2) {
      this.setState({
        url : false, 
        existing : true, 
        upload : false, 
      })
    }

    if (option === 3) {
      this.setState({
        url : false, 
        existing : false, 
        upload : true
      })
    }
  }

  render(){
    const { loading} = this.state;
    const queryParams = new URLSearchParams(window.location.search);
    const dataSourceUrl = queryParams.get('dataSource');

    return (
      <div>
        <NavBar 
          changeOption={this.changeOption}
          path={this.state.path}
        />
        <div>
          {dataSourceUrl && this.setState({url : true})}
          {dataSourceUrl && this.setState({path : true})}
          {this.state.url && 
            <DataSelectionUrl 
            onNewSelection={this.onNewSelection} 
            onAllSelection={this.onAllSelection} 
            onHandleChange={this.handleChangeCallBack}
            onHandleClick={this.handleClick}
            labels={this.state.labels}
            changeGenome={this.changeGenome}
          />
          }
          {this.state.existing &&
            <DataSelection 
            onNewSelection={this.onNewSelection} 
            onAllSelection={this.onAllSelection} 
            onHandleChange={this.handleChangeCallBack}
            onHandleClick={this.handleClick}
            labels={this.state.labels}
            changeGenome={this.changeGenome}
          />
          }
          {this.state.upload &&
            <DataSelectionUpload
            onNewSelection={this.onNewSelection} 
            onAllSelection={this.onAllSelection} 
            onHandleChange={this.handleChangeCallBack}
            onHandleClick={this.handleClick}
            labels={this.state.labels}
            changeGenome={this.changeGenome}
            />
            }
          <div>
            {loading ? this.renderLoading() : this.renderReport()
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

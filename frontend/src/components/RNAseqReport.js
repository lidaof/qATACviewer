import React from 'react';


class RNAseqReport extends React.Component {

    render(){
        const {errorMsg, noDataFromAPI, data, error, chartHeight, chartWidth, handleWidthChange, handleHeightChange, increaseHeight, decreaseHeight, increaseWidth, decreaseWidth} = this.props;
        if(errorMsg) {
          return this.renderError();
        }
        if(noDataFromAPI){
          return <div className="lead alert alert-danger">Error! No report could be loaded from the selected datasets!</div>
        }
        let dataRNA = null;
        if (data){
          dataRNA = data['rna'];
        }

        return(
            <div>
                <div>
              {error &&
                error.map((item)=> <div className="alert alert-danger" key={item}>Report {item} is not loaded properly, please check your path and report format.</div>)
              }
            </div>
            <div>
                {dataRNA &&
                    <div></div>
                }
            </div>
            </div>
        )
    }
}

export default RNAseqReport;
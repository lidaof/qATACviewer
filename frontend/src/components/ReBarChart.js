import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine} from 'recharts';
import PropTypes from 'prop-types';

class ReBarChart extends React.Component{
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        xDataKey: PropTypes.string.isRequired,
        yDomain: PropTypes.arrayOf(PropTypes.number),
        dataKeysAndFills: PropTypes.arrayOf(PropTypes.object).isRequired,
        yRefGood: PropTypes.number,
        yRefOk: PropTypes.number
    };

    static defaultProps = {
        width: 1200,
        height: 400,
        yRefGood: null,
        yRefOk: null,
        yDomain: null
    };


    render(){
        const {width, height, data, xDataKey, yDomain, dataKeysAndFills, yRefGood, yRefOk} = this.props; 
        return (
            <BarChart width={width} height={height} data={data}
                            margin={{top: 30, right: 50, left: 30, bottom: 5}}>
                  <XAxis dataKey={xDataKey}/>
                  { yDomain ? <YAxis domain={yDomain} /> : <YAxis /> }
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  {
                      dataKeysAndFills.map((ele) => <Bar key={ele.dataKey} dataKey={ele.dataKey} fill={ele.fill} />)
                  }
                  { yRefGood ? <ReferenceLine y={yRefGood} label="Good" stroke="darkgreen" /> : '' }
                  { yRefOk ? <ReferenceLine y={yRefOk} label="Acceptable" stroke="red" /> : '' }
              </BarChart>
        );
    }
}

export default ReBarChart;

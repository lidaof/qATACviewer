import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class ScoreTable extends React.Component {
    render(){
        const columns = [{
            dataField: 'sample',
            text: 'Sample'
            }, {
            dataField: 'score',
            text: 'Score'
        }];
        
        const rowStyle2 = (row, rowIndex) => {
            const style = {};
            if (row.score >= 5) {
                style.backgroundColor = '#009900';
            } else {
                style.backgroundColor = '#ff9619';
            }
            return style;
        };
        const {data} = this.props;
        return(
            <BootstrapTable keyField='id' data={ data } columns={ columns } rowStyle={ rowStyle2 } />
        );
    }
      
}

export default ScoreTable;
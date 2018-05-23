import React, { Component } from 'react';

//API
import axios from 'axios';

//Utils
import moment from 'moment';
import NumberFormat from 'react-number-format';


export class Trades extends Component {
  constructor(props){
    super(props);
    this.trades = this.props.trades
  }

  getInitialState(){
    return {
      trades: this.props.trades
    }
  }

  render() {
    const trades = this.props.trades;
    return (
      <div>
        <div className="card bg-dark text-light rounded-0 border-0 h-100">
            <div className="card-body text-center px-1">
                <div className="card bg-secondary text-light rounded-0">
                  <div className="card-block pt-2 pb-0">
                    <h6 className="text-uppercase">Últimos trades</h6>
                  </div>
                </div>
                  <div className="px-1">
                    <table className="table table-borderless table-sm">
                      <thead>
                        <tr className="text-uppercase small">
                          <th scope="col">Hora</th>
                          <th scope="col"><span className="text-muted">MXN</span> Price</th>
                          <th scope="col"><span className="text-muted">BTC</span> Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                      { 
                        !trades
                          ? 
                          <tr><td colSpan={3}>Loading</td></tr> 
                          :
                          trades.map((i) => i.t === 0 || i.t === 'buy'
                          ? 
                          <tr className="small" key={i.i}>
                            <td>{moment(i.d).format('HH:mm:ss')}</td>
                            <td className="text-success">
                              <NumberFormat value={i.r} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}/>
                            </td>
                            <td>
                              <NumberFormat value={i.a} displayType={'text'} decimalScale={8} fixedDecimalScale={true}/>
                            </td>
                          </tr> 
                        : 
                          <tr className="small" key={i.i}> 
                            <td>{moment(i.d).format('HH:mm:ss')}</td>
                            <td className="text-danger">
                              <NumberFormat value={i.r} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}/></td>
                            <td>
                              <NumberFormat value={i.a} displayType={'text'} decimalScale={8} fixedDecimalScale={true}/>
                            </td>
                          </tr>
                        )
                      }
                      </tbody>
                    </table>
                </div>
            </div> 
        </div>
      </div>
    )
  }
}

Trades.defaultProps = { 
  trades: null
};

export default Trades;
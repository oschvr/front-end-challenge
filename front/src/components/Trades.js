import React, { Component } from 'react';

//API
import axios from 'axios';

//Utils
import moment from 'moment';
import NumberFormat from 'react-number-format';


export class Trades extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: { 
        trades: this.props.trades, 
        loading: true
      }
    }
  }

  getInitialState(){
    return {
      data: { 
        trades: this.props.trades, 
        loading: true
      }
    }
  }

  componentWillMount(){
    //fetch 20 trades to display at first. map the obj values to the socket standard
    axios.get('https://api.bitso.com/v3/trades/?book=btc_mxn&limit=30')
      .then((res) => this.setState({
        data: {
          trades: res.data.payload.map((trade) => {
            const {amount: a, created_at: d, maker_side: t, price: r, tid: i} = trade;
            return Object.assign({}, {a, d, t, r, i});
          }, (err) => {
            console.log('Trades Error: ', err)
          }),
          loading: false
        }
      }))
  }

  componentDidMount(){
    //new socket instance
    this.socket = new WebSocket('wss://ws.bitso.com');
    //subscribe to the trades channel
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'trades' }));
    }
    //listen for a trades channel new msg
    this.socket.onmessage = (msg) => {
      //Parse the socket message. validate if type === 'trades'
      const trade = JSON.parse(msg.data);
      //console.log('Incoming Trade:', trade);
      if(trade.type === 'trades' && trade.payload){
        //Add new data to trades socket info
        trade.payload[0].c = new Date();
        //Create a copy of state.data, limit 20
        const trades = this.state.data.trades;
        //unshift => push to the top
        trades.unshift(trade.payload[0]);
        //slice to the top N elements
        trades.slice(0, 30);
        //create animation
        //Push to setState. This calls render() automatically
        this.setState({
          data: {
            trades: trades,
            loading: false
          }
        })
      }
    }
  }

  render(){
    const data = this.state.data;

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
                        data.loading 
                        ? 
                        <tr><td colSpan={3}>Loading</td></tr> 
                        : 
                          data.trades.map((i) => i.t === 0 || i.t === 'buy'
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
  data: { 
    trades: [], 
    loading: true
  }
};

export default Trades;
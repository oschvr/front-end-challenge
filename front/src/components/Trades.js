import React, { Component } from 'react';
import moment from 'moment';

export class Trades extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: this.props.data
    }
  }

  getInitialState(){
    return {
      data: this.props.data
    }
  }

  componentWillMount(){
    //fetch 20 trades to display at first. map the obj values to the socket standard
    fetch('https://api.bitso.com/v3/trades/?book=btc_mxn&limit=30')
      .then(response => response.json())
      .then(data => this.setState({
        data: data.payload.map((trade)=>{
          console.log(trade.created_at);
          const {amount: a, created_at: d, maker_side: t, price: r, tid: i} = trade;
          return Object.assign({}, {a, d, t, r, i});
        })
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
      console.log('Incoming Trade:', trade);
      if(trade.type === 'trades' && trade.payload){
        //Add new data to trades socket info
        trade.payload[0].c = new Date();
        //Create a copy of state.data, limit 20
        const data = this.state.data;
        //unshift => push to the top
        data.unshift(trade.payload[0]);
        //slice to the top N elements
        //data.slice(0, 30);
        //create animation
        //Push to setState. This calls render() automatically
        this.setState({
          data: data
        })
      }
    }
  }

  render(){
    //get current state.data
    const data = this.state.data;
    //console.log('Trades: ',data);
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
                        data.map((i) => i.t === 0 || i.t === 'buy'
                        ? 
                          <tr className="small" key={i.i}>
                            <td>{moment(i.d).format('HH:mm:ss')}</td>
                            <td className="text-success">{i.r}</td>
                            <td>{parseFloat(i.a).toFixed(8)}</td>
                          </tr> 
                        : 
                          <tr className="small" key={i.i}> 
                            <td>{moment(i.d).format('HH:mm:ss')}</td>
                            <td className="text-danger">{i.r}</td>
                            <td>{parseFloat(i.a).toFixed(8)}</td>
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

Trades.defaultProps = { data: [] };

export default Trades;
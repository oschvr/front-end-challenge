import React, { Component } from 'react';
import moment from 'moment';
import { Row } from 'react-grid-system';

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
    fetch('https://api.bitso.com/v3/trades/?book=btc_mxn&limit=20')
      .then(response => response.json())
      .then(data => this.setState({
        data: data.payload.sort().map((x)=>{
          const {amount: a, created_at: c, maker_side: t, price: r, tid: i} = x;
          return Object.assign({}, {a, c, t, r, i});
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
      if(trade.type === 'trades' && trade.payload){
        
        //Add new data to trades socket info
        trade.payload[0].c = new Date();
        
        //Create a copy of state.data, limit 20
        const data = this.state.data;
        console.log('Current data: ', data);
        data.push(trade.payload[0]);
        
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
          <div className="card">
              <div className="card-body px-1">
                  <h4>Trades</h4>                
                    <div className="px-1">
                      <table className="table table-borderless table-sm">
                        <thead>
                          <tr>
                            <th scope="col">Time</th>
                            <th scope="col">Price</th>
                            <th scope="col">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                        { 
                          data.map((i) => i.t === 0 || i.t === 'buy'
                          ? 
                            <tr className="small" scope="row" key={i.i}>
                              <td>{moment(i.c).format('HH:mm:ss')}</td>
                              <td className="text-success">{i.r}</td>
                              <td>{i.a}</td>
                            </tr> 
                          : 
                            <tr className="small" scope="row" key={i.i}>
                              <td>{moment(i.c).format('HH:mm:ss')}</td>
                              <td className="text-danger">{i.r}</td>
                              <td>{i.a}</td>
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
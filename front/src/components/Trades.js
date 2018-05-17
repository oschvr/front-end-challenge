import React, { Component } from 'react';

import io from 'socket.io-client';
import moment from 'moment';

var websocket = new WebSocket('wss://ws.bitso.com');

export class Trades extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: []
    }
  }

  getInitialState(){
    return {
      data: []
    }
  }

  componentWillMount(){
    fetch('https://api.bitso.com/v3/trades/?book=btc_mxn&limit=15')
      .then(response => response.json())
      .then(data => this.setState({ data: data.payload }))
  }

  componentDidMount(){
    this.socket = new WebSocket('wss://ws.bitso.com');
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'trades' }));
    }
    this.socket.onmessage = (msg) => {
      const trade = JSON.parse(msg.data);
      if(trade.type == 'trades' && trade.payload){
        const data = this.state.data;
        data.push(trade.payload);
        this.setState({
          data: data
        })
      }
    }
  }

  render(){
    const data = this.state.data;
    return (
      <div>
          <div className="card">
              <div className="card-body">
                  <h3>Trades</h3>                
                  <ul className="list-unstyled">
                    <div className="px-1">
                      { 
                        data.map((i) => i.maker_side === 'buy' 
                        ? 
                          <li className='text-success small' key={i.tid}> {moment(i.created_at).format('HH:mm:ss')}  {i.price}  {i.amount} </li> 
                        : 
                          <li className='text-danger small' key={i.tid}> {moment(i.created_at).format('HH:mm:ss')}  {i.price}  {i.amount} </li>)
                      }
                    </div>
                  </ul>
              </div> 
          </div>
      </div>
    )
  }
}

Trades.defaultProps = { data: [] };

export default Trades;
import React, { Component } from 'react';

import io from 'socket.io-client';
import moment from 'moment';

var websocket = new WebSocket('wss://ws.bitso.com');

export class Orders extends Component {
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
  };

  componentWillMount(){
    fetch('https://api.bitso.com/v3/order_book/?book=btc_mxn&limit=20')
      .then(response => response.json())
      .then(data => this.setState({ data: data.payload }))
    console.log(this.state.data); 
  }

  componentDidMount(){
    this.socket = new WebSocket('wss://ws.bitso.com');
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'orders' }));
    }
    this.socket.onmessage = (msg) => {
      const order = JSON.parse(msg.data);
      if(order.type == 'orders' && order.payload){
        const data = this.state.data;
        //console.log(data);
        //data.push(order.payload);
        this.setState({
          data: order.payload
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
                  <h3>Orders</h3>                
                  <ul className="list-unstyled">
                    <div className="px-1">
                    </div>
                  </ul>
              </div> 
          </div>
      </div>
    )
  }
}

Orders.defaultProps = { data: [] };

export default Orders;
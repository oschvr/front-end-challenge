import React, { Component } from 'react';
import { Row, Col } from 'react-grid-system';

import io from 'socket.io-client';
import moment from 'moment';

var websocket = new WebSocket('wss://ws.bitso.com');

export class Orders extends Component {
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
  };

  componentWillMount(){
    fetch('https://api.bitso.com/v3/order_book/?book=btc_mxn&limit=20')
      .then(response => response.json())
      .then(data => this.setState({ data: data.payload })) 
  }

  componentDidMount(){
    this.socket = new WebSocket('wss://ws.bitso.com');
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'orders' }));
    }
    this.socket.onmessage = (msg) => {
      const order = JSON.parse(msg.data);
      console.log('incoming order: ', order.payload);
      if(order.type == 'orders' && order.payload){
        const orders = this.state.data;
        //console.log(orders);
        this.setState({
          data: orders
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
                <Row>

                </Row>
              </div> 
          </div>
      </div>
    )
  }
}


export default Orders;
import React, { Component } from 'react';

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
    //fetch 20 trades to display at first. map the obj values to the socket standard
    fetch('https://api.bitso.com/v3/order_book/?book=btc_mxn&limit=20')
      .then(response => response.json())
      .then(data => console.log(data)) 
  }

  componentDidMount(){
    this.socket = new WebSocket('wss://ws.bitso.com');
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'orders' }));
    }
    this.socket.onmessage = (msg) => {
      const order = JSON.parse(msg.data);
      //console.log('incoming order: ', order.payload);
      if(order.type === 'orders' && order.payload){
        const orders = this.state.data;
        //console.log(orders);
        this.setState({
          data: orders
        })
      }
    }
  }

  render(){
    return (
      <div>
          <div className="card">
              <div className="card-body">
                <h3>Orders</h3>
              </div> 
          </div>
      </div>
    )
  }
}


export default Orders;
import React, { Component } from 'react';
import { Row, Col } from 'react-grid-system';

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
    fetch('https://api.bitso.com/v3/order_book/?book=btc_mxn&aggregate=false&limit=20')
      .then(response => response.json())

  }

  componentDidMount(){
    //new socket instance
    this.socket = new WebSocket('wss://ws.bitso.com');

    //subscribe to the ordres channel
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'orders' }));
    }

    //listen for orders channel new msg
    this.socket.onmessage = (msg) => {
      const order = JSON.parse(msg.data);
      //console.log('incoming order: ', order.payload);
      if(order.type === 'orders' && order.payload){
        //const orders = this.state.data;
        //console.log('Current Data: ', orders);
        //this.setState({
        //  data: orders
        //})
      }
    }
  }

  render(){
    return (
      <div>
          <div className="card bg-dark text-light rounded-0 border-0">
              <div className="card-body text-center px-1">
                <h4>Orders</h4>
                <div className="px-1">
                  <Row>
                    <Col xs={6}>
                    <div className="card bg-secondary text-light rounded-0">
                      <div className="card-block pt-2 pb-0">
                        <h6 className="text-uppercase">Compras</h6>
                      </div>
                    </div>
                      <table className="table table-borderless table-sm">
                        <thead>
                          <tr className="text-uppercase small">
                            <th scope="col">Amount</th>
                            <th scope="col">Value</th>
                            <th scope="col">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          
                        </tbody>
                      </table>
                    </Col>
                    <Col xs={6}>
                    <div className="card bg-secondary text-light rounded-0">
                      <div className="card-block pt-2 pb-0">
                        <h6 className="text-uppercase">Ventas</h6>
                      </div>
                    </div>
                    <table className="table table-borderless table-sm">
                      <thead>
                        <tr className="text-uppercase small">
                          <th scope="col">Amount</th>
                          <th scope="col">Value</th>
                          <th scope="col">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                      </tbody>
                    </table>
                    </Col>
                  </Row>
                </div>
              </div> 
          </div>
      </div>
    )
  }
}


export default Orders;
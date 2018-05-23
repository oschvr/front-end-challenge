import React, { Component } from 'react';
import { Row, Col } from 'react-grid-system';

//API
import axios from 'axios';

//Utils
import moment from 'moment';
import NumberFormat from 'react-number-format';

export class Orders extends Component {
  constructor(props){
    super(props)

    this.state = {
      data: {
        sequence: {},
        updated_at: {},
        asks: [],
        bids: [],
        loading: true
      }
    }
  }

  getInitialState(){
    return {
      data: {
        sequence: {},
        updated_at: {},
        asks: [],
        bids: [],
        loading: true
      }
    }
  }

  componentWillMount(){
    //fetch orders to display at first. map the obj values to the socket standard
    axios.get('https://api.bitso.com/v3/order_book/?book=btc_mxn&aggregate=true')
      .then((res) => { 
        this.setState({ 
          data: { 
            sequence: res.data.payload.sequence,
            updated_at: res.data.payload.updated_at,
            asks: res.data.payload.asks.map((ask) => {
              const {amount: a, price: r} = ask;
              return Object.assign({}, {a, r});
            }),
            bids: res.data.payload.bids.map((bid) => {
              const {amount: a, price: r} = bid;
              return Object.assign({}, {a, r});
            }),
            loading: false,
          }
        });
      }, (err) => {
        console.log('Orders Error: ', err);
      })
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
      //console.log('Incoming Order: ', order);
      if(order.type === 'diff_orders' && order.payload){
        // const orders = {
        //   sequence: order.payload.sequence,
        //   updated_at: order.payload.updated_at,
        //   asks: order.payload.asks,
        //   bids: order.payload.bids
        // }
        //this.setState({orders})
      }
    }
  }

  render(){
    const data = this.state.data;
    //console.log(data);
    return (
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
                      <th scope="col">Sum</th>  
                      <th scope="col"><span className="text-muted">BTC</span> Monto</th>
                      <th scope="col">Valor</th>
                      <th scope="col"><span className="text-muted">MXN</span> Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.loading 
                      ? 
                      <tr><td colSpan={4}>Loading</td></tr> 
                      : 
                      data.asks.map((i) => {
                        //console.log(i);
                        <tr className="small">
                          <td>{i.a}</td>  
                          <td>
                            <NumberFormat value={i.a} displayType={'text'} decimalScale={8} fixedDecimalScale={true}/>
                          </td>
                          <td>
                            <NumberFormat value={i.r} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}/>
                          </td> 
                          <td className="text-success">
                            <NumberFormat value={i.r} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}/>
                          </td>
                        </tr>
                      })
                    }
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
                  <th scope="col">Sum</th>  
                  <th scope="col"><span className="text-muted">BTC</span> Monto</th>
                  <th scope="col">Valor</th>
                  <th scope="col"><span className="text-muted">MXN</span> Precio</th>
                  </tr>
                </thead>
                <tbody>
                {
                  data.loading ? 
                  <tr><td colSpan={4}>Loading</td></tr> : 
                  data.bids.slice(0,20).map((i) => {
                    <tr className="small">
                      <td>{i.a}}</td>  
                      <td>
                        <NumberFormat value={i.a} displayType={'text'} decimalScale={8} fixedDecimalScale={true}/>
                      </td>
                      <td>
                        <NumberFormat value={parseFloat(i.r) * parseFloat(i.a)} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}/>
                      </td> 
                      <td className="text-success">
                        <NumberFormat value={i.r} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}/>
                      </td>
                    </tr>
                  })
                }
                </tbody>
              </table>
              </Col>
            </Row>
          </div>
        </div> 
      </div>
    )
  }
}

Orders.defaultProps = {
  data: {
    sequence: {},
    updated_at: {},
    asks: [],
    bids: [],
    loading: true
  }
}

export default Orders;
import React, { Component, Fragment } from 'react';

//UI
import { Row, Col, Container } from 'react-grid-system';

//Components
import Trades from './Trades';
import Chart from './Chart';
import Orders from './Orders';
import { Market } from './Market';
import { Topbar } from './Topbar';
import { Navbar } from './Navbar';

//Utils
import axios from 'axios';
import id from 'shortid';
import uuid from 'uuid';
import moment from 'moment';

export class Layout extends Component {
  constructor(props){
    super(props);

    this.url = 'https://api.bitso.com/v3';
    this.socket = new WebSocket('wss://ws.bitso.com');
    //this.book = props.book;

    this.state = {
      trades: null,
      orders: null,
      initialTrades: null,
      initialOrders: null,
      loading: true
    }
  }

  handleStateChange = (data) => {
    //console.log(...data);
    this.setState({data})
  }
 
  componentWillMount() {
    //const { book } = this.props.match.params;
    const book = 'btc_mxn';

    this.getInitialOrders(book);
    this.getInitialTrades(book);

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({action: 'subscribe', book, type: 'trades'}));
      this.socket.send(JSON.stringify({action: 'subscribe', book, type: 'diff_orders'}));
    }

    this.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if(data.type === 'diff-orders' && data.payload) {
        //Create a copy of state.data, limit 20
        const orders = this.state.orders;
        this.setState({
            orders
        })        
      } else if(data.type === 'trades' && data.payload){
        data.payload[0].c = moment().toISOString();
        const trades = this.state.trades;
        //trades.unshift(data.payload[0]);
        this.setState({
            trades
        })
      }
    }
  }

  componentWillUnmount = () => {
    this.socket.close();
  }

  getInitialOrders = (book) => {
    axios.get(this.url+"/order_book", {
      params: { 
        book, 
        aggregate: true 
      }
    })
    .then((res) => { 
      this.setState({     
        initialOrders: { 
          sequence: res.data.payload.sequence,
          updated_at: res.data.payload.updated_at,
          asks: res.data.payload.asks.map((ask) => {
            ask.value = +ask.amount * +ask.price;
            const oid = id.generate();
            const {amount: a, price: r, value: v, oid: o} = ask;
            return Object.assign({}, {a, r, v, o});
          }),
          bids: res.data.payload.bids.map((bid) => {
            bid.value = +bid.amount * +bid.price;
            const oid = id.generate();
            const {amount: a, price: r, value: v, oid: o} = bid;
            return Object.assign({}, {a, r, v, o});
          })
        }
      })
    })
    .catch((err) => {
      return Object.assign({}, err)
    })
  }

  getInitialTrades = (book) =>{
    axios.get(this.url+'/trades', {
      params: {
        book,
        limit: 30
      }
    })
    .then((res) => this.setState({
      initialTrades: res.data.payload.map((trade) => {
        trade.value = +trade.amount * +trade.price; 
        const {amount: a, created_at: d, maker_side: t, price: r, value: v, tid: i} = trade;
        return Object.assign({}, {a, d, t, r, v, i});
      }),
      loading: false   
    }))
    .catch((err)=>{
      return Object.assign({}, err)
    })
  }

  render() {
    const data = this.state;
    console.log('Data: ', data);
    return (
      <div>
        {
          data.loading
          ?
          <Fragment>
            <Row>
              <Col sm={12}>
                <h1>Loading</h1>
              </Col>
            </Row>
          </Fragment>
          :
          <Fragment>
            <Row>
              <Col sm={12}>
                  <Navbar/>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                  <Topbar/>
              </Col>
            </Row>
            <Row nogutter className="h-100">
              <Col xs={3}>
                <Trades trades={data.trades || data.initialTrades} />
              </Col>
              <Col xs={9}>
                <Row>
                  <Col sm={12}>
                    <Chart/>
                  </Col>
                  <Col sm={12}>
                    <Orders orders={data.orders || data.initialOrders} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Fragment>
        }
      </div>
    )
  }
}

export default Layout;

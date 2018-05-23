import React, { Component, Fragment } from 'react';

//UI
import { Row, Col } from 'react-grid-system';

//Components
import Trades from './Trades';
import Chart from './Chart';
import Orders from './Orders';
import { Topbar } from './Topbar';
import { Navbar } from './Navbar';

//Utils
import axios from 'axios';
import uuid from 'uuid';
import moment from 'moment';
import shortid from 'shortid';

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
      ticker: null,
      loading: true
    }
  }

  
  /**
   * Handles the state change
   * @param  {} data
   */
  handleStateChange = (data) => {
    //console.log(...data);
    this.setState({data})
  }
 
  componentWillMount() {
    //const { book } = this.props.match.params;
    const book = 'btc_mxn';

    //this.getTicker(book);
    this.getInitialOrders(book);
    this.getInitialTrades(book);
    
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({action: 'subscribe', book: book, type: 'trades'}));
      this.socket.send(JSON.stringify({ action: 'subscribe', book: book, type: 'diff-orders' }));
    }

    this.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if(data.type === 'diff-orders' && data.payload) {
        let orders = this.state.orders;
        if(!orders){    
          orders = this.state.initialOrders;
          this.setState({ orders })
        } else {
          this.updateOrderBook(data);
          //this.setState({ orders })
        }
      } else if(data.type === 'trades' && data.payload){
        data.payload[0].d = moment().toISOString();
        const trades = this.state.initialTrades;
        if(trades){
          trades.unshift(data.payload[0]);
          this.setState({ trades })
        }
      }
    }
  }

  componentWillUnmount = () => {
    this.socket.close();
  }

  /**
   * Gets the ticker object.
   * Updates the component state
   * @param  {} book
   */
  getTicker = (book) => {
    axios.get(this.url+'/ticker', {
    }).then((res) =>{
      const ticker = res.data.payload;
      //console.log('Ticker: ',ticker);
      this.setState({ ticker })
    })
  }
  
  /**
   * Update the order book based on the socket diff-orders channel
   * @param  {} initialOrders
   * @param  {} orders
   * @param  {} book
   */
  updateOrderBook = (initialOrders, orders, book) => {
    // 1 Compare orders.sequence with initialOrders.sequence
    // 2 Map asks and bids and order asc
    // 3 Order by price
    // 4 Generate a sum attr 
  }
  
  /**
   * Fetches the inital order objects
   * Updates the component state
   * @param  {} book
   */
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
            ask.oid = shortid.generate();
            //ask.oid = uuid();
            ask.updated_at = moment().toISOString();
            const {amount: a, price: r, value: v, oid: o, updated_at: d} = ask;
            return Object.assign({}, {d, a, r, v, o});
          }).slice(0,20),
          bids: res.data.payload.bids.map((bid) => {
            bid.value = +bid.amount * +bid.price;
            bid.oid = shortid.generate();
            //bid.oid = uuid();
            bid.updated_at = moment().toISOString();
            const {amount: a, price: r, value: v, oid: o, updated_at: d} = bid;
            return Object.assign({}, {d, a, r, v, o});
          }).slice(0,20)
        },
        loading: false 
      })
    })
    .catch((err) => {
      return Object.assign({}, err)
    })
  }
  
  /**
   * Fetches the initial trades objects.
   * Updates the component state
   * @param  {} book
   * @param  {} limit
   */
  getInitialTrades = (book, limit) =>{
    axios.get(this.url+'/trades', {
      params: {
        book,
        limit
      }
    })
    .then((res) => this.setState({
      initialTrades: res.data.payload.map((trade) => {
        trade.value = +trade.amount * +trade.price; 
        const {amount: a, created_at: d, maker_side: t, price: r, value: v, tid: i} = trade;
        return Object.assign({}, {a, d, t, r, v, i});
      })  
    }))
    .catch((err)=>{
      return Object.assign({}, err)
    })
  }

   
  render() {
    const data = this.state;
    //console.log('Data: ', data);
    return (
      <div>
        {
          data.loading
          ?
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
              </Col>
              <Col xs={9}>
                <Row>
                  <Col sm={12}>
                  </Col>
                </Row>
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

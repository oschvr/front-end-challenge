import React, { Component, Fragment } from 'react';

//UI
import { Row, Col } from 'react-grid-system';

//Components
import Trades from './Trades';
import Chart from './Chart';
import Orders from './Orders';
import { Topbar } from './Topbar';
import { Navbar } from './Navbar';

export class Dashboard extends Component {
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

export default Dashboard;

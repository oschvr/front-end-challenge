import React, { Component } from 'react';
import { Row, Col } from 'react-grid-system';

//Utils
import moment from 'moment';
import NumberFormat from 'react-number-format';

export class Orders extends Component {
  constructor(props){
    super(props)
    this.orders = this.props.orders;
  }

  componentDidMount = () => {
    
  }
  
  calculateSum = (orders) =>{
    return orders.reduce((i)=>{
      return i.a
    })
  }

  render(){
    const orders = this.orders;
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
    orders: null
}

export default Orders;
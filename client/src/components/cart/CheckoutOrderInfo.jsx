import React, { Component } from 'react'
import { Table, Loader } from 'rsuite';

// CSS
import '../../css/cart/cartCheckout.css'


class CheckoutOrderInfo extends Component {

    componentDidMount() {
        // console.log('Personal Info Ready')
      }

    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
          decimalCount = Math.abs(decimalCount);
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      
          const negativeSign = amount < 0 ? "-" : "";
      
          let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
          let j = (i.length > 3) ? i.length % 3 : 0;
      
          return '$' + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
          // console.log(e)
        }
      };

    render() {
        // Verify this is current step
        if (this.props.currentStep !== 1) {
            return null
        }
        const { Column, HeaderCell, Cell } = Table;

        return (
            <div className='checkoutFormRow orderInfoStep'>
              <h2 className='orderInfoTitle'>Your Order</h2>
              <div id="orderInfoLoader" hidden={this.props.cartLoaded ? true : false}>
                <Loader vertical center speed="slow" size="lg" content="Loading cart..." />
              </div>
              <div id="orderInfoTableDiv" hidden={this.props.cartLoaded ? false : true}>
                <Table
                  className='orderTable'
                  // height={400}
                  defaultExpandAllRows={true}
                  data={this.props.currentCart}
                  renderEmpty={() => <div id='emptyCartTitle'>Cart is Empty</div>}
                  onRowClick={data => {
                      // console.log(data);
                  }}
                >
                  <Column id='orderSoapQty' flexGrow={1} align="left">
                      <HeaderCell>Qty</HeaderCell>
                      <Cell dataKey="soapQty" />
                  </Column>

                  <Column id='orderSoapName' flexGrow={1} align="left" >
                      <HeaderCell>Name</HeaderCell>
                      <Cell dataKey="soapName" />
                      {/* <Cell>{(rowData, rowIndex) => {return rowData.productId.name;}}</Cell> */}
                  </Column>

                  <Column id='orderSoapDescription' flexGrow={1} align="left">
                      <HeaderCell>Description</HeaderCell>
                      <Cell>{(rowData) => {return rowData.soapIngredients}}</Cell>
                      {/* <Cell dataKey="soapPrice" /> */}
                  </Column>

                  <Column id='orderSoapPrice' flexGrow={1} align="right">
                      <HeaderCell>Price</HeaderCell>
                      <Cell>{(rowData) => {return this.formatMoney(rowData.soapPrice)}}</Cell>
                      {/* <Cell dataKey="soapPrice" /> */}
                  </Column>

                  <Column id='orderSoapTotalPrice' flexGrow={1} align="right">
                      <HeaderCell>Total Price</HeaderCell>
                      <Cell>{(rowData) => {return this.formatMoney(rowData.soapTotal)}}</Cell>
                  </Column>

                  {/* <Column width={200}>
                      <HeaderCell>Img</HeaderCell>
                      <Cell dataKey="image" />
                  </Column> */}

              </Table>
              </div>
              <div id='orderInfoTotalDiv'>
                  <h2 id='orderSubtotal' className='orderInfoTitle'>Subtotal: {this.formatMoney(this.props.orderSubTotal)}</h2>
                  <h2 id='orderShippingCost' className='orderInfoTitle'>Shipping & Handling: {this.formatMoney(this.props.orderShippingCost)}</h2>
                  <h2 id='orderGrandTotal' className='orderInfoTitle'>Grand Total: {this.formatMoney(this.props.orderGrandTotal)}</h2>
              </div>
              
                
            </div>
        )
      };
};

export default CheckoutOrderInfo;
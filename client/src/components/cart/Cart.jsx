import React, { Component } from 'react';
import { Table, Modal, Button, Icon } from 'rsuite';
import $ from 'jquery'
import API from '../../utils/API'
import '../../css/cart/shoppingCart.css'

class Cart extends Component {
  constructor(props) {
      super(props);
      

      this.state = {
        carts: [],
        cartTotal: '',
        payloader: '',
        hasError: '',
        soapName: '',
        soapIngredients: '',
        soapPrice: '',
        soapImage: '',
        soapId: '',
        soapQty: '',
        error: '',
        qty: 'qty',
        show: false
      }

      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
      this.changeQty = this.changeQty.bind(this)
      this.fetchCart = this.fetchCart.bind(this)
      this.increaseQty = this.increaseQty.bind(this)
      this.decreaseQty = this.decreaseQty.bind(this)
      this.removeItem = this.removeItem.bind(this)
      this.handleRemoveItem = this.handleRemoveItem.bind(this)
      this.emptyCart = this.emptyCart.bind(this)
      this.changeQtyState = this.changeQtyState.bind(this)
      this.handleOrderSubmit = this.handleOrderSubmit.bind(this)
    }

    componentDidMount() {
      this.fetchCart()
    }

    async fetchCart() {
        const res = await fetch("http://localhost:3000/cart");
        res
          .json()
          .then((res) => {
            // console.log('CART CONTENTS: ', res.data.items);
            let cartItems = res.data.items
            let cartTotal = 0
            for (let i=0; i<cartItems.length; i++) {
              let cartItem = cartItems[i]
              let cartItemTotal = cartItem.total
              cartTotal = cartTotal + cartItemTotal
            }
            // console.log('CART TOTAL: ', cartTotal)
            this.setState({
                carts: res.data.items,
                payloader: res.data,
                cartTotal: cartTotal
            })
          })
          .catch((error) => {
            this.setState({
                hasError: error
            })
          });
      }

    async increaseQty(id) {
        try {
          const res = await fetch("http://localhost:3000/cart", {
            method: "POST",
            body: JSON.stringify({
              productId: id,
              quantity: 1,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            
          });
          console.log(res);
          this.fetchCart();
        //   alert("Item Increamented");
        } catch (err) {
          console.log(err);
        }
      }

    async decreaseQty(id) {
        try {
          const res = await fetch("http://localhost:3000/cart/minus", {
            method: "POST",
            body: JSON.stringify({
              productId: id,
              quantity: 1,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            
          });
          console.log(res);
          this.fetchCart();
        //   alert("Item Increamented");
        } catch (err) {
          console.log(err);
        }
      }

    async removeItem(id) {
        try {
          const res = await fetch("http://localhost:3000/cart", {
            method: "POST",
            body: JSON.stringify({
              productId: id,
              quantity: -1,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            
          });
          console.log(res);
          this.fetchCart();
        //   alert("Item Increamented");
        } catch (err) {
          console.log(err);
        }
      }
    
    
    async emptyCart() {
        try {
          const res = await fetch("http://localhost:3000/cart/empty-cart", {
            method: "DELETE",
          });
          await res.json();
          this.fetchCart();
          this.props.history.push("/");
        } catch (err) {
          console.log(err);
        }
      }
  
    changeQty = (e) => {
        console.log("Quantity change: ", e.target)
        let newQty = $(e.target).text()
        console.log('New qty: ', newQty)
        this.setState({
          qty: newQty
        })
      }

    changeQtyState = (e) => {
        console.log('CHANGE TARGET: ', e.target)
        console.log('BUTTON MATH: ', e.target.dataset.buttonmath)
        let buttonMath = e.target.dataset.buttonmath
        let soapQty = this.state.soapQty

        if (buttonMath === 'positive') {
            this.setState({
                soapQty: soapQty + 1
            }, () => {
                console.log('NEW SOAP QTY STATE: ', this.state.soapQty)
                this.increaseQty(this.state.soapId)
            })
        } else {
            this.setState({
                soapQty: soapQty - 1
            }, () => {
                console.log('NEW SOAP QTY STATE: ', this.state.soapQty)
                this.decreaseQty(this.state.soapId)
            })
        }
      }

    close() {
        this.fetchCart()
        this.setState({ show: false });
      }

    handleRemoveItem = (e) => {
        let cart = this.state.carts
        let targetSoap = e.target
        let soapId = targetSoap.dataset.product
        let soap = cart.filter(product => {
            return product._id === soapId
        })
        let soapProductId = soap[0].productId._id
        let soapName = soap[0].productId.name
        console.log('SOAP SELECTED: ', soap)
        console.log('SOAP NAME: ', soapName)
        console.log('SOAP PRODUCT ID: ', soapProductId)
        this.removeItem(soapProductId)
    }
  
    open = (e) => {
        let cart = this.state.carts
        let targetSoap = e.target
        let soapId = targetSoap.dataset.product
        let soap = cart.filter(product => {
            return product._id === soapId
        })
        let soapProductId = soap[0].productId._id
        let soapName = soap[0].productId.name
        console.log('SOAP SELECTED: ', soap)
        console.log('SOAP NAME: ', soapName)
        console.log('SOAP ID: ', soapId)
        this.setState({
            soapId: soapProductId,
            soapName: soapName,
            soapPrice: soap[0].price,
            soapQty: soap[0].quantity,
            show: true
        })
        // let soap = e.target
        // let soapName = soap.productId[0]
        // let soapId = soap._id
        // // let soapImage = soap.dataset.soapimage
        // let soapPrice = soap.price
        // console.log("PRODUCT: ", soapName)
        // this.setState({ 
        //     // soapImage: soapImage,
        //     soapId: soapId,
        //     soapName: soapName,
        //     soapPrice: soapPrice,
        //     show: true
        // });
      }

    handleOrderSubmit = (e) => {
      e.preventDefault()
      console.log('SUBMITTING ORDER')
      console.log('CURRENT CART: ', this.state.carts)
      let cart = this.state.carts
      let orderData = { 
          firstName: 'test',
          lastName: 'tester',
          email: 'test@yahoo.com',
          phoneNumber: '111-222-3333',
          purchaseId: 'testId',
          confirmationNumber: '1234',
          purchaseDetails: cart
      };
      console.log('ORDER DATA: ', orderData);
      API.submitOrder(orderData)
        .then(res => {
          console.log('ORDER SUBMIT RESULT: ', res) 
          })
          .catch(error => {
              console.log(error)
          })
    }
  
  

  render() {     
    const { Column, HeaderCell, Cell } = Table;                                                  
      return (
          <span>
            <h2 className='shoppingCartTitle'>Shopping Cart</h2>
            <div id='cartRow' className="row">
              
            <Modal show={this.state.show} onHide={this.close}>
              <Modal.Header>
                  <Modal.Title>{this.state.soapName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5 className="font-medium m-b-30">
                  Price: ${this.state.soapPrice} 
                  {/* /{" "} */}
                  {/* <del className="text-muted line-through">$225</del> */}
                </h5><br />
                  Qty: {this.state.soapQty}
                <Button 
                  className="changeQtyButton btn btn-primary btn-sm"
                  onClick={(e) => {this.changeQtyState(e)}}
                  data-buttonmath='negative'
                >
                  -
                </Button>
                <Button
                  onClick={(e) => {this.changeQtyState(e)}}
                  className="btn btn-primary btn-sm"
                  data-buttonmath='positive'
                >
                  +
                </Button>
              </Modal.Body>
              <Modal.Footer>
                
                {/* <Button onClick={(e) => this.increaseQty(this.state.soapId)} appearance="primary">
                  Update Cart
                </Button> */}
                <Button onClick={this.close} appearance="subtle">
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

              <Table
                className='cartTable'
                // height={400}
                data={this.state.carts}
                renderEmpty={() => <div id='emptyCartTitle'>Cart is Empty</div>}
                onRowClick={data => {
                    console.log(data);
                }}

                >
                <Column width={200} align="center" fixed>
                    <HeaderCell>Name</HeaderCell>
                    <Cell>{(rowData, rowIndex) => {return rowData.productId.name;}}</Cell>
                </Column>

                <Column width={70} fixed>
                    <HeaderCell>Price ($)</HeaderCell>
                    <Cell dataKey="price" />
                </Column>

                <Column width={70}>
                    <HeaderCell>Qty</HeaderCell>
                    <Cell dataKey="quantity" />
                </Column>

                <Column width={200}>
                    <HeaderCell>Total Price ($)</HeaderCell>
                    <Cell dataKey="total" />
                </Column>

                {/* <Column width={200}>
                    <HeaderCell>Img</HeaderCell>
                    <Cell dataKey="image" />
                </Column> */}


                <Column id='actionColumn' width={120} fixed="right">
                    <HeaderCell id='actionColumnHeader'>Action</HeaderCell>
                    <Cell>
                    {rowData => {
                        // function handleAction() {
                        // alert(`id:${rowData.id}`);
                        // }
                        return (
                        <span>
                            <Button className='cartEditButtons' onClick={this.open} data-product={rowData._id}> Edit </Button> |{' '}
                            <Button className='cartEditButtons' onClick={(e) => this.handleRemoveItem(e)} data-product={rowData._id}> Remove </Button>
                        </span>
                        );
                    }}
                    </Cell>
                </Column>
            </Table>
          </div>
          <div id='placeOrderRow' className="row">
              <h2 id='placeOrderTotal'>Grand Total: ${this.state.cartTotal}</h2>
              <Button id='placeOrderButton' onClick={this.handleOrderSubmit}>
                  Secure Checkout <Icon icon='lock' />
              </Button>
          </div>   
        </span>
      )
  }
}

export default Cart
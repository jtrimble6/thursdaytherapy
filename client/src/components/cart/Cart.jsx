import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Table, Modal, Button, Icon } from 'rsuite';
import $ from 'jquery'
import API from '../../utils/API'

import '../../css/cart/shoppingCart.css'

class Cart extends Component {
  constructor(props) {
      super(props);
      

      this.state = {
        developmentURL: "http://localhost:3000/cart",
        productionURL: "https://thursdaytherapy.herokuapp.com/cart",
        redirect: false,
        products: [],
        carts: [],
        cartTotal: '',
        payloader: '',
        hasError: '',
        itemKey: '',
        soapName: '',
        soapIngredients: '',
        soapPrice: '',
        soapImage: '',
        soapId: '',
        soapQty: '',
        error: '',
        qty: 'qty',
        show: false,
        showPaymentForm: false,
        loaded: false,
        submittingOrder: false
      }

      this.setRedirect = this.setRedirect.bind(this)
      this.renderRedirect = this.renderRedirect.bind(this)
      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
      this.handleOrderCheckout = this.handleOrderCheckout.bind(this)
      this.closePaymentForm = this.closePaymentForm.bind(this)
      this.changeQty = this.changeQty.bind(this)
      this.fetchCart = this.fetchCart.bind(this)
      this.fetchData = this.fetchData.bind(this)
      this.increaseQty = this.increaseQty.bind(this)
      this.decreaseQty = this.decreaseQty.bind(this)
      this.removeItem = this.removeItem.bind(this)
      this.handleRemoveItem = this.handleRemoveItem.bind(this)
      this.emptyCart = this.emptyCart.bind(this)
      this.changeQtyState = this.changeQtyState.bind(this)
    }

    componentDidMount() {
      this.fetchData()
      // this.fetchCart()
    }

    async fetchData() {
      let productImages = []
      const res = await fetch(process.env.NODE_ENV === "development" ? "http://localhost:3000/uploads" : "https://thursdaytherapy.herokuapp.com/uploads");
        res.json()
          .then((res) => {
            // console.log('ALL IMAGES: ', res);
            productImages = res
            // console.log('ALL IMAGES: ', res.data);
            // console.log('ALL FILES: ', res.file);
            this.setState({
              productImages: res,
              // filteredProducts: res.data
            });
            API.getProducts()
                .then(res => {
                  // console.log('PRODUCT IMAGES RETRIEVED: ', productImages)
                  let productsData = res.data
                  // console.log('PRODUCTS: ', productsData)
                  for (let p=0; p<productsData.length; p++) {
                    let product = productsData[p]
                    let productName = product.name
                    let productImage = productImages.filter(image => {
                      return image.productId === productName
                    })
                    let newProducts = [...productsData]
                    // console.log('FILENAME: ', productImage[0])
                    let productImageFile = productImage[0]
                    if (productImageFile) {
                      let newProduct = {
                        ...newProducts[p], 
                        soapImageFile: productImage[0].filename,
                        soapImageId: productImage[0]._id
                      }
                      newProducts[p] = newProduct
                      this.setState({
                        products: newProducts,
                      })
                      productsData = newProducts
                    }
                    this.fetchCart(newProducts)
                    // console.log('NEW PRODUCTS WITH IMAGES: ', this.state.filteredProducts)
                  }
                  // this.setState({
                  //     products: res.data,
                  //     filteredProducts: res.data
                  //   });
                })
                .catch(err => {
                  // console.log('ERROR GETTING PRODUCTS: ', err)
                })
          })
          .catch((error) => {
            this.setState({
              error: error
            });
        });
      }

    async fetchCart(newProducts) {
      let cart = []
      // console.log('LOCAL STORAGE: ', localStorage)
      // console.log('PRODUCTS: ', products)
      let cartTotal = 0
      for (let c=0; c<localStorage.length; c++) {
        let products = newProducts
        let itemKey = localStorage.key(c)
        let item = localStorage.getItem(itemKey)
        let itemObj = JSON.parse(item)
        // console.log('LOCAL STORAGE ITEM: ', itemObj)

        let itemLookup = ''
        let itemName = ''
        let itemPrice = ''
        let itemQty = ''
        let itemId = ''
        itemLookup = products.filter(product => {
          return (product._id === itemObj.soapName)
        })
        // console.log('ITEM LOOKUP: ', itemLookup)
        itemName = itemLookup[0].name
        itemPrice = itemLookup[0].price
        itemQty = itemObj.soapQty
        itemId = itemLookup[0]._id

        if (itemQty > 0) {
          let newCartItem = {
            'itemKey': itemKey,
            'soapName': itemName,
            'soapPrice': itemPrice,
            'soapQty': itemQty,
            'soapTotal': (itemPrice * itemQty),
            'soapId': itemId
          }
          cart.push(newCartItem)
          cartTotal = cartTotal + (itemPrice * itemQty)
        } else {
          this.removeItem(itemKey)
        }
        
      }
      
      this.setState({
        carts: cart,
        cartTotal: cartTotal
      })

      // console.log('CART: ', cart)

      }

    async increaseQty(itemKey) {
      let item = itemKey
      let soapItem = localStorage.getItem(item)
      let soapItemObj = JSON.parse(soapItem)
      console.log('SOAP ITEM OBJ: ', soapItemObj)
      let newSoapItemObj = {
        'soapName': soapItemObj.soapName,
        'soapQty': soapItemObj.soapQty++
      }
      let newSoapItemString = JSON.stringify(newSoapItemObj)
      localStorage.setItem(item, newSoapItemString)
      // this.props.updateCart()
      this.fetchData()
      }

    async decreaseQty(itemKey) {
        let item = itemKey
        let soapItem = localStorage.getItem(item)
        let soapItemObj = JSON.parse(soapItem)
        console.log('SOAP ITEM OBJ: ', soapItemObj)
        let newSoapItemObj = {
          'soapName': soapItemObj.soapName,
          'soapQty': soapItemObj.soapQty--
        }
        let newSoapItemString = JSON.stringify(newSoapItemObj)
        localStorage.setItem(item, newSoapItemString)
        // this.props.updateCart()
        this.fetchData()
      }

    async removeItem(itemKey) {
        localStorage.removeItem(itemKey)
        window.location.reload()
      }
    
    async emptyCart() {
        localStorage.clear()
        window.location.reload()
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
      }
  
    changeQty = (e) => {
        // console.log("Quantity change: ", e.target)
        let newQty = $(e.target).text()
        // console.log('New qty: ', newQty)
        this.setState({
          qty: newQty
        })
      }

    changeQtyState = (e) => {
        // console.log('CHANGE TARGET: ', e.target)
        // console.log('BUTTON MATH: ', e.target.dataset.buttonmath)
        let buttonMath = e.target.dataset.buttonmath
        let soapQty = JSON.parse(this.state.soapQty)
        let itemKey = this.state.itemKey

        if (buttonMath === 'positive') {
            this.setState({
                soapQty: soapQty + 1
            }, () => {
                // console.log('NEW SOAP QTY STATE: ', this.state.soapQty)
                this.increaseQty(itemKey)
            })
        } else {
            this.setState({
                soapQty: soapQty - 1
            }, () => {
                // console.log('NEW SOAP QTY STATE: ', this.state.soapQty)
                this.decreaseQty(itemKey)
            })
        }
      }

    close() {
        this.fetchCart(this.state.products)
        this.setState({ show: false });
      }

    closePaymentForm() {
        // this.fetchCart(this.state.products)
        this.setState({ showPaymentForm: false });
      }

    handleRemoveItem = (e) => {
        let cart = this.state.carts
        // console.log('CART: ', cart)
        let targetSoap = e.target
        // console.log('TARGET SOAP: ', targetSoap.dataset.product)
        let soapId = targetSoap.dataset.product
        let soap = cart.filter(product => {
            return product.soapId === soapId
        })
        // let soapProductId = soap[0].soapId
        // let soapName = soap[0].soapName
        let itemKey = soap[0].itemKey
        // console.log('REMOVE THIS KEY: ', itemKey)
        this.removeItem(itemKey)
        this.fetchData()
      }
  
    open = (e) => {
        let cart = this.state.carts
        // console.log('CART: ', cart)
        let targetSoap = e.target
        // console.log('TARGET SOAP: ', targetSoap.dataset.product)
        let soapId = targetSoap.dataset.product
        let soap = cart.filter(product => {
            return product.soapId === soapId
        })
        let soapProductId = soap[0].soapId
        let soapName = soap[0].soapName
        let itemKey = soap[0].itemKey
        // console.log('SOAP SELECTED: ', soap)
        // console.log('SOAP NAME: ', soapName)
        // console.log('SOAP ID: ', soapProductId)
        this.setState({
            itemKey: itemKey,
            soapId: soapProductId,
            soapName: soapName,
            soapPrice: soap[0].soapPrice,
            soapQty: soap[0].soapQty,
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

    handleOrderCheckout = () => {
      this.setRedirect()
      }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
      }

    renderRedirect = () => {
        if (this.state.redirect === true) {
          return <Redirect to='/checkout' />
        }
        else {}
      }

  
  

  render() {     
    const { Column, HeaderCell, Cell } = Table;                                                  
      return (
          <span>
            {this.renderRedirect()}
            <h2 className='shoppingCartTitle'>Shopping Cart</h2>
            <div id='cartRow' className="row">
              
            <Modal show={this.state.show} onHide={this.close}>
              <Modal.Header>
                  <Modal.Title>{this.state.soapName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5 className="font-medium m-b-30">
                  Price: {this.formatMoney(this.state.soapPrice)} 
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
                    // console.log(data);
                }}
              >
                <Column flexGrow={1} id='cartSoapQtyCol' width={70} align="center">
                    <HeaderCell>Qty</HeaderCell>
                    <Cell dataKey="soapQty" />
                </Column>

                <Column flexGrow={1} id='cartSoapNameCol' width={200} align="center">
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey="soapName" />
                    {/* <Cell>{(rowData, rowIndex) => {return rowData.productId.name;}}</Cell> */}
                </Column>

                <Column flexGrow={1} id='cartSoapPriceCol'width={200} align="center">
                    <HeaderCell>Price</HeaderCell>
                    <Cell>{(rowData) => {return this.formatMoney(rowData.soapPrice)}}</Cell>
                    {/* <Cell dataKey="soapPrice" /> */}
                </Column>

                <Column flexGrow={1} id='cartSoapTotalCol' width={200} align="center">
                    <HeaderCell>Total Price</HeaderCell>
                    <Cell>{(rowData) => {return this.formatMoney(rowData.soapTotal)}}</Cell>
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
                            <Button className='cartEditButtons' onClick={this.open} data-product={rowData.soapId}> Edit </Button> |{' '}
                            <Button className='cartEditButtons' onClick={(e) => this.handleRemoveItem(e)} data-product={rowData.soapId}> Remove </Button>
                        </span>
                        );
                    }}
                    </Cell>
                </Column>
            </Table>
          </div>
          <div id='placeOrderRow' className="row">
              <h2 id='placeOrderTotal'>Subtotal: {this.formatMoney(this.state.cartTotal)}</h2>
              <Button id='emptyCartButton' onClick={this.emptyCart}>
                  Empty Cart <Icon icon='trash' />
              </Button>
              <Button id='placeOrderButton' onClick={this.handleOrderCheckout}>
                  Secure Checkout <Icon icon='lock' />
              </Button>
          </div>   
        </span>
      )
  }
}

export default Cart
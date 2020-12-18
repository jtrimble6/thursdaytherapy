import React, { Component } from 'react';
import { Panel, Modal, Button, Dropdown, Form, FormGroup, FormControl, Icon, Grid, Row, Col, Loader, Alert } from 'rsuite';
import $ from 'jquery'
import API from '../../utils/API'
import '../../css/products/productsImages.css'

class Products extends Component {
  constructor(props) {
      super(props);

      this.state = {
        show: false,
        soapName: '',
        soapIngredients: '',
        soapPrice: '',
        soapImage: '',
        soapImageFile: '',
        soapId: '',
        error: '',
        qty: 'QTY',
        products: [],
        filteredProducts: []
      }

      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
      this.fetchData = this.fetchData.bind(this)
      this.addToCart = this.addToCart.bind(this)
      this.changeQty = this.changeQty.bind(this)
      this.updateExistingCart = this.updateExistingCart.bind(this)
      this.checkBrowser = this.checkBrowser.bind(this)
      this.handleSearchEntry = this.handleSearchEntry.bind(this)
  }

  componentDidMount() {
      this.fetchData()
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
                      filteredProducts: newProducts
                    })
                    productsData = newProducts
                    document.getElementById('productsLoader').hidden = true
                  }
                  this.props.updateCart()
                  // console.log('NEW PRODUCTS WITH IMAGES: ', this.state.filteredProducts)
                }
                // this.setState({
                //     products: res.data,
                //     filteredProducts: res.data
                //   });
              })
              .catch(err => {
                Alert.warning('There was an error loading the page. Please retry.', 10000)
                console.log('ERROR GETTING PRODUCTS: ', err)
              })
        })
        .catch((error) => {
          this.setState({
            error: error
          });
          Alert.warning('There was an error loading the page. Please retry.', 10000)
      });
    }

  async addToCart(id) {
    if (this.state.qty === 'QTY') {
      // console.log('must set a valid qty')
      Alert.warning('Please select qty.', 5000)
      return
    } else if (localStorage.getItem('item1')) {
      // localStorage.clear()
      let soapName = id;
      let soapQty = this.state.qty;
      let newCart = []
      // console.log('CART EXISTS: ', localStorage.key(0))

      for (let c=0; c<localStorage.length; c++) {
        let itemKey = localStorage.key(c)
        let item = localStorage.getItem(itemKey)
        // console.log('LOCAL STORAGE ITEM: ', item)
        let itemObj = JSON.parse(item)
        newCart.push(itemObj)
      }

      let itemAlreadyInCart = newCart.filter(item => {
        return item.soapName === soapName
      })

      if (itemAlreadyInCart.length) {
        // console.log('NEW CART: ', newCart)
        // console.log('ITEM ALREADY IN CART: ', itemAlreadyInCart)
        let data = [...newCart];
        let index = data.findIndex(obj => obj.soapName === itemAlreadyInCart[0].soapName);
        // console.log('FOUND INDEX: ', index)
        let newSoapQty = (parseInt(data[index].soapQty) + parseInt(soapQty))
        // console.log('NEW SOAP QTY: ', newSoapQty)
        data[index].soapQty = newSoapQty.toString();
        newCart = data
      } else {
        newCart.push({
          'soapName': soapName,
          'soapQty': soapQty,
        })
      }
      // console.log('NEW CART: ', newCart)
      this.updateExistingCart(newCart)
    } else {
      let soapName = id;
      let soapQty = this.state.qty;
      let soapAdded = {
        'soapName': soapName, 
        'soapQty': soapQty,
      }
      // localStorage.clear()
      let soapAddedString = JSON.stringify(soapAdded)
      localStorage.setItem('item1', soapAddedString);
      // console.log('LOCAL STORAGE: ', localStorage)
      Alert.success('Item added to cart!', 5000)
      this.close()
      }
    }

  checkBrowser() {
      if ('localStorage' in window && window['localStorage'] !== null) {
        // We can use localStorage object to store data.
        return true;
      } else {
        return false;
      }
    }

  updateExistingCart(cart) {
    let newCart = cart
    for (let n=0; n<newCart.length; n++) {
      let item = newCart[n]
      let itemString = JSON.stringify(item)
      localStorage.setItem('item' + (n+1), itemString);
    }
    // console.log('LOCAL STORAGE: ', localStorage)
    Alert.success('Item added to cart!', 5000)
    this.close()
    }

  close() {
      this.setState({ 
        show: false,
        qty: 'qty',
       });
      this.fetchData()
    }

  open = (e) => {
      // console.log(e.target)
      let soap = e.target
      let soapName = soap.dataset.soapname
      let soapId = soap.dataset.soapid
      let soapImage = soap.dataset.soapimage
      let soapPrice = soap.dataset.soapprice
      let soapIngredients = soap.dataset.soapingredients
      let soapImageFile = soap.dataset.soapimagefile
      // console.log("PRODUCT: ", soapName)
      this.setState({ 
          soapImage: soapImage,
          soapId: soapId,
          soapName: soapName,
          soapPrice: soapPrice,
          soapIngredients: soapIngredients,
          soapImageFile: soapImageFile,
          show: true
      });
    }
  
  changeQty = (e) => {
      // console.log("Quantity change: ", e.target)
      let newQty = $(e.target).text()
      // console.log('New qty: ', newQty)
      this.setState({
        qty: newQty
      })
    }

  handleSearchEntry = event => {
    // console.log(event)
    // console.log('NEW SEARCH ENTRY: ', event.searchEntry)
    let products = this.state.products
    let newSearchEntry = event.searchEntry
    if(newSearchEntry === '') {
      this.fetchData()
    }
    let inventoryFiltered = products.filter(product => {
      return product.name.toLowerCase().includes(newSearchEntry.toLowerCase())
    })
    this.setState({
      filteredProducts: inventoryFiltered
    })
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
        console.log(e)
      }
    }
  

  render() {                                                       
      return (
          <span>
            <div className="row productsTitleRow">
              <p className='productsTitle'>Soaps</p>
              {/* SEARCH BAR */}
              <Form id='adminProductsSearchBarForm' onChange={(event) => this.handleSearchEntry(event)}>
                <FormGroup id='adminProductsSearchBarFormGroup'>
                  <FormControl 
                    name="searchEntry"
                    type="text"
                    className="form-control productsSearchBarFromEntry"
                    id="searchEntry"
                    placeholder="Search by name or ingredient" 
                  />
                  <Icon className='searchIcon' icon='search' size="lg" />
                </FormGroup>
              </Form>
            </div>
            <div id='productsImagesRow1' className="row">
            <div id="productsLoader" hidden={false}>
              <Loader vertical center speed="slow" size="lg" content="Loading products..." />
            </div>
            <Modal id='productListingModal' show={this.state.show} onHide={this.close}>
              <Modal.Header>
                  <Modal.Title id='productsListingName'>{this.state.soapName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Grid fluid>
                  <Row className='show-grid'>
                    <Col className='productListingDetailsCol' xs={12} xsPush={12}>
                      <p className='productsListingIngredients'>Soap Ingredients: { this.state.soapIngredients ? this.state.soapIngredients : 'No ingredients listed' }</p>
                        <br />
                        <h5 className="productsListingPrice">
                          {this.formatMoney(this.state.soapPrice)} 
                          {/* /{" "} */}
                          {/* <del className="text-muted line-through">$225</del> */}
                        </h5>
                    </Col>
                    <Col className='productListingImageCol' xs={12} xsPull={12}>
                    <img src={`uploads/${this.state.soapImageFile}`} data-soapname='Peacock Z' onClick={this.open} className="productsImageModal" alt="peacockZ1" />
                    </Col>
                  </Row>
                </Grid>
              </Modal.Body>
              <Modal.Footer>
                <Dropdown className='changeQtyDropdown' title={this.state.qty} placement="leftStart">
                  <Dropdown.Item onClick={this.changeQty}>1</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>2</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>3</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>4</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>5</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>6</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>7</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>8</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>9</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeQty}>10</Dropdown.Item>
                </Dropdown>
                <Button onClick={(e) => this.addToCart(this.state.soapId)} appearance="primary">
                  Add to Cart
                </Button>
                <Button onClick={this.close} appearance="subtle">
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
            
            {this.state.filteredProducts.map((product, i) => (
              <span key={product._id}>
                <Panel className='productsImagePanel' shaded bordered bodyFill={false} style={{ display: 'inline-block' }}>
                  <img 
                    src={`uploads/${product.soapImageFile}`}
                    data-soapname={product.name} 
                    data-soapprice={product.price} 
                    data-soapimage={product.image} 
                    data-soapid={product._id} 
                    data-soapingredients={product.ingredients}
                    data-soapimagefile={product.soapImageFile}
                    onClick={this.open} 
                    className="productsImage" 
                    alt="peacockZ1" 
                  />
                  <Panel className='productsImageHeader' header={product.name}></Panel>
                </Panel>
              </span>   
            ))}
          </div>
        </span>
      )
  }
}

export default Products
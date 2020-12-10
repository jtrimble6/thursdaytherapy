import React, { Component } from 'react';
import { Panel, Modal, Button, Dropdown, Form, FormGroup, FormControl, Icon } from 'rsuite';
import $ from 'jquery'
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
        soapId: '',
        error: '',
        qty: 'qty',
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
      const res = await fetch("http://localhost:3000/product");
      res
        .json()
        .then((res) => {
          console.log('PRODUCTS: ', res.data);
          this.setState({
            products: res.data,
            filteredProducts: res.data
          });
        })
        .catch((error) => {
          this.setState({
            error: error
          });
        });
    }

  async addToCart(id) {
    if (this.state.qty === 'qty') {
      console.log('must set a valid qty')
      // NEED TO ADD ALERT
      return
    } else if (localStorage.getItem('item1')) {
      // localStorage.clear()
      let soapName = id;
      let soapQty = this.state.qty;
      let newCart = []
      newCart.push({
        'soapName': soapName,
        'soapQty': soapQty,
      })
      console.log('CART EXISTS: ', localStorage.key(0))
      for (let c=0; c<localStorage.length; c++) {
        let itemKey = localStorage.key(c)
        let item = localStorage.getItem(itemKey)
        console.log('LOCAL STORAGE ITEM: ', item)
        let itemObj = JSON.parse(item)
        newCart.push(itemObj)
      }
      console.log('NEW CART: ', newCart)
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
      console.log('LOCAL STORAGE: ', localStorage)
      this.close()
    // try {
    //     const response = await fetch("http://localhost:3000/cart", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         productId: id,
    //         quantity: this.state.qty,
    //       }),
    //       headers: {
    //         "Content-type": "application/json; charset=UTF-8",
    //       },
    //     });
    //     let data = await response.json();
    //     // alert("Item Added To Cart");
    //     this.close()
    //     console.log(data);
    //   } catch (err) {
    //     alert("Something Went Wrong");
    //     console.log(err);
    //   }
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
    console.log('LOCAL STORAGE: ', localStorage)
    this.close()
    }

  close() {
      this.setState({ 
        show: false,
        qty: 'qty',
       });
      window.location.reload()
    }

  open = (e) => {
      // console.log(e.target)
      let soap = e.target
      let soapName = soap.dataset.soapname
      let soapId = soap.dataset.soapid
      let soapImage = soap.dataset.soapimage
      let soapPrice = soap.dataset.soapprice
      let soapIngredients = soap.dataset.soapingredients
      // console.log("PRODUCT: ", soapName)
      this.setState({ 
          soapImage: soapImage,
          soapId: soapId,
          soapName: soapName,
          soapPrice: soapPrice,
          soapIngredients: soapIngredients,
          show: true
      });
    }
  
  changeQty = (e) => {
    console.log("Quantity change: ", e.target)
    let newQty = $(e.target).text()
    console.log('New qty: ', newQty)
    this.setState({
      qty: newQty
    })
    }

  handleSearchEntry = event => {
    console.log(event)
    console.log('NEW SEARCH ENTRY: ', event.searchEntry)
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
            <Modal show={this.state.show} onHide={this.close}>
              <Modal.Header>
                  <Modal.Title id='productsListingName'>{this.state.soapName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                
                
                <img src={"http://localhost:3000/" + this.state.soapImage} data-soapname='Peacock Z' onClick={this.open} className="productsImageModal" alt="peacockZ1" />
                <br />
                <h5 className="productsListingPrice">
                  ${this.state.soapPrice} 
                  {/* /{" "} */}
                  {/* <del className="text-muted line-through">$225</del> */}
                </h5>
                <br />
                <p>Soap Ingredients: { this.state.soapIngredients ? this.state.soapIngredients : 'No ingredients listed' }</p>
                
                
              </Modal.Body>
              <Modal.Footer>
                <Dropdown className='changeQtyDropdown' title={this.state.qty} placement="topStart">
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
                    src={"http://localhost:3000/" + product.image} 
                    data-soapname={product.name} 
                    data-soapprice={product.price} 
                    data-soapimage={product.image} 
                    data-soapid={product._id} 
                    data-soapingredients={product.ingredients}
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
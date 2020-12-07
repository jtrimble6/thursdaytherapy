import React, { Component } from 'react';
import { Panel, Modal, Button, Dropdown } from 'rsuite';
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
        products: []
      }

      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
      this.fetchData = this.fetchData.bind(this)
      this.addToCart = this.addToCart.bind(this)
      this.changeQty = this.changeQty.bind(this)
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
            products: res.data
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
      return
    } else try {
        const response = await fetch("http://localhost:3000/cart", {
          method: "POST",
          body: JSON.stringify({
            productId: id,
            quantity: this.state.qty,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        let data = await response.json();
        // alert("Item Added To Cart");
        this.close()
        console.log(data);
      } catch (err) {
        alert("Something Went Wrong");
        console.log(err);
      }
    }

  close() {
      this.setState({ 
        show: false,
        qty: 'qty',
       });
    }

  open = (e) => {
      console.log(e.target)
      let soap = e.target
      let soapName = soap.dataset.soapname
      let soapId = soap.dataset.soapid
      let soapImage = soap.dataset.soapimage
      let soapPrice = soap.dataset.soapprice
      let soapIngredients = soap.dataset.soapingredients
      console.log("PRODUCT: ", soapName)
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
  
  

  render() {                                                       
      return (
          <span>
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
            {this.state.products.map((product, i) => (
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
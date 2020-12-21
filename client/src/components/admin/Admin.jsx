import React, { Component } from 'react';
// import { Panel, Modal, Button, Dropdown } from 'rsuite';
import $ from 'jquery'
import '../../css/admin/admin.css'

class Admin extends Component {
  constructor(props) {
      super(props);
      

      this.state = {        
        developmentURL: "http://localhost:3000/product",
        developmentCartURL: "http://localhost:3000/cart",
        productionCartURL: "https://thursdaytherapy.herokuapp.com/cart",
        productionURL: "https://thursdaytherapy.herokuapp.com/product",
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
    //   this.fetchData()
    }

  async fetchData() {
      const res = await fetch(process.env.NODE_ENV === "development" ? this.state.developmentURL : this.state.productionURL);
      res
        .json()
        .then((res) => {
          // console.log(res.data);
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
      // console.log('must set a valid qty')
      return
    } else try {
        const response = await fetch(process.env.NODE_ENV === "development" ? this.state.developmentCartURL : this.state.productionCartURL, {
          method: "POST",
          body: JSON.stringify({
            productId: id,
            quantity: this.state.qty,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        // let data = await response.json();
        // alert("Item Added To Cart");
        this.close()
        // console.log(data);
      } catch (err) {
        alert("Something Went Wrong");
        // console.log(err);
      }
    }

  close() {
      this.setState({ 
        show: false,
        qty: 'qty',
       });
    }

  open = (e) => {
      // console.log(e.target)
      let soap = e.target
      let soapName = soap.dataset.soapname
      let soapId = soap.dataset.soapid
      let soapImage = soap.dataset.soapimage
      let soapPrice = soap.dataset.soapprice
      // console.log("PRODUCT: ", soapName)
      this.setState({ 
          soapImage: soapImage,
          soapId: soapId,
          soapName: soapName,
          soapPrice: soapPrice,
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
  
  

  render() {                                                       
      return (
          <span>
            <h2 id='adminPageTitle'>Welcome Admin!</h2>
          </span>
      )
  }
}

export default Admin
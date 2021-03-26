import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Switch, Redirect } from 'react-router-dom'

import API from './utils/API'
import Home from './components/home/Home'
import ProductsPage from './components/products/ProductsPage'
import OurStory from './components/story/OurStory'
import HowToBuy from './components/howToBuy/HowToBuy'
import ContactUs from './components/contact/ContactUs'
import CartPage from './components/cart/CartPage'
import CheckoutPage from './components/cart/CheckoutPage'
import AdminLogin from './components/admin/AdminLogin'
import AdminPage from './components/admin/AdminPage'
import Inventory from './components/admin/Inventory'
import Purchases from './components/admin/Purchases'
import AdminTools from './components/admin/AdminTools'
import AdminLogout from './components/admin/AdminLogout'

import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
    
    }

    this.clearLocalStorage = this.clearLocalStorage.bind(this)
    

}

  componentDidMount() {
    this.getUser()
  }

  updateUser = (userObject) => {
    localStorage.clear()
    this.setState(
      userObject
    )
    localStorage.setItem('user', this.state.username)
    localStorage.setItem('sessionID', this.state.sessionID)
    // console.log('LOCAL STORAGE: ', localStorage)
    // debugger;
    }

  getUser = () => {
    let localSessionID = localStorage.getItem('sessionID')
    // console.log('LOCAL SESSION ID: ', localSessionID)
    if (!localSessionID || localSessionID === 'null') {
      this.setState({
        loggedIn: false
      })
      // console.log('LOGGED IN? ', this.state.loggedIn)
    } else {
      // console.log("Session not null")
      API.checkSession(localSessionID)
        .then(response => {
          if (response.data._id === localSessionID) {
            // console.log("Login confirmed");
            this.setState({
              loggedIn: true,
              admin: response.data.admin
            })
            console.log('LOGGED IN? ', this.state.loggedIn)
          } else {
            // console.log("No matching sessions");
            this.setState({
              loggedIn: false,
              admin: false
            })
            // console.log(this.state.loggedIn)
          }
        }).catch(error => {
          console.log('Login Error: ', error)
          this.setState({
            loggedIn: false,
            admin: false
          })
        })
    }
    }

  clearLocalStorage = () => {
    let localSessionID = localStorage.getItem('sessionID')
    if (localSessionID) {
      localStorage.clear()
    }
  }

  render() {
    return (
      <Router>
        <div id='appRoot' className="App">
          <Switch>
            <Route exact path='/' onEnter={this.clearLocalStorage}
              render={() =>
                <Home />
              }
            />
            <Route exact path='/products' onEnter={this.clearLocalStorage}
              render={() =>
                <ProductsPage />
              }
            />
            <Route exact path='/ourstory' onEnter={this.clearLocalStorage}
              render={() =>
                <OurStory />
              }
            />
            <Route exact path='/howtobuy' onEnter={this.clearLocalStorage}
              render={() =>
                <HowToBuy />
              }
            />
            <Route exact path='/contactus' onEnter={this.clearLocalStorage}
              render={() =>
                <ContactUs />
              }
            />
            <Route exact path='/shoppingcart' onEnter={this.clearLocalStorage}
              render={() =>
                <CartPage />
              }
            />
            <Route exact path='/checkout'
              render={() =>
                <CheckoutPage />
              }
            />
            <Route exact path='/login'
              render={() =>
                <AdminLogin 
                  updateUser={this.updateUser}
                />
                
              }
            />
            <Route exact path='/admin'
              render={() =>
                
                <AdminPage 
                  updateUser={this.updateUser}
                />
                
                }
            />
            <Route exact path='/inventory'
              render={() =>
                <Inventory 
                  updateUser={this.updateUser}
                />
              }
            />
            <Route exact path='/purchases'
              render={() =>
                
                <Purchases 
                  updateUser={this.updateUser}
                />

              }
            />
            <Route exact path='/tools'
              render={() =>
                <AdminTools 
                  updateUser={this.updateUser}
                />
              }
            />
            <Route exact path='/signout'
              render={() =>
                <AdminLogout 
                  updateUser={this.updateUser}
                />
              }
            />
          </Switch>
        </div>
      </Router>
      
    );
  }
}

export default App;

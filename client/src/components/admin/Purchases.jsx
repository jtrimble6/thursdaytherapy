import React, { Component } from 'react';
import { Modal, Button, Table, Row, Icon, Alert, Loader, Dropdown } from 'rsuite';
import { Form } from 'react-bootstrap'
import API from '../../utils/API'
import NavbarAdmin from '../nav/NavbarAdmin.jsx'
import moment from 'moment'
import axios from 'axios'
import $ from 'jquery'
import '../../css/admin/purchases.css'

const normalizeInput = (value, previousValue) => {
    // console.log('normalizing input')
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
    
    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 4) return currentValue;
      if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
  };


class Purchases extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPurchases: [],
            filteredPurchases: [],
            showDetails: false,
            showEditDetails: false,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            phoneError: false,
            email: '',
            address1: '',
            address2: '',
            addressZipCode: '',
            addressCity: '',
            addressState: '',
            purchaseDate: '',
            confirmationNumber: '',
            orderId: '',
            purchaseId: '',
            purchaseDetails: [],
            purchaseTotal: '',
            purchasesLoaded: false,
            purchaseReceiptUrl: '',
            purchaseCardLastFour: ''

        }

        this.getPurchases = this.getPurchases.bind(this)
        this.handleUpdateOrder = this.handleUpdateOrder.bind(this)
        this.openDetails = this.openDetails.bind(this)
        this.closeDetails = this.closeDetails.bind(this)
        this.closeEditDetails = this.closeEditDetails.bind(this)
        this.openEditDetails = this.openEditDetails.bind(this)
        this.handleEditDetails = this.handleEditDetails.bind(this)
        this.handleSearchEntry = this.handleSearchEntry.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.changeState = this.changeState.bind(this)
        this.sendOrderConfirmationEmail = this.sendOrderConfirmationEmail.bind(this)
        this.sendNewOrderEmail = this.sendNewOrderEmail.bind(this)
        this.handleResendEmails = this.handleResendEmails.bind(this)
        this.formatMoney = this.formatMoney.bind(this)
    }

    componentDidMount() {
        this.getPurchases()
      }
    
    getPurchases = () => {
      API.getPurchases()
        .then(res => {
            // console.log('PURCHASES: ', res.data)
            let purchases = res.data
            for (let p=0; p<purchases.length; p++) {
                let purchaseDate = purchases[p].purchaseDate
                purchases[p].purchaseDate = moment(purchaseDate).format('MM/DD/YYYY')
            }
            // console.log('NEW PURCHASES: ', purchases)
            this.setState({
                currentPurchases: purchases,
                filteredPurchases: purchases,
                purchasesLoaded: true
            })
        })
        .catch(err => {
            Alert.error('There was an error loading the purchases. Please reload page.', 10000)
            console.log('ERROR GETTING PURCHASES: ', err)
        })
      }

    handleUpdateOrder = () => {
      let orderId = this.state.orderId
      let orderDetails = {
          'firstName': this.state.firstName,
          'lastName': this.state.lastName,
          'email': this.state.email,
          'phoneNumber': this.state.phoneNumber,
          'address1': this.state.address1,
          'address2': this.state.address2,
          'addressZipCode': this.state.addressZipCode,
          'addressCity': this.state.addressCity,
          'addressState': this.state.addressState
      }

      API.updateOrder(orderId, orderDetails)
        .then(res => {
            // console.log('UPDATE ORDER RESULT', res)
            // window.location.reload()
            Alert.success('Order was successfully updated!', 5000)
            this.closeEditDetails()
        })
        .catch(err => {
            Alert.error('There was an error updating the product. Please retry.', 10000)
            console.log('ERROR GETTING PURCHASES: ', err)
        })
      }

    closeDetails() {
        this.getPurchases()
        this.setState({ showDetails: false });
      }

    closeEditDetails() {
        this.getPurchases()
        this.setState({ showEditDetails: false });
      }

    async handleEditDetails() {
        document.getElementById('firstName').disabled = false
        document.getElementById('lastName').disabled = false
        document.getElementById('phoneNumber').disabled = false
        document.getElementById('email').disabled = false
        document.getElementById('address1').disabled = false
        document.getElementById('address2').disabled = false
        document.getElementById('addressZipCode').disabled = false
        document.getElementById('addressCity').disabled = false
        document.getElementById('addressState').disabled = false
      }

    // handleEditPurchases = event => {
    //     // console.log(event)
    //     // console.log('NEW ORDER FIRST NAME: ', event.firstName)
    //     // console.log('NEW ORDER LAST NAME: ', event.lastName)
    //     // console.log('NEW ORDER PHONE NUMBER: ', event.phoneNumber)
    //     // console.log('NEW ORDER EMAIL: ', event.email)
    //     this.setState({
    //         firstName: event.firstName !== undefined ? event.firstName : this.state.firstName,
    //         lastName: event.lastName !== undefined ? event.lastName : this.state.lastName,
    //         phoneNumber: event.phoneNumber !== undefined ? event.phoneNumber : this.state.phoneNumber,
    //         email: event.email !== undefined ? event.email : this.state.email
    //     })
    //   }

    openEditDetails = (e) => {
        let targetPurchase = e.target
        let purchases = this.state.currentPurchases
        // console.log('CURRENT PURCHASES: ', purchases)
        let purchaseId = targetPurchase.dataset.product
        let purchase = purchases.filter(purchase => {
            return purchase._id === purchaseId
        })
        let orderId = purchase[0]._id
        let purchaseDetails = purchase[0].purchaseDetails
        let purchaseTotal = 0
        for (let i=0; i<purchaseDetails.length; i++) {
            let purchaseItem = purchaseDetails[i]
            let purchaseItemTotal = purchaseItem.soapTotal
            purchaseTotal = purchaseTotal + purchaseItemTotal
        }
        // let soapProductId = soap[0].productId._id
        // let soapName = soap[0].productId.name
        // console.log('PURCHASE SELECTED: ', purchase)
        // console.log('PURCHASE DETAILS: ', purchaseDetails)
        // console.log('PURCHASE TOTAL: ', purchaseTotal)
        // document.getElementById('purchaseId').disabled = false
        // document.getElementById('phoneNumber').disabled = false
        // console.log('SOAP NAME: ', soapName)
        // console.log('TARGET PURCHASE: ', targetPurchase)
        this.setState({
            orderId: orderId,
            purchaseId: purchase[0].purchaseId,
            confirmationNumber: purchase[0].confirmationNumber,
            firstName: purchase[0].firstName,
            lastName: purchase[0].lastName,
            phoneNumber: purchase[0].phoneNumber,
            email: purchase[0].email,
            address1: purchase[0].address1,
            address2: purchase[0].address2,
            addressZipCode: purchase[0].addressZipCode,
            addressCity: purchase[0].addressCity,
            addressState: purchase[0].addressState,
            purchaseDate: purchase[0].purchaseDate,
            purchaseDetails: purchaseDetails,
            purchaseTotal: purchaseTotal,
            purchaseReceiptUrl: purchase[0].purchaseReceiptUrl,
            purchaseCardLastFour: purchase[0].purchaseCardLastFour,
            showEditDetails: true
        })
      }

    openDetails = (e) => {
        let targetPurchase = e.target
        let purchases = this.state.currentPurchases
        // console.log('CURRENT PURCHASES: ', purchases)
        let purchaseId = targetPurchase.dataset.product
        let purchase = purchases.filter(purchase => {
            return purchase._id === purchaseId
        })
        let purchaseDetails = purchase[0].purchaseDetails
        let purchaseTotal = 0
        for (let i=0; i<purchaseDetails.length; i++) {
            let purchaseItem = purchaseDetails[i]
            let purchaseItemTotal = purchaseItem.soapTotal
            purchaseTotal = purchaseTotal + purchaseItemTotal
        }
        // let soapProductId = soap[0].productId._id
        // let soapName = soap[0].productId.name
        // console.log('PURCHASE SELECTED: ', purchase)
        // console.log('PURCHASE DETAILS: ', purchaseDetails)
        // console.log('PURCHASE TOTAL: ', purchaseTotal)
        // console.log('SOAP NAME: ', soapName)
        // console.log('TARGET PURCHASE: ', targetPurchase)
        this.setState({
            purchaseId: purchase[0].purchaseId,
            confirmationNumber: purchase[0].confirmationNumber,
            firstName: purchase[0].firstName,
            lastName: purchase[0].lastName,
            phoneNumber: purchase[0].phoneNumber,
            email: purchase[0].email,
            address1: purchase[0].address1,
            address2: purchase[0].address2,
            addressZipCode: purchase[0].addressZipCode,
            addressCity: purchase[0].addressCity,
            addressState: purchase[0].addressState,
            purchaseDate: purchase[0].purchaseDate,
            purchaseDetails: purchaseDetails,
            purchaseTotal: purchaseTotal,
            purchaseReceiptUrl: purchase[0].purchaseReceiptUrl,
            purchaseCardLastFour: purchase[0].purchaseCardLastFour,
            showDetails: true
        })
        
      }

    handleSearchEntry = event => {
        // console.log(event)
        // console.log('NEW SEARCH ENTRY: ', event.searchEntry)
        let purchases = this.state.currentPurchases
        let newSearchEntry = event.searchEntry
        if(newSearchEntry === '') {
          this.getPurchases()
        }
        let filteredPurchases = purchases.filter(purchase => {
          return (purchase.firstName.toLowerCase().includes(newSearchEntry.toLowerCase()) || purchase.lastName.toLowerCase().includes(newSearchEntry.toLowerCase()))
        })
        this.setState({
          filteredPurchases: filteredPurchases
        })
      }

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
          [name]: value,
        })    
      }

    handlePhoneChange(event) {
        // this.setState({
        //   stepOneFieldError: false,
        //   changeStepError: false
        // })    
        const {name, value} = event.target
        this.setState(prevState => ( { [name]: normalizeInput(value, prevState.phoneNumber) }));
        if (value.length !== 14) {
          console.log('PHONE VALUE: ', value)
          this.setState({
            phoneError: true
          })
        } else {
          this.setState({
            phoneError: false
          })
        }
      }

    changeState = (e) => {
        console.log("State change: ", e.target)
        let addressState = $(e.target).text()
        console.log('New state: ', addressState)
        this.setState({
          addressState: addressState
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
          // console.log(e)
        }
      }

    handleResendEmails = (e) => {
      let targetPurchase = e.target
        let purchases = this.state.currentPurchases
        // console.log('CURRENT PURCHASES: ', purchases)
        let purchaseId = targetPurchase.dataset.product
        let purchase = purchases.filter(purchase => {
            return purchase._id === purchaseId
        })
        let purchaseDetails = purchase[0].purchaseDetails
        let purchaseTotal = 0
        for (let i=0; i<purchaseDetails.length; i++) {
            let purchaseItem = purchaseDetails[i]
            let purchaseItemTotal = purchaseItem.soapTotal
            purchaseTotal = purchaseTotal + purchaseItemTotal
        }
       
        // console.log('SUBMITTING ORDER')
        let orderData = { 
            purchaseId: purchase[0].purchaseId,
            confirmationNumber: purchase[0].confirmationNumber,
            firstName: purchase[0].firstName,
            lastName: purchase[0].lastName,
            phoneNumber: purchase[0].phoneNumber,
            email: purchase[0].email,
            address1: purchase[0].address1,
            address2: purchase[0].address2,
            addressZipCode: purchase[0].addressZipCode,
            addressCity: purchase[0].addressCity,
            addressState: purchase[0].addressState,
            purchaseDate: purchase[0].purchaseDate,
            purchaseDetails: purchaseDetails,
            purchaseAmount: JSON.stringify(this.formatMoney(purchaseTotal)),
            purchaseReceiptUrl: purchase[0].purchaseReceiptUrl,
            purchaseCard: purchase[0].purchaseCardLastFour
        };
        console.log('ORDER DATA: ', orderData);
        let orderDetails = orderData.purchaseDetails
        this.sendNewOrderEmail(orderData.firstName, orderData.lastName, orderData.email, orderData.phoneNumber, orderDetails)
        this.sendOrderConfirmationEmail(orderData.firstName, orderData.lastName, orderData.email, orderData.confirmationNumber, orderData.purchaseReceiptUrl, orderDetails)
      }

    sendOrderConfirmationEmail = (firstName, lastName, email, confirmationNumber, confirmationUrl, details) => {
        // console.log(firstName, lastName, email, confirmationNumber, confirmationUrl)
        let cart = details
          // let that = this
          // Format a string itemising cart by mapping elements to sub-strings and joining the result
          const items = cart.map(function(element) {
            // let soapPriceInt = parseInt(element.soapPrice)
            // console.log('SOAP PRICE INT: ', soapPriceInt)
            // let soapPriceFormatted = that.formatMoney(soapPriceInt)
            // console.log('SOAP PRICE FORMATTED: ', soapPriceFormatted)
            // let soapTotalInt = parseInt(element.soapTotal)
            // console.log('SOAP TOTAL INT: ', soapPriceInt)
            // let soapTotalFormatted = that.formatMoney(element.soapTotal)
            // console.log('SOAP TOTAL FORMATTED: ', soapTotalFormatted)
            return `
            (${ element.soapQty }) ${ element.soapName }
            
            `;
          }).join(' | ');
    
          // Calculate total price via reduction, and format to a number to 2dp
          // const totalPrice = this.state.cart.reduce(function(sum, element) {
          //   return sum + (element.soapQuantity * element.soapPrice);
          // }, 0.0);
    
          // Format body string with itemised cart, total price, etc
          const orderDetails = `
          ${ items }
          `;
          axios({
              method: "POST", 
              url: "https://thursday-therapy.com/orderconfirmation",
              // url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/orderconfirmation" : "https://thursdaytherapy.herokuapp.com/orderconfirmation",
              data: {
                  firstName: firstName,   
                  lastName: lastName,
                  email: email,  
                  confirmationNumber: confirmationNumber,
                  confirmationUrl: confirmationUrl,
                  orderDetails: orderDetails
              }
          }).then((response)=> {
              console.log('EMAIL CONF RESPONSE: ', response)
              if (response.data.msg === 'success'){
                  // console.log("Message Sent."); 
                  Alert.success('Confirmation email sent!', 5000)
                  // this.setState({
                  //   contactSuccess: true
                  // })
                  // this.resetForm()
              } else if(response.data.msg === 'fail'){
                // console.log("Message failed to send.")
                Alert.error('There was an error sending order confirmation. Please contact us to resend.', 15000)
                // this.setState({
                //   contactError: true
                // })
              }
          })
      }

    sendNewOrderEmail = (firstName, lastName, email, phoneNumber, details) => {
        // console.log(firstName, lastName, email, phoneNumber, details)
        let cart = details
        let that = this
        // Format a string itemising cart by mapping elements to sub-strings and joining the result
        const items = cart.map(function(element) {
          let soapPriceInt = parseInt(element.soapPrice)
          // console.log('SOAP PRICE INT: ', soapPriceInt)
          let soapPriceFormatted = that.formatMoney(soapPriceInt)
          // console.log('SOAP PRICE FORMATTED: ', soapPriceFormatted)
          // let soapTotalInt = parseInt(element.soapTotal)
          // console.log('SOAP TOTAL INT: ', soapPriceInt)
          let soapTotalFormatted = that.formatMoney(element.soapTotal)
          // console.log('SOAP TOTAL FORMATTED: ', soapTotalFormatted)
          return `
          PRODUCT: ${ element.soapName }
          PRICE: ${ soapPriceFormatted }
          QUANTITY: ${ element.soapQty }
          PRODUCT TOTAL: ${ soapTotalFormatted }
          `;
        }).join('\n');
  
        // Calculate total price via reduction, and format to a number to 2dp
        // const totalPrice = this.state.cart.reduce(function(sum, element) {
        //   return sum + (element.soapQuantity * element.soapPrice);
        // }, 0.0);
  
        // Format body string with itemised cart, total price, etc
        const body = `
        ${ items }
  
        Total Sale: ${that.formatMoney(this.props.paymentAmount)}
        `;
  
        axios({
            method: "POST", 
            url: "https://thursday-therapy.com/neworder",
            // url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/neworder" : "https://thursdaytherapy.herokuapp.com/neworder",
            data: {
                firstName: firstName,   
                lastName: lastName,
                email: email,  
                phoneNumber: phoneNumber,
                details: body
            }
        }).then((response)=> {
          console.log('EMAIL ORDER RESPONSE: ', response)
            if (response.data.msg === 'success'){
                // console.log("Message Sent."); 
                Alert.success('Your order has been received!', 5000)
                this.setState({
                  contactSuccess: true
                })
                this.resetForm()
            } else if(response.data.msg === 'fail'){
              // console.log("Message failed to send.")
              Alert.error('There was an error submitting your order. Please contact us to complete order.', 15000)
              this.setState({
                contactError: true
              })
            }
        })
      }

    render() {            
        const { Column, HeaderCell, Cell } = Table;                                                                                             
        return (
          <div id='purchases'>
            <NavbarAdmin />
              <span>
                <div className="row purchasesTitleRow">
                  <p className='purchasesTitle'>Purchases</p>
                  {/* SEARCH BAR */}
                  <Form id='adminPurchasesSearchBarForm'>
                    <Form.Group id='adminPurchasesSearchBarFormGroup'>
                      <Form.Control 
                        name="searchEntry"
                        type="text"
                        className="form-control purchasesSearchBarFromEntry"
                        id="searchEntry"
                        placeholder="Search by name" 
                        onChange={this.handleSearchEntry}
                      />
                      <Icon className='searchIcon' icon='search' size="lg" />
                    </Form.Group>
                  </Form>
                </div>

                <div id='purchaseRow' className="row">

                <div id="purchasesInfoLoader" hidden={this.state.purchasesLoaded ? true : false}>
                    <Loader vertical center speed="slow" size="lg" content="Loading purchases..." />
                </div>
                
                {/* EDIT DETAILS MODAL */}
                <Modal 
                  size="md"
                  show={this.state.showEditDetails} 
                  onHide={this.closeEditDetails} 
                  id='openPurchasesDetailModal'
                >
                    <Modal.Header>
                        <Modal.Title>{this.state.soapName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form id='purchaseForm'>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="firstName">First Name</Form.Label>
                            <Form.Control 
                                disabled
                                name="firstName"
                                // type="text"
                                className="form-control purchaseFormEntry"
                                id="firstName"
                                value={this.state.firstName}     
                                onChange={this.handleChange}                               
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="lastName">Last Name</Form.Label>
                            <Form.Control 
                                disabled
                                name="lastName"
                                // type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="lastName"
                                value={this.state.lastName} 
                                onChange={this.handleChange}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="phoneNumber">Phone #</Form.Label>
                            <Form.Control  
                                disabled
                                name="phoneNumber"
                                // type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="phoneNumber"
                                value={this.state.phoneNumber}         
                                onChange={this.handlePhoneChange}                     
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="email">Email</Form.Label>
                            <Form.Control 
                                disabled
                                name="email"
                                // type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="email"
                                value={this.state.email}   
                                onChange={this.handleChange}                            
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="address1">Address 1</Form.Label>
                            <Form.Control 
                                disabled
                                name="address1"
                                // type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="address1"
                                value={this.state.address1}   
                                onChange={this.handleChange}                            
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="address2">Address 2</Form.Label>
                            <Form.Control 
                                disabled
                                name="address2"
                                // type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="address2"
                                value={this.state.address2}   
                                onChange={this.handleChange}                            
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="addressZipCode">Address Zip Code</Form.Label>
                            <Form.Control 
                                disabled
                                name="addressZipCode"
                                // type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="addressZipCode"
                                value={this.state.addressZipCode}   
                                onChange={this.handleChange}                            
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="addressCity">Address City</Form.Label>
                            <Form.Control 
                                disabled
                                name="addressCity"
                                // type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="addressCity"
                                value={this.state.addressCity}   
                                onChange={this.handleChange}                            
                            />
                        </Form.Group>
                        <Form.Group className='purchaseFormGroup' controlId="formGridShippingState">
                          <Form.Label className='purchaseFormLabel' htmlFor="addressState">Address State</Form.Label>
                          <Dropdown 
                            disabled
                            name="addressState"
                            id='addressState'
                            className='changeQtyDropdown' 
                            title={this.state.addressState} 
                            placement="leftStart"
                            aria-label='State'
                          >
                            <Dropdown.Item onClick={this.changeState}>Alabama</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Alaska</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Arizona</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Arkansas</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>California</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Colorado</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Connecticut</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Delaware</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Florida</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Georgia</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Hawaii</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Idaho</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Illinois</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Indiana</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Iowa</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Kansas</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Kentucky</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Louisiana</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Maine</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Maryland</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Massachusetts</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Michigan</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Minnesota</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Mississippi</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Missouri</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Montana</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Nebraska</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Nevada</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New Hampshire</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New Jersey</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New Mexico</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New York</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>North Carolina</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>North Dakota</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Ohio</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Oklahoma</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Oregon</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Pennsylvania</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Rhode Island</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>South Carolina</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>South Dakota</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Tennessee</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Texas</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Utah</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Vermont</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Virginia</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Washington</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>West Virginia</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Wisconsin</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Wyoming</Dropdown.Item>
                          </Dropdown>
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="purchaseDate">Purchase Date</Form.Label>
                            <Form.Control 
                                disabled
                                name="purchaseDate"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseDate"
                                value={this.state.purchaseDate}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="purchaseId">Purchase ID</Form.Label>
                            <Form.Control 
                                disabled
                                name="purchaseId"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseId"
                                value={this.state.purchaseId}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="confirmationNumber">Confirmation #</Form.Label>
                            <Form.Control 
                                disabled
                                name="confirmationNumber"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="confirmationNumber"
                                value={this.state.confirmationNumber}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                          <Table
                            className='purchaseDetailsTable'
                            // height={400}
                            data={this.state.purchaseDetails}
                            renderEmpty={() => <div id='emptyPurchasesTitle'>No Matching Data</div>}
                            onRowClick={data => {
                                // console.log('PURCHASE TABLE DETAILS: ', data);
                            }}

                            >
                        
                            <Column flexGrow={1} width={200}>
                                <HeaderCell>Product Name</HeaderCell>
                                <Cell dataKey="soapName" />
                                {/* <Cell>{(rowData, rowIndex) => {return rowData.productId.name}}</Cell> */}
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Quanity</HeaderCell>
                                <Cell dataKey="soapQty" />
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Price</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapPrice}}</Cell>
                                {/* <Cell dataKey="soapPrice" /> */}
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Total</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapTotal}}</Cell>
                                {/* <Cell dataKey="total" /> */}
                            </Column>

                            {/* <Column width={100} resizable>
                                <HeaderCell>Order ID</HeaderCell>
                                <Cell dataKey="_id" />
                            </Column> */}

                            {/* <Column width={250} resizable>
                                <HeaderCell>Product ID</HeaderCell>
                                <Cell dataKey="soapId" />
                            </Column> */}

                          </Table>
                        </Form.Group>
                      </Form>
                      <Row>
                        <h2 id='purchaseDetailsTotal'>Grand Total: ${this.state.purchaseTotal}</h2>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleEditDetails}>
                          Edit
                        </Button>
                        <Button onClick={this.handleUpdateOrder}>
                          Submit Changes
                        </Button>
                        <Button onClick={this.closeEditDetails} appearance="subtle">
                          Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* OPEN DETAILS MODAL */}
                <Modal 
                  size="md"
                  show={this.state.showDetails} 
                  onHide={this.closeDetails} 
                  id='openPurchasesDetailModal'
                >
                    <Modal.Header>
                        <Modal.Title>{this.state.soapName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form id='purchaseForm'>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="firstName">First Name</Form.Label>
                            <Form.Control 
                                disabled
                                name="firstName"
                                type="text"
                                className="form-control purchaseFormEntry"
                                id="firstName"
                                placeholder={this.state.firstName}                                    
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="lastName">Last Name</Form.Label>
                            <Form.Control 
                                disabled
                                name="lastName"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="lastName"
                                placeholder={this.state.lastName}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="phoneNumber">Phone #</Form.Label>
                            <Form.Control 
                                disabled
                                name="phoneNumber"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="phoneNumber"
                                placeholder={this.state.phoneNumber}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="email">Email</Form.Label>
                            <Form.Control 
                                disabled
                                name="email"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="email"
                                placeholder={this.state.email}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="address1">Address 1</Form.Label>
                            <Form.Control 
                                disabled
                                name="address1"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="address1"
                                placeholder={this.state.address1}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="address2">Address 2</Form.Label>
                            <Form.Control 
                                disabled
                                name="address2"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="address2"
                                placeholder={this.state.address2}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="addressZipCode">Address Zip Code</Form.Label>
                            <Form.Control 
                                disabled
                                name="addressZipCode"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="addressZipCode"
                                placeholder={this.state.addressZipCode}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="addressCity">Address City</Form.Label>
                            <Form.Control 
                                disabled
                                name="addressCity"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="addressCity"
                                placeholder={this.state.addressCity}                              
                            />
                        </Form.Group>
                        <Form.Group className='purchaseFormGroup' controlId="formGridShippingState">
                          <Form.Label className='purchaseFormLabel' htmlFor="addressState">Address State</Form.Label>
                          <Dropdown 
                            disabled
                            name="addressState"
                            className='changeQtyDropdown' 
                            title={this.state.addressState} 
                            placement="leftStart"
                            aria-label='State'
                          >
                            <Dropdown.Item onClick={this.changeState}>Alabama</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Alaska</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Arizona</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Arkansas</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>California</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Colorado</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Connecticut</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Delaware</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Florida</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Georgia</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Hawaii</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Idaho</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Illinois</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Indiana</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Iowa</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Kansas</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Kentucky</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Louisiana</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Maine</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Maryland</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Massachusetts</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Michigan</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Minnesota</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Mississippi</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Missouri</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Montana</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Nebraska</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Nevada</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New Hampshire</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New Jersey</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New Mexico</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>New York</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>North Carolina</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>North Dakota</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Ohio</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Oklahoma</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Oregon</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Pennsylvania</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Rhode Island</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>South Carolina</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>South Dakota</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Tennessee</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Texas</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Utah</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Vermont</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Virginia</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Washington</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>West Virginia</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Wisconsin</Dropdown.Item>
                            <Dropdown.Item onClick={this.changeState}>Wyoming</Dropdown.Item>
                          </Dropdown>
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="purchaseDate">Purchase Date</Form.Label>
                            <Form.Control 
                                disabled
                                name="purchaseDate"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseDate"
                                placeholder={this.state.purchaseDate}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="purchaseId">Purchase ID</Form.Label>
                            <Form.Control 
                                disabled
                                name="purchaseId"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseId"
                                placeholder={this.state.purchaseId}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                            <Form.Label className='purchaseFormLabel' htmlFor="confirmationNumber">Confirmation #</Form.Label>
                            <Form.Control 
                                disabled
                                name="confirmationNumber"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="confirmationNumber"
                                placeholder={this.state.confirmationNumber}                              
                            />
                        </Form.Group>
                        <Form.Group className="purchaseFormGroup">
                          <Table
                            className='purchaseDetailsTable'
                            // height={400}
                            data={this.state.purchaseDetails}
                            renderEmpty={() => <div id='emptyPurchasesTitle'>No Purchase Details</div>}
                            onRowClick={data => {
                                // console.log('PURCHASE TABLE DETAILS: ', data);
                            }}

                            >
                        
                            <Column flexGrow={1} width={200}>
                                <HeaderCell>Product Name</HeaderCell>
                                <Cell dataKey="soapName" />
                                {/* <Cell>{(rowData, rowIndex) => {return rowData.productId.name}}</Cell> */}
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Quanity</HeaderCell>
                                <Cell dataKey="soapQty" />
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Price</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapPrice}}</Cell>
                                {/* <Cell dataKey="soapPrice" /> */}
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Total</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapTotal}}</Cell>
                                {/* <Cell dataKey="total" /> */}
                            </Column>

                            {/* <Column width={100} resizable>
                                <HeaderCell>Order ID</HeaderCell>
                                <Cell dataKey="_id" />
                            </Column> */}

                            {/* <Column width={250} resizable>
                                <HeaderCell>Product ID</HeaderCell>
                                <Cell dataKey="soapId" />
                            </Column> */}

                          </Table>
                        </Form.Group>
                      </Form>
                      <Row>
                        <h2 id='purchaseDetailsTotal'>Grand Total: ${this.state.purchaseTotal}</h2>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeDetails} appearance="subtle">
                          Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* PURCHASES TABLE */}
                <Table
                  hidden={this.state.purchasesLoaded ? false : true}
                  className='purchasesTable'
                  // height={400}
                  data={this.state.filteredPurchases}
                  renderEmpty={() => <div id='emptyPurchasesTitle'>No Matching Data</div>}
                  onRowClick={data => {
                      // console.log('PURCHASES TABLE: ', data);
                  }}

                  >
                  <Column flexGrow={1} width={100} align="center">
                      <HeaderCell>First Name</HeaderCell>
                      <Cell dataKey="firstName" />
                      
                  </Column>

                  <Column flexGrow={1} width={100}>
                      <HeaderCell>Last Name</HeaderCell>
                      <Cell dataKey="lastName" />
                  </Column>

                  <Column flexGrow={1} width={150}>
                      <HeaderCell>Phone #</HeaderCell>
                      <Cell dataKey="phoneNumber" />
                  </Column>

                  <Column flexGrow={1} width={150}>
                      <HeaderCell>Purchase Date</HeaderCell>
                      <Cell dataKey="purchaseDate" />
                  </Column>

                  <Column flexGrow={2} width={250}>
                      <HeaderCell>Confirmation #</HeaderCell>
                      <Cell dataKey="confirmationNumber" />
                  </Column>

                  {/* <Column width={200}>
                      <HeaderCell>Purchase Details</HeaderCell>
                      <Cell>
                      {rowData.purchaseDetails.map((purchase, i) => {
                          return <p>{purchase}</p>
                      })}
                          
                      </Cell>
                  </Column> */}


                  <Column id='actionColumn' flex-grow={2} fixed="right">
                      <HeaderCell id='actionColumnHeader'>Action</HeaderCell>
                      <Cell>
                      {rowData => {
                          // function handleAction() {
                          // alert(`id:${rowData.id}`);
                          // }
                          return (
                          <span>
                              <Button className='purchaseEditButtons' onClick={this.openEditDetails} data-product={rowData._id}> Edit </Button> |{' '}
                              <Button className='purchaseEditButtons' onClick={this.openDetails} data-product={rowData._id}> Details </Button> |{' '}
                              <Button className='purchaseEditButtons' onClick={this.handleResendEmails} data-product={rowData._id}> Resend Emails </Button>
                          </span>
                          );
                      }}
                      </Cell>
                  </Column>
                </Table>
            </div>
            
            </span>
          </div>
        )
    }
}

export default Purchases
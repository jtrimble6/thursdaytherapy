import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import API from '../../utils/API'
import axios from 'axios'
import { Loader, Alert, Modal, Button } from 'rsuite';

const styles = {
  name: {
    verticalAlign: 'top',
    display: 'none',
    margin: 0,
    border: 'none',
    fontSize: "16px",
    fontFamily: "Helvetica Neue",
    padding: "16px",
    color: "#373F4A",
    backgroundColor: "transparent",
    lineHeight: "1.15em",
    placeholderColor: "#000",
    _webkitFontSmoothing: "antialiased",
    _mozOsxFontSmoothing: "grayscale",
  },
  leftCenter: {
    float: 'left',
    textAlign: 'center'
  },
  blockRight: {
    display: 'block',
    float: 'right'
  },
  center: {
    textAlign: 'center',
    width: '100%',
    margin: '0 auto'
  },
  submitButton: {
    width: '60%',
    backgroundColor: 'lightgreen',
    fontSize: '2vw',
    marginBottom: '2vw'
  },
  addressValidationButton: {
    width: '60%',
    backgroundColor: 'gold',
    fontSize: '2vw',
    marginBottom: '2vw'
  }
}

export default class PaymentForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      cardBrand: "",
      nonce: undefined,
      googlePay: false,
      applePay: false,
      masterpass: false,
      paymentStatus: '',
      paymentCardLastFour: '',
      paymentAmount: '',
      paymentId: '',
      paymentOrderId: '',
      purchaseReceiptUrl: '',
      redirect: false,

    }
    this.setRedirect = this.setRedirect.bind(this)
    this.renderRedirect = this.renderRedirect.bind(this)
    this.requestCardNonce = this.requestCardNonce.bind(this);
    this.handleThirdParty = this.handleThirdParty.bind(this)
    this.handleNonceReceived = this.handleNonceReceived.bind(this)
    this.handlePaymentConfirmation = this.handlePaymentConfirmation.bind(this)
    this.handleConfirmationComplete = this.handleConfirmationComplete.bind(this)
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this)
    this.sendNewOrderEmail = this.sendNewOrderEmail.bind(this)
    this.sendOrderConfirmationEmail = this.sendOrderConfirmationEmail.bind(this)
  }

  componentDidMount() {
    const config = {
      applicationId: "sandbox-sq0idb-r0EX7qY-zPL3PXaw54l0Hg",
      locationId: "L04H83ZZ2XDWC",
      inputClass: "sq-input",
      autoBuild: false,
      inputStyles: [
        {
          fontSize: "16px",
          fontFamily: "Helvetica Neue",
          padding: "16px",
          color: "#373F4A",
          backgroundColor: "transparent",
          lineHeight: "1.15em",
          placeholderColor: "#000",
          _webkitFontSmoothing: "antialiased",
          _mozOsxFontSmoothing: "grayscale"
        }
      ],
      // applePay: {
      //   elementId: 'sq-apple-pay'
      // },
      // masterpass: {
      //   elementId: 'sq-masterpass'
      // },
      // googlePay: {
      //   elementId: 'sq-google-pay'
      // },
      cardNumber: {
        elementId: "sq-card-number",
        placeholder: "• • • •  • • • •  • • • •  • • • •"
      },
      cvv: {
        elementId: "sq-cvv",
        placeholder: "CVV"
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: "MM/YY"
      },
      postalCode: {
        elementId: "sq-postal-code",
        placeholder: "Zip"
      },
      callbacks: {
        methodsSupported: (methods) => {
          if(methods.googlePay){
            this.setState({
              googlePay: methods.googlePay
            })
          }
          if(methods.applePay){
            this.setState({
              applePay: methods.applePay
            })
          }
          if(methods.masterpass){
            this.setState({
              masterpass: methods.masterpass
            })
          }
          return;
        },
        createPaymentRequest: () => {
          return {
            requestShippingAddress: false,
            requestBillingInfo: true,
            currencyCode: "USD",
            countryCode: "US",
            total: {
              label: "MERCHANT NAME",
              amount: JSON.stringify(this.props.paymentAmount),
              pending: false
            },
            lineItems: [
              {
                label: "Subtotal",
                amount: JSON.stringify(this.props.paymentAmount),
                pending: false
              }
            ]
          };
        },
        cardNonceResponseReceived: (errors, nonce, cardData) => {
          if (errors) {
            // Log errors from nonce generation to the Javascript console
            Alert.error('There was an error processing payment. Please try again.', 10000)
            document.getElementById('processingPaymentPayButton').hidden = false
            document.getElementById('processingPaymentLoader').hidden = true
            // console.log("Encountered errors:");
            errors.forEach(function(error) {
              // console.log("  " + error.message);
            });
            return;
          }
          this.handleNonceReceived(nonce)
          this.setState({
            nonce: nonce
          })
        },
        unsupportedBrowserDetected: () => {
        },
        inputEventReceived: (inputEvent) => {
          switch (inputEvent.eventType) {
            case "focusClassAdded":
              break;
            case "focusClassRemoved":
              break;
            case "errorClassAdded":
              document.getElementById("error").innerHTML =
                "Please fix card information errors before continuing.";
              break;
            case "errorClassRemoved":
              document.getElementById("error").style.display = "none";
              break;
            case "cardBrandChanged":
              if(inputEvent.cardBrand !== "unknown"){
                this.setState({
                  cardBrand: inputEvent.cardBrand
                })
              } else {
                this.setState({
                  cardBrand: ""
                })
              }
              break;
            case "postalCodeChanged":
              break;
            default:
              break;
          }
        },
        paymentFormLoaded: function() {
          document.getElementById('name').style.display = "inline-flex";
        }
      }
    };
    this.SqPaymentForm = new this.props.paymentForm(config);
    this.SqPaymentForm.build();
    }

  requestCardNonce = (e) => {
      e.preventDefault()
      this.props.hideNonceModal()
      document.getElementById('processingPaymentPayButton').hidden = true
      document.getElementById('processingPaymentLoader').hidden = false
      this.SqPaymentForm.requestCardNonce();
    }

  handleNonceReceived = (nonce) => {
    const idempotency_key = uuidv4();
    // console.log('nonce received in payment: ', nonce)
    // console.log('uuid created: ', idempotency_key)
    //Generate a random UUID as an idempotency key for the payment request
    // length of idempotency_key should be less than 45
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
        });
    }

    fetch('process-payment', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nonce: nonce,
          idempotency_key: idempotency_key,
          location_id: "L04H83ZZ2XDWC",
          paymentAmount: this.props.paymentAmount
        })   
      })
      .catch(err => {
        // alert('Network error: ' + err);
        Alert.error('Sorry, there was an error connecting to Square payment. Please try again.', 10000)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(
            errorInfo => Promise.reject(errorInfo));
        }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        if (data.title === "Payment Successful") {
          Alert.success('Payment was a success!', 5000)
          // console.log('PAYMENT WAS A HUGE SUCCESS!')
          // console.log('PAYMENT RESULT: ', data.result.payment)
          let paymentResult = data.result.payment
          this.setState({
              paymentStatus: paymentResult.status,
              paymentCardLastFour: paymentResult.cardDetails.card.last4,
              paymentAmount: paymentResult.amountMoney.amount,
              paymentId: paymentResult.id,
              paymentOrderId: paymentResult.orderId,
              purchaseReceiptUrl: paymentResult.receiptUrl
          })

        }
        // debugger;
        // alert('Payment complete successfully!\nCheck browser developer console for more details');
        this.handlePaymentConfirmation()
      })
      .catch(err => {
        console.error(err);
        Alert.error('Sorry, there was an error completing your payment. Please try again.', 10000)
        // alert('Payment failed to complete!\nCheck browser developer console for more details');
      });
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

  handlePaymentConfirmation = () => {
    // SHOW ORDER CONFIRMATION FORM
    let orderConfirmationForm = document.getElementById('paymentConfirmationForm')
    orderConfirmationForm.hidden = false

    // HIDE PAYMENT INFO FORM
    let orderFormContainer = document.getElementById('paymentInfoForm')
    orderFormContainer.hidden = true

    // HIDE ORDER FORM NAV BUTTONS
    let checkoutFormNav = document.getElementById('checkoutFormNav')
    checkoutFormNav.innerHTML = ''

    // CHANGE CHECKOUT TITLE
    // HIDE CHECKOUT STEP TITLE DIV
    let checkoutTitle = document.getElementById('checkoutTitle')
    checkoutTitle.innerHTML = 'Payment Complete'
    let checkoutStepTitle = document.getElementById('checkoutStepTitle')
    checkoutStepTitle.innerHTML = ''

    // HIDE REQUIRED TEXT
    let requiredText = document.getElementById('checkoutRequiredSmall')
    requiredText.hidden = true

    // CREATE CHECKOUT CONFIRMATION BUTTON
    let checkoutConfirmationButton = document.createElement('button')
    // checkoutConfirmationButton.innerHTML = '<button className="checkoutConfirmationButton" onclick='+ this.handleConfirmationComplete +'" />';
    checkoutConfirmationButton.innerHTML = 'Back to home'
    checkoutConfirmationButton.classList.add('checkoutConfirmationButton')
    checkoutConfirmationButton.classList.add('button-credit-card')
    checkoutConfirmationButton.onclick = this.handleConfirmationComplete
    checkoutFormNav.appendChild(checkoutConfirmationButton)

    // CREATE ORDER CONFIRMATION DIV
    let orderConfirmationElement = document.createElement('div')
    orderConfirmationElement.classList.add('paymentConfirmationDiv')

    // ADD ORDER CONFIRMATION DATA TO DIV
    // let lineBreak = document.createElement('br')

    let orderConfirmationStatus = document.createElement('p')
    orderConfirmationStatus.innerHTML = 'Payment Status: ' + this.state.paymentStatus
    
    let orderCard = document.createElement('p')
    orderCard.innerHTML = 'Payment Card: *' + this.state.paymentCardLastFour
    
    let orderAmount = document.createElement('p')
    let orderAmountInt = parseInt(this.props.paymentAmount)
    let orderAmountFormatted = this.formatMoney(orderAmountInt)
    orderAmount.innerHTML = 'Payment Amount: ' + orderAmountFormatted
    
    let orderConfirmationNumber = document.createElement('p')
    orderConfirmationNumber.innerHTML = 'Confirmation #: ' + this.state.paymentId
    
    let orderEmailConfirmation = document.createElement('p')
    orderEmailConfirmation.innerHTML = 'Thank you for your order! A confirmation email has been sent to: ' + this.props.email + ' (It may be sent to your spam folder).'
    
    // APPEND ORDER CONFIRMATION DIV TO PAGE
    orderConfirmationElement.appendChild(orderConfirmationStatus)
    orderConfirmationElement.appendChild(orderCard)
    orderConfirmationElement.appendChild(orderAmount)
    orderConfirmationElement.appendChild(orderConfirmationNumber)
    orderConfirmationElement.appendChild(orderEmailConfirmation)
    orderConfirmationForm.appendChild(orderConfirmationElement)

    // EMPTY LOCAL STORAGE
    localStorage.clear()

    this.handleOrderSubmit()
      
    }

  handleOrderSubmit = () => {
      // console.log('SUBMITTING ORDER')
      let orderData = { 
          firstName: this.props.firstName,
          lastName: this.props.lastName,
          email: this.props.email,
          phoneNumber: this.props.phoneNumber,
          addressLine1: this.props.addressLine1,
          addressLine2: this.props.addressLine2,
          purchaseId: this.state.paymentId,
          purchaseOrderId: this.state.paymentOrderId,
          purchaseReceiptUrl: this.state.purchaseReceiptUrl,
          confirmationNumber: this.state.paymentId,
          purchaseDetails: this.props.cart,
          purchaseAmount: JSON.stringify(this.formatMoney(this.state.paymentAmount)),
          purchaseCard: this.state.paymentCardLastFour
      };
      console.log('ORDER DATA: ', orderData);
      API.submitOrder(orderData)
        .then(res => {
            // console.log('ORDER SUBMIT RESULT: ', res) 
            let orderDetails = orderData.purchaseDetails
            this.sendNewOrderEmail(orderData.firstName, orderData.lastName, orderData.email, orderData.phoneNumber, orderDetails)
            this.sendOrderConfirmationEmail(orderData.firstName, orderData.lastName, orderData.email, orderData.confirmationNumber, orderData.purchaseReceiptUrl, orderDetails)
          })
          .catch(error => {
            console.log(error)
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
          url: "https://thursdaytherapy.herokuapp.com/neworder",
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
          url: "https://thursdaytherapy.herokuapp.com/orderconfirmation",
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

  handleConfirmationComplete = () => {
    // console.log('CHECKOUT COMPLETE')
    this.setRedirect()
    }

  handleThirdParty = (e) => {
    e.preventDefault()
    }

  setRedirect = () => {
      this.setState({
          redirect: true
      })
    }

  renderRedirect = () => {
      if (this.state.redirect === true) {
        return <Redirect to='/' />
      }
      else {}
    }

  render(){
    return (
      <div id='paymentInfoSquareForm' className="container">
        {this.renderRedirect()}
        {/* ADD INVENTORY MODAL */}
        <Modal show={this.props.showAddressModal} onHide={this.props.hideAddressModal}>
          <Modal.Header>
            <Modal.Title>Address Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <hr />
            <h2>Address Entered: </h2><br />
            <p>{this.props.address1} {this.props.address2} {this.props.addressCity}, {this.props.addressState} {this.props.addressZipCode}</p>
            <hr />
            <h2>Address Suggestions: </h2><br />
            {
              this.props.addressSuggestions.length ? this.props.addressSuggestions.map(suggestion => {
                return <span>{suggestion.deliveryLine1} {suggestion.lastLine} <Button onClick={this.props.confirmAddress} data-addressline1={suggestion.deliveryLine1} data-addressline2={suggestion.lastLine}>Select address</Button></span>
              }) 
              : <p>No suggestions found.</p>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.confirmAddress} data-addressline1={this.props.address1 + ' ' + this.props.address2} data-addressline2={this.props.addressCity + ' ' + this.props.addressState + ' ' + this.props.addressZipCode} >
              Confirm Address
            </Button>
            <Button onClick={this.props.hideAddressModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <div id='creditCardForm' hidden={true}>
          <div id="form-container">
            <div id="sq-ccbox">
              <p className='sqPaymentCardInfo'>
                <span style={styles.leftCenter}>Enter Card Info Below </span>
                <span style={styles.blockRight}>
                  {this.state.cardBrand.toUpperCase()}
                </span>
              </p>
                <input
                  id="name"
                  style={styles.name}
                  type="text"
                  placeholder="Full Name on Card"
                />
              <div id="cc-field-wrapper">
                <input type="hidden" id="card-nonce" name="nonce" />
                <div id="sq-card-number" style={styles.center}></div>
                <div id="sq-expiration-date" style={styles.center}></div>
                <div id="sq-cvv" style={styles.center}></div>
                <div id="sq-postal-code"></div>
              </div>
            </div>
          </div>
          <p style={styles.center} id="error"></p>
          <Button 
            style={styles.submitButton}
            className="button-credit-card"
            onClick={this.requestCardNonce}
            id='paymentFormSubmitButton'
          >
            <span hidden={false} id="processingPaymentPayButton">Pay</span>
            <span id="processingPaymentLoader" hidden={true}>
              <Loader center speed="slow" size="xs" content="Processing..." />
            </span>
          </Button>
        </div>
        {/* <Modal show={this.props.showNonceModal} onHide={this.props.hideNonceModal}>
          <Modal.Header>
            <Modal.Title>Payment Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div id="form-container">
            <div id="sq-ccbox">
              <p className='sqPaymentCardInfo'>
                <span style={styles.leftCenter}>Enter Card Info Below </span>
                <span style={styles.blockRight}>
                  {this.state.cardBrand.toUpperCase()}
                </span>
              </p>
                <input
                  id="name"
                  style={styles.name}
                  type="text"
                  placeholder="Name on Card"
                />
              <div id="cc-field-wrapper">
                <input type="hidden" id="card-nonce" name="nonce" />
                <div id="sq-card-number" style={styles.center}></div>
                <div id="sq-expiration-date" style={styles.center}></div>
                <div id="sq-cvv" style={styles.center}></div>
                <div id="sq-postal-code"></div>
              </div>
            </div>
          </div>
          <p style={styles.center} id="error"></p>
        
          </Modal.Body>
          <Modal.Footer>
            <Button 
              style={styles.submitButton}
              className="button-credit-card"
              onClick={this.requestCardNonce}
              id='paymentFormSubmitButton'
            >
              <span hidden={false} id="processingPaymentPayButton">Pay</span>
              <span id="processingPaymentLoader" hidden={true}>
                <Loader center speed="slow" size="xs" content="Processing..." />
              </span>
            </Button>
            <Button onClick={this.props.hideNonceModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal> */}
        <Button 
          style={styles.addressValidationButton}
          onClick={this.props.validateAddress}
          id='addressValidationButton'
          hidden={false}
        >
          Continue to Payment
        </Button>
      </div>
    )
  }
}
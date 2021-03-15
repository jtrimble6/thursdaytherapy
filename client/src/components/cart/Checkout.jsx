import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import API from '../../utils/API'
import { Alert } from 'rsuite';
import { Form, Button } from 'react-bootstrap'
import $ from 'jquery'


// CSS
import '../../css/cart/cartCheckout.css'

// SIGN UP PAGES
import CheckoutOrderInfo from './CheckoutOrderInfo'
import CheckoutPaymentInfo from './CheckoutPaymentInfo'
import CheckoutConfirmation from './CheckoutConfirmation'

// ALERTS 
import ChangeStepError from '../alerts/ChangeStepError'

// SCRIPTS
// import ScriptTag from 'react-script-tag';

// import ExistingAccount from "../../alerts/ExistingAccount";
// import PasswordError from '../../alerts/PasswordError';

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

// const validateInput = value => {
//   let error = ""
  
//   if (!value) error = "Required!"
//   else 
//   }
  
//   return error;
// };


class Checkout extends Component {
    // clockRef = null;
    
    constructor(props) {
        super(props)
        this.state = {
          sqPaymentForm: '',
          currentStep: 1, // Default is Step 1
          currentStepTitle: 'Order Details',
          currentCart: [],
          cartTotal: '',
          cartLoaded: false,
          orderSubTotal: '',
          orderShippingCost: '',
          orderGrandTotal: '',
          products: [],
          productImages: [],
          progressPct: 10,
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          addressLine1: '',
          addressLine2: '',
          address1: '',
          address2: '',
          addressZipCode: '',
          addressCity: '',
          addressState: 'Select State',
          paymentComplete: false,
          paymentRefNumber: '',
          paymentTxnId: '',
          paymentDate: '',
          paymentCard: '',
          addressSuggestions: [],
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
          showAddressModal: false,
          showNonceModal: false,
          emailError: false,
          passwordError: false,
          phoneError: false,
          changeStepError: false,
          stepOneFieldError: false,
          sessionID: '',
          redirect: false,
          divStyle: {
            backgroundColor: '#85bb65 !important',
            color: 'white',
            border: 'none',
            width: '90%',
            marginLeft: '5%',
            marginBottom: '1%',
            textAlign: 'center',
            alignContent: 'center'
          },
          loaded: false
      }
        this.fetchCart = this.fetchCart.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleNextStep = this.handleNextStep.bind(this)
        this.handlePrevStep = this.handlePrevStep.bind(this)
        this.handleFinalStep = this.handleFinalStep.bind(this)
        this.changeState = this.changeState.bind(this)
        this.handleStepTitleChange = this.handleStepTitleChange.bind(this)
        this.scrollTop = this.scrollTop.bind(this)
        this.validStepOne = this.validStepOne.bind(this)
        this.checkEmail = this.checkEmail.bind(this)
        this.validateAddress = this.validateAddress.bind(this)
        this.handleSendUserInfo = this.handleSendUserInfo.bind(this)
        this.openAddressModal = this.openAddressModal.bind(this)
        this.hideAddressModal = this.hideAddressModal.bind(this)
        this.openNonceModal = this.openNonceModal.bind(this)
        this.hideNonceModal = this.hideNonceModal.bind(this)
        this.confirmAddress = this.confirmAddress.bind(this)
        this.renderCreditCardForm = this.renderCreditCardForm.bind(this)
        this.requestCardNonce = this.requestCardNonce.bind(this)
        this.handleNonceReceived = this.handleNonceReceived.bind(this)
        this.handlePaymentConfirmation = this.handlePaymentConfirmation.bind(this)
        this.handleOrderSubmit = this.handleOrderSubmit.bind(this)
        this.sendNewOrderEmail = this.sendNewOrderEmail.bind(this)
        this.sendOrderConfirmationEmail = this.sendOrderConfirmationEmail.bind(this)
        this.formatMoney = this.formatMoney.bind(this)
        this.setRedirect = this.setRedirect.bind(this)
        this.renderRedirect = this.renderRedirect.bind(this)
        this.handleConfirmationComplete = this.handleConfirmationComplete.bind(this)
    
    }

    componentDidMount() {
        // console.log('User Sign Up Ready')
        this.scrollTop()
        this.fetchData()
        
      }

    renderCreditCardForm = () => {
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
                amount: JSON.stringify(this.state.orderGrandTotal),
                pending: false
              },
              lineItems: [
                {
                  label: "Subtotal",
                  amount: JSON.stringify(this.state.orderGrandTotal),
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
      this.SqPaymentForm = new window.SqPaymentForm(config);
      this.SqPaymentForm.build();
      let creditCardForm = document.getElementById('creditCardForm')
      creditCardForm.hidden = false
      this.setState({
        sqPaymentForm: this.SqPaymentForm
      })
      }

    requestCardNonce = (e) => {
        e.preventDefault()
        let cardholderName = document.getElementById('name')
        let cardholderNameValue = cardholderName.value
        // console.log('CARD HOLDER NAME: ', cardholderNameValue)
        if (cardholderNameValue === '') {
          Alert.warning('Please enter the cardholder full name.', 5000)
          return;
        }
        // this.props.hideNonceModal()
        document.getElementById('processingPaymentPayButton').hidden = true
        document.getElementById('processingPaymentLoader').hidden = false
        this.state.sqPaymentForm.requestCardNonce();
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
              paymentAmount: parseInt(this.state.orderGrandTotal)
            })   
          })
          .catch(err => {
            // alert('Network error: ' + err);
            Alert.error('Sorry, there was an error connecting to Square payment. Please try again.', 10000)
            document.getElementById('processingPaymentPayButton').hidden = false
            document.getElementById('processingPaymentLoader').hidden = true
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
            document.getElementById('processingPaymentPayButton').hidden = false
            document.getElementById('processingPaymentLoader').hidden = true
            // alert('Payment failed to complete!\nCheck browser developer console for more details');
          });
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
        let orderAmountInt = ''
        let orderAmountFormatted = ''

        if (this.state.orderGrandTotal % 1 === 0) {
          orderAmountInt = parseInt(this.state.orderGrandTotal)
          console.log('ORDER TOTAL: ', orderAmountInt)
          orderAmountFormatted = this.formatMoney(orderAmountInt)
          
        } else {
          orderAmountInt = this.state.orderGrandTotal
          console.log('ORDER TOTAL: ', orderAmountInt)
          orderAmountFormatted = this.formatMoney(orderAmountInt)
        }

        // let orderAmountFormatted = this.formatMoney(orderAmountInt)
        orderAmount.innerHTML = 'Payment Amount: ' + orderAmountFormatted
        
        let orderConfirmationNumber = document.createElement('p')
        orderConfirmationNumber.innerHTML = 'Confirmation #: ' + this.state.paymentId
        
        let orderEmailConfirmation = document.createElement('p')
        orderEmailConfirmation.innerHTML = 'Thank you for your order! A confirmation email has been sent to: ' + this.state.email 
        
        let orderEmailDisclaimer = document.createElement('p')
        orderEmailDisclaimer.innerHTML = '(Email may be sent to your spam folder).'
    
        // APPEND ORDER CONFIRMATION DIV TO PAGE
        orderConfirmationElement.appendChild(orderConfirmationStatus)
        orderConfirmationElement.appendChild(orderCard)
        orderConfirmationElement.appendChild(orderAmount)
        orderConfirmationElement.appendChild(orderConfirmationNumber)
        orderConfirmationElement.appendChild(orderEmailConfirmation)
        orderConfirmationElement.appendChild(orderEmailDisclaimer)
        orderConfirmationForm.appendChild(orderConfirmationElement)
    
    
        // EMPTY LOCAL STORAGE
        localStorage.clear()
    
        this.handleOrderSubmit()
          
      }
    
    handleOrderSubmit = () => {
          // console.log('SUBMITTING ORDER')
          let orderData = { 
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              email: this.state.email,
              phoneNumber: this.state.phoneNumber,
              addressLine1: this.state.addressLine1,
              addressLine2: this.state.addressLine2,
              purchaseId: this.state.paymentId,
              purchaseOrderId: this.state.paymentOrderId,
              purchaseReceiptUrl: this.state.purchaseReceiptUrl,
              confirmationNumber: this.state.paymentId,
              purchaseDetails: this.state.currentCart,
              purchaseAmount: this.formatMoney(this.state.orderGrandTotal),
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
            let soapPriceFormatted = ''
            let soapTotalFormatted = ''
            if (element.soapPrice % 1 === 0) {
              let soapPriceInt = parseInt(element.soapPrice)
              console.log('SOAP PRICE: ', element.soapPrice)
              console.log('SOAP PRICE INT: ', soapPriceInt)
              soapPriceFormatted = that.formatMoney(soapPriceInt)
              // console.log('SOAP PRICE FORMATTED: ', soapPriceFormatted)
              // let soapTotalInt = parseInt(element.soapTotal)
              // console.log('SOAP TOTAL INT: ', soapPriceInt)
              soapTotalFormatted = that.formatMoney(element.soapTotal)
              // console.log('SOAP TOTAL FORMATTED: ', soapTotalFormatted)
            } else {
              soapPriceFormatted = that.formatMoney(element.soapPrice)
              soapTotalFormatted = that.formatMoney(element.soapTotal)
            }
            
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
          
          Subtotal: ${that.formatMoney(this.state.orderSubTotal)}
          Shipping & Handling: ${that.formatMoney(this.state.orderShippingCost)}
          Total Sale: ${that.formatMoney(this.state.orderGrandTotal)}
          `;
    
          axios({
              method: "POST", 
              url: "https://thursday-therapy.com/neworder",
              // url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/neworder" : "https://thursday-therapy.com/neworder",
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
              url: "https://thursday-therapy.com/orderconfirmation",
              // url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/orderconfirmation" : "https://thursday-therapy.com/orderconfirmation",
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
    
    scrollTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }

    async fetchData() {
        let productImages = []
        const res = await fetch(process.env.NODE_ENV === "development" ? "http://localhost:3000/uploads" : "https://thursday-therapy.com/uploads");
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
                      // let productIngredients = product.ingredients
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
                      // console.log('NEW PRODUCTS WITH IMAGES: ', this.state.products)
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
        // document.getElementById('orderInfoLoader').hidden = false
        let cart = []
        // console.log('LOCAL STORAGE: ', localStorage)
        // console.log('PRODUCTS: ', products)
        let cartTotal = 0
        let cartItemQty = 0
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
          let itemIngredients = ''
          itemLookup = products.filter(product => {
            return (product._id === itemObj.soapName)
          })
          // console.log('ITEM LOOKUP: ', itemLookup)
          itemName = itemLookup[0].name
          itemPrice = itemLookup[0].price
          itemQty = itemObj.soapQty
          itemId = itemLookup[0]._id
          itemIngredients = itemLookup[0].ingredients
  
          if (itemQty > 0) {
            let newCartItem = {
              'itemKey': itemKey,
              'soapName': itemName,
              'soapPrice': itemPrice,
              'soapQty': itemQty,
              'soapTotal': (itemPrice * itemQty),
              'soapId': itemId,
              'soapIngredients': itemIngredients
            }
            cart.push(newCartItem)
            cartTotal = cartTotal + (itemPrice * itemQty)
            cartItemQty = cartItemQty + itemQty
          } else {
            this.removeItem(itemKey)
          }
          
        }


        // CALCULATE SHIPPING COST
        let orderShippingCost = 7.95
        if (cartItemQty > 10) {
          orderShippingCost = orderShippingCost + (cartItemQty/100 * orderShippingCost)
        }

        // CALCULATE GRAND TOTAL
        let orderGrandTotal = cartTotal + orderShippingCost
        
        this.setState({
          currentCart: cart,
          cartTotal: cartTotal,
          orderSubTotal: cartTotal,
          orderShippingCost: orderShippingCost,
          orderGrandTotal: orderGrandTotal,
          cartLoaded: true
        })

        // document.getElementById('orderInfoLoader').hidden = true
  
        // console.log('CART: ', cart)
        console.log('CART TOTAL: ', orderGrandTotal)
  
      }

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
          [name]: value,
          stepOneFieldError: false,
          changeStepError: false
        })    
      }

    changeState = (e) => {
        console.log("State change: ", e.target)
        let addressState = $(e.target).text()
        console.log('New state: ', addressState)
        this.setState({
          addressState: addressState
        })
      }
    
    handlePhoneChange({ target: { value } }) {
        this.setState({
          stepOneFieldError: false,
          changeStepError: false
        })    
        this.setState(prevState=> ({ phoneNumber: normalizeInput(value, prevState.phoneNumber) }));
        if (value.length !== 14) {
          // console.log('PHONE VALUE: ', value)
          this.setState(prevState=> ({
            phoneNumber: prevState.phoneNumber.substring(0,14)
          }))
        } else {
          this.setState({
            phoneError: false
          })
        }
      }

    handleStepTitleChange = () => {
      let currentStep = this.state.currentStep
      if (currentStep === 3) { 
        this.setState({
          progressPct: 100,
          currentStepTitle: 'Order Confirmation'
        })
      } else if (currentStep === 2) {
        this.setState({
          progressPct: 80,
          currentStepTitle: 'Payment Information'
        })
      } else if (currentStep === 1) {
        this.setState({
          progressPct: 50,
          currentStepTitle: 'Order Details'
        })
      } else {
        this.setState({
          progressPct: 0,
          currentStepTitle: 'Error'
        })
      }

      } 

    validStepOne = () => {
      let firstName = this.state.firstName
      let lastName = this.state.lastName
      let email = this.state.email
      let phoneNumber = this.state.phoneNumber

      let requiredFields = (firstName.length > 0 && lastName.length > 0 && email.length > 0 && phoneNumber.length > 0 ) ? true : false

        if (!requiredFields) {
            this.setState({
            stepOneFieldError: true
            })
            return false
        } else if (this.state.phoneError || this.state.emailError ) {
            this.setState({
            changeStepError: true
            })
            return false
        } else {
            this.setState({
            stepOneFieldError: false,
            changeStepError: false
            })
            return true
        }
      }

    handleNextStep(event) {
        event.preventDefault()
        // let stepOneComplete = this.validStepOne()
        let stepOneComplete = true

        // CHECK FOR ERRORS
        if (stepOneComplete) {
          
          let currentStep = this.state.currentStep
          // If the current step is 1 or 2, then add one on "next" button click
          currentStep = currentStep >= 2 ? 3 : currentStep + 1
          this.setState({
            currentStep: currentStep
          }, () => {
            this.handleStepTitleChange()
          })
          this.scrollTop()
        } 
        
      }
        
    handlePrevStep(event) {
        event.preventDefault()
        this.scrollTop()
        this.handleStepTitleChange()
        let currentStep = this.state.currentStep
        // If the current step is 2 or 3, then subtract one on "previous" button click
        currentStep = currentStep <= 1? 1: currentStep - 1
        this.setState({
          currentStep: currentStep,
        }, () => {
          this.handleStepTitleChange()
        })

      }

    handleFinalStep = () => {
      this.setState({
          currentStep: 3
        }, () => {
          this.handleStepTitleChange()
          this.scrollTop()
        })
      }

    // handleOrderSubmit = (e) => {
    //     e.preventDefault()
    //     this.scrollTop()
    //     // console.log('SUBMITTING ORDER')
    //     this.setState({
    //         currentStep: 3
    //     }, () => {
    //       this.handleStepTitleChange()
    //     })
    //     // console.log('CURRENT CART: ', this.state.carts)
    //     let cart = this.state.currentCart
    //     let orderData = { 
    //         firstName: this.state.firstName,
    //         lastName: this.state.lastName,
    //         email: this.state.email,
    //         phoneNumber: this.state.phoneNumber,
    //         address1: this.state.address1,
    //         address2: this.state.address2,
    //         addressCity: this.state.addressCity,
    //         addressZipCode: this.state.addressZipCode,
    //         addressState: this.state.addressState,
    //         purchaseId: 'testId',
    //         confirmationNumber: '1234',
    //         purchaseDetails: cart
    //     };
    //     // console.log('ORDER DATA: ', orderData);
    //     API.submitOrder(orderData)
    //       .then(res => {
    //           // console.log('ORDER SUBMIT RESULT: ', res) 
    //         })
    //         .catch(error => {
    //           // console.log(error)
    //         })
    //   }

    checkEmail = (event) => {
        const {name, value} = event.target

        this.setState({
          stepOneFieldError: false,
          changeStepError: false
        })    

        // Verify email address is valid
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if ( re.test(value) ) {
          // VALID EMAIL
          // console.log('EMAIL VALUE: ', value)
          this.setState({
            emailError: false,
          })
        }
        else {
          // INVALID EMAIL
          // console.log('PLEASE ENTER A VALID EMAIL ADDRESS')
          this.setState({
            emailError: true
          })
        }

        this.setState({
          [name]: value
        })    

      }

    validateAddress = (e) => {
      e.preventDefault()

      if (this.state.firstName === '') {
        Alert.warning('Please enter a first name.', 5000)
        return;
      }
      if (this.state.lastName === '') {
        Alert.warning('Please enter a last name.', 5000)
        return;
      }
      if (this.state.emailError) {
        Alert.warning('Please enter a valid email address.', 5000)
        return;
      }
      if (this.state.phoneError) {
        Alert.warning('Please enter a valid phone number.', 5000)
        return;
      }

      let address1 = this.state.address1
      let address2 = this.state.address2 !== '' ? this.state.address2 : 'empty'
      let addressCity = this.state.addressCity
      let addressState = this.state.addressState
      let addressZipCode = this.state.addressZipCode
      
      axios.post(process.env.NODE_ENV === "development" ? "http://localhost:3000/addressverf/" : "https://thursday-therapy.com/addressverf/" + address1 + "/" + address2 + "/" + addressCity + "/" + addressState + "/" + addressZipCode, {
        })
        .then(res => {
          // console.log('GOT A RESPONSE ADDRESS VERF: ', res)
          let lookup = res.data.lookups[0]
          let lookupResult = lookup.result
          console.log('LOOKUP RESULT: ', lookupResult)
          this.setState({
            addressSuggestions: lookupResult,
            showAddressModal: true
          })
        })
        .catch(err => {
          console.log('GOT AN ERROR ADDRESS VERF: ', err)
        })
      
      }

    confirmAddress = (e) => {
        e.preventDefault()
        this.setState({
          showAddressModal: false,
        })

        this.renderCreditCardForm()

        let addressValidationButton = document.getElementById('addressValidationButtonDiv')
        addressValidationButton.hidden = true
        let paymentInfo = document.getElementById('paymentInfoFormRow')
        paymentInfo.hidden = true

        let address = e.target
        console.log('SELECTED ADDRESS BUTTON: ', address)
        let addressLine1 = address.dataset.addressline1
        let addressLine2 = address.dataset.addressline2
        console.log('ADDRESS CONFIRMED: ', addressLine1, addressLine2)
        this.setState({
          addressLine1: addressLine1,
          addressLine2: addressLine2
        })
      }

    openAddressModal = (e) => {
        // console.log(e.target)
        this.setState({ 
            showAddressModal: true
        });
      }

    hideAddressModal = (e) => {
        this.setState({ 
            showAddressModal: false
          });
      }

    openNonceModal = (e) => {
        // console.log(e.target)
        this.setState({ 
            showNonceModal: true
        });
      }

    hideNonceModal = (e) => {
        this.setState({ 
            showNonceModal: false
          });
      }

    handleSubmit = (event) => {
        event.preventDefault()
        const { email, username, password } = this.state
        alert(`Your registration detail: \n 
          Email: ${email} \n 
          Username: ${username} \n
          Password: ${password}`)
      }

    handleSendUserInfo = (firstName, lastName, email, subscriptionStatus) => {
        // console.log(firstName, lastName, email, subscriptionStatus)
        axios({
            method: "POST", 
            url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/sendUserInfo" : "http://gfitwefit.com/sendUserInfo",
            data: {
                firstName: firstName,   
                lastName: lastName,
                email: email,  
                subscriptionStatus: subscriptionStatus === true ? 'active' : 'inactive'
            }
        }).then((response)=> {
            if (response.data.msg === 'success'){
                // console.log("Message Sent."); 
                this.setState({
                  contactSuccess: true
                })
                this.handleFinalStep()
            } else if(response.data.msg === 'fail'){
              // console.log("Message failed to send.")
              this.setState({
                contactError: true
              })
            }
        })
      }

    handleConfirmationComplete = () => {
        // console.log('CHECKOUT COMPLETE')
        this.setRedirect()
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

    render() {
        return (
            <span>
              {this.renderRedirect()}
                {/* <h2 className='checkoutTitle'>Secure Checkout</h2> */}
                <div id='checkoutTitleDiv' className="checkoutTitleRow">
                  <h1 id='checkoutTitle' className='checkoutTitle'>Secure Checkout</h1>
                  <p id='checkoutStepTitle' className='checkoutStep'>
                    {this.state.currentStepTitle}
                  </p>
                  {/* <ProgressBar 
                    now={this.state.progressPct}
                  /> */}
                  <small id='checkoutRequiredSmall' className='checkoutRequired'>*Required</small>
                </div>

                <Form className='checkoutForm'>

                  <CheckoutOrderInfo 
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    currentCart={this.state.currentCart}
                    cartLoaded={this.state.cartLoaded}
                    orderSubTotal={this.state.orderSubTotal}
                    orderShippingCost={this.state.orderShippingCost}
                    orderGrandTotal={this.state.orderGrandTotal}
                  />
                
                  <CheckoutPaymentInfo 
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    handlePhoneChange={this.handlePhoneChange}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    email={this.state.email}
                    phoneNumber={this.state.phoneNumber}
                    addressLine1={this.state.addressLine1}
                    addressLine2={this.state.addressLine2}
                    address1={this.state.address1}
                    address2={this.state.address2}
                    addressZipCode={this.state.addressZipCode}
                    addressCity={this.state.addressCity}
                    addressState={this.state.addressState}
                    checkEmail={this.checkEmail}
                    emailError={this.state.emailError}
                    phoneError={this.state.phoneError}
                    cartTotal={this.state.orderGrandTotal}
                    paymentForm={window.SqPaymentForm}
                    formLoaded={this.state.loaded}
                    paymentAmount={this.state.orderGrandTotal}
                    cart={this.state.currentCart}
                    changeState={this.changeState}
                    validateAddress={this.validateAddress}
                    showAddressModal={this.state.showAddressModal}
                    openAddressModal={this.openAddressModal}
                    hideAddressModal={this.hideAddressModal}
                    showNonceModal={this.state.showNonceModal}
                    openNonceModal={this.openNonceModal}
                    hideNonceModal={this.hideNonceModal}
                    addressSuggestions={this.state.addressSuggestions}
                    confirmAddress={this.confirmAddress}
                    handleCardError={this.renderCreditCardForm}
                    requestCardNonce={this.requestCardNonce}
                  />
                  
                  <CheckoutConfirmation 
                    currentStep={this.state.currentStep}
                  />


                  <Form.Row className="formNav" id='checkoutFormNav'>
                    { 
                      (this.state.currentStep === 1) ? 
                      
                      <Button onClick={this.handleNextStep} variant="primary" className="nextStep">
                        Confirm Order
                      </Button>
                      
                      :

                      (this.state.currentStep < 2) ?
                    
                      <span className='stepButtonSpan'>
                        <Button onClick={this.handlePrevStep} variant="warning" className="prevStep" aria-label='Previous Step'>
                            Prev
                        </Button> 

                        <Button onClick={this.handleNextStep} variant="primary" className="nextStep" aria-label='Next Step'>
                            Next
                        </Button>
                      </span>

                      :

                      (this.state.currentStep === 2) ?

                        <Button onClick={this.handlePrevStep} variant="warning" id='finalStepPrev' className="prevStep" aria-label='Previous Step'>
                            Prev
                        </Button> 

                      :

                      <span></span>

                    }
                    <ChangeStepError 
                      changeStepError={this.state.changeStepError}
                      stepOneFieldError={this.state.stepOneFieldError}
                    />
                  </Form.Row>

                </Form>
                
            </span>
            
        
        )
      };
};

export default Checkout;
       



import React, { Component } from 'react'
// import { Redirect } from 'react-router-dom'
import axios from 'axios'
import API from '../../utils/API'
// import { NavLink } from 'reactstrap';
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
          currentStep: 1, // Default is Step 1
          currentStepTitle: 'Order Details',
          currentCart: [],
          cartTotal: '',
          cartLoaded: false,
          products: [],
          productImages: [],
          progressPct: 10,
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
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
          showAddressModal: false,
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
        
    
    }

    componentDidMount() {
        // console.log('User Sign Up Ready')
        this.scrollTop()
        this.fetchData()
        
      }

    

    scrollTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
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
          } else {
            this.removeItem(itemKey)
          }
          
        }
        
        this.setState({
          currentCart: cart,
          cartTotal: cartTotal,
          cartLoaded: true
        })

        // document.getElementById('orderInfoLoader').hidden = true
  
        // console.log('CART: ', cart)
        // console.log('CART TOTAL: ', cartTotal)
  
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
          this.setState({
            phoneError: true
          })
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

    handleOrderSubmit = (e) => {
        e.preventDefault()
        this.scrollTop()
        // console.log('SUBMITTING ORDER')
        this.setState({
            currentStep: 3
        }, () => {
          this.handleStepTitleChange()
        })
        // console.log('CURRENT CART: ', this.state.carts)
        let cart = this.state.currentCart
        let orderData = { 
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            address1: this.state.address1,
            address2: this.state.address2,
            addressCity: this.state.addressCity,
            addressZipCode: this.state.addressZipCode,
            addressState: this.state.addressState,
            purchaseId: 'testId',
            confirmationNumber: '1234',
            purchaseDetails: cart
        };
        // console.log('ORDER DATA: ', orderData);
        API.submitOrder(orderData)
          .then(res => {
              // console.log('ORDER SUBMIT RESULT: ', res) 
            })
            .catch(error => {
              // console.log(error)
            })
      }

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
      let address1 = this.state.address1
      let address2 = this.state.address2
      let addressCity = this.state.addressCity
      let addressState = this.state.addressState
      let addressZipCode = this.state.addressZipCode
      
      axios.post(process.env.NODE_ENV === "development" ? "http://localhost:3000/addressverf/" : "https://thursday-therapy.com/addressverf/" + address1 + "/" + address2 + "/" + addressCity + "/" + addressState + "/" + addressZipCode, {
        })
        .then(res => {
          console.log('GOT A RESPONSE ADDRESS VERF: ', res)
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

    render() {
        return (
            <span>
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
                  />
                
                  <CheckoutPaymentInfo 
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    handlePhoneChange={this.handlePhoneChange}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    email={this.state.email}
                    phoneNumber={this.state.phoneNumber}
                    address1={this.state.address1}
                    address2={this.state.address2}
                    addressZipCode={this.state.addressZipCode}
                    addressCity={this.state.addressCity}
                    addressState={this.state.addressState}
                    checkEmail={this.checkEmail}
                    emailError={this.state.emailError}
                    phoneError={this.state.phoneError}
                    cartTotal={this.state.cartTotal}
                    paymentForm={window.SqPaymentForm}
                    formLoaded={this.state.loaded}
                    paymentAmount={this.state.cartTotal}
                    cart={this.state.currentCart}
                    changeState={this.changeState}
                    validateAddress={this.validateAddress}
                    showAddressModal={this.state.showAddressModal}
                    openAddressModal={this.openAddressModal}
                    hideAddressModal={this.hideAddressModal}
                    addressSuggestions={this.state.addressSuggestions}
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
       



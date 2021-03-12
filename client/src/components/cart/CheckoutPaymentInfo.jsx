import React, { Component } from 'react'
import { Form, Col } from 'react-bootstrap'
import { Dropdown } from 'rsuite';
import PaymentForm from './PaymentForm'
import { Loader } from 'rsuite';


// CSS
import '../../css/cart/cartCheckout.css'

// ALERTS
// import EmailError from '../alerts/EmailError';
// import PhoneError from '../alerts/PhoneError'




class CheckoutPaymentInfo extends Component {

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
          loaded: false,
        }
        
      }

      componentDidMount(){

      }

      componentWillMount(){
        const that = this;
        let sqPaymentScript = document.createElement('script');
        sqPaymentScript.src = "https://js.squareupsandbox.com/v2/paymentform";
        sqPaymentScript.type = "text/javascript"
        sqPaymentScript.async = false;
        sqPaymentScript.onload = ()=>{that.setState({
          loaded: true
        })};
        document.getElementsByTagName("head")[0].appendChild(sqPaymentScript);
      }    

  
    render() {
        // Verify this is current step
        if (this.props.currentStep !== 2) {
            return null
        }

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
              textAlign: 'center'
            }
          }

        return (
          <div>
            <div id='paymentConfirmationForm' hidden={true}>
              
            </div>
            <div hidden={false} id='paymentInfoForm' className='checkoutFormRow paymentInfoStep'>
              <Form.Row id='paymentInfoFormRow'>
                  <p className='sqPaymentCardInfo'>
                    <span style={styles.leftCenter}>Enter Contact Info Below </span>
                  </p>
                  <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridFirstName">
                    <Form.Label>First Name*</Form.Label>
                    <Form.Control 
                        value={this.props.firstName}
                        onChange={this.props.handleChange}
                        name="firstName"
                        placeholder="First Name" 
                        aria-label='First Name'
                    />
                  </Form.Group>

                  <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridLastName">
                    <Form.Label>Last Name*</Form.Label>
                    <Form.Control 
                        value={this.props.lastName}
                        onChange={this.props.handleChange}
                        name="lastName"
                        placeholder="Last Name" 
                        aria-label='Last Name'
                    />
                  </Form.Group>

                  <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridEmail">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                        value={this.props.email}
                        name="email"
                        onChange={this.props.checkEmail}
                        type="email" 
                        placeholder="Email" 
                        aria-label='Email'
                    />
                    {/* <EmailError 
                        emailError={this.props.emailError}
                    /> */}
                  </Form.Group>

                  <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridPhoneNumber">
                    <Form.Label>Phone Number*</Form.Label>
                    <Form.Control 
                        value={this.props.phoneNumber}
                        name="phoneNumber"
                        onChange={this.props.handlePhoneChange}
                        placeholder="(___) ___-____" 
                        aria-label='Phone Number'
                    />
                    {/* <PhoneError 
                        phoneError={this.props.phoneError}
                    /> */}
                  </Form.Group>
                  <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridShippingAddress">
                    {/* <Form.Label>Shipping Address*</Form.Label> */}

                    <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridShippingAddress1">
                      <Form.Label>Address Line 1*</Form.Label>
                      <Form.Control
                          value={this.props.address1}
                          name="address1"
                          onChange={this.props.handleChange}
                          placeholder="Street Address" 
                          aria-label='Street Address'
                      /> 
                    </Form.Group>
                    <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridShippingAddress2">
                      <Form.Label>Address Line 2 (optional)</Form.Label>
                      <Form.Control
                          value={this.props.address2}
                          name="address2"
                          onChange={this.props.handleChange}
                          placeholder="Apt/Suite/Other" 
                          aria-label='Apt/Suite/Other'
                      /> 
                    </Form.Group>
                    <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridShippingCity">
                      <Form.Label>City*</Form.Label>
                      <Form.Control
                          value={this.props.addressCity}
                          name="addressCity"
                          onChange={this.props.handleChange}
                          placeholder="City" 
                          aria-label='City'
                      /> 
                    </Form.Group>
                    <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridShippingState">
                      <Form.Label>State*</Form.Label>
                      <Dropdown 
                        className='changeQtyDropdown' 
                        title={this.props.addressState} 
                        placement="leftStart"
                        aria-label='State'
                      >
                        <Dropdown.Item onClick={this.props.changeState}>Alabama</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Alaska</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Arizona</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Arkansas</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>California</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Colorado</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Connecticut</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Delaware</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Florida</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Georgia</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Hawaii</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Idaho</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Illinois</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Indiana</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Iowa</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Kansas</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Kentucky</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Louisiana</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Maine</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Maryland</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Massachusetts</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Michigan</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Minnesota</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Mississippi</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Missouri</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Montana</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Nebraska</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Nevada</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>New Hampshire</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>New Jersey</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>New Mexico</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>New York</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>North Carolina</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>North Dakota</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Ohio</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Oklahoma</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Oregon</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Pennsylvania</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Rhode Island</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>South Carolina</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>South Dakota</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Tennessee</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Texas</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Utah</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Vermont</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Virginia</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Washington</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>West Virginia</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Wisconsin</Dropdown.Item>
                        <Dropdown.Item onClick={this.props.changeState}>Wyoming</Dropdown.Item>
                      </Dropdown>
                    </Form.Group>
                    <Form.Group className='paymentInfoFormGroup' as={Col} controlId="formGridShippingZipCode">
                      <Form.Label>Zip Code*</Form.Label>
                      <Form.Control
                          value={this.props.addressZipCode}
                          name="addressZipCode"
                          onChange={this.props.handleChange}
                          placeholder="Zip Code" 
                          aria-label='Zip Code'
                      /> 
                    </Form.Group>
                  </Form.Group>

                </Form.Row>

                <Form.Row id='checkoutPaymentInfoRow'>
                <div id="checkoutPaymentInfoLoader" hidden={this.state.loaded}>
                  <Loader vertical center speed="slow" size="lg" content="Loading payment form..." />
                </div>
                  {this.state.loaded ? 
                  <PaymentForm 
                    paymentForm={window.SqPaymentForm}
                    paymentAmount={this.props.cartTotal}
                    cart={this.props.cart}
                    firstName={this.props.firstName}
                    lastName={this.props.lastName}
                    email={this.props.email}
                    phoneNumber={this.props.phoneNumber}
                    emailError={this.props.emailError}
                    phoneError={this.props.phoneError}
                    address1={this.props.address1}
                    address2={this.props.address2}
                    addressZipCode={this.props.addressZipCode}
                    addressCity={this.props.addressCity}
                    addressState={this.props.addressState}
                    validateAddress={this.props.validateAddress}
                    // requestCardNonce={this.requestCardNonce}
                  />
                  // <Form.Group as={Col} controlId="formGridEmail">
                  //   <span style={styles.leftCenter}>Enter Card Info Below </span>
                  //   <span style={styles.blockRight}>
                  //       {this.state.cardBrand.toUpperCase()}
                  //   </span>
                  //   <div id="sq-card-number"></div>
                  //   <input type="hidden" id="card-nonce" name="nonce" />
                  //   <div id="sq-expiration-date"></div>
                  //   <div id="sq-cvv"></div>
                  // </Form.Group>

                  : 
                  
                  <div></div>
                }
                  
                  {/* <Button
                    className="button-credit-card"
                    onClick={this.requestCardNonce}
                  >
                    Submit Order
                  </Button> */}
                </Form.Row>

                
            </div>
          </div>
        )
    };
};

export default CheckoutPaymentInfo;
       
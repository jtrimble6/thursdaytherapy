import React, { Component } from 'react'
import { Form, Col } from 'react-bootstrap'
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
        
        // this.closePaymentForm = this.closePaymentForm.bind(this)
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
       
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import API from '../../utils/API';
import axios from 'axios';
import { Loader, Alert, Modal, Button } from 'rsuite';

// COMPONENTS
// import SquarePaymentForm from './SquarePaymentForm';
// import PayPalButton from './PayPalButton';

import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';

// import dotenv from 'dotenv'
// dotenv.config()

// const styles = {
// 	name: {
// 		verticalAlign: 'top',
// 		display: 'none',
// 		margin: 0,
// 		border: 'none',
// 		fontSize: '16px',
// 		fontFamily: 'Helvetica Neue',
// 		padding: '16px',
// 		color: '#373F4A',
// 		backgroundColor: 'transparent',
// 		lineHeight: '1.15em',
// 		placeholderColor: '#000',
// 		_webkitFontSmoothing: 'antialiased',
// 		_mozOsxFontSmoothing: 'grayscale'
// 	},
// 	leftCenter: {
// 		float: 'left',
// 		textAlign: 'center'
// 	},
// 	blockRight: {
// 		display: 'block',
// 		float: 'right'
// 	},
// 	center: {
// 		textAlign: 'center',
// 		width: '100%',
// 		margin: '0 auto'
// 	},
// 	submitButton: {
// 		width: '60%',
// 		backgroundColor: 'lightgreen',
// 		fontSize: '2vw',
// 		marginBottom: '2vw'
// 	}
// };

export default class MyPaymentForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cardBrand: '',
			nonce: undefined,
			googlePay: false,
			applePay: false,
			masterpass: false,
			paypalLoadError: false,
			paymentStatus: '',
			paymentCardLastFour: '',
			paymentAmount: '',
			paymentId: '',
			paymentOrderId: '',
			purchaseReceiptUrl: '',
			paymentComplete: false,
			paymentOptionSelected: false,
			showPaymentOptionsModal: false,
			redirect: false
		};
		this.setRedirect = this.setRedirect.bind(this);
		this.renderRedirect = this.renderRedirect.bind(this);
		// this.requestCardNonce = this.requestCardNonce.bind(this);
		this.handleThirdParty = this.handleThirdParty.bind(this);
		this.handleNonceReceived = this.handleNonceReceived.bind(this);
		this.handlePaymentConfirmation = this.handlePaymentConfirmation.bind(this);
		this.handlePaypalConfirmation = this.handlePaypalConfirmation.bind(this);
		this.handlePaypalLoadError = this.handlePaypalLoadError.bind(this);
		this.handleConfirmationComplete = this.handleConfirmationComplete.bind(this);
		this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
		this.sendNewOrderEmail = this.sendNewOrderEmail.bind(this);
		this.sendOrderConfirmationEmail = this.sendOrderConfirmationEmail.bind(this);
		this.handlePayWithCreditCard = this.handlePayWithCreditCard.bind(this)
		this.handleCardTokenizeResponseReceived = this.handleCardTokenizeResponseReceived.bind(this)
	}

	componentDidMount() {
		// console.log('payment form')
		// console.log('SANDBOX ID: ', process.env.REACT_APP_SQUARE_SANDBOX_APPLICATION_ID)
	}

	handlePaypalLoadError = () => {
		this.setState({
			paypalLoadError: true
		});
	};

	handlePaypalConfirmation = (payer) => {
		// console.log('PAYPAL CONFIRMATION');
		// console.log('PAYEE DETAILS: ', payer);

		Alert.success('Payment was a success!', 5000);
		// console.log('PAYMENT WAS A HUGE SUCCESS!')
		// console.log('PAYMENT RESULT: ', data.result.payment)
		this.setState({
			paymentStatus: 'SUCCESS',
			paymentCardLastFour: 'PAYPAL',
			paymentAmount: this.props.paymentAmount,
			paymentId: payer.payer_id,
			paymentOrderId: payer.payer_id,
			purchaseReceiptUrl: 'Payment made through paypal',
			paymentComplete: true
		});

		this.handlePaymentConfirmation();
	};

	handleNonceReceived = (nonce) => {
		const idempotency_key = uuidv4();
		// console.log('nonce received in payment: ', nonce)
		// console.log('uuid created: ', idempotency_key)

		// Generate a random UUID as an idempotency key for the payment request
		// length of idempotency_key should be less than 45
		function uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		}

		fetch('process-payment', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nonce: nonce,
				idempotency_key: idempotency_key,
				location_id: process.env.REACT_APP_LOCATION_ID,
				paymentAmount: this.props.paymentAmount
			})
		})
			.catch((err) => {
				// alert('Network error: ' + err);
				Alert.error('Sorry, there was an error connecting to Square payment. Please try again.', 10000);
			})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((errorInfo) => Promise.reject(errorInfo));
				}
				return response.json();
			})
			.then((data) => {
				// console.log(data);
				if (data.title === 'Payment Successful') {
					Alert.success('Payment was a success!', 5000);
					// console.log('PAYMENT WAS A HUGE SUCCESS!')
					// console.log('PAYMENT RESULT: ', data.result.payment)
					let paymentResult = data.result.payment;
					this.setState({
						paymentStatus: paymentResult.status,
						paymentCardLastFour: paymentResult.cardDetails.card.last4,
						paymentAmount: paymentResult.amountMoney.amount,
						paymentId: paymentResult.id,
						paymentOrderId: paymentResult.orderId,
						purchaseReceiptUrl: paymentResult.receiptUrl
					});
				}
				
				this.handlePaymentConfirmation();
			})
			.catch((err) => {
				console.error(err);
				Alert.error('Sorry, there was an error completing your payment. Please try again.', 10000);
			});
	};

	formatMoney(amount, decimalCount = 2, decimal = '.', thousands = ',') {
		try {
			decimalCount = Math.abs(decimalCount);
			decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

			const negativeSign = amount < 0 ? '-' : '';

			let i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
			let j = i.length > 3 ? i.length % 3 : 0;

			return (
				'$' +
				negativeSign +
				(j ? i.substr(0, j) + thousands : '') +
				i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
				(decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '')
			);
		} catch (e) {
			// console.log(e)
		}
	};

	handlePaymentConfirmation = () => {
		// SHOW ORDER CONFIRMATION FORM
		let orderConfirmationForm = document.getElementById('paymentConfirmationForm');
		orderConfirmationForm.hidden = false;

		// HIDE PAYMENT INFO FORM
		let orderFormContainer = document.getElementById('paymentInfoForm');
		orderFormContainer.hidden = true;

		// HIDE ORDER FORM NAV BUTTONS
		let checkoutFormNav = document.getElementById('checkoutFormNav');
		checkoutFormNav.innerHTML = '';

		// CHANGE CHECKOUT TITLE
		// HIDE CHECKOUT STEP TITLE DIV
		let checkoutTitle = document.getElementById('checkoutTitle');
		checkoutTitle.innerHTML = 'Payment Complete';
		let checkoutStepTitle = document.getElementById('checkoutStepTitle');
		checkoutStepTitle.innerHTML = '';

		// HIDE REQUIRED TEXT
		let requiredText = document.getElementById('checkoutRequiredSmall');
		requiredText.hidden = true;

		// CREATE CHECKOUT CONFIRMATION BUTTON
		let checkoutConfirmationButton = document.createElement('button');
		// checkoutConfirmationButton.innerHTML = '<button className="checkoutConfirmationButton" onclick='+ this.handleConfirmationComplete +'" />';
		checkoutConfirmationButton.innerHTML = 'Return Home';
		checkoutConfirmationButton.classList.add('checkoutConfirmationButton');
		checkoutConfirmationButton.classList.add('button-credit-card');
		checkoutConfirmationButton.onclick = this.handleConfirmationComplete;
		checkoutFormNav.appendChild(checkoutConfirmationButton);

		// CREATE ORDER CONFIRMATION DIV
		let orderConfirmationElement = document.createElement('div');
		orderConfirmationElement.classList.add('paymentConfirmationDiv');

		// ADD ORDER CONFIRMATION DATA TO DIV
		// let lineBreak = document.createElement('br')

		let orderConfirmationStatus = document.createElement('p');
		orderConfirmationStatus.innerHTML = 'Payment Status: ' + this.state.paymentStatus;

		let orderCard = document.createElement('p');
		orderCard.innerHTML = 'Payment Method: *' + this.state.paymentCardLastFour;

		let orderAmount = document.createElement('p');
		let orderAmountInt = parseFloat(this.state.paymentAmount).toFixed(2);
		let orderAmountFormatted = this.formatMoney(orderAmountInt);
		orderAmount.innerHTML = 'Payment Amount: ' + orderAmountFormatted;

		let orderConfirmationNumber = document.createElement('p');
		orderConfirmationNumber.innerHTML = 'Confirmation #: ' + this.state.paymentId;

		let orderEmailConfirmation = document.createElement('p');
		orderEmailConfirmation.innerHTML =
			'Thank you for your order! A confirmation email has been sent to: ' + this.props.email;

		let orderEmailDisclaimer = document.createElement('p');
		orderEmailDisclaimer.innerHTML = '(Email may be sent to your spam folder).';

		// APPEND ORDER CONFIRMATION DIV TO PAGE
		orderConfirmationElement.appendChild(orderConfirmationStatus);
		orderConfirmationElement.appendChild(orderCard);
		orderConfirmationElement.appendChild(orderAmount);
		orderConfirmationElement.appendChild(orderConfirmationNumber);
		orderConfirmationElement.appendChild(orderEmailConfirmation);
		orderConfirmationElement.appendChild(orderEmailDisclaimer);
		orderConfirmationForm.appendChild(orderConfirmationElement);

		// EMPTY LOCAL STORAGE
		localStorage.clear();

		this.handleOrderSubmit();
	};

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
		// console.log('ORDER DATA: ', orderData);
		API.submitOrder(orderData)
			.then((res) => {
				// console.log('ORDER SUBMIT RESULT: ', res)
				let orderDetails = orderData.purchaseDetails;
				this.sendNewOrderEmail(
					orderData.firstName,
					orderData.lastName,
					orderData.email,
					orderData.phoneNumber,
					orderDetails
				);
				this.sendOrderConfirmationEmail(
					orderData.firstName,
					orderData.lastName,
					orderData.email,
					orderData.confirmationNumber,
					orderData.purchaseReceiptUrl,
					orderDetails
				);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	sendNewOrderEmail = (firstName, lastName, email, phoneNumber, details) => {
		// console.log(firstName, lastName, email, phoneNumber, details)
		let cart = details;
		let that = this;
		// Format a string itemising cart by mapping elements to sub-strings and joining the result
		const items = cart
			.map(function(element) {
				let soapPriceFormatted = '';
				let soapTotalFormatted = '';
				if (element.soapPrice % 1 === 0) {
					let soapPriceInt = parseInt(element.soapPrice);
					// console.log('SOAP PRICE: ', element.soapPrice);
					// console.log('SOAP PRICE INT: ', soapPriceInt);
					soapPriceFormatted = that.formatMoney(soapPriceInt);
					// console.log('SOAP PRICE FORMATTED: ', soapPriceFormatted)
					// let soapTotalInt = parseInt(element.soapTotal)
					// console.log('SOAP TOTAL INT: ', soapPriceInt)
					soapTotalFormatted = that.formatMoney(element.soapTotal);
					// console.log('SOAP TOTAL FORMATTED: ', soapTotalFormatted)
				} else {
					soapPriceFormatted = that.formatMoney(element.soapPrice);
					soapTotalFormatted = that.formatMoney(element.soapTotal);
				}

				return `
					PRODUCT: ${element.soapName}
					PRICE: ${soapPriceFormatted}
					QUANTITY: ${element.soapQty}
					PRODUCT TOTAL: ${soapTotalFormatted}
				`;
			})
			.join('\n');

		// Calculate total price via reduction, and format to a number to 2dp
		// const totalPrice = this.state.cart.reduce(function(sum, element) {
		//   return sum + (element.soapQuantity * element.soapPrice);
		// }, 0.0);

		// Format body string with itemised cart, total price, etc
		const body = `
			${items}

			Total Sale: ${that.formatMoney(this.props.paymentAmount)}
		`;

		axios({
			method: 'POST',
			url: 'https://www.thursday-therapy.com/neworder',
			// url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/neworder" : "https://www.thursday-therapy.com/neworder",
			data: {
				firstName: firstName,
				lastName: lastName,
				email: email,
				phoneNumber: phoneNumber,
				details: body
			}
		}).then((response) => {
			console.log('EMAIL ORDER RESPONSE: ', response);
			if (response.data.msg === 'success') {
				// console.log("Message Sent.");
				Alert.success('Your order has been received!', 5000);
				this.setState({
					contactSuccess: true
				});
				// this.resetForm();
			} else if (response.data.msg === 'fail') {
				// console.log("Message failed to send.")
				Alert.error('There was an error submitting your order. Please contact us to complete order.', 15000);
				this.setState({
					contactError: true
				});
			}
		});
	};

	sendOrderConfirmationEmail = (firstName, lastName, email, confirmationNumber, confirmationUrl, details) => {
		// console.log(firstName, lastName, email, confirmationNumber, confirmationUrl)
		let cart = details;
		// let that = this
		// Format a string itemising cart by mapping elements to sub-strings and joining the result
		const items = cart
			.map(function(element) {
				return `
        (${element.soapQty}) ${element.soapName}
        
        `;
			})
			.join(' | ');

		// Calculate total price via reduction, and format to a number to 2dp
		// const totalPrice = this.state.cart.reduce(function(sum, element) {
		//   return sum + (element.soapQuantity * element.soapPrice);
		// }, 0.0);

		// Format body string with itemised cart, total price, etc
		const orderDetails = `
			${items}
		`;

		axios({
			method: 'POST',
			url: 'https://www.thursday-therapy.com/orderconfirmation',
			// url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/orderconfirmation" : "https://www.thursday-therapy.com/orderconfirmation",
			data: {
				firstName: firstName,
				lastName: lastName,
				email: email,
				confirmationNumber: confirmationNumber,
				confirmationUrl: confirmationUrl,
				orderDetails: orderDetails
			}
		}).then((response) => {
			console.log('EMAIL CONF RESPONSE: ', response);
			if (response.data.msg === 'success') {
				Alert.success('Confirmation email sent!', 5000);
			} else if (response.data.msg === 'fail') {
				Alert.error('There was an error sending order confirmation. Please contact us to resend.', 15000);
			}
		});
	};

	handleConfirmationComplete = () => {
		// console.log('CHECKOUT COMPLETE')
		this.setRedirect();
	};

	handleThirdParty = (e) => {
		e.preventDefault();
	};

	setRedirect = () => {
		this.setState({
			redirect: true
		});
	};

	renderRedirect = () => {
		if (this.state.redirect === true) {
			return <Redirect to="/" />;
		} else {
		}
	};

	handlePayWithCreditCard = () => {
		this.props.creditCardPayment()
		this.setState({
			paymentOptionSelected: true
		})
	}

	handleCardTokenizeResponseReceived = (token, buyer) => {
		const idempotency_key = uuidv4();
		// Generate a random UUID as an idempotency key for the payment request
		// length of idempotency_key should be less than 45
		function uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		}

		let finalPaymentAmountInCents = parseFloat(this.props.paymentAmount).toFixed(2) * 100
		// console.log('final payout amount in cents: ', finalPaymentAmountInCents)

		fetch('process-payment', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				// token: token,
				// buyer: buyer,
				sourceId: token.token,
				idempotencyKey: idempotency_key,
				amountMoney: {amount: parseInt(finalPaymentAmountInCents), currency: "USD"},
				locationId: process.env.REACT_APP_LOCATION_ID,
			})
		})
			.catch((err) => {
				// alert('Network error: ' + err);
				Alert.error('Sorry, there was an error connecting to Square payment. Please try again.', 10000);
			})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((errorInfo) => Promise.reject(errorInfo));
				}
				// console.log('PAYMENT WAS A HUGE SUCCESS!!! ', response)
				return response.json();
			})
			.then((data) => {
				// console.log(data);
				// console.log('PAYMENT RESULT: ', data)
				// console.log('JSON DATA: ', JSON.stringify(data));
				if (data.title === 'Payment Successful') {
					Alert.success('Payment was a success!', 5000);
					// console.log('PAYMENT WAS A HUGE SUCCESS!')
					// console.log('PAYMENT RESULT: ', data.result.payment)
					let paymentResult = data.result.payment;
					let paymentAmount = paymentResult.totalMoney.amount / 100
					// console.log("payment amount: ", paymentAmount)
					this.setState({
						paymentStatus: paymentResult.status,
						paymentCardLastFour: paymentResult.cardDetails.card.last4,
						paymentAmount: paymentAmount,
						paymentId: paymentResult.id,
						paymentOrderId: paymentResult.orderId,
						purchaseReceiptUrl: paymentResult.receiptUrl
					});
				}
				// debugger;
				// alert('Payment complete successfully!\nCheck browser developer console for more details');
				this.handlePaymentConfirmation();
			})
			.catch((err) => {
				console.error(err);
				Alert.error('Sorry, there was an error completing your payment. Please try again.', 10000);
				// alert('Payment failed to complete!\nCheck browser developer console for more details');
			});
	}

	render() {
		return (
			<div id="paymentInfoSquareForm" className="container">
				{this.renderRedirect()}

				{/* SMARTY STREETS SDK ADDRESS VERIFICATION MODAL */}
				<Modal show={this.props.showAddressModal} onHide={this.props.hideAddressModal}>
					<Modal.Header>
						<Modal.Title className="confirmAddressModalHeader">Address Verification</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h2>Address Suggestions: </h2>
						<br />
						{this.props.addressSuggestions.length ? (
							this.props.addressSuggestions.map((suggestion) => {
								return (
									<span>
										{suggestion.deliveryLine1} {suggestion.lastLine}{' '}
										<Button
											onClick={this.props.confirmAddress}
											data-addressline1={suggestion.deliveryLine1}
											data-addressline2={suggestion.lastLine}
										>
											Select address
										</Button>
									</span>
								);
							})
						) : (
							<p>No suggestions found.</p>
						)}
						<hr />
						<h2 className="addressEnteredHeader">Address Entered: </h2>
						<br />
						<p className="addressEntered">
							{this.props.address1} {this.props.address2 !== null ? this.props.address2 : ''}{' '}
							{this.props.addressCity}, {this.props.addressState} {this.props.addressZipCode}
						</p>
						<Button
							className="confirmAddressButton"
							onClick={this.props.confirmAddress}
							data-addressline1={this.props.address1 + ' ' + this.props.address2}
							data-addressline2={
								this.props.addressCity + ' ' + this.props.addressState + ' ' + this.props.addressZipCode
							}
						>
							Confirm Address
						</Button>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.hideAddressModal}>Cancel</Button>
					</Modal.Footer>
				</Modal>

				{/* MANUAL ADDRESS VERIFICATION MODAL */}
				<Modal show={this.props.showManualAddressModal} onHide={this.props.hideManualAddressModal}>
					<Modal.Header>
						<Modal.Title className="confirmAddressModalHeader">Address Verification</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h2 className="addressEnteredHeader">Please Confirm Address Entered: </h2>
						<br />
						<p className="addressEntered">
							{this.props.address1} {this.props.address2 !== null ? this.props.address2 : ''}{' '}
							{this.props.addressCity}, {this.props.addressState} {this.props.addressZipCode}
						</p>
						<Button
							className="confirmAddressButton"
							onClick={this.props.manualConfirmAddress}
							data-addressline1={this.props.address1 + ' ' + this.props.address2}
							data-addressline2={
								this.props.addressCity + ' ' + this.props.addressState + ' ' + this.props.addressZipCode
							}
						>
							Confirm Address
						</Button>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.hideManualAddressModal}>Cancel</Button>
					</Modal.Footer>
				</Modal>

				{/* PAYMENT OPTIONS MODAL */}
				<Modal
					id="paymentOptionsModal"
					show={
						this.state.paymentOptionSelected ? (
							this.state.showPaymentOptionsModal
						) : (
							this.props.showPaymentOptionsModal
						)
					}
					onHide={this.props.hidePaymentOptionsModal}
				>
					<Modal.Header>
						<Modal.Title className="paymentOptionsModalHeader">Select Payment Method</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Button className="paymentOptionsButton" onClick={this.handlePayWithCreditCard}>
							Pay with Credit Card
						</Button>

						{/* <h2 className='paymentOptionsSubHeader'>Third-Party Payment Services: </h2><br />

						<PayPalButton 
							paymentAmount={this.props.paymentAmount}
							handlePaypalConfirmation={this.handlePaypalConfirmation}
							hidePaymentOptionsModal={this.props.hidePaymentOptionsModal}
							handlePaypalLoadError={this.handlePaypalLoadError}
						/>

						{
						this.state.paypalLoadError ? <Button className='paypalLoadErrorButton' disabled>Error loading third-party services</Button> : <div></div>
						} */}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.hidePaymentOptionsModal}>Cancel</Button>
					</Modal.Footer>
				</Modal>

				<div id="addressValidationButtonDiv" hidden={false}>
					<Button onClick={this.props.validateAddress} id="addressValidationButton">
						Continue to Payment
					</Button>
				</div>

				<div id="creditCardForm" hidden={true}>
					{/* <SquarePaymentForm /> */}
					<PaymentForm
						/**
						 * Identifies the calling form with a verified application ID generated from
						 * the Square Application Dashboard.
						 */
						// SANDBOX
						// applicationId={process.env.REACT_APP_SQUARE_SANDBOX_APPLICATION_ID}

						// PRODUCTION
						applicationId={process.env.REACT_APP_SQUARE_PRODUCTION_APPLICATION_ID}

						/**
						 * Invoked when payment form receives the result of a tokenize generation
						 * request. The result will be a valid credit card or wallet token, or an error.
						 */
						cardTokenizeResponseReceived={(token, buyer) => {
							console.info({ token, buyer });
							this.handleCardTokenizeResponseReceived(token, buyer)
						}}
						/**
						 * This function enable the Strong Customer Authentication (SCA) flow
						 *
						 * We strongly recommend use this function to verify the buyer and reduce
						 * the chance of fraudulent transactions.
						 */
						// createVerificationDetails={() => ({
						// 	amount: '1.00',
						// 	/* collected from the buyer */
						// 	billingContact: {
						// 	addressLines: ['123 Main Street', 'Apartment 1'],
						// 	familyName: 'Doe',
						// 	givenName: 'John',
						// 	countryCode: 'GB',
						// 	city: 'London',
						// 	},
						// 	currencyCode: 'GBP',
						// 	intent: 'CHARGE',
						// })}
						/**
						* Identifies the location of the merchant that is taking the payment.
						* Obtained from the Square Application Dashboard - Locations tab.
						*/
						locationId={process.env.REACT_APP_LOCATION_ID}
					>
					<CreditCard />
					</PaymentForm>

				</div>

			</div>
		);
	}
}
import * as React from 'react';

import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

export default function App() {
	return (
		<div className="App">
			<h1>Hello CodeSandbox</h1>
			<h2>Start editing to see some magic happen!</h2>

			<PaymentForm
				applicationId={process.env.REACT_APP_SQUARE_SANDBOX_APPLICATION_ID}
				cardTokenizeResponseReceived={(token, buyer) => {
					console.info({ token, buyer });
				}}
				locationId={process.env.REACT_APP_LOCATION_ID}
			>
				<CreditCard />
			</PaymentForm>
		</div>
	);
}

// import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
// import { Form } from 'rsuite';

// const SquarePaymentForm = () => (
// 	<PaymentForm
// 		/**
//      * Identifies the calling form with a verified application ID generated from
//      * the Square Application Dashboard.
//      */
// 		applicationId={process.env.REACT_APP_SQUARE_SANDBOX_APPLICATION_ID}
// 		/**
//      * Invoked when payment form receives the result of a tokenize generation
//      * request. The result will be a valid credit card or wallet token, or an error.
//      */
// 		cardTokenizeResponseReceived={(token, buyer) => {
// 			console.info({ token, buyer });
// 		}}
// 		/**
//      * This function enable the Strong Customer Authentication (SCA) flow
//      *
//      * We strongly recommend use this function to verify the buyer and reduce
//      * the chance of fraudulent transactions.
//      */
// 		// createVerificationDetails={() => ({
// 		// 	amount: '1.00',
// 		// 	/* collected from the buyer */
// 		// 	billingContact: {
// 		// 		addressLines: [ '123 Main Street', 'Apartment 1' ],
// 		// 		familyName: 'Doe',
// 		// 		givenName: 'John',
// 		// 		countryCode: 'GB',
// 		// 		city: 'London'
// 		// 	},
// 		// 	currencyCode: 'GBP',
// 		// 	intent: 'CHARGE'
// 		// })}
// 		/**
//      * Identifies the location of the merchant that is taking the payment.
//      * Obtained from the Square Application Dashboard - Locations tab.
//      */
// 		locationId={process.env.REACT_APP_LOCATION_ID}
// 	>
// 		{/* <Form.Row id="billingInfoRow">
// 			<h2>Enter Billing Info</h2>

// 			<Form.Group className="billingInfoFormGroup">
// 				<Form.Label>Address Line 1</Form.Label>
// 				<Form.Control
// 					value={this.props.billingAddress1}
// 					onChange={this.props.handleChange}
// 					name="billingAddress1"
// 					placeholder="123 Main Street"
// 					aria-label="Address Line 1"
// 				/>
// 			</Form.Group>
// 			<Form.Group className="billingInfoFormGroup">
// 				<Form.Label>Address Line 2</Form.Label>
// 				<Form.Control
// 					value={this.props.billingAddress2}
// 					onChange={this.props.handleChange}
// 					name="billingAddress2"
// 					placeholder="Apartment 1"
// 					aria-label="Address Line 2"
// 				/>
// 			</Form.Group>
// 			<Form.Group className="billingInfoFormGroup">
// 				<Form.Label>First Name</Form.Label>
// 				<Form.Control
// 					value={this.props.firstName}
// 					onChange={this.props.handleChange}
// 					name="firstName"
// 					placeholder="John"
// 					aria-label="First Name"
// 				/>
// 			</Form.Group>
// 			<Form.Group className="billingInfoFormGroup">
// 				<Form.Label>Last Name</Form.Label>
// 				<Form.Control
// 					value={this.props.lastName}
// 					onChange={this.props.handleChange}
// 					name="lastName"
// 					placeholder="Doe"
// 					aria-label="Last Name"
// 				/>
// 			</Form.Group>
// 			<Form.Group className="billingInfoFormGroup">
// 				<Form.Label>Address Line 1</Form.Label>
// 				<Form.Control
// 					value={this.props.billingAddress1}
// 					onChange={this.props.handleChange}
// 					name="billingAddress1"
// 					placeholder="123 Main Street"
// 					aria-label="Address Line 1"
// 				/>
// 			</Form.Group>
// 		</Form.Row> */}
// 		<CreditCard />
// 	</PaymentForm>
// );

// export default SquarePaymentForm;

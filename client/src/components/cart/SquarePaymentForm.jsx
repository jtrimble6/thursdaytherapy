import * as React from 'react';

import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

export default function App() {
	return (
		<div className="App">
			<h1>Hello CodeSandbox</h1>
			<h2>Start editing to see some magic happen!</h2>

			<PaymentForm
				// SANDBOX
				// applicationId={process.env.REACT_APP_SQUARE_SANDBOX_APPLICATION_ID}

				// PRODUCTION 
				applicationId={process.env.REACT_APP_SQUARE_PRODUCION_APPLICATION_ID}

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
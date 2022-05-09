import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = (props) => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);

    // creates a paypal order
    const createOrder = (data, actions) => {
    
    return actions.order
        .create({
        purchase_units: [
            {
            description: "Sunflower",
            amount: {
                currency_code: "USD",
                value: props.paymentAmount,
            },
            },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
            shipping_preference: "NO_SHIPPING",
        },
        })
        .then((orderID) => {
        setOrderID(orderID);
        return orderID;
        });
    };

    // check Approval
    const onApprove = (data, actions) => {
        // props.hidePaymentOptionsModal()
        // props.handlePaymentConfirmation()
        actions.order.capture().then(function (details) {
            const { payer } = details;
            props.handlePaypalConfirmation(payer)
            setSuccess(true);
        });
    };
    //capture likely error
    const onError = (data, actions) => {
        console.log('ERROR PROCESSING PAYPAL')
        setErrorMessage("An Error occured with your payment ");
    };

    const SCRIPT_PROVIDER_OPTIONS = {
        "client-id": process.env.NODE_ENV === 'development' ? "test" : process.env.REACT_APP_PAYPAL_SANDBOX_CLIENT_ID
    };

return (
    <PayPalScriptProvider options={SCRIPT_PROVIDER_OPTIONS}>
        <div className="wrapper">
            <PayPalButtons
                style={{ layout: "vertical", color: 'blue' }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
            />
        </div>
    </PayPalScriptProvider>
    );
}

export default PayPalButton
import React, { useEeffect, useState } from 'react';
import { Elements, StripeProvider,CardElement, injectStripe }    from 'react-stripe-elements';
import firebase from "firebase/compat/app";
import {PaymentElement} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js';
import Button from "@mui/material/Button";

const Payment = (stripeConfig) => {

    const [customer, setCustomer]  = useState(null);
    const [payment, setPayment]    = useState(false);

    const StripePromise = loadStripe("pk_test_51L526RGH7Y6DbZsDauEw1anemg27mScrSuK7a3WOzhDx08m0vjZuyvytTzXMKyXCHQT53pw60DdQOF4aOeEnJ7To00HVayNsSM")

        
    return  (
        <section>
            <Elements>
                <PaymentElement/>
            </Elements>
        </section>

    );
    
}

export default Payment;

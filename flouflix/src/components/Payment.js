import React from 'react';
import {PaymentElement,CardElement,CardExpiryElement,CardNumberElement,CardCvcElement,Elements,useStripe, useElements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js';
import Button from "@mui/material/Button";

const Payment = (stripeConfig) => {
    const StripePromise = loadStripe("pk_test_51L526RGH7Y6DbZsDauEw1anemg27mScrSuK7a3WOzhDx08m0vjZuyvytTzXMKyXCHQT53pw60DdQOF4aOeEnJ7To00HVayNsSM")
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();
  
      if (!stripe || !elements) {
          console.log("stripe n'a pas été load")
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "https://flouflix-staging.web.app/",
        },
      });
  
      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        console.log(result.error.message);
      } else {
          console.log("Payment sécurisé")
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    };


    return  (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={!stripe}>Submit</button>
        </form>
    );
}

export default Payment;

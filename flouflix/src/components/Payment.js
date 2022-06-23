import React, {useState,useEffect} from 'react';
import {PaymentElement,CardElement,CardExpiryElement,CardNumberElement,CardCvcElement,Elements,useStripe, useElements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js';
import Button from "@mui/material/Button";

const Payment = (props) => {
    const StripePromise = loadStripe("pk_test_51L526RGH7Y6DbZsDauEw1anemg27mScrSuK7a3WOzhDx08m0vjZuyvytTzXMKyXCHQT53pw60DdQOF4aOeEnJ7To00HVayNsSM")

    const[stripeError,setStripeError] = useState();
    const[loading,setLoading] = useState();
    const lineItem = [];
    console.log(props)
    for (let index = 0; index < props.sale.length; index++) {
        lineItem.push({
            price : props.sale[index].price,
            quantity : parseInt(props.sale[index].quantity),
        })
        console.log(props.sale[0].quantity)
        console.log(lineItem)
        
    }
    useEffect(async () => {
        setLoading(true);
        
        const stripe = await StripePromise

        const {error} = await stripe.redirectToCheckout({
            lineItems:
                lineItem,
            mode : 'payment',
            cancelUrl : 'https://flouflix-staging.web.app/mon-panier',
            successUrl : 'https://flouflix-staging.web.app/confirmation-commande',
            customerEmail : props.email,
        });
        if(error){
            setLoading(false);
            setStripeError(error);
        }
    }, []);
    return(null)

}

export default Payment;

"use client"
import React, { useEffect, useState } from 'react'
import Header from './_components/Header'
import { useUser } from '@clerk/nextjs'
import axios from 'axios';
import { CartContext } from './_context/CartContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Script from 'next/script';

function Provider({ children }) {

    const { user } = useUser();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        user && CheckIsNewUser();
        user && GetCartItems();
    }, [user]);
    const CheckIsNewUser = async () => {
        const result = await axios.post('/api/user', {
            user: user
        });
    }

    const GetCartItems = async () => {
        const result = await axios.get('/api/cart?email=' + user?.primaryEmailAddress?.emailAddress)
        setCart(result.data);

    }

return (
        <div>
            <CartContext.Provider value={{ cart, setCart }}>
                {/* Correct Razorpay SDK Script */}
                <Script 
                    src="https://checkout.razorpay.com/v1/checkout.js"
                    strategy="lazyOnload"
                    onLoad={() => {
                        console.log('Razorpay SDK loaded successfully');
                    }}
                    onError={(e) => {
                        console.error('Failed to load Razorpay SDK:', e);
                    }}
                />
                <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency: 'USD' }}>
                    <Header />
                    <div>
                        {children}
                    </div>
                </PayPalScriptProvider>
            </CartContext.Provider>
        </div>
    )
}

export default Provider

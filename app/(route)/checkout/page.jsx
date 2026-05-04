"use client"
import CheckoutProductItem from "@/app/_components/CheckoutProductItem";
import { CartContext } from "@/app/_context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react"
import { toast } from "sonner";

function Checkout() {
    const {cart, setCart}= useContext(CartContext);
    const { user }= useUser();
    const [loading,setLoading]= useState(false);
    const router= useRouter();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [address, setAddress] = useState({
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: ''
    });

    const calculateTotal= ()=>{
        let total= 0;
        cart.forEach(item=>{
            total= total+ Number(item.price)
        })
        return Math.round(total * 100);
    }

    const calculateTotalRupees = () => {
        let total = 0;
        cart.forEach(item => {
            total = total + Number(item.price)
        })
        return total;
    }

    useEffect(() => {
        const checkRazorpay = () => {
            if (window.Razorpay) {
                setRazorpayLoaded(true);
                console.log('Razorpay is loaded');
            } else {
                setTimeout(checkRazorpay, 100);
            }
        };
        checkRazorpay();
    }, []);

    const validateAddress = () => {
        if (!address.name.trim()) {
            toast.error('Please enter your full name');
            return false;
        }
        if (!address.phone.trim() || address.phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return false;
        }
        if (!address.addressLine.trim()) {
            toast.error('Please enter your address');
            return false;
        }
        if (!address.city.trim()) {
            toast.error('Please enter your city');
            return false;
        }
        if (!address.state.trim()) {
            toast.error('Please enter your state');
            return false;
        }
        if (!address.pincode.trim() || address.pincode.length < 6) {
            toast.error('Please enter a valid pincode');
            return false;
        }
        return true;
    };

    const  onPaymentSuccess= async(paymentId, orderId, signature)=>{
        setLoading(true);
        try {
            const verifyResponse = await axios.post('/api/verifyPayment', {
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderId,
                razorpay_signature: signature,
            });

            if (verifyResponse.data.verified) {
                const fullAddress = `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`;
                const result= await axios.post('/api/order',{
                    orderDetail: cart,
                    email:user?.primaryEmailAddress?.emailAddress,
                    paymentId: paymentId,
                    amount: calculateTotalRupees(),
                    name: address.name,
                    phone: address.phone,
                    address: fullAddress
                });

                if(result)
                {
                    // Send order confirmation email
                    try {
                        await axios.post('/api/send-email', {
                            to: user?.primaryEmailAddress?.emailAddress,
                            subject: 'Your MediCare Order Confirmation & Receipt',
                            orderDetail: cart,
                            paymentId: paymentId,
                            totalAmount: calculateTotalRupees(),
                            customerName: address.name,
                            customerAddress: fullAddress,
                            customerPhone: address.phone,
                            orderDate: new Date().toISOString(),
                        });
                        toast.success('Order confirmation email sent!');
                    } catch (emailErr) {
                        console.error('Email sending failed:', emailErr);
                    }

                    setCart([]);
                    toast.success('Order Created Successfully!!')
                    router.replace('/dashboard');
                }
            } else {
                toast.error('Payment verification failed');
            }
        } catch (error) {
            console.error("Order creation error:", error);
            toast.error("Failed to create order. Please contact support.");
        }
        setLoading(false);
    }

    const handleAddressChange = (field, value) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const initRazorpayPayment = async () => {
        if (!razorpayLoaded || !window.Razorpay) {
            toast.error("Payment system is not loaded. Please refresh the page.");
            return;
        }

        if (!user || !user.primaryEmailAddress) {
            toast.error("Please login to continue");
            return;
        }

        if (!validateAddress()) {
            return;
        }

        setLoading(true);
        try {
            const orderResponse = await axios.post('/api/createOrder', {
                amount: calculateTotal()
            });

            const order = orderResponse.data;
            
            if (!order || !order.id) {
                throw new Error("Failed to create order");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                name: "Medical E-Commerce",
                currency: order.currency,
                amount: order.amount,
                order_id: order.id,
                description: "Payment for your order",
                handler: async function (response) {
                    console.log("Payment response:", response);
                    toast.success("Payment Successful!");
                    await onPaymentSuccess(
                        response.razorpay_payment_id,
                        response.razorpay_order_id,
                        response.razorpay_signature
                    );
                },
                prefill: {
                    name: user?.fullName || "",
                    email: user?.primaryEmailAddress?.emailAddress || "",
                    contact: ""
                },
                theme: {
                    color: "#0070ba"
                },
                modal: {
                    ondismiss: function() {
                        toast.error("Payment cancelled!");
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response) {
                console.error("Razorpay payment failed:", response.error);
                toast.error(response.error.description || "Payment failed. Please try again.");
                setLoading(false);
            });

            paymentObject.open();
            
        } catch (error) {
            console.error("Payment initialization error:", error);
            toast.error(error.message || "Payment failed. Please try again.");
            setLoading(false);
        }
    }

    return(
        <div className="mt-10">
            <h2 className="font-bold text-3xl">Checkout</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-10">
                <div className="flex flex-col gap-3">
                    {cart.length === 0 ? (
                        <div className="text-center p-10 bg-gray-100 rounded-lg">
                            <p className="text-gray-500">Your cart is empty</p>
                            <Button onClick={() => router.push('/')} className="mt-4">
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        cart.map((product,index)=>(
                            <CheckoutProductItem product={product} key={index}/>
                        ))
                    )}
                </div>
                <div>
                    <Card className='p-5'>
                        <h2 className="font-bold text-2xl flex justify-between">Total: <span>₹{calculateTotal() / 100}</span></h2>
                        <hr className='my-5 border-black'></hr>
                        <div>Your payment receipt and product details will be delivered to your registered email Id.
                        <Badge className='text-black bg-white'>{user?.primaryEmailAddress?.emailAddress}</Badge></div>

                        {cart.length > 0 && (
                            <>
                                <div className="mt-5 space-y-3">
                                    <h3 className="font-bold text-lg">Shipping Address</h3>
                                    <Input
                                        placeholder="Full Name"
                                        value={address.name}
                                        onChange={(e) => handleAddressChange('name', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Phone Number"
                                        type="tel"
                                        value={address.phone}
                                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Address Line"
                                        value={address.addressLine}
                                        onChange={(e) => handleAddressChange('addressLine', e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            placeholder="City"
                                            value={address.city}
                                            onChange={(e) => handleAddressChange('city', e.target.value)}
                                        />
                                        <Input
                                            placeholder="State"
                                            value={address.state}
                                            onChange={(e) => handleAddressChange('state', e.target.value)}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Pincode"
                                        value={address.pincode}
                                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                                    />
                                </div>
                                <Button 
                                    onClick={initRazorpayPayment}
                                    disabled={loading || !razorpayLoaded}
                                    className="w-full mt-5 bg-[#0070ba] hover:bg-[#003087]"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : razorpayLoaded ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.5 4h-3.5V2.5C16 1.5 14.5 0 12.5 0H8.5C7 0 6 1 6 2.5V4H3.5C2 4 1 5 1 6.5v12c0 1.5 1 2.5 2.5 2.5h13c1.5 0 2.5-1 2.5-2.5V6.5c0-1.5-1-2.5-2.5-2.5zM8 4h3v3H8V4zm8 14H4v-2h12v2zm0-4H4v-2h13v2zm0-4H4V6h13v4z"/>
                                            </svg>
                                            Pay with Razorpay
                                        </span>
                                    ) : (
                                        <span>Loading Payment System...</span>
                                    )}
                                </Button>
                                
                                {!razorpayLoaded && (
                                    <p className="text-sm text-gray-500 mt-2 text-center">
                                        Please wait while payment system loads...
                                    </p>
                                )}
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Checkout

import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

export const EmailOrder = ({ orderDetail, paymentId, totalAmount, customerName, customerAddress, customerPhone, orderDate }) => {
    const safeOrderDetail = Array.isArray(orderDetail) ? orderDetail : [];
    const safeTotal = totalAmount || safeOrderDetail.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    .font-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                `}</style>
            </Head>
            <Preview>MediCare Order Confirmation - Payment Successful</Preview>
            <Body className="font-inter bg-gray-100" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', backgroundColor: '#f3f4f6', margin: 0, padding: '20px' }}>
                <Container style={{ maxWidth: '640px', margin: '0 auto' }}>

                    {/* Header Banner */}
                    <Section style={{ backgroundColor: '#1e40af', borderRadius: '12px 12px 0 0', padding: '24px' }}>
                        <Row>
                            <Column style={{ verticalAlign: 'middle', width: '56px' }}>
                                <Img
                                    src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png"
                                    width="48"
                                    height="48"
                                    alt="MediCare Logo"
                                    style={{ borderRadius: '8px', display: 'block', backgroundColor: '#fff' }}
                                />
                            </Column>
                            <Column style={{ verticalAlign: 'middle', paddingLeft: '16px' }}>
                                <Heading style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: 0 }}>
                                    MediCare
                                </Heading>
                                <Text style={{ color: '#bfdbfe', fontSize: '14px', margin: '4px 0 0 0' }}>
                                    Medical Supplies & Equipment
                                </Text>
                            </Column>
                            <Column align="right" style={{ verticalAlign: 'middle' }}>
                                <Text style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0 }}>
                                    Receipt
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Payment Success Banner */}
                    <Section style={{ backgroundColor: '#dcfce7', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', padding: '16px 24px', textAlign: 'center' }}>
                        <Text style={{ color: '#166534', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                            ✅ Payment Successful
                        </Text>
                    </Section>

                    {/* Main Content Card */}
                    <Section style={{ backgroundColor: '#ffffff', padding: '24px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px' }}>

                        {/* Order Details Row */}
                        <Row style={{ marginBottom: '24px' }}>
                            <Column style={{ verticalAlign: 'top', width: '50%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
                                    Order Date
                                </Text>
                                <Text style={{ color: '#111827', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                                    {orderDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Text>
                            </Column>
                            <Column align="right" style={{ verticalAlign: 'top', width: '50%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
                                    Payment ID
                                </Text>
                                <Text style={{ color: '#111827', fontSize: '14px', fontWeight: '600', margin: 0, fontFamily: 'monospace' }}>
                                    {paymentId || 'N/A'}
                                </Text>
                            </Column>
                        </Row>

                        <Hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

                        {/* Customer Details */}
                        <Section style={{ marginBottom: '24px', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
                            <Heading style={{ color: '#374151', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
                                Shipping Details
                            </Heading>
                            {customerName && (
                                <Text style={{ color: '#4b5563', fontSize: '14px', margin: '4px 0' }}>
                                    <strong>Name:</strong> {customerName}
                                </Text>
                            )}
                            {customerPhone && (
                                <Text style={{ color: '#4b5563', fontSize: '14px', margin: '4px 0' }}>
                                    <strong>Phone:</strong> {customerPhone}
                                </Text>
                            )}
                            {customerAddress && (
                                <Text style={{ color: '#4b5563', fontSize: '14px', margin: '4px 0' }}>
                                    <strong>Address:</strong> {customerAddress}
                                </Text>
                            )}
                        </Section>

                        <Hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

                        {/* Order Items Header */}
                        <Row style={{ marginBottom: '12px' }}>
                            <Column style={{ width: '55%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                    Item
                                </Text>
                            </Column>
                            <Column align="center" style={{ width: '20%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                    Category
                                </Text>
                            </Column>
                            <Column align="right" style={{ width: '25%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                    Price
                                </Text>
                            </Column>
                        </Row>

                        {/* Order Items */}
                        {safeOrderDetail.map((order, index) => (
                            <Row key={index} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: index < safeOrderDetail.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <Column style={{ verticalAlign: 'middle', width: '55%' }}>
                                    <Row>
                                        <Column style={{ width: '48px', verticalAlign: 'middle' }}>
                                            <Img
                                                src={order?.imageUrl || 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png'}
                                                width="48"
                                                height="48"
                                                alt={order?.title || 'Product'}
                                                style={{ borderRadius: '6px', display: 'block' }}
                                            />
                                        </Column>
                                        <Column style={{ verticalAlign: 'middle', paddingLeft: '10px' }}>
                                            <Text style={{ color: '#111827', fontSize: '14px', fontWeight: '500', margin: 0 }}>
                                                {order?.title || 'Product'}
                                            </Text>
                                        </Column>
                                    </Row>
                                </Column>
                                <Column align="center" style={{ verticalAlign: 'middle', width: '20%' }}>
                                    <Text style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{order?.category || '-'}</Text>
                                </Column>
                                <Column align="right" style={{ verticalAlign: 'middle', width: '25%' }}>
                                    <Text style={{ color: '#111827', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                                        ₹{order?.price || 0}
                                    </Text>
                                </Column>
                            </Row>
                        ))}

                        <Hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

                        {/* Order Summary */}
                        <Section>
                            <Row style={{ marginBottom: '8px' }}>
                                <Column style={{ width: '70%' }}>
                                    <Text style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Subtotal</Text>
                                </Column>
                                <Column align="right" style={{ width: '30%' }}>
                                    <Text style={{ color: '#111827', fontSize: '14px', margin: 0 }}>₹{safeTotal}</Text>
                                </Column>
                            </Row>
                            <Row style={{ marginBottom: '8px' }}>
                                <Column style={{ width: '70%' }}>
                                    <Text style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Shipping</Text>
                                </Column>
                                <Column align="right" style={{ width: '30%' }}>
                                    <Text style={{ color: '#22c55e', fontSize: '14px', margin: 0 }}>Free</Text>
                                </Column>
                            </Row>
                            <Row style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #e5e7eb' }}>
                                <Column style={{ width: '70%' }}>
                                    <Text style={{ color: '#111827', fontSize: '18px', fontWeight: '700', margin: 0 }}>Total Paid</Text>
                                </Column>
                                <Column align="right" style={{ width: '30%' }}>
                                    <Text style={{ color: '#1e40af', fontSize: '20px', fontWeight: '700', margin: 0 }}>₹{safeTotal}</Text>
                                </Column>
                            </Row>
                        </Section>

                    </Section>

                    {/* Thank You Message */}
                    <Section style={{ textAlign: 'center', padding: '32px 0' }}>
                        <Heading style={{ color: '#111827', fontSize: '22px', fontWeight: '600', margin: '0 0 12px 0' }}>
                            Thank You for Your Order!
                        </Heading>
                        <Text style={{ color: '#6b7280', fontSize: '15px', margin: '0 auto', maxWidth: '400px', lineHeight: '1.6' }}>
                            Your order has been received and is being processed. You will receive a shipping confirmation email once your items are dispatched.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                        <Text style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0' }}>
                            Questions? Contact our support team at{' '}
                            <Link href="mailto:as2172025@gmail.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
                                support@medicare.com
                            </Link>
                        </Text>
                        <Text style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 16px 0' }}>
                            <Link href="#" style={{ color: '#6b7280', textDecoration: 'none', margin: '0 8px' }}>Account Settings</Link>
                            {' | '}
                            <Link href="#" style={{ color: '#6b7280', textDecoration: 'none', margin: '0 8px' }}>Terms of Service</Link>
                            {' | '}
                            <Link href="#" style={{ color: '#6b7280', textDecoration: 'none', margin: '0 8px' }}>Privacy Policy</Link>
                        </Text>
                        <Text style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px 0' }}>
                            Copyright © 2026 MediCare. All rights reserved.
                        </Text>
                        <Text style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                            Bichya Colony, Gorakhpur District, 273001, Uttar Pradesh, India
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

export default EmailOrder;

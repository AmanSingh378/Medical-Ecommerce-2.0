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
import { orderTable } from '@/configs/schema';


export const EmailOrder = ({ orderDetail }) => {
    const {
        orderId = 'ORD-2024-001',
        date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } = orderDetail || {};

    return (
        <Html>
            <Head>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    .font-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                `}</style>
            </Head>
            <Preview>MediCare Order Confirmation - {orderId}</Preview>
            <Body className="font-inter bg-gray-100" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', backgroundColor: '#f3f4f6', margin: 0, padding: '20px' }}>
                <Container style={{ maxWidth: '640px', margin: '0 auto' }}>

                    {/* Header Banner */}
                    <Section style={{ backgroundColor: '#1e40af', borderRadius: '12px 12px 0 0', padding: '24px' }}>
                        <Row>
                            <Column style={{ verticalAlign: 'middle', width: '56px' }}>
                                <Img
                                    src= "https://pngtree.com/so/medicare-icon"
                                    width="48"
                                    height="48"
                                    alt="MediCare Logo"
                                    style={{ borderRadius: '8px', display: 'block' }}
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

                    {/* Main Content Card */}
                    <Section style={{ backgroundColor: '#ffffff', padding: '24px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px' }}>

                        {/* Order Details Row */}
                        <Row style={{ marginBottom: '24px' }}>
                            <Column style={{ verticalAlign: 'top', width: '50%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
                                    Order Number
                                </Text>
                                <Text style={{ color: '#111827', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                                    {orderId}
                                </Text>
                            </Column>
                            <Column align="right" style={{ verticalAlign: 'top', width: '50%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
                                    Date
                                </Text>
                                <Text style={{ color: '#111827', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                                    {date}
                                </Text>
                            </Column>
                        </Row>

                        <Hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

                        {/* Shipping Address */}
                        <Row style={{ marginBottom: '24px' }}>
                            
                        </Row>

                        <Hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

                        {/* Order Items Header */}
                        <Row style={{ marginBottom: '12px' }}>
                            <Column style={{ width: '50%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                    Item
                                </Text>
                            </Column>
                            <Column align="center" style={{ width: '15%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                    Qty
                                </Text>
                            </Column>
                            <Column align="right" style={{ width: '35%' }}>
                                <Text style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                    Price
                                </Text>
                            </Column>
                        </Row>

                        {/* Order Items */}
                        {orderDetail&&orderDetail.map((order, index) => (
                            <Row key={index} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: index < orderDetail.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <Column style={{ verticalAlign: 'middle', width: '50%' }}>
                                    <Row>
                                        <Column style={{ width: '56px', verticalAlign: 'middle' }}>
                                            <Img
                                                src={order?.imageUrl}
                                                width="56"
                                                height="56"
                                                alt={order.name}
                                                style={{ borderRadius: '8px', display: 'block' }}
                                            />
                                        </Column>
                                        <Column style={{ verticalAlign: 'middle', paddingLeft: '12px' }}>
                                            <Text >{order?.title}</Text>
                                        </Column>
                                    </Row>
                                </Column>
                                <Column align="center" style={{ verticalAlign: 'middle', width: '15%' }}>
                                    <Text style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{order?.category}</Text>
                                </Column>
                                
                            </Row>
                        ))}
                        {/* Order Summary */}
                        

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


import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import EmailOrder from '@/emails/email.jsx';

// Try to initialize Resend if API key is available
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Fallback Gmail SMTP transporter
const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(req) {
    try {
        const { to, subject, orderDetail, paymentId, totalAmount, customerName, customerAddress, customerPhone, orderDate } = await req.json();

        if (!to) {
            return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Render email HTML from React component
        let html;
        try {
            html = await render(
                EmailOrder({
                    orderDetail,
                    paymentId,
                    totalAmount,
                    customerName,
                    customerAddress,
                    customerPhone,
                    orderDate,
                })
            );
        } catch (renderError) {
            console.error('Email render error:', renderError);
            return NextResponse.json({ error: 'Failed to render email template', details: renderError.message }, { status: 500 });
        }

        // Try Resend first, fallback to Gmail SMTP
        if (resend) {
            try {
                const data = await resend.emails.send({
                    from: 'MediCare <onboarding@resend.dev>',
                    to: [to],
                    subject: subject || 'Your MediCare Order Confirmation',
                    html: html,
                });
                return NextResponse.json({ success: true, provider: 'resend', data });
            } catch (resendError) {
                console.warn('Resend failed, trying Gmail fallback:', resendError.message);
            }
        }

        // Fallback to Gmail SMTP
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            try {
                const info = await gmailTransporter.sendMail({
                    from: `"MediCare Orders" <${process.env.GMAIL_USER}>`,
                    to: to,
                    subject: subject || 'Your MediCare Order Confirmation',
                    html: html,
                });
                return NextResponse.json({ success: true, provider: 'gmail', messageId: info.messageId });
            } catch (gmailError) {
                console.error('Gmail fallback also failed:', gmailError);
                return NextResponse.json({ error: 'Failed to send email via all providers', details: gmailError.message }, { status: 500 });
            }
        }

        // No email provider configured
        console.error('No email provider configured. Set RESEND_API_KEY or GMAIL_USER + GMAIL_APP_PASSWORD');
        return NextResponse.json({ error: 'No email provider configured' }, { status: 500 });

    } catch (error) {
        console.error('Unexpected error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }
}


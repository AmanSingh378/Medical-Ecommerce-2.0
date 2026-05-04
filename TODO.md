# TODO - Payment Fix

- [x] Edit `app/(route)/checkout/page.jsx` - Pass & send `razorpay_signature`, remove invalid `error` handler, add `payment.failed` listener, include `orderDate` in email
- [x] Edit `app/api/verifyPayment/route.jsx` - Replace server fetch with HMAC SHA256 signature verification using `crypto`
- [ ] Restart dev server and test payment with Razorpay test card

# TODO - Delete Product Feature

- [ ] Update `app/api/products/route.jsx` - Add DELETE handler
- [ ] Update `app/_components/ProductEditableOption.jsx` - Add delete functionality
- [ ] Update `app/_components/AddToCartBtn.jsx` - Pass product and onDelete props
- [ ] Update `app/_components/ProductCardItem.jsx` - Accept and pass onDelete prop
- [ ] Update `app/(route)/dashboard/_components/UserListing.jsx` - Add handleDelete callback

# DONE - Email Confirmation After Payment

- [x] Checkout page calls `/api/send-email` after successful payment
- [x] Send-email API uses `@react-email/render` for HTML generation
- [x] Send-email API has Resend + Gmail SMTP fallback for reliability
- [x] Email template `emails/email.jsx` renders beautiful order receipt
- [x] Installed `@react-email/render` and `nodemailer`
- [x] Build passes successfully


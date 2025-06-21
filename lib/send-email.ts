import sgMail from '@sendgrid/mail';

// Set your SendGrid API key in your .env file as SENDGRID_API_KEY
// Set your sender email in your .env file as SENDGRID_SENDER
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const SENDER_EMAIL = process.env.SENDGRID_SENDER!;

export async function sendExpirationEmail(userId: string, email: string) {
  if (!email) return;
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: 'Your Bizplannaija Subscription Has Expired',
    text: `Hi,\n\nYour subscription has expired and your account has been downgraded to the Free plan. Please log in to renew and regain access to premium features.\n\nThank you,\nThe Bizplannaija Team`,
    html: `<p>Hi,</p><p>Your subscription has <strong>expired</strong> and your account has been downgraded to the <strong>Free plan</strong>.<br/>Please <a href="https://bizplannaija.com/login">log in</a> to renew and regain access to premium features.</p><p>Thank you,<br/>The Bizplannaija Team</p>`
  };
  try {
    await sgMail.send(msg);
    console.log(`Expiration email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send expiration email:', err);
  }
}

// .env setup instructions:
// SENDGRID_API_KEY=your_sendgrid_api_key
// SENDGRID_SENDER=your_verified_sender_email 
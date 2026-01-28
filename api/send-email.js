const { Resend } = require('resend');
const Stripe = require('stripe');
const { generateEmailHtml } = require('./lib/email-template');

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  const { session_id, analysisData } = req.body;

  // Validate required fields
  if (!session_id) {
    return res.status(400).json({
      success: false,
      error: 'Λείπει το session_id',
    });
  }

  if (!analysisData || !analysisData.subscriptions || !Array.isArray(analysisData.subscriptions)) {
    return res.status(400).json({
      success: false,
      error: 'Λείπουν τα δεδομένα ανάλυσης',
    });
  }

  try {
    // Verify payment with Stripe and get customer email
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Η πληρωμή δεν έχει ολοκληρωθεί',
      });
    }

    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Δεν βρέθηκε email πελάτη',
      });
    }

    // Generate unlock code (same logic as verify-payment.js)
    const unlockCode = `TYRAKI-${session_id.slice(-8).toUpperCase()}`;

    // Generate email HTML
    const emailHtml = generateEmailHtml(analysisData, unlockCode);

    // Send email via Resend
    const emailFrom = process.env.EMAIL_FROM || 'Τυράκι <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: customerEmail,
      subject: '✅ Επιτυχής Πληρωμή - Οι συνδρομές σου ξεκλειδώθηκαν | Τυράκι',
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        error: 'Αποτυχία αποστολής email',
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email στάλθηκε επιτυχώς',
      emailId: data?.id,
    });

  } catch (error) {
    console.error('Send email error:', error);

    // Handle specific Stripe errors
    if (error.code === 'resource_missing') {
      return res.status(404).json({
        success: false,
        error: 'Δεν βρέθηκε το session',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Σφάλμα αποστολής email',
      details: error.message,
    });
  }
};

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get session_id from query params or body
  const sessionId = req.query.session_id || req.body?.session_id;

  if (!sessionId) {
    return res.status(400).json({
      verified: false,
      error: 'Λείπει το session_id',
      message: 'Παρακαλώ δώσε το Session ID που έλαβες μετά την πληρωμή.',
    });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      return res.status(200).json({
        verified: true,
        message: 'Η πληρωμή επαληθεύτηκε επιτυχώς! Μπορείς τώρα να δεις όλες τις συνδρομές σου.',
        unlockCode: generateUnlockCode(sessionId),
        paidAt: new Date(session.created * 1000).toISOString(),
        amount: '€3.00',
      });
    } else {
      return res.status(200).json({
        verified: false,
        message: 'Η πληρωμή δεν έχει ολοκληρωθεί ακόμα.',
        status: session.payment_status,
      });
    }
  } catch (error) {
    console.error('Stripe verification error:', error);

    // Handle specific Stripe errors
    if (error.code === 'resource_missing') {
      return res.status(404).json({
        verified: false,
        error: 'Δεν βρέθηκε το session',
        message: 'Το Session ID δεν είναι έγκυρο. Ελέγξτε ότι το αντιγράψατε σωστά.',
      });
    }

    return res.status(500).json({
      verified: false,
      error: 'Σφάλμα επαλήθευσης',
      message: 'Υπήρξε πρόβλημα με την επαλήθευση. Δοκιμάστε ξανά.',
    });
  }
};

// Generate a simple unlock code based on session ID
function generateUnlockCode(sessionId) {
  const hash = sessionId.slice(-8).toUpperCase();
  return `TYRAKI-${hash}`;
}

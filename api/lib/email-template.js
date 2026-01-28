/**
 * Email template generator for Tyraki payment confirmation emails
 * Uses table-based layout with inline CSS for email client compatibility
 */

const COLORS = {
  bgPrimary: '#faf8f5',
  bgCard: '#ffffff',
  textPrimary: '#2c2420',
  textSecondary: '#6b6560',
  textMuted: '#9a9590',
  accent: '#d97757',
  success: '#22c55e',
  border: '#e8e5e1',
};

const categoryIcons = {
  streaming: '🎬',
  telecom: '📱',
  software: '💻',
  gym: '🏋️',
  utility: '⚡',
  other: '📦',
  unknown: '❓',
};

const categoryNames = {
  streaming: 'Streaming',
  telecom: 'Τηλεπικοινωνίες',
  software: 'Λογισμικό',
  gym: 'Γυμναστήριο',
  utility: 'Κοινωφελή',
  other: 'Άλλο',
  unknown: 'Άγνωστο',
};

/**
 * Generate HTML email content for payment confirmation
 * @param {Object} data - The analysis data
 * @param {Array} data.subscriptions - Array of subscription objects
 * @param {number} data.total_monthly - Total monthly cost
 * @param {number} data.total_yearly - Total yearly cost
 * @param {number} data.count - Number of subscriptions
 * @param {string} unlockCode - The unlock code for the payment
 * @returns {string} HTML email content
 */
function generateEmailHtml(data, unlockCode) {
  const { subscriptions, total_monthly, total_yearly, count } = data;

  // Generate subscription rows
  const subscriptionRows = subscriptions
    .map((sub) => {
      const icon = categoryIcons[sub.category] || categoryIcons.other;
      const catName = categoryNames[sub.category] || categoryNames.other;
      return `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${COLORS.border};">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="50" style="vertical-align: middle;">
                  <div style="width: 40px; height: 40px; background: ${COLORS.bgPrimary}; border-radius: 10px; text-align: center; line-height: 40px; font-size: 20px;">
                    ${icon}
                  </div>
                </td>
                <td style="vertical-align: middle; padding-left: 12px;">
                  <div style="font-weight: 600; color: ${COLORS.textPrimary}; font-size: 15px;">${escapeHtml(sub.name)}</div>
                  <div style="font-size: 12px; color: ${COLORS.textMuted};">${catName}</div>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                  <div style="font-weight: 600; color: ${COLORS.accent}; font-size: 15px;">€${sub.monthly_cost.toFixed(2)}/μήνα</div>
                  <div style="font-size: 12px; color: ${COLORS.textMuted};">€${(sub.monthly_cost * 12).toFixed(2)}/χρόνο</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Επιτυχής Πληρωμή - Τυράκι</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgPrimary}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${COLORS.bgPrimary};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <span style="font-size: 28px;">🧀</span>
              <span style="font-size: 24px; font-weight: 800; color: ${COLORS.textPrimary}; margin-left: 8px;">Τυράκι</span>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, ${COLORS.success} 0%, #16a34a 100%); border-radius: 20px;">
                <tr>
                  <td align="center" style="padding: 32px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                    <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: white;">Πληρωμή Επιτυχής!</h1>
                    <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9);">Όλες οι συνδρομές σου είναι τώρα ξεκλειδωμένες</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px;"></td></tr>

          <!-- Summary Box -->
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, ${COLORS.accent} 0%, #16a34a 100%); border-radius: 16px;">
                <tr>
                  <td align="center" style="padding: 24px;">
                    <div style="font-size: 14px; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Συνολικό κόστος συνδρομών</div>
                    <div style="font-size: 32px; font-weight: 800; color: white;">€${total_yearly.toFixed(2)}/χρόνο</div>
                    <div style="font-size: 16px; color: rgba(255,255,255,0.9);">(€${total_monthly.toFixed(2)}/μήνα)</div>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px;">
                      <tr>
                        <td align="center" style="padding: 16px 32px 0;">
                          <div style="font-size: 24px; font-weight: 700; color: white;">${count}</div>
                          <div style="font-size: 12px; color: rgba(255,255,255,0.8);">Συνδρομές</div>
                        </td>
                        <td align="center" style="padding: 16px 32px 0;">
                          <div style="font-size: 24px; color: white;">🔓</div>
                          <div style="font-size: 12px; color: rgba(255,255,255,0.8);">Ξεκλειδωμένες</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px;"></td></tr>

          <!-- Subscriptions List -->
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 16px;">
                <tr>
                  <td style="padding: 24px 24px 16px;">
                    <h2 style="margin: 0; font-size: 18px; color: ${COLORS.textPrimary};">🔓 Όλες οι Συνδρομές σου</h2>
                  </td>
                </tr>
                ${subscriptionRows}
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px;"></td></tr>

          <!-- Unlock Code Box -->
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 16px;">
                <tr>
                  <td align="center" style="padding: 24px;">
                    <div style="font-size: 14px; color: ${COLORS.textSecondary}; margin-bottom: 8px;">Κωδικός Ξεκλειδώματος</div>
                    <div style="font-size: 20px; font-weight: 700; color: ${COLORS.accent}; font-family: monospace; background: ${COLORS.bgPrimary}; padding: 12px 24px; border-radius: 8px; display: inline-block;">${escapeHtml(unlockCode)}</div>
                    <div style="font-size: 12px; color: ${COLORS.textMuted}; margin-top: 12px;">Φύλαξε αυτόν τον κωδικό για μελλοντικές αναλύσεις</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 24px;"></td></tr>

          <!-- CTA Button -->
          <tr>
            <td align="center">
              <a href="https://tyraki.vercel.app" style="display: inline-block; background: ${COLORS.accent}; color: white; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-decoration: none;">
                Επιστροφή στο Τυράκι →
              </a>
            </td>
          </tr>

          <!-- Spacing -->
          <tr><td style="height: 32px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px; border-top: 1px solid ${COLORS.border};">
              <p style="margin: 0; font-size: 12px; color: ${COLORS.textMuted};">
                Αυτό το email στάλθηκε αυτόματα μετά την επιτυχή πληρωμή σου στο Τυράκι.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: ${COLORS.textMuted};">
                © ${new Date().getFullYear()} Τυράκι - Βρες και ακύρωσε ανεπιθύμητες συνδρομές
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { generateEmailHtml };

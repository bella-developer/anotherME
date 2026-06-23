/**
 * Email Service
 * Sends emails using Brevo REST API (no SDK, just fetch)
 * Works perfectly with Render's network restrictions
 */

// Check if Brevo is configured
const isConfigured = !!process.env.BREVO_API_KEY;

if (isConfigured) {
  console.log('[EMAIL SERVICE] Brevo API configured successfully');
} else {
  console.warn('[EMAIL SERVICE] BREVO_API_KEY not configured - emails will be logged to console only');
  console.warn('[EMAIL SERVICE] Get your free API key at https://app.brevo.com/settings/keys/api');
}

/**
 * Send email via Brevo REST API
 */
async function sendBrevoEmail(to, subject, htmlContent) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: 'Eso',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com'
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, resetToken, username) {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://anothermee.vercel.app'}/reset-password?token=${resetToken}`;
  
  if (isConfigured) {
    console.log(`[EMAIL] Sending password reset email to: ${email}`);
    try {
      const result = await sendBrevoEmail(email, 'Reset Your Eso Password', `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', monospace; background-color: #000000;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #0a0a0a; border: 1px solid #333333;">
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #333333;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 0.3em; color: #ffffff; font-weight: 700;">ESO</h1>
              <p style="margin: 10px 0 0; font-size: 11px; letter-spacing: 0.15em; color: #666666; text-transform: uppercase;">Your inner world, understood</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #ffffff;">Hello <strong>${username}</strong>,</p>
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #cccccc;">You requested to reset your password. Click the button below:</p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">RESET PASSWORD</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0; font-size: 12px; line-height: 1.6; color: #888888;">Or copy this link:</p>
              <p style="margin: 10px 0 0; font-size: 11px; line-height: 1.6; color: #666666; word-break: break-all;">${resetUrl}</p>
              <div style="margin: 40px 0 0; padding-top: 30px; border-top: 1px solid #333333;">
                <p style="margin: 0; font-size: 11px; color: #888888;">Link expires in 1 hour.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; font-size: 10px; color: #666666;">The Eso Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `);

      console.log(`[EMAIL] Password reset email sent. Message ID: ${result.messageId}`);
      return { success: true, message: 'Password reset email sent', messageId: result.messageId };
    } catch (error) {
      console.error('[EMAIL] Error sending password reset email:', error.message);
      throw new Error('Failed to send password reset email');
    }
  } else {
    console.log('\n========================================');
    console.log('📧 PASSWORD RESET EMAIL (DEV MODE)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log('========================================\n');
    return { success: true, message: 'Password reset email logged (development mode)', resetUrl };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email, username) {
  if (!email) return { success: false, message: 'No email provided' };

  if (isConfigured) {
    console.log(`[EMAIL] Sending welcome email to: ${email}`);
    try {
      const result = await sendBrevoEmail(email, 'Welcome to Eso', `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', monospace; background-color: #000000;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #0a0a0a; border: 1px solid #333333;">
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #333333;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 0.3em; color: #ffffff; font-weight: 700;">ESO</h1>
              <p style="margin: 10px 0 0; font-size: 11px; letter-spacing: 0.15em; color: #666666; text-transform: uppercase;">Your inner world, understood</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Welcome, <strong>${username}</strong>!</p>
              <p style="margin: 0 0 30px; font-size: 14px; color: #cccccc;">Thank you for joining Eso — a safe space for introverts and deep thinkers.</p>
              <h2 style="margin: 30px 0 20px; font-size: 14px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;">Explore Our Spaces:</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Philosophy</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Question reality</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Solitude</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Embrace being alone</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Creativity</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Share your art</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Deep Talks</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Meaningful conversations</p>
                  </td>
                </tr>
              </table>
              <div style="margin: 40px 0 0; padding-top: 30px; border-top: 1px solid #333333;">
                <p style="margin: 0; font-size: 11px; color: #888888; font-style: italic;">"Most people seek attention. Few seek understanding."</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; font-size: 10px; color: #666666;">The Eso Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `);

      console.log(`[EMAIL] Welcome email sent. Message ID: ${result.messageId}`);
      return { success: true, message: 'Welcome email sent', messageId: result.messageId };
    } catch (error) {
      console.error('[EMAIL] Error sending welcome email:', error.message);
      return { success: false, message: 'Failed to send welcome email' };
    }
  } else {
    console.log('\n========================================');
    console.log('📧 WELCOME EMAIL (DEV MODE)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Username: ${username}`);
    console.log('========================================\n');
    return { success: true, message: 'Welcome email logged (development mode)' };
  }
}

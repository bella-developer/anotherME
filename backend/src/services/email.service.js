/**
 * Email Service
 * Handles sending emails for password reset and notifications using Resend
 */

import { Resend } from 'resend';

// Initialize Resend client
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('[EMAIL SERVICE] Resend initialized successfully');
} else {
  console.warn('[EMAIL SERVICE] RESEND_API_KEY not found - emails will be logged to console only');
}

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} username - User's username
 * @returns {Promise<Object>} Email send result
 */
export async function sendPasswordResetEmail(email, resetToken, username) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  // Send actual email using Resend if API key is configured
  if (resend) {
    console.log(`[EMAIL] Attempting to send password reset email to: ${email}`);
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Eso <onboarding@resend.dev>',
        to: [email],
        subject: 'Reset Your Eso Password',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', monospace; background-color: #000000;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #0a0a0a; border: 1px solid #333333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #333333;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 0.3em; color: #ffffff; font-weight: 700;">ESO</h1>
              <p style="margin: 10px 0 0; font-size: 11px; letter-spacing: 0.15em; color: #666666; text-transform: uppercase;">Your inner world, understood</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #ffffff;">Hello <strong>${username}</strong>,</p>
              
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #cccccc;">You requested to reset your password. Click the button below to create a new password:</p>
              
              <!-- Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 0;">RESET PASSWORD</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; font-size: 12px; line-height: 1.6; color: #888888;">Or copy and paste this link into your browser:</p>
              <p style="margin: 10px 0 0; font-size: 11px; line-height: 1.6; color: #666666; word-break: break-all;">${resetUrl}</p>
              
              <div style="margin: 40px 0 0; padding-top: 30px; border-top: 1px solid #333333;">
                <p style="margin: 0 0 10px; font-size: 11px; line-height: 1.6; color: #888888;">This link will expire in <strong>1 hour</strong>.</p>
                <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #888888;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; font-size: 10px; line-height: 1.6; color: #666666; letter-spacing: 0.05em;">
                The Eso Team<br>
                A safe space for introverts and deep thinkers
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });

      if (error) {
        console.error('[EMAIL] Resend email error:', error);
        throw new Error('Failed to send password reset email');
      }
      
      console.log(`[EMAIL] Password reset email sent successfully. Email ID: ${data?.id}`);
      return {
        success: true,
        message: 'Password reset email sent',
        emailId: data?.id,
      };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  } else {
    // Development: Log to console
    console.log('\n========================================');
    console.log('📧 PASSWORD RESET EMAIL (DEV MODE)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Username: ${username}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log('========================================\n');
    
    return {
      success: true,
      message: 'Password reset email logged (development mode)',
      resetUrl, // Only in dev mode
    };
  }
}

/**
 * Send welcome email (optional)
 * @param {string} email - Recipient email
 * @param {string} username - User's username
 * @returns {Promise<Object>} Email send result
 */
export async function sendWelcomeEmail(email, username) {
  if (!email) return { success: false, message: 'No email provided' };

  // Send actual email using Resend if API key is configured
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Eso <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to Eso',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Eso</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', monospace; background-color: #000000;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #0a0a0a; border: 1px solid #333333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #333333;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 0.3em; color: #ffffff; font-weight: 700;">ESO</h1>
              <p style="margin: 10px 0 0; font-size: 11px; letter-spacing: 0.15em; color: #666666; text-transform: uppercase;">Your inner world, understood</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #ffffff;">Welcome, <strong>${username}</strong>!</p>
              
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #cccccc;">Thank you for joining Eso — a safe space where introverts, deep thinkers, and unique minds connect authentically.</p>
              
              <!-- Spaces -->
              <h2 style="margin: 30px 0 20px; font-size: 14px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;">Explore Our Spaces:</h2>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Philosophy</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Question reality and explore ideas that challenge the ordinary</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Solitude</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Embrace the beauty of being alone</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #222222;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Creativity</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Share art, writing, and creative expression</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="margin: 0; font-size: 13px; color: #ffffff;"><strong>→ Deep Talks</strong></p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #888888;">Conversations that go beneath the surface</p>
                  </td>
                </tr>
              </table>
              
              <div style="margin: 40px 0 0; padding-top: 30px; border-top: 1px solid #333333;">
                <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #888888; font-style: italic;">
                  "Most people seek attention. Few seek understanding."
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #333333;">
              <p style="margin: 0; font-size: 10px; line-height: 1.6; color: #666666; letter-spacing: 0.05em;">
                The Eso Team<br>
                Built for the quiet, the thoughtful, the unique
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });

      if (error) {
        console.error('[EMAIL] Resend welcome email error:', error);
        // Don't throw - welcome email is optional
        return {
          success: false,
          message: 'Failed to send welcome email',
        };
      }
      
      console.log(`[EMAIL] Welcome email sent successfully. Email ID: ${data?.id}`);
      return {
        success: true,
        message: 'Welcome email sent',
        emailId: data?.id,
      };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw - welcome email is optional
      return {
        success: false,
        message: 'Failed to send welcome email',
      };
    }
  } else {
    // Development: Log to console
    console.log('\n========================================');
    console.log('📧 WELCOME EMAIL (DEV MODE)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Username: ${username}`);
    console.log('========================================\n');
    
    return {
      success: true,
      message: 'Welcome email logged (development mode)',
    };
  }
}

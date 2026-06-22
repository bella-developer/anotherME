/**
 * Email Service
 * Handles sending emails for password reset and notifications
 */

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} username - User's username
 * @returns {Promise<Object>} Email send result
 */
export async function sendPasswordResetEmail(email, resetToken, username) {
  // In development, we'll just log the reset link
  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
    // Production: Send actual email using SendGrid
    try {
      const sgMail = await import('@sendgrid/mail');
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@eso.app',
        subject: 'Reset Your Eso Password',
        text: `Hello ${username},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest,\nThe Eso Team`,
        html: `
          <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000; color: #fff;">
            <h1 style="font-size: 24px; margin-bottom: 20px; letter-spacing: 0.2em;">ESO</h1>
            <p style="margin-bottom: 20px;">Hello <strong>${username}</strong>,</p>
            <p style="margin-bottom: 20px;">You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #fff; color: #000; text-decoration: none; font-weight: bold; letter-spacing: 0.1em; margin: 20px 0;">RESET PASSWORD</a>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">This link will expire in 1 hour.</p>
            <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />
            <p style="font-size: 11px; color: #666;">The Eso Team - Your inner world, finally understood.</p>
          </div>
        `,
      };

      await sgMail.default.send(msg);
      
      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      console.error('SendGrid email error:', error);
      throw new Error('Failed to send password reset email');
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

  if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
    try {
      const sgMail = await import('@sendgrid/mail');
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@eso.app',
        subject: 'Welcome to Eso',
        text: `Welcome to Eso, ${username}!\n\nYour inner world, finally understood.\n\nExplore our spaces:\n- Philosophy: Question reality and explore ideas\n- Solitude: Embrace the beauty of being alone\n- Creativity: Share art, writing, and expression\n- Deep Talks: Conversations that matter\n\nBest,\nThe Eso Team`,
        html: `
          <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000; color: #fff;">
            <h1 style="font-size: 24px; margin-bottom: 20px; letter-spacing: 0.2em;">ESO</h1>
            <p style="margin-bottom: 20px;">Welcome, <strong>${username}</strong>!</p>
            <p style="margin-bottom: 20px;">Your inner world, finally understood.</p>
            <h2 style="font-size: 16px; margin-top: 30px; margin-bottom: 15px;">Explore Our Spaces:</h2>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;">→ <strong>Philosophy</strong>: Question reality and explore ideas</li>
              <li style="margin-bottom: 10px;">→ <strong>Solitude</strong>: Embrace the beauty of being alone</li>
              <li style="margin-bottom: 10px;">→ <strong>Creativity</strong>: Share art, writing, and expression</li>
              <li style="margin-bottom: 10px;">→ <strong>Deep Talks</strong>: Conversations that matter</li>
            </ul>
            <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />
            <p style="font-size: 11px; color: #666;">The Eso Team</p>
          </div>
        `,
      };

      await sgMail.default.send(msg);
      
      return {
        success: true,
        message: 'Welcome email sent',
      };
    } catch (error) {
      console.error('SendGrid email error:', error);
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

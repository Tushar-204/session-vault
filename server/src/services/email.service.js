import nodemailer from 'nodemailer';

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendVerificationEmail(email, token) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"SessionVault Security" <${process.env.EMAIL_FROM || 'no-reply@sessionvault.io'}>`,
      to: email,
      subject: 'Verify your SessionVault Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #3b82f6;">Welcome to SessionVault!</h2>
          <p>Please click the button below to verify your email address and activate your account:</p>
          <a href="${verifyUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0;">Verify Email Address</a>
          <p style="font-size: 12px; color: #777;">Or copy this link: ${verifyUrl}</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Verification email sent to ${email}`);
    } catch (err) {
      console.warn(`[EmailService] SMTP send failed: ${err.message}. (Local dev fallback active)`);
    }
  }

  async sendPasswordResetEmail(email, token) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"SessionVault Security" <${process.env.EMAIL_FROM || 'no-reply@sessionvault.io'}>`,
      to: email,
      subject: 'Reset your SessionVault Password',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ef4444;">Password Reset Request</h2>
          <p>You requested a password reset for your SessionVault account. Click below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0;">Reset Password</a>
          <p style="font-size: 12px; color: #777;">Link expires in 1 hour.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Reset email sent to ${email}`);
    } catch (err) {
      console.warn(`[EmailService] SMTP send failed: ${err.message}`);
    }
  }
}

export const emailService = new EmailService();

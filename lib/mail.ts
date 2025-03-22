import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE), // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true, // Show debug output
  logger: true // Log information into console
});

interface SendMailProps {
  to: string;
  subject: string;
  html: string;
}

interface EmailError {
  message: string;
  code?: string;
  command?: string;
  response?: string;
}

export async function sendMail({ to, subject, html }: SendMailProps) {
  try {
    // Verify SMTP connection configuration
    console.log('Verifying SMTP connection...');
    const verification = await transporter.verify();
    console.log('SMTP Connection verified:', verification);

    // Log email configuration (without sensitive data)
    console.log('Attempting to send email with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      auth: {
        user: process.env.SMTP_USER,
        // Not logging password for security
      }
    });

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    });
    
    return { success: true };
  } catch (error) {
    // Enhanced error logging
    const emailError = error as EmailError;
    console.error('Detailed email error:', {
      error: emailError.message,
      code: emailError.code,
      command: emailError.command,
      response: emailError.response,
      stack: (error as Error).stack, // Add stack trace
    });

    // Log environment variables (without sensitive data)
    console.log('Environment variables check:', {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_SECURE: !!process.env.SMTP_SECURE,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
      SMTP_FROM_NAME: !!process.env.SMTP_FROM_NAME,
      SMTP_FROM_EMAIL: !!process.env.SMTP_FROM_EMAIL,
    });

    return { success: false, error: emailError };
  }
}

export function generatePasswordResetEmail(resetToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
  }
  
  const resetUrl = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9fafb; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1f2937; margin-bottom: 10px;">Reset Your Password</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <p style="color: #4b5563; line-height: 1.5;">Hello,</p>
        <p style="color: #4b5563; line-height: 1.5;">We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #4b5563; line-height: 1.5;">If you didn't request this password reset, you can safely ignore this email.</p>
        <p style="color: #4b5563; line-height: 1.5;">This link will expire in 1 hour for security reasons.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${resetUrl}</p>
      </div>
    </div>
  `;
} 
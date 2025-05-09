import nodemailer from 'nodemailer';
import appConfig from '../../config/appConfig.js';
const sender = appConfig.emailSender;
const password = appConfig.emailPassword;

const forgotPasswordEmail = async (recipient, resetToken) => {
  if (!recipient || recipient.includes('string')) {
    console.warn('Skipping email: Invalid or test recipient.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: sender,
      pass: password,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"FlyInHour Support" <${sender}>`,
    to: recipient,
    subject: 'Reset Your FlyInHour Password',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetLink}" target="_blank">Link</a></p>
        <p>If you didn’t request a password reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The FlyInHour Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return resetToken;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

export default forgotPasswordEmail;

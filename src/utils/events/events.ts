import { EventEmitter } from 'node:events';
import env from '@utils/envalid';
import { verificationCodeEmail } from '@utils/emails/verification-code';
import { passwordResetEmail } from '@utils/emails/password-reset';
import { passwordResetEmailSuccess } from '@utils/emails/password-reset-success';
import { createTransport } from 'nodemailer';

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: env.SERVICE_EMAIL,
    pass: env.APP_PASSWORD,
  },
});

export const eventEmitter = new EventEmitter();

eventEmitter.setMaxListeners(0);

eventEmitter.on('requestVerificationCode', async (toEmail: string, verificationCode: string) => {
  await transport.sendMail({
    from: 'onboarding@resend.dev',
    to: toEmail,
    subject: 'Verify you email address',
    html: verificationCodeEmail(verificationCode),
  });
});

eventEmitter.on('requestPasswordResetCode', async (toEmail: string, passwordResetCode: string) => {
  await transport.sendMail({
    from: 'onboarding@resend.dev',
    to: toEmail,
    subject: 'Forgot you password?',
    html: passwordResetEmail(passwordResetCode),
  });
});

eventEmitter.on('passwordResetSuccess', async (toEmail: string, passwordResetCode: string) => {
  await transport.sendMail({
    from: 'onboarding@resend.dev',
    to: toEmail,
    subject: 'Success!',
    html: passwordResetEmailSuccess(),
  });
});

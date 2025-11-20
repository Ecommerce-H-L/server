import { EmailVerification, PasswordReset } from '@common/email-templates';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import React from 'react';
import { Resend } from 'resend';

import { Env } from '@/config/env';

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor(private readonly configService: ConfigService<Env, true>) {
    this.resend = new Resend(configService.get('RESEND_API_KEY'));
  }
  async sendEmailVerificationOtp(payload: { email: string; otpCode: string }) {
    return this.resend.emails.send({
      from: 'Nest.js Ecommerce <no-reply@lifeistoolong.id.vn>',
      to: [payload.email],
      subject: 'Verify your email address',
      react: <EmailVerification otpCode={payload.otpCode} />,
    });
  }

  async sendPasswordResetOtp(payload: { email: string; otpCode: string }) {
    return this.resend.emails.send({
      from: 'Nest.js Ecommerce <no-reply@lifeistoolong.id.vn>',
      to: [payload.email],
      subject: 'Reset your password',
      react: <PasswordReset otpCode={payload.otpCode} />,
    });
  }
}

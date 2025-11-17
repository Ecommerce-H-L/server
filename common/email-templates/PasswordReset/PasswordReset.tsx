import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

import envConfig from '@/config/env';

import {
  body,
  card,
  container,
  content,
  divider,
  footer,
  footerText,
  footerTitle,
  header,
  heading,
  logo,
  otpCode,
  otpHint,
  otpSection,
  securitySection,
  supportLink,
  text,
} from './PasswordReset.styles';

interface ForgotPasswordProps {
  otpCode?: string;
}

export const PasswordReset = ({
  otpCode: otpCodeValue,
}: ForgotPasswordProps) => {
  const frontEndBaseUrl = envConfig.FRONTEND_BASE_URL;
  const otpExpiresInMinutes = envConfig.OTP_EXPIRES_IN / 60000;
  return (
    <Html>
      <Head />
      <Preview>Reset your password for Ecommerce</Preview>

      <Body style={body}>
        <Container style={container}>
          <Section style={card}>
            <Section style={header}>
              <Img
                src={`${frontEndBaseUrl}/static/ecommerce-logo.png`}
                width="140"
                alt="Ecommerce"
                style={logo}
              />
            </Section>

            <Section style={content}>
              <Heading as="h1" style={heading}>
                Reset your password
              </Heading>

              <Text style={text}>
                We received a request to reset the password for your Ecommerce
                account.
              </Text>

              <Text style={text}>
                Use the one-time password (OTP) below to continue resetting your
                password. For your security, this code will expire shortly.
              </Text>
            </Section>

            {/* OTP code block */}
            <Section style={otpSection}>
              <Text style={otpCode}>{otpCodeValue}</Text>

              <Text style={otpHint}>
                This code is valid for {otpExpiresInMinutes} minutes.
              </Text>
            </Section>

            {/* Security note */}
            <Section style={securitySection}>
              <Text style={text}>
                If you did not request a password reset, you can safely ignore
                this email. Your password will not be changed.
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerTitle}>Ecommerce Team</Text>
              <Text style={footerText}>
                Need more help? Visit{' '}
                <Link href={frontEndBaseUrl} style={supportLink}>
                  our support page
                </Link>
                .
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

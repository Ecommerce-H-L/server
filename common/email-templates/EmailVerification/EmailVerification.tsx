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
  bodyText,
  card,
  codeHint,
  codeLabel,
  codeValue,
  codeWrapper,
  contentSection,
  footerLink,
  footerText,
  header,
  heading,
  logo,
  main,
  outerContainer,
  securitySection,
  securityText,
} from './EmailVerification.styles';

interface EmailVerificationProps {
  otpCode?: string;
}

export const EmailVerification = ({ otpCode }: EmailVerificationProps) => {
  const otpExpiryMinutes = envConfig.OTP_EXPIRES_IN / 60000;
  const frontEndBaseUrl = envConfig.FRONTEND_BASE_URL;
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Verify your email for Ecommerce</Preview>

        <Container style={outerContainer}>
          <Section style={card}>
            {/* Header / Logo */}
            <Section style={header}>
              <Img
                src={`${frontEndBaseUrl}/static/ecommerce-logo.png`}
                width="120"
                height="40"
                alt="Ecommerce Logo"
                style={logo}
              />
            </Section>

            {/* Main content */}
            <Section style={contentSection}>
              <Heading style={heading}>Verify your email address</Heading>

              <Text style={bodyText}>
                Thanks for creating an account on <strong>Ecommerce</strong>. To
                keep your account secure, we just need to confirm that this
                email address belongs to you.
                <br />
                <br />
                Please enter the verification code below when prompted on the
                website. If you did not request this code or did not try to
                create an account, you can safely ignore this email.
              </Text>

              <Section style={codeWrapper}>
                <Text style={codeLabel}>Your verification code</Text>

                <Text style={codeValue}>{otpCode}</Text>

                <Text style={codeHint}>
                  This code is valid for {otpExpiryMinutes} minutes.
                </Text>
              </Section>
            </Section>

            <Hr />

            {/* Security note */}
            <Section style={securitySection}>
              <Text style={securityText}>
                Ecommerce will never ask you to share your password or full
                payment details by email. If you receive any message that looks
                suspicious, delete it and access your account by typing our URL
                directly into your browser.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Text style={footerText}>
            This message was sent to you by <strong>Ecommerce</strong>.
            <br />
            If you did not create an account or request this verification code,
            you can ignore this email and no changes will be made to your
            account.
            <br />
            <br />
            Visit{' '}
            <Link href={frontEndBaseUrl} target="_blank" style={footerLink}>
              our website
            </Link>{' '}
            to learn more about how we protect your data and privacy.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

EmailVerification.PreviewProps = {
  otpCode: '596853',
} satisfies EmailVerificationProps;

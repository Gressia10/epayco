import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpUser || !smtpPass) {
      this.logger.error('SMTP credentials not found in environment variables');
      throw new Error('SMTP credentials not configured');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  async enviarToken(email: string, token: string): Promise<boolean> {
    try {
      const smtpFrom = this.configService.get<string>('SMTP_FROM');
      this.logger.log(`Enviando token a ${email} desde ${smtpFrom}`);

      await this.transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: 'Token de Confirmación',
        text: `Su token de confirmación es: ${token}`,
        html: `
          <h1>Token de Confirmación</h1>
          <p>Su token de confirmación es: <strong>${token}</strong></p>
          <p>Este token expirará en 5 minutos.</p>
        `,
      });
      return true;
    } catch (error) {
      this.logger.error('Error al enviar email:', error);
      return false;
    }
  }
} 
// src/services/email.service.ts
import * as nodemailer from 'nodemailer';
import logger from '../utils/logger';

interface SendCouponEmailParams {
  to: string;
  userName: string;
  couponCode: string;
  promotionTitle: string;
  promotionDescription: string;
  brandUrl?: string;
}

export class EmailService {
  private static _transporter: nodemailer.Transporter | null = null;

  private static getTransporter(): nodemailer.Transporter {
    if (!this._transporter) {
      // Try different ways to access createTransporter
      let createTransporter: any;

      if (typeof nodemailer.createTransporter === 'function') {
        createTransporter = nodemailer.createTransporter;
      } else if (typeof (nodemailer as any).default?.createTransporter === 'function') {
        createTransporter = (nodemailer as any).default.createTransporter;
      } else {
        // Last resort: require it directly
        const nm = require('nodemailer');
        createTransporter = nm.createTransporter || nm.default?.createTransporter;
      }

      if (!createTransporter) {
        throw new Error('Could not find nodemailer.createTransporter function');
      }

      this._transporter = createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this._transporter;
  }

  /**
   * Enviar email con código de cupón
   */
  static async sendCouponEmail(params: SendCouponEmailParams) {
    try {
      const {
        to,
        userName,
        couponCode,
        promotionTitle,
        promotionDescription,
        brandUrl,
      } = params;

      const html = this.generateCouponEmailHTML({
        userName,
        couponCode,
        promotionTitle,
        promotionDescription,
        brandUrl,
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@wwtrail.com',
        to,
        subject: `Tu cupón: ${promotionTitle}`,
        html,
      };

      const info = await this.getTransporter().sendMail(mailOptions);
      logger.info(`Coupon email sent to ${to}: ${info.messageId}`);

      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Error sending coupon email:', error);
      throw error;
    }
  }

  /**
   * Generar HTML del email de cupón
   */
  private static generateCouponEmailHTML(params: {
    userName: string;
    couponCode: string;
    promotionTitle: string;
    promotionDescription: string;
    brandUrl?: string;
  }): string {
    const { userName, couponCode, promotionTitle, promotionDescription, brandUrl } = params;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Cupón - ${promotionTitle}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #16a34a;
      margin-bottom: 15px;
    }
    .coupon-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px dashed #16a34a;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .coupon-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .coupon-code {
      font-size: 32px;
      font-weight: bold;
      color: #16a34a;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .description {
      color: #666;
      margin: 20px 0;
      line-height: 1.8;
    }
    .cta-button {
      display: inline-block;
      background-color: #16a34a;
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background-color: #15803d;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #16a34a;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .coupon-code {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 ¡Tu Cupón Está Listo!</h1>
    </div>

    <div class="content">
      <div class="greeting">
        Hola <strong>${userName}</strong>,
      </div>

      <p>¡Gracias por tu interés! Aquí tienes tu cupón exclusivo:</p>

      <div class="title">
        ${promotionTitle}
      </div>

      <div class="coupon-box">
        <div class="coupon-label">Tu Código de Cupón</div>
        <div class="coupon-code">${couponCode}</div>
      </div>

      <div class="description">
        ${promotionDescription}
      </div>

      ${brandUrl ? `
        <div style="text-align: center;">
          <a href="${brandUrl}" class="cta-button">
            Usar Cupón Ahora →
          </a>
        </div>
      ` : ''}

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        <strong>💡 Consejo:</strong> Guarda este email para tener el código siempre a mano.
      </p>
    </div>

    <div class="footer">
      <p>
        Este email fue enviado por <strong>WWTRAIL</strong><br>
        La comunidad trail más activa
      </p>
      <p>
        <a href="https://wwtrail.com">wwtrail.com</a> |
        <a href="https://wwtrail.com/promotions">Ver más promociones</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Verificar configuración de email
   */
  static async verifyConnection() {
    try {
      await this.getTransporter().verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}

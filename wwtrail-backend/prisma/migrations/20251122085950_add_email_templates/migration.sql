-- CreateEnum
CREATE TYPE "EmailTemplateType" AS ENUM ('COUPON_REDEMPTION', 'WELCOME', 'PASSWORD_RESET', 'EVENT_REMINDER', 'COMPETITION_UPDATE');

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "type" "EmailTemplateType" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "textBody" TEXT NOT NULL,
    "availableVariables" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_type_key" ON "email_templates"("type");

-- CreateIndex
CREATE INDEX "email_templates_type_idx" ON "email_templates"("type");

-- CreateIndex
CREATE INDEX "email_templates_isActive_idx" ON "email_templates"("isActive");

-- Insert default coupon redemption template
INSERT INTO "email_templates" ("id", "type", "name", "subject", "htmlBody", "textBody", "availableVariables", "isActive") VALUES (
    gen_random_uuid(),
    'COUPON_REDEMPTION',
    'Cupón Canjeado',
    '¡Tu cupón de {{promotionTitle}} está listo!',
    '<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .coupon-box { background: white; border: 2px dashed #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .coupon-code { font-size: 32px; font-weight: bold; color: #10b981; font-family: monospace; letter-spacing: 2px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ¡Cupón Canjeado Exitosamente!</h1>
        </div>
        <div class="content">
            <p>Hola <strong>{{userName}}</strong>,</p>
            <p>¡Excelentes noticias! Tu cupón de <strong>{{promotionTitle}}</strong> ha sido canjeado correctamente.</p>

            <div class="coupon-box">
                <p style="margin: 0 0 10px 0; color: #6b7280;">Tu código de cupón:</p>
                <div class="coupon-code">{{couponCode}}</div>
            </div>

            <p>{{promotionDescription}}</p>

            {{#if brandUrl}}
            <div style="text-align: center;">
                <a href="{{brandUrl}}" class="button">Usar Cupón Ahora</a>
            </div>
            {{/if}}

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                Guarda este código en un lugar seguro. Lo necesitarás para canjear tu descuento.
            </p>
        </div>
        <div class="footer">
            <p>© 2024 WWTrail. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>',
    'Hola {{userName}},

¡Excelentes noticias! Tu cupón de {{promotionTitle}} ha sido canjeado correctamente.

Tu código de cupón: {{couponCode}}

{{promotionDescription}}

{{#if brandUrl}}
Usa tu cupón ahora: {{brandUrl}}
{{/if}}

Guarda este código en un lugar seguro. Lo necesitarás para canjear tu descuento.

---
© 2024 WWTrail. Todos los derechos reservados.
Este es un email automático, por favor no respondas a este mensaje.',
    '{"userName": "Nombre del usuario que canjea", "couponCode": "Código del cupón", "promotionTitle": "Título de la promoción", "promotionDescription": "Descripción de la promoción", "brandUrl": "URL del sitio web de la marca (opcional)"}',
    true
);

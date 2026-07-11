// types/email-template.ts - Email Template types

/**
 * Email template type enum
 */
export type EmailTemplateType =
  | 'COUPON_REDEMPTION'
  | 'WELCOME'
  | 'PASSWORD_RESET'
  | 'EVENT_REMINDER'
  | 'COMPETITION_UPDATE';

/**
 * Email Template interface
 */
export interface EmailTemplate {
  id: string;
  type: EmailTemplateType;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  availableVariables: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create/Update Email Template Input
 */
export interface CreateEmailTemplateInput {
  type: EmailTemplateType;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  availableVariables?: Record<string, string>;
  isActive?: boolean;
}

export interface UpdateEmailTemplateInput {
  name?: string;
  subject?: string;
  htmlBody?: string;
  textBody?: string;
  availableVariables?: Record<string, string>;
  isActive?: boolean;
}

/**
 * API Response types
 */
export interface EmailTemplateResponse {
  status: 'success';
  data: EmailTemplate;
}

export interface EmailTemplatesResponse {
  status: 'success';
  data: EmailTemplate[];
}

export interface EmailTemplatePreviewResponse {
  status: 'success';
  data: {
    subject: string;
    htmlBody: string;
    textBody: string;
  };
}

/**
 * Email template type info for UI
 */
export interface EmailTemplateTypeInfo {
  value: EmailTemplateType;
  label: string;
  description: string;
  icon: string;
  defaultVariables: Record<string, string>;
}

export const EMAIL_TEMPLATE_TYPES: EmailTemplateTypeInfo[] = [
  {
    value: 'COUPON_REDEMPTION',
    label: 'Cupón Canjeado',
    description: 'Email enviado cuando un usuario canjea un cupón',
    icon: '🎟️',
    defaultVariables: {
      userName: 'Nombre del usuario que canjea',
      couponCode: 'Código del cupón',
      promotionTitle: 'Título de la promoción',
      promotionDescription: 'Descripción de la promoción',
      brandUrl: 'URL del sitio web de la marca (opcional)',
    },
  },
  {
    value: 'WELCOME',
    label: 'Bienvenida',
    description: 'Email de bienvenida para nuevos usuarios',
    icon: '👋',
    defaultVariables: {
      userName: 'Nombre del usuario',
      userEmail: 'Email del usuario',
    },
  },
  {
    value: 'PASSWORD_RESET',
    label: 'Resetear Contraseña',
    description: 'Email para resetear contraseña',
    icon: '🔑',
    defaultVariables: {
      userName: 'Nombre del usuario',
      resetLink: 'Link para resetear contraseña',
      expiresIn: 'Tiempo de expiración del link',
    },
  },
  {
    value: 'EVENT_REMINDER',
    label: 'Recordatorio de Evento',
    description: 'Recordatorio de evento próximo',
    icon: '📅',
    defaultVariables: {
      userName: 'Nombre del usuario',
      eventName: 'Nombre del evento',
      eventDate: 'Fecha del evento',
      eventLocation: 'Ubicación del evento',
    },
  },
  {
    value: 'COMPETITION_UPDATE',
    label: 'Actualización de Competición',
    description: 'Notificación de cambios en competición',
    icon: '🏃',
    defaultVariables: {
      userName: 'Nombre del usuario',
      competitionName: 'Nombre de la competición',
      updateMessage: 'Mensaje de actualización',
    },
  },
];

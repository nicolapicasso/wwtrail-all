import { EmailTemplateType } from '@prisma/client';
import prisma from '../config/database';
import logger from '../utils/logger';

interface CreateEmailTemplateInput {
  type: EmailTemplateType;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  availableVariables?: Record<string, string>;
  isActive?: boolean;
}

interface UpdateEmailTemplateInput {
  name?: string;
  subject?: string;
  htmlBody?: string;
  textBody?: string;
  availableVariables?: Record<string, string>;
  isActive?: boolean;
}

export class EmailTemplateService {
  /**
   * Get all email templates
   */
  static async getAll() {
    try {
      const templates = await prisma.emailTemplate.findMany({
        orderBy: { type: 'asc' },
      });

      return templates;
    } catch (error) {
      logger.error('Error fetching email templates:', error);
      throw error;
    }
  }

  /**
   * Get email template by ID
   */
  static async getById(id: string) {
    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { id },
      });

      return template;
    } catch (error) {
      logger.error('Error fetching email template:', error);
      throw error;
    }
  }

  /**
   * Get email template by type
   */
  static async getByType(type: EmailTemplateType) {
    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { type },
      });

      return template;
    } catch (error) {
      logger.error('Error fetching email template by type:', error);
      throw error;
    }
  }

  /**
   * Get active email template by type
   */
  static async getActiveByType(type: EmailTemplateType) {
    try {
      const template = await prisma.emailTemplate.findFirst({
        where: {
          type,
          isActive: true,
        },
      });

      return template;
    } catch (error) {
      logger.error('Error fetching active email template:', error);
      throw error;
    }
  }

  /**
   * Create email template
   */
  static async create(data: CreateEmailTemplateInput) {
    try {
      const template = await prisma.emailTemplate.create({
        data: {
          type: data.type,
          name: data.name,
          subject: data.subject,
          htmlBody: data.htmlBody,
          textBody: data.textBody,
          availableVariables: data.availableVariables || {},
          isActive: data.isActive ?? true,
        },
      });

      logger.info(`Email template created: ${template.id} (${template.type})`);
      return template;
    } catch (error) {
      logger.error('Error creating email template:', error);
      throw error;
    }
  }

  /**
   * Update email template
   */
  static async update(id: string, data: UpdateEmailTemplateInput) {
    try {
      const template = await prisma.emailTemplate.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.subject && { subject: data.subject }),
          ...(data.htmlBody && { htmlBody: data.htmlBody }),
          ...(data.textBody && { textBody: data.textBody }),
          ...(data.availableVariables && { availableVariables: data.availableVariables }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      logger.info(`Email template updated: ${template.id}`);
      return template;
    } catch (error) {
      logger.error('Error updating email template:', error);
      throw error;
    }
  }

  /**
   * Delete email template
   */
  static async delete(id: string) {
    try {
      await prisma.emailTemplate.delete({
        where: { id },
      });

      logger.info(`Email template deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting email template:', error);
      throw error;
    }
  }

  /**
   * Render template with variables
   * Replaces {{variable}} with actual values
   */
  static renderTemplate(template: string, variables: Record<string, string>): string {
    let rendered = template;

    // Simple conditional support: {{#if variable}}...{{/if}}
    rendered = rendered.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, varName, content) => {
      return variables[varName] ? content : '';
    });

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      rendered = rendered.replace(regex, value || '');
    });

    return rendered;
  }

  /**
   * Preview template with sample data
   */
  static async preview(id: string, sampleData: Record<string, string>) {
    try {
      const template = await this.getById(id);
      if (!template) {
        throw new Error('Template not found');
      }

      const renderedHtml = this.renderTemplate(template.htmlBody, sampleData);
      const renderedText = this.renderTemplate(template.textBody, sampleData);
      const renderedSubject = this.renderTemplate(template.subject, sampleData);

      return {
        subject: renderedSubject,
        htmlBody: renderedHtml,
        textBody: renderedText,
      };
    } catch (error) {
      logger.error('Error previewing email template:', error);
      throw error;
    }
  }
}

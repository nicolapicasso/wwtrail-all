import apiClientV2 from '../client-v2';
import {
  EmailTemplate,
  EmailTemplateResponse,
  EmailTemplatesResponse,
  EmailTemplatePreviewResponse,
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
} from '@/types/email-template';

class EmailTemplatesService {
  /**
   * Get all email templates (admin only)
   */
  async getAll(): Promise<EmailTemplate[]> {
    const response = await apiClientV2.get<EmailTemplatesResponse>('/email-templates');
    return response.data.data;
  }

  /**
   * Get email template by ID (admin only)
   */
  async getById(id: string): Promise<EmailTemplate> {
    const response = await apiClientV2.get<EmailTemplateResponse>(`/email-templates/${id}`);
    return response.data.data;
  }

  /**
   * Create email template (admin only)
   */
  async create(data: CreateEmailTemplateInput): Promise<EmailTemplate> {
    const response = await apiClientV2.post<EmailTemplateResponse>('/email-templates', data);
    return response.data.data;
  }

  /**
   * Update email template (admin only)
   */
  async update(id: string, data: UpdateEmailTemplateInput): Promise<EmailTemplate> {
    const response = await apiClientV2.put<EmailTemplateResponse>(`/email-templates/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete email template (admin only)
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/email-templates/${id}`);
  }

  /**
   * Preview email template with sample data (admin only)
   */
  async preview(
    id: string,
    sampleData: Record<string, string>
  ): Promise<{ subject: string; htmlBody: string; textBody: string }> {
    const response = await apiClientV2.post<EmailTemplatePreviewResponse>(
      `/email-templates/${id}/preview`,
      { sampleData }
    );
    return response.data.data;
  }
}

export default new EmailTemplatesService();

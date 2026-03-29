'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { emailTemplatesService } from '@/lib/api/v2';
import {
  EmailTemplate,
  EmailTemplateType,
  EMAIL_TEMPLATE_TYPES,
} from '@/types/email-template';
import { Mail, Save, Eye, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [textBody, setTextBody] = useState('');

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  // Variables panel
  const [showVariables, setShowVariables] = useState(true);
  const [sampleData, setSampleData] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject);
      setHtmlBody(selectedTemplate.htmlBody);
      setTextBody(selectedTemplate.textBody);

      // Initialize sample data with placeholders
      const typeInfo = EMAIL_TEMPLATE_TYPES.find((t) => t.value === selectedTemplate.type);
      if (typeInfo) {
        const initialSampleData: Record<string, string> = {};
        Object.keys(typeInfo.defaultVariables).forEach((key) => {
          initialSampleData[key] = `Ejemplo ${key}`;
        });
        setSampleData(initialSampleData);
      }
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emailTemplatesService.getAll();
      setTemplates(data);

      // Select COUPON_REDEMPTION template by default
      const defaultTemplate = data.find((t) => t.type === 'COUPON_REDEMPTION');
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate);
      }
    } catch (err: any) {
      console.error('Error loading templates:', err);
      setError(err.message || 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await emailTemplatesService.update(selectedTemplate.id, {
        subject,
        htmlBody,
        textBody,
      });

      setSuccess('Plantilla guardada correctamente');
      await loadTemplates();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error saving template:', err);
      setError(err.message || 'Error al guardar plantilla');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedTemplate) return;

    try {
      setPreviewLoading(true);
      setError(null);

      const preview = await emailTemplatesService.preview(selectedTemplate.id, sampleData);

      setPreviewSubject(preview.subject);
      setPreviewHtml(preview.htmlBody);
      setPreviewText(preview.textBody);
      setShowPreview(true);
    } catch (err: any) {
      console.error('Error generating preview:', err);
      setError(err.message || 'Error al generar vista previa');
    } finally {
      setPreviewLoading(false);
    }
  };

  const insertVariable = (variable: string, target: 'subject' | 'html' | 'text') => {
    const variableTag = `{{${variable}}}`;

    if (target === 'subject') {
      setSubject((prev) => prev + variableTag);
    } else if (target === 'html') {
      setHtmlBody((prev) => prev + variableTag);
    } else {
      setTextBody((prev) => prev + variableTag);
    }
  };

  const getTemplateTypeInfo = (type: EmailTemplateType) => {
    return EMAIL_TEMPLATE_TYPES.find((t) => t.value === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando plantillas...</p>
        </div>
      </div>
    );
  }

  const typeInfo = selectedTemplate ? getTemplateTypeInfo(selectedTemplate.type) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="h-8 w-8 text-green-600" />
                Configuración de Emails
              </h1>
              <p className="mt-2 text-gray-600">
                Personaliza las plantillas de email que se envían automáticamente
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Email</h2>
              <div className="space-y-2">
                {templates.map((template) => {
                  const info = getTemplateTypeInfo(template.type);
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{info?.icon}</span>
                        <span className="font-medium text-gray-900">{info?.label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{info?.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-3">
            {selectedTemplate && typeInfo && (
              <div className="space-y-6">
                {/* Template Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{typeInfo.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{typeInfo.label}</h3>
                      <p className="text-gray-600 mt-1">{typeInfo.description}</p>
                    </div>
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-lg shadow">
                  <button
                    onClick={() => setShowVariables(!showVariables)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      Variables Disponibles
                    </h3>
                    {showVariables ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {showVariables && (
                    <div className="px-6 pb-6 border-t">
                      <p className="text-sm text-gray-600 mb-4 mt-4">
                        Usa estas variables en tu plantilla con la sintaxis{' '}
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          {'{{nombreVariable}}'}
                        </code>
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(typeInfo.defaultVariables).map(([key, description]) => (
                          <div
                            key={key}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <code className="text-sm font-mono text-green-600 bg-white px-2 py-1 rounded border border-green-200">
                                {'{{' + key + '}}'}
                              </code>
                            </div>
                            <p className="text-xs text-gray-600">{description}</p>

                            {/* Sample data input for preview */}
                            <input
                              type="text"
                              value={sampleData[key] || ''}
                              onChange={(e) =>
                                setSampleData({ ...sampleData, [key]: e.target.value })
                              }
                              placeholder={`Ejemplo: ${key}`}
                              className="mt-2 w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subject Field */}
                <div className="bg-white rounded-lg shadow p-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Asunto del Email
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Asunto del email..."
                  />
                </div>

                {/* HTML Body */}
                <div className="bg-white rounded-lg shadow p-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Cuerpo HTML
                  </label>
                  <textarea
                    value={htmlBody}
                    onChange={(e) => setHtmlBody(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                    placeholder="HTML del email..."
                  />
                </div>

                {/* Text Body */}
                <div className="bg-white rounded-lg shadow p-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Texto Plano (fallback)
                  </label>
                  <textarea
                    value={textBody}
                    onChange={(e) => setTextBody(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                    placeholder="Versión en texto plano..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handlePreview}
                    disabled={previewLoading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="h-5 w-5" />
                    {previewLoading ? 'Generando...' : 'Vista Previa'}
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>

                {/* Preview Modal */}
                {showPreview && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6 border-b sticky top-0 bg-white">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-900">Vista Previa</h3>
                          <button
                            onClick={() => setShowPreview(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Preview Subject */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Asunto:
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="font-medium">{previewSubject}</p>
                          </div>
                        </div>

                        {/* Preview HTML */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vista HTML:
                          </label>
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <iframe
                              srcDoc={previewHtml}
                              className="w-full h-96 bg-white"
                              title="Email Preview"
                            />
                          </div>
                        </div>

                        {/* Preview Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Versión Texto:
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                              {previewText}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

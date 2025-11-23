// components/SEOFaqSchema.tsx
'use client';

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOFaqSchemaProps {
  faq: FAQItem[];
  visible?: boolean; // Si true, muestra las FAQ visualmente también
}

/**
 * Componente que genera Schema.org JSON-LD para FAQ
 * Optimizado para que LLMs (ChatGPT, Claude, Perplexity) puedan extraer info fácilmente
 */
export function SEOFaqSchema({ faq, visible = false }: SEOFaqSchemaProps) {
  if (!faq || faq.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema.org JSON-LD para LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Sección FAQ visible (opcional) */}
      {visible && (
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
          <div className="space-y-3">
            {faq.map((item, index) => (
              <details
                key={index}
                className="group rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
              >
                <summary className="cursor-pointer font-semibold text-lg list-none flex items-center justify-between">
                  <span>{item.question}</span>
                  <svg
                    className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

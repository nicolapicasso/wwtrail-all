// components/home/TextBlock.tsx

'use client';

import { HomeTextSize, HomeTextVariant, HomeTextAlign, type TextBlockConfig } from '@/types/home';

interface TextBlockProps {
  config: TextBlockConfig;
}

export function TextBlock({ config }: TextBlockProps) {
  const { content, size, variant, align = HomeTextAlign.LEFT } = config;

  // Mapeo de tamaños
  const sizeClasses = {
    [HomeTextSize.SM]: 'text-sm md:text-base',
    [HomeTextSize.MD]: 'text-base md:text-lg',
    [HomeTextSize.LG]: 'text-lg md:text-xl',
    [HomeTextSize.XL]: 'text-xl md:text-2xl lg:text-3xl',
  };

  // Clases según variante
  const variantClasses = {
    [HomeTextVariant.PARAGRAPH]: 'font-normal text-gray-700 leading-relaxed',
    [HomeTextVariant.HEADING]: 'font-bold text-gray-900 leading-tight',
  };

  // Clases de alineación
  const alignClasses = {
    [HomeTextAlign.LEFT]: 'text-left',
    [HomeTextAlign.CENTER]: 'text-center',
    [HomeTextAlign.RIGHT]: 'text-right',
  };

  const className = `${sizeClasses[size]} ${variantClasses[variant]} ${alignClasses[align]}`;

  return (
    <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {variant === HomeTextVariant.HEADING ? (
          <h2 className={className}>{content}</h2>
        ) : (
          <p className={className}>{content}</p>
        )}
      </div>
    </div>
  );
}

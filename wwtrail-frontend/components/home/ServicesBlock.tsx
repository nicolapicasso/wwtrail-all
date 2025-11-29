// components/home/ServicesBlock.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import servicesService from '@/lib/api/v2/services.service';
import type { Service } from '@/types/v2';
import type { ContentBlockConfig } from '@/types/home';
import { HomeBlockViewType } from '@/types/home';

interface ServicesBlockProps {
  config: ContentBlockConfig;
}

export function ServicesBlock({ config }: ServicesBlockProps) {
  const { limit, viewType, featuredOnly } = config;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('[ServicesBlock] Fetching services with config:', { limit, featuredOnly });
        const response = await servicesService.getAll({
          limit,
          featured: featuredOnly,
          status: 'PUBLISHED'
        });
        console.log('[ServicesBlock] API Response:', response);
        console.log('[ServicesBlock] Services count:', response?.data?.length || 0);
        setServices(response?.data || []);
      } catch (error) {
        console.error('[ServicesBlock] Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [limit, featuredOnly]);

  if (loading) {
    return (
      <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-orange-600" />
              Servicios Destacados
            </h2>
            <p className="text-gray-600 mt-2">Alojamientos, restaurantes y más para tu próxima aventura</p>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Ver todos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Contenido */}
        {viewType === HomeBlockViewType.CARDS ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

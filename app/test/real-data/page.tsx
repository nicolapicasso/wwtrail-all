'use client';

import { EventList } from '@/components/EventList';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TestRealDataPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/test"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a tests mock
          </Link>
          
          <h1 className="text-3xl font-bold">🌐 Test con Datos Reales</h1>
          <p className="text-muted-foreground mt-2">
            Conectando con tu backend en http://localhost:3001
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Instrucciones */}
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            📋 Antes de continuar
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span>✅</span>
              <span>Tu backend debe estar corriendo en <code className="bg-blue-100 px-1 rounded">http://localhost:3001</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span>✅</span>
              <span>Debes tener eventos creados en la base de datos</span>
            </li>
            <li className="flex items-start gap-2">
              <span>💡</span>
              <span>Si ves un error, verifica que el backend esté corriendo</span>
            </li>
          </ul>
        </div>

        {/* EventList con datos reales */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-2xl font-bold mb-6">Lista de Eventos</h2>
          
          <EventList />
        </div>

        {/* Info adicional */}
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
          <h3 className="font-semibold text-green-900 mb-2">
            ✅ ¿Qué deberías ver?
          </h3>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Barra de búsqueda funcionando</li>
            <li>• Botón "Show Filters" que se expande</li>
            <li>• Cards de eventos de tu base de datos</li>
            <li>• Paginación al final si tienes más de 12 eventos</li>
            <li>• Click en un evento te lleva a su detalle</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
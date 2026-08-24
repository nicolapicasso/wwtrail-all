'use client';

import { useState } from 'react';
import { UserPlus, Megaphone, KeyRound, Star } from 'lucide-react';
import { UserImporter } from '@/components/admin/UserImporter';

type Tab = 'marketing' | 'accounts' | 'insiders';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'marketing', label: 'Marketing (consentimiento)', icon: Megaphone },
  { key: 'accounts', label: 'Cuentas de portal', icon: KeyRound },
  { key: 'insiders', label: 'Insiders', icon: Star },
];

export default function ImportUsersPage() {
  const [tab, setTab] = useState<Tab>('marketing');

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <UserPlus className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Importar usuarios</h1>
          <p className="text-gray-600">Sube un CSV, mapea las columnas y elige cómo crear las cuentas.</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
        {TABS.map((tb) => {
          const Icon = tb.icon;
          const active = tab === tb.key;
          return (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${active ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Icon className="h-4 w-4" /> {tb.label}
            </button>
          );
        })}
      </div>

      {tab === 'marketing' && (
        <UserImporter
          title="Audiencia de marketing (consentimiento heredado)"
          description="Importa contactos que ya dieron su consentimiento en tu sistema anterior. No crea acceso al portal; solo alimenta la audiencia de campañas."
          defaultMarketingOptIn
          fields={['firstName', 'lastName', 'country', 'language']}
        />
      )}

      {tab === 'accounts' && (
        <UserImporter
          title="Cuentas de portal"
          description="Crea cuentas de usuario. Elige entre contraseña provisional (se envía por email) o invitación para que fijen su propia contraseña."
          accountModes={['invite', 'provisional']}
          fields={['firstName', 'lastName', 'country', 'language', 'city', 'phone']}
        />
      )}

      {tab === 'insiders' && (
        <UserImporter
          title="Insiders (masivo)"
          description="Importa corresponsales Insider. Se marcan como Insider y puedes crearles acceso al portal. Admite bio y redes sociales."
          accountModes={['invite', 'provisional', 'none']}
          fixedAsInsider
          fields={['firstName', 'lastName', 'country', 'language', 'city', 'bio', 'instagramUrl', 'facebookUrl', 'twitterUrl', 'youtubeUrl']}
        />
      )}
    </div>
  );
}

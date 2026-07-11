// components/home/ValueProps.tsx
// Fixed "value proposition" section for the redesigned home (3 cards).

import { Globe2, BarChart3, Users } from 'lucide-react';

const ITEMS = [
  {
    Icon: Globe2,
    title: 'Todo el trail mundial',
    body: 'Eventos, competiciones y circuitos de montaña de todo el planeta reunidos y siempre actualizados en un único lugar.',
  },
  {
    Icon: BarChart3,
    title: 'Datos que importan',
    body: 'Distancia, desnivel positivo, número de carreras y ediciones al frente, para elegir tu próximo reto de un vistazo.',
  },
  {
    Icon: Users,
    title: 'Organizadores y comunidad',
    body: 'Descubre a los organizadores, sigue circuitos especiales y conecta con la comunidad de trail runners.',
  },
];

export function ValueProps() {
  return (
    <section className="w-full px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-5 md:grid-cols-3">
        {ITEMS.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-surface p-6 shadow-card"
          >
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-md bg-green-tint-bg">
              <Icon className="h-6 w-6 text-green-brand" />
            </div>
            <h3 className="mt-4 text-[19px] font-extrabold tracking-[-0.01em] text-ink-2">
              {title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ValueProps;

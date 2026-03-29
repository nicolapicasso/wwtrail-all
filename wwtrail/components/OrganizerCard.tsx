// components/OrganizerCard.tsx
// Component to display organizer information in event/competition/edition pages

import Link from 'next/link';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/utils/imageUrl';

interface OrganizerCardProps {
  organizer: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  className?: string;
}

export default function OrganizerCard({ organizer, className = '' }: OrganizerCardProps) {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}>
      <h3 className="mb-4 font-semibold flex items-center gap-2">
        <Building2 className="h-5 w-5 text-[#B66916]" />
        Organizador
      </h3>

      <Link
        href={`/organizers/${organizer.slug}`}
        className="group block"
      >
        {organizer.logoUrl && (
          <div className="flex justify-center mb-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 group-hover:ring-2 group-hover:ring-[#B66916] transition-all">
              <Image
                src={normalizeImageUrl(organizer.logoUrl)}
                alt={`${organizer.name} logo`}
                fill
                className="object-contain p-2"
              />
            </div>
          </div>
        )}

        <p className="text-center font-medium text-gray-900 group-hover:text-[#B66916] transition-colors">
          {organizer.name}
        </p>

        <p className="text-center text-xs text-gray-500 mt-1 group-hover:text-[#B66916] transition-colors">
          Ver perfil del organizador →
        </p>
      </Link>
    </div>
  );
}

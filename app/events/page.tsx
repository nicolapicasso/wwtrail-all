// app/events/page.tsx - Events listing page

import { EventList } from '@/components/EventList';
import { MapPin } from 'lucide-react';

export const metadata = {
  title: 'Trail Running Events | WWTRAIL',
  description: 'Discover trail running events and ultra marathons around the world',
};

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Trail Running Events</h1>
            <p className="text-muted-foreground">
              Discover amazing trail running events around the world
            </p>
          </div>
        </div>
      </div>

      {/* Events list with filters */}
      <EventList />
    </div>
  );
}

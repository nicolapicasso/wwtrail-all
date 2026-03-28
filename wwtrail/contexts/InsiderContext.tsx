// contexts/InsiderContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { userService } from '@/lib/api/user.service';

interface InsiderContextValue {
  badgeUrl: string | null;
  loading: boolean;
}

const InsiderContext = createContext<InsiderContextValue>({
  badgeUrl: null,
  loading: true,
});

export function InsiderProvider({ children }: { children: ReactNode }) {
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadgeUrl = async () => {
      try {
        const data = await userService.getPublicInsiders();
        setBadgeUrl(data.config?.badgeUrl || null);
      } catch (error) {
        console.error('Error fetching insider badge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadgeUrl();
  }, []);

  return (
    <InsiderContext.Provider value={{ badgeUrl, loading }}>
      {children}
    </InsiderContext.Provider>
  );
}

export function useInsiderBadge() {
  return useContext(InsiderContext);
}

export default InsiderContext;

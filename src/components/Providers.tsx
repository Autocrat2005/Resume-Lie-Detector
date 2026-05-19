'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../../lib/supabase-client';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface AppContextType {
  supabase: SupabaseClient | null;
  user: User | null;
  loading: boolean;
}

const AppContext = createContext<AppContextType>({
  supabase: null,
  user: null,
  loading: true,
});

export function useApp() {
  return useContext(AppContext);
}

export default function Providers({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AppContext.Provider value={{ supabase, user, loading }}>
      {children}
    </AppContext.Provider>
  );
}

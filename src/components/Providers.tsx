'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../../lib/supabase-client';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface AppContextType {
  supabase: SupabaseClient | null;
  user: User | null;
  loading: boolean;
  plan: string;
  refreshPlan: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  supabase: null,
  user: null,
  loading: true,
  plan: 'free',
  refreshPlan: async () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export default function Providers({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  const fetchActivePlan = async (currentUser: User) => {
    if (!supabase) return;
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', currentUser.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      setPlan(data?.plan || 'free');
    } catch (err) {
      console.error('Error fetching subscription plan:', err);
      setPlan('free');
    }
  };

  const refreshPlan = async () => {
    if (user) {
      await fetchActivePlan(user);
    } else {
      setPlan('free');
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchActivePlan(currentUser);
        } else {
          setPlan('free');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AppContext.Provider value={{ supabase, user, loading, plan, refreshPlan }}>
      {children}
    </AppContext.Provider>
  );
}

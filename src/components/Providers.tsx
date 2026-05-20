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

    // 1. Fetch initial session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchActivePlan(currentUser);
      }
    }).catch((err) => {
      console.error('Error getting initial session:', err);
      setLoading(false);
    });

    // 2. Listen for auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
        
        if (currentUser) {
          fetchActivePlan(currentUser);
        } else {
          setPlan('free');
        }
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

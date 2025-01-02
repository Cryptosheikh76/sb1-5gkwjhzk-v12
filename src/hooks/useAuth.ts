import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

function mapSupabaseUser(user: SupabaseUser | null): User | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
    username: '', // Will be populated from profile
    avatar_url: '',
    is_staff: false,
    is_verified: false,
    followers_count: 0
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        // Get additional user data from profiles
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile && mappedUser) {
          setUser({
            ...mappedUser,
            ...profile
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        // Get additional user data from profiles
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile && mappedUser) {
          setUser({
            ...mappedUser,
            ...profile
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { error: authError, data } = await supabase.auth.signUp({ 
      email, 
      password 
    });

    if (authError) return { error: authError };

    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, username }]);

      if (profileError) return { error: profileError };
    }

    return { error: null };
  };

  const signOut = () => supabase.auth.signOut();

  return { user, loading, signIn, signUp, signOut };
}
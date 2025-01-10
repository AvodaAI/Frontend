import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  token: string | null;
  getTokenFromCookies: () => Promise<string | null>;
  setTokenForCookies: (token: string) => Promise<void>;
  error: string | null;
}

export function useAuth() {
  const supabase = useSupabase();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    login: async () => {},
    logout: async () => {},
    isLoading: true,
    token: null,
    getTokenFromCookies: async () => null,
    setTokenForCookies: async () => {},
    error: null,
  });

  useEffect(() => {
    const getTokenFromSupabase = async () => {
      const { data, error } = await supabase.auth.getSession();
  
      if (error) {
        throw new Error(error.message);
      }
  
      if (data.session) {
        return data.session.access_token
      } else {
        throw new Error('No active session found.');
      }
    }
  
    const getTokenFromCookies = async () => {
      const response = await fetch('/api/auth/cookies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
  
      const data = await response.json();
  
      return data.token;
    }
  
    const setTokenForCookies = async (token: string) => {
      const response = await fetch('/api/auth/cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
  
      return response.json();
    }

    const login = async (email: string, password: string) => {
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
  
        if (response.ok) {
          // Add a small delay before navigation
          setTimeout(() => {
            router.replace('/dashboard')
          }, 100)

          const token = await getTokenFromSupabase();
          await setTokenForCookies(token);
        } else {
          const data = await response.json()
          throw new Error(data.error || 'Invalid email or password')
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'An error occurred during sign in')
        } else {
          throw new Error('An unknown error occurred')
        }
      }
    }

    const logout = async () => {
      const { error } = await supabase.auth.signOut();
      if ( error ) {
        throw new Error("Error signing out: " + error.message);
      } else {
        window.location.href = "/";
      }
    };

    const fetchUser = async () => {
      let userForCatchError: User | null = null;
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        userForCatchError = user;

        if (error) {
          throw new Error(error.message);
        }

        const token = await getTokenFromCookies() || await getTokenFromSupabase();

        if (user) {
          setAuthState({
            isAuthenticated: true,
            user,
            login,
            logout,
            isLoading: false,
            token,
            getTokenFromCookies,
            setTokenForCookies,
            error: null,
          });
        } else {
          setAuthState((prevState) => ({ ...prevState, login, logout, isLoading: false }));
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setAuthState({
          isAuthenticated: false,
          user: userForCatchError,
          login,
          logout,
          isLoading: false,
          token: null,
          getTokenFromCookies,
          setTokenForCookies,
          error: error.message || 'An error occurred',
        });
      }
    };

    fetchUser();
  }, [supabase, router]);

  return authState;
}

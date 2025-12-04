'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

interface AuthContextType {
    user: User | null;
    credits: number;
    loading: boolean;
    signOut: () => Promise<void>;
    deductCredits: (amount: number) => Promise<void>;
    refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchCredits(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchCredits(session.user.id);
            } else {
                setCredits(0);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchCredits = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setCredits(data?.credits || 0);
        } catch (error) {
            console.error('Error fetching credits:', error);
            setCredits(0);
        } finally {
            setLoading(false);
        }
    };

    const refreshCredits = async () => {
        if (user) {
            await fetchCredits(user.id);
        }
    };

    const deductCredits = async (amount: number) => {
        if (!user) return;

        try {
            // Update credits in database
            const { data, error } = await supabase
                .from('profiles')
                .update({ credits: credits - amount })
                .eq('id', user.id)
                .select('credits')
                .single();

            if (error) throw error;

            // Log transaction
            await supabase.from('credit_transactions').insert({
                user_id: user.id,
                amount: -amount,
                type: 'deduct',
                description: 'dApp generation',
            });

            setCredits(data.credits);
        } catch (error) {
            console.error('Error deducting credits:', error);
            throw error;
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setCredits(0);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                credits,
                loading,
                signOut,
                deductCredits,
                refreshCredits,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Verify user authentication from JWT token
export async function verifyAuth(request: Request): Promise<{ userId: string | null; error?: string }> {
    try {
        const cookieStore = cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return { userId: null, error: 'Unauthorized' };
        }

        return { userId: user.id };
    } catch (error) {
        console.error('Auth verification error:', error);
        return { userId: null, error: 'Authentication failed' };
    }
}

// Extract user ID from Authorization header (alternative method)
export async function getUserFromHeader(request: Request): Promise<{ userId: string | null; error?: string }> {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { userId: null, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.substring(7);

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get() { return undefined; },
                },
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return { userId: null, error: 'Invalid token' };
        }

        return { userId: user.id };
    } catch (error) {
        console.error('Token verification error:', error);
        return { userId: null, error: 'Token verification failed' };
    }
}

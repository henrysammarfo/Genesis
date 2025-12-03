import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID required' }, { status: 401 });
        }

        // Fetch user's ENV variables
        const { data, error } = await supabaseAdmin
            .from('user_env_vars')
            .select('key, value')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching ENV vars:', error);
            return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
        }

        // Decrypt values
        const envVars = (data || []).map((item) => ({
            key: item.key,
            value: decrypt(item.value),
            masked: item.key.includes('PRIVATE_KEY'),
        }));

        return NextResponse.json({ success: true, envVars });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, envVars } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID required' }, { status: 401 });
        }

        if (!envVars || !Array.isArray(envVars)) {
            return NextResponse.json({ success: false, error: 'Invalid ENV variables' }, { status: 400 });
        }

        // Delete existing ENV vars for this user
        await supabaseAdmin.from('user_env_vars').delete().eq('user_id', userId);

        // Insert new ENV vars (encrypted)
        const encryptedVars = envVars
            .filter((v) => v.key && v.value) // Only save non-empty values
            .map((v) => ({
                user_id: userId,
                key: v.key,
                value: encrypt(v.value),
            }));

        if (encryptedVars.length > 0) {
            const { error } = await supabaseAdmin.from('user_env_vars').insert(encryptedVars);

            if (error) {
                console.error('Error saving ENV vars:', error);
                return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

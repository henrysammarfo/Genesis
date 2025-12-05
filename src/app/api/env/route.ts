import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all env vars for user
        const { data: envVars, error } = await supabase
            .from('user_env_vars')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching env vars:', error);
            return NextResponse.json({ error: 'Failed to fetch env vars' }, { status: 500 });
        }

        // Decrypt values
        const decrypted = envVars?.map(v => ({
            ...v,
            value: v.encrypted ? decrypt(v.value) : v.value
        })) || [];

        return NextResponse.json({ envVars: decrypted });
    } catch (error) {
        console.error('Env vars GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { key, value } = body;

        if (!key || !value) {
            return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
        }

        // Encrypt the value
        const encryptedValue = encrypt(value);

        // Upsert env var
        const { data: envVar, error } = await supabase
            .from('user_env_vars')
            .upsert({
                user_id: user.id,
                key,
                value: encryptedValue,
                encrypted: true
            }, {
                onConflict: 'user_id,key'
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving env var:', error);
            return NextResponse.json({ error: 'Failed to save env var' }, { status: 500 });
        }

        return NextResponse.json({
            envVar: {
                ...envVar,
                value: decrypt(envVar.value)
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Env vars POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('user_env_vars')
            .delete()
            .eq('user_id', user.id)
            .eq('key', key);

        if (error) {
            console.error('Error deleting env var:', error);
            return NextResponse.json({ error: 'Failed to delete env var' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Env vars DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

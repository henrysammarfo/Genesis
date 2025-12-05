import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Get the user
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Check if profile exists, if not create it
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.id)
                    .single()

                if (!existingProfile) {
                    // Create profile with initial credits
                    await supabase.from('profiles').insert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                        credits: 100, // Initial credits
                    })
                }

                // Redirect to dashboard
                return NextResponse.redirect(`${origin}/dashboard`)
            }
        }
    }

    // If there's an error or no code, redirect to signin with error
    return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`)
}

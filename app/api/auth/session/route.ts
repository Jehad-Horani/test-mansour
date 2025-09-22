import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createServerSupabaseClient({ req, res });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return res.status(401).json({ hasProfile: false, profile: null });

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return res.status(200).json({
        hasProfile: !!profile,
        profile: profile || null,
        error: error?.message || null,
    });
}
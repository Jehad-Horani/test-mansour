import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const {
        email,
        password,
        name,
        phone,
        university,
        major,
        year,
        avatar,
        bio,
        subscription_tier,
        stats
    } = req.body;

    // 1. Create user in Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (userError || !userData.user) {
        return res.status(400).json({ error: userError?.message || 'User creation failed' });
    }

    const userId = userData.user.id;

    // 2. Call profile insert function
    const { error: profileError } = await supabase.rpc('create_profile', {
        p_id: userId,
        p_name: name,
        p_phone: phone,
        p_email: email,
        p_university: university,
        p_major: major,
        p_year: year,
        p_avatar: avatar || null,
        p_bio: bio || null,
        p_subscription_tier: subscription_tier || null,
        p_stats: stats || null,
    });

    if (profileError) {
        // Optionally: delete user if profile creation fails
        await supabase.auth.admin.deleteUser(userId);
        return res.status(400).json({ error: profileError.message });
    }

    return res.status(201).json({ user_id: userId, message: 'Signup and profile creation successful' });
}
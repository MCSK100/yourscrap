import { supabaseAdmin } from '../utils/supabaseClient.js';

export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = data.user;
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('full_name, role')
      .eq('user_id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      role: profileData?.role || 'user',
      fullName: profileData?.full_name || null
    };

    if (profileError && profileError.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to load user profile' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

import { supabase } from './supabaseClient.js';

const STORAGE_KEY = 'eco-scrap-user';

const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const clearUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const normalizeProfile = async (user) => {
  if (!user?.id) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name,role,phone')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return { id: user.id, email: user.email, role: 'user', full_name: null };
  }

  return {
    id: user.id,
    email: user.email,
    role: data?.role || 'user',
    fullName: data?.full_name || null,
    phone: data?.phone || null
  };
};

export const login = async ({ email, password }) => {
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  if (ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminUser = { id: 'admin', email: ADMIN_EMAIL, role: 'admin', fullName: 'Admin', token: 'static-admin-token' };
    saveUser(adminUser);
    return adminUser;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data?.user) throw new Error('Login failed');

  const profile = await normalizeProfile(data.user);
  const activeUser = { ...profile, token: data.session?.access_token };
  saveUser(activeUser);
  return activeUser;
};

const upsertProfileForOAuth = async (user) => {
  if (!user?.id) return;

  const { data: existing } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing?.user_id) return;

  await supabase.from('profiles').insert({
    user_id: user.id,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    email: user.email,
    phone: null,
    role: 'user',
  });
};

const getOrCreateProfile = async (user) => {
  await upsertProfileForOAuth(user);
  const profile = await normalizeProfile(user);
  return profile || { id: user.id, email: user.email, role: 'user', fullName: null, phone: null };
};

export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
      // queryParams can be added if needed
    },
  });

  if (error) throw error;
  // For OAuth, Supabase typically redirects; return data for completeness.
  return data;
};

export const applySessionUserToStorage = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const sessionUser = data?.session?.user;
  if (!sessionUser) throw new Error('No active session');

  const profile = await getOrCreateProfile(sessionUser);
  const activeUser = { ...profile, token: data.session?.access_token };
  saveUser(activeUser);
  return activeUser;
};


export const register = async ({ fullName, email, phone, password, role }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { phone }
    }
  });

  if (error) throw error;
  if (!data?.user) throw new Error('Registration failed');

  const profileInsert = await supabase.from('profiles').insert({
    user_id: data.user.id,
    full_name: fullName,
    email,
    phone,
    role
  });

  if (profileInsert.error) {
    throw profileInsert.error;
  }

  const activeUser = {
    id: data.user.id,
    email,
    role,
    fullName,
    phone,
    token: data.session?.access_token
  };
  saveUser(activeUser);

  return activeUser;
};

export const logout = async () => {
  try { await supabase.auth.signOut(); } catch {}
  clearUser();
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    clearUser();
    return null;
  }
};

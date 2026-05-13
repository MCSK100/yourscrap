import { supabaseAdmin } from '../utils/supabaseClient.js';

const validatePickupPayload = (payload) => {
  const requiredFields = ['category', 'item_name', 'weight_kg', 'estimated_value_cents', 'schedule_at', 'pickup_address'];
  const missing = requiredFields.filter((field) => !payload[field] && payload[field] !== 0);
  if (missing.length) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  if (Number(payload.weight_kg) < 0 || Number(payload.estimated_value_cents) < 0) {
    return 'Weight and estimated value must be non-negative numbers.';
  }

  if (isNaN(Date.parse(payload.schedule_at))) {
    return 'schedule_at must be a valid date string.';
  }

  return null;
};

const getOrCreateProfile = async (userId, email, fullName) => {
  const { data: existingProfile, error: existingError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existingError && existingError.code !== 'PGRST116') {
    throw existingError;
  }

  if (existingProfile?.id) {
    return existingProfile.id;
  }

  const { data: newProfile, error: insertError } = await supabaseAdmin
    .from('profiles')
    .insert({
      user_id: userId,
      email,
      full_name: fullName,
      role: 'user'
    })
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  return newProfile.id;
};

export const createPickup = async (req, res, next) => {
  try {
    const validationError = validatePickupPayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const profileId = await getOrCreateProfile(req.user.id, req.user.email, req.user.fullName);

    const payload = {
      user_id: req.user.id,
      profile_id: profileId,
      category: req.body.category,
      item_name: req.body.item_name,
      weight_kg: Number(req.body.weight_kg),
      estimated_value_cents: Number(req.body.estimated_value_cents),
      final_value_cents: Number(req.body.final_value_cents ?? 0),
      status: 'pending',
      schedule_at: new Date(req.body.schedule_at).toISOString(),
      pickup_address: req.body.pickup_address,
      image_url: req.body.image_url || null,
      notes: req.body.notes || null,
      price_list_id: req.body.price_list_id || null
    };

    const { data, error } = await supabaseAdmin
      .from('pickups')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create pickup request' });
    }

    return res.status(201).json({ pickup: data });
  } catch (error) {
    return next(error);
  }
};

export const getMyPickups = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('pickups')
      .select('*, price_list(category, item_type, unit, price_cents)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Unable to fetch pickup history' });
    }

    return res.json({ pickups: data });
  } catch (error) {
    return next(error);
  }
};

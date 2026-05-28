import { supabaseAdmin } from '../utils/supabaseClient.js';

export const createPickup = async (req, res, next) => {
  try {
    const { customer_name, customer_phone, pickup_address, items, preferred_date, preferred_time, notes, customer_email, location_lat, location_lng } = req.body;

    if (!customer_name || !customer_phone || !pickup_address) {
      return res.status(400).json({ error: 'customer_name, customer_phone, and pickup_address are required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    const payload = {
      customer_name,
      customer_phone,
      customer_email: customer_email || null,
      pickup_address,
      items,
      preferred_date: preferred_date || null,
      preferred_time: preferred_time || null,
      notes: notes || null,
      location_lat: location_lat || null,
      location_lng: location_lng || null,
      status: 'pending'
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

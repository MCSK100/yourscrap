import { supabaseAdmin } from '../utils/supabaseClient.js';

export const getPickupList = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = supabaseAdmin
      .from('pickups')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,pickup_address.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Unable to fetch pickups' });
    }

    return res.json({ pickups: data });
  } catch (error) {
    return next(error);
  }
};

export const updatePickup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

    const updatePayload = {};

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      updatePayload.status = status;
    }

    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('pickups')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update pickup' });
    }

    return res.json({ pickup: data });
  } catch (error) {
    return next(error);
  }
};

export const deletePickup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('pickups')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete pickup' });
    }

    return res.json({ message: 'Pickup deleted' });
  } catch (error) {
    return next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const { key } = req.query;

    let query = supabaseAdmin.from('settings').select('*');

    if (key) {
      query = query.eq('key', key).single();
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    return res.json({ settings: data });
  } catch (error) {
    return next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'key and value are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update setting' });
    }

    return res.json({ setting: data });
  } catch (error) {
    return next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('pickups')
      .select('status, created_at');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }

    const statusCounts = {
      pending: 0, confirmed: 0, in_progress: 0, completed: 0, cancelled: 0
    };

    data.forEach((pickup) => {
      if (statusCounts[pickup.status] !== undefined) {
        statusCounts[pickup.status] += 1;
      }
    });

    return res.json({
      statusCounts,
      totalPickups: data.length
    });
  } catch (error) {
    return next(error);
  }
};

import { supabaseAdmin } from '../utils/supabaseClient.js';

const requireAdmin = (req, res) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }
  return true;
};

const monthKey = (dateString) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getAnalytics = async (req, res, next) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { data, error } = await supabaseAdmin
      .from('pickups')
      .select('status,created_at,final_value_cents');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch analytics data' });
    }

    const revenueByMonth = {};
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      collected: 0,
      cancelled: 0,
      completed: 0
    };
    let totalRevenueCents = 0;

    data.forEach((pickup) => {
      const bucket = monthKey(pickup.created_at);
      const value = Number(pickup.final_value_cents || 0);
      totalRevenueCents += value;
      revenueByMonth[bucket] = (revenueByMonth[bucket] || 0) + value;
      if (statusCounts[pickup.status] !== undefined) {
        statusCounts[pickup.status] += 1;
      }
    });

    const monthlyRevenue = Object.entries(revenueByMonth)
      .map(([month, revenue_cents]) => ({ month, revenue_cents }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return res.json({
      monthlyRevenue,
      statusCounts,
      totalRevenueCents,
      totalPickups: data.length
    });
  } catch (error) {
    return next(error);
  }
};

export const getPickupList = async (req, res, next) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { data, error } = await supabaseAdmin
      .from('pickups')
      .select('id, user_id, category, item_name, status, schedule_at, pickup_address, estimated_value_cents, final_value_cents, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Unable to fetch pickup list' });
    }

    return res.json({ pickups: data });
  } catch (error) {
    return next(error);
  }
};

export const updatePickupStatus = async (req, res, next) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const { status, final_value_cents } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'collected', 'cancelled', 'completed'];

    if (!status && final_value_cents === undefined) {
      return res.status(400).json({ error: 'At least one update field is required' });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatePayload = {};
    if (status) updatePayload.status = status;
    if (final_value_cents !== undefined) {
      const amount = Number(final_value_cents);
      if (Number.isNaN(amount) || amount < 0) {
        return res.status(400).json({ error: 'final_value_cents must be a non-negative number' });
      }
      updatePayload.final_value_cents = amount;
    }

    const { data, error } = await supabaseAdmin
      .from('pickups')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update pickup status' });
    }

    return res.json({ pickup: data });
  } catch (error) {
    return next(error);
  }
};

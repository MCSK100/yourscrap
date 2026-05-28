export const verifyAdmin = (req, res, next) => {
  const pin = req.headers['x-admin-pin'];
  const adminPin = process.env.ADMIN_PIN;

  if (!adminPin) {
    return res.status(500).json({ error: 'Admin PIN not configured on server' });
  }

  if (!pin || pin !== adminPin) {
    return res.status(401).json({ error: 'Invalid admin PIN' });
  }

  next();
};

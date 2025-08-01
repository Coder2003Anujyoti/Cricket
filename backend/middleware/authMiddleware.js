const jwt = require('jsonwebtoken');
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log(process.env.JWT_SECRET)
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // { username, role }
    next();
  });
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
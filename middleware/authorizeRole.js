// middleware/authorizeRole.js
module.exports = function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Role tidak ada" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak (forbidden)" });
    }

    next();
  };
};
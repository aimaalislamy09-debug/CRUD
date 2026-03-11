// middleware/authorize.js
module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Belum login" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak (forbidden)" });
    }

    next();
  };
};
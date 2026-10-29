import jwt from 'jsonwebtoken';

export function verifikasiToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
}

export function izinkanRole(...rolesYangDiizinkan) {
  return (req, res, next) => {
    if (!req.user || !rolesYangDiizinkan.includes(req.user.role)) {
      return res.status(403).json({ message: 'Anda tidak punya akses ke fitur ini.' });
    }
    next();
  };
}

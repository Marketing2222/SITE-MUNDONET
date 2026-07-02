import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'mundonet_secret_2024_!@#';

export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '8h' });

export const verifyToken = (token) => {
  try { return jwt.verify(token, SECRET); }
  catch { return null; }
};

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  const token = header.slice(7);
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Token inválido ou expirado' });
  req.user = payload;
  next();
};

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export const protect = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }
  if (!token) return res.status(401).json({ msg: 'No token. Not authorized.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid.' });
  }
};

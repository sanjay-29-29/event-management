const jwt = require('jsonwebtoken');

const auth_user = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const auth_admin = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {

      req.user = decoded;
      next();
    } else {
      throw new Error('Not authorized as admin');
    }
  } catch (e) {
    console.log(e);
    res.status(403).send({ error: 'Access denied. Requires admin role.' });
  }
}

module.exports = { auth_user, auth_admin };
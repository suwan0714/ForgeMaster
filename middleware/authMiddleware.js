const jwt = require('jsonwebtoken');
require('dotenv').config();

// 토큰을 검증하는 보안 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer TOKEN' 형태에서 토큰만 추출

  if (!token) {
    return res.status(401).json({ message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
    }
    req.user = user; // 다음 미들웨어나 라우터에서 유저 정보를 쓸 수 있게 저장
    next();
  });
};

module.exports = { authenticateToken };
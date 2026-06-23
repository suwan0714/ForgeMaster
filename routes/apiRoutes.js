const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const clanController = require('../controllers/clanController');
const memberController = require('../controllers/memberController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 인증 경로
router.post('/login', authController.login);

// 클랜 경로
router.post('/clan/generate', authenticateToken, clanController.generateClan);
router.get('/clan/rankings', authenticateToken, clanController.getRankings);
router.delete('/clan/:id', authenticateToken, clanController.deleteClan);

// 멤버 경로
router.post('/member/update', authenticateToken, memberController.updateAssets);

module.exports = router;
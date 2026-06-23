const { pool } = require('../db');

// 서버 측 재계산 엔진 (이전 계산 로직 동일하게 포함)
const calculateScore = (assets, tech) => { /* 이전 코드와 동일 */ };

exports.updateAssets = async (req, res) => {
    const { nickname, assets, techLevels } = req.body;
    const total_score = calculateScore(assets, techLevels);
    try {
        await pool.query('UPDATE members SET total_score = $1 WHERE nickname = $2', [total_score, nickname]);
        res.json({ success: true, total_score });
    } catch (err) { res.status(500).json({ error: "업데이트 실패" }); }
};
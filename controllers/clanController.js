const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../db'); 

// 클랜 생성 (관리자용)
exports.generateClan = async (req, res) => {
    // [보안] 기존 코드의 권한 체크 유지
    if (req.user.role !== 'admin') return res.status(403).json({ message: '관리자 권한이 없습니다.' });

    const { clanName } = req.body;
    const clanCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const leaderId = `leader_${crypto.randomBytes(2).toString('hex')}`;
    const generatedPassword = crypto.randomBytes(4).toString('hex');
    const hash = await bcrypt.hash(generatedPassword, 10);

    try {
        const queryText = `INSERT INTO clans (clan_name, clan_code, leader_id, leader_password_hash) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await pool.query(queryText, [clanName, clanCode, leaderId, hash]);
        res.status(201).json({ clan: result.rows[0], generatedPassword });
    } catch (err) { res.status(500).json({ error: "클랜 생성 실패" }); }
};

// 클랜 목록 조회 (관리자용)
exports.getRankings = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: '관리자 권한이 없습니다.' });
    try {
        const result = await pool.query('SELECT clan_id, clan_name, clan_code, leader_id FROM clans ORDER BY clan_id DESC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: "조회 실패" }); }
};

// 클랜 삭제 (관리자용)
exports.deleteClan = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: '관리자 권한이 없습니다.' });
    try {
        const result = await pool.query('DELETE FROM clans WHERE clan_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: '클랜 없음' });
        res.json({ message: '삭제 완료' });
    } catch (err) { res.status(500).json({ error: "삭제 실패" }); }
};
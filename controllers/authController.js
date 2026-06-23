const bcrypt = require('bcrypt');
const { pool } = require('../db');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    console.log("프론트에서 들어온 데이터:", req.body);
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(401).json({ message: '사용자 없음' });
        
        const isMatch = await bcrypt.compare(password, result.rows[0].password_hash);
        if (!isMatch) return res.status(401).json({ message: '비밀번호 불일치' });

        const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) { res.status(500).json({ error: "로그인 실패" }); }
};
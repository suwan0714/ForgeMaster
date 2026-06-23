const bcrypt = require('bcrypt'); // 🌟 bcrypt 적용
const db = require('./db');

const args = process.argv.slice(2);
const username = args[0];
const password = args[1];

if (!username || !password) {
  console.log('❌ 사용법: node createAdmin.js [아이디] [비밀번호]');
  process.exit(1);
}

async function createAdmin() {
  try {
    // 🌟 10 라운드 솔팅을 가진 강력한 해싱 적용
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // 기존 동명 계정 제거
    await db.query('DELETE FROM admins WHERE username = $1', [username]);

    const queryText = `
      INSERT INTO admins (username, password_hash)
      VALUES ($1, $2)
      RETURNING admin_id, username;
    `;
    const res = await db.query(queryText, [username, hash]);
    console.log(`\n✅ 관리자 계정 '${res.rows[0].username}'이(가) 강력한 bcrypt 보안 해시로 안전하게 생성되었습니다.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ 계정 생성 중 에러 발생:', err.message);
    process.exit(1);
  }
}

createAdmin();
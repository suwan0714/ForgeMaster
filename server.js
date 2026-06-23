const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
// const { pool } = require('./db'); // 필요하면 여기서도 가져다 쓰면 됩니다.

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버 가동 중 (포트: ${PORT})`));
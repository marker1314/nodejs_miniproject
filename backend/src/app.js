const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const studyRoutes = require('./routes/studies');
const mypageRoutes = require('./routes/mypage');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우터 연결
app.use('/auth', authRoutes);       // 로그인, 회원가입
app.use('/studies', studyRoutes);   // 스터디 관련 (CRUD, 지원)
app.use('/mypage', mypageRoutes);   // 마이페이지

// 기본 경로 확인용
app.get('/', (req, res) => {
  res.send('스터디 게시판 백엔드 서버가 정상 동작 중입니다!');
});

module.exports = app;
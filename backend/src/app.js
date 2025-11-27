const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const studyRoutes = require('./routes/studies');
const { authenticate } = require('./controllers/authController');
const { getMyStudies, getMyAppliedStudies } = require('./controllers/studyController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/studies', studyRoutes);

// MyPage Routes
app.get('/mypage/studies', authenticate, getMyStudies);
app.get('/mypage/applied', authenticate, getMyAppliedStudies);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '스터디 모집 게시판 API 서버' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

module.exports = app;

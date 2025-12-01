const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/register - 회원가입
router.post('/register', authController.register);

// POST /auth/login - 로그인
router.post('/login', authController.login);

module.exports = router;

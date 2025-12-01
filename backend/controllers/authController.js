const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key-change-in-production';

// 메모리 내 데이터 저장소
const users = [];
let nextUserId = 1;

// JWT 토큰 생성 함수
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
};

// 회원가입
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 유효성 검사
    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // 이메일 중복 확인
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = {
      id: nextUserId++,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    users.push(newUser);

    // 응답 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 유효성 검사
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 사용자 찾기
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const accessToken = generateToken(user);

    // 응답
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
};

// JWT 인증 미들웨어
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// users 배열을 export (다른 컨트롤러에서 사용)
exports.users = users;

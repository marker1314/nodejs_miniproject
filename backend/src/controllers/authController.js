const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sparta-secret-key'; // 실무에선 .env 사용 권장

// 데이터 저장소 (임시)
let users = [];
let nextUserId = 1;

// 회원가입
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: nextUserId++,
            email,
            password: hashedPassword,
            name
        };

        users.push(newUser);

        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        });
    } catch (error) {
        res.status(500).json({ message: '서버 에러' });
    }
};

// 로그인
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: '이메일 또는 비밀번호 불일치' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '이메일 또는 비밀번호 불일치' });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            SECRET_KEY,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: '서버 에러' });
    }
};

// [수정된 인증 미들웨어]
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. 헤더가 아예 없는 경우
    if (!authHeader) {
        console.log('❌ 인증 실패: Authorization 헤더가 없음');
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // 2. 토큰 추출 (Bearer가 있든 없든 처리하도록 수정)
    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    try {
        // 3. 토큰 검증
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // 요청에 유저 정보 담기
        console.log(`✅ 인증 성공: User ID ${decoded.id}`);
        next();
    } catch (error) {
        // 4. 검증 실패 (만료되거나 조작됨)
        console.log('❌ 인증 실패: 토큰이 유효하지 않음 (Error:', error.message, ')');
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

exports.users = users;
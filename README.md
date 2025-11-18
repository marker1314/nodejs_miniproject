# 스터디 모집 게시판 백엔드 프로젝트

이 프로젝트는 스터디 모집 게시판의 백엔드 API를 직접 개발하는 실습 프로젝트입니다. 
강의에서 배운 내용을 바탕으로 실제로 동작하는 서버를 만들어보세요!

## 📚 프로젝트 소개

스터디를 찾거나 스터디원을 모집할 수 있는 게시판의 백엔드 API를 개발합니다.
사용자들은 스터디 모집 글을 작성, 조회, 수정, 삭제할 수 있습니다.

## 🎯 학습 목표

- Node.js와 Express를 사용한 REST API 개발
- HTTP 메서드(GET, POST, PUT, DELETE) 이해 및 활용
- 라우팅과 미들웨어 개념 이해
- JSON 데이터 처리
- 기본적인 에러 처리

## 🛠️ 사용 기술

- **Node.js**: JavaScript 런타임 환경
- **Express**: Node.js 웹 프레임워크
- **기타**: 필요에 따라 추가 패키지 사용 가능

## 📋 사전 준비사항

### 1. Node.js 설치 확인

터미널(명령 프롬프트)에서 다음 명령어를 입력하여 Node.js가 설치되어 있는지 확인하세요:

```bash
node -v
npm -v
```

버전이 출력되면 정상적으로 설치된 것입니다. 설치되어 있지 않다면 [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하여 설치하세요.

### 2. 코드 에디터

- VS Code 권장 ([다운로드](https://code.visualstudio.com/))

## 🚀 프로젝트 시작하기

### 1. 프로젝트 초기화 (백엔드)

```bash
# backend 디렉토리로 이동
cd backend

# package.json 생성
npm init -y

# Express 설치
npm install express

# 기타 필요한 패키지 설치
npm install cors jsonwebtoken bcrypt
```

### 2. 프로젝트 구조

다음과 같은 구조로 파일을 생성하세요:

```
nodejs_miniproject/
├── backend/              # 백엔드 (구현 필요)
│   ├── node_modules/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── client/               # 프론트엔드 (완성됨)
    ├── src/
    ├── package.json
    └── README.md
```

### 3. 백엔드 서버 실행

```bash
cd backend
node src/server.js
```

백엔드 서버가 정상적으로 실행되면 `http://localhost:3000`에서 API에 접근할 수 있습니다.

### 4. 프론트엔드 서버 실행

**새 터미널 창을 열고** 다음 명령어를 실행하세요:

```bash
# 프론트엔드 디렉토리로 이동
cd client

# 의존성 설치 (최초 1회만)
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

> **중요**: 백엔드와 프론트엔드를 **동시에** 실행해야 정상적으로 작동합니다.
> - 백엔드: `http://localhost:3000`
> - 프론트엔드: `http://localhost:5173`

## 📖 API 명세서

API 명세서는 다음 링크에서 확인할 수 있습니다:
👉 [API 명세서 보러가기](https://aluminum-maraca-e22.notion.site/2afca9a8ba9e8028a80cc3d9e3b1b366?v=2afca9a8ba9e806ea154000ca347d76b&source=copy_link)

### 1. Thunder Client (VS Code 확장 프로그램)
- VS Code 내에서 바로 API 테스트 가능

### 2. curl 명령어
```bash
# GET 요청 예시
curl http://localhost:3000/api/studies

# POST 요청 예시
curl -X POST http://localhost:3000/api/studies \
  -H "Content-Type: application/json" \
  -d '{"title":"알고리즘 스터디","description":"매주 화요일 저녁 7시"}'
```

## 💡 개발 팁

### 1. 단계별로 진행하세요
1. 먼저 서버가 정상적으로 실행되는지 확인
2. 간단한 GET 요청부터 구현
3. POST, PUT, DELETE 순서로 구현
4. 에러 처리 추가

### 2. 자주 테스트하세요
- 기능 하나를 구현할 때마다 Postman으로 테스트
- 예상한 결과와 실제 결과를 비교

### 3. 콘솔 로그를 활용하세요
```javascript
console.log('받은 데이터:', req.body);
```

### 4. 에러 메시지를 잘 읽으세요
- 에러 메시지는 문제를 해결하는 힌트입니다
- 에러가 발생한 파일과 줄 번호를 확인하세요

## 📝 구현 체크리스트

- [ ] 프로젝트 초기 설정 완료
- [ ] 서버 실행 확인
- [ ] 스터디 목록 조회 API 구현
- [ ] 스터디 상세 조회 API 구현
- [ ] 스터디 작성 API 구현
- [ ] 스터디 수정 API 구현
- [ ] 스터디 삭제 API 구현
- [ ] 에러 처리 추가
- [ ] 모든 API 테스트 완료

## 🔍 자주 발생하는 문제 해결

### 1. `Cannot find module 'express'`
```bash
npm install express
```

### 2. 포트가 이미 사용 중인 경우
- 다른 프로그램이 3000번 포트를 사용 중일 수 있습니다
- `server.js`에서 포트 번호를 변경하세요 (예: 3001, 3002)

### 3. 서버 재시작
- 코드를 수정한 후에는 서버를 재시작해야 합니다
- `Ctrl + C`로 서버를 종료하고 다시 `node src/server.js`로 실행

### 4. nodemon 사용 (선택사항)
코드 수정 시 자동으로 서버를 재시작하려면:
```bash
npm install -D nodemon
```

`package.json`에 스크립트 추가:
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

실행:
```bash
npm run dev
```

## 📚 참고 자료

- [Express 공식 문서](https://expressjs.com/ko/)
- [MDN Web Docs - HTTP](https://developer.mozilla.org/ko/docs/Web/HTTP)
- [REST API 디자인 가이드](https://developer.mozilla.org/ko/docs/Glossary/REST)
- [Node.js 시작하기 가이드](https://shimdh.tistory.com/340)

궁금한 점이 있다면 주저하지 말고 질문하세요.

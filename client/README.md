# 스터디 모집 게시판 - 프론트엔드

React + TypeScript + Vite로 구축된 스터디 모집 게시판 프론트엔드입니다.

## 주요 기능

- 🔐 **인증 시스템**: JWT 기반 로그인/회원가입
- 📋 **스터디 관리**: 스터디 생성, 수정, 삭제
- 🔍 **검색 및 필터링**: 카테고리, 지역, 키워드로 스터디 검색
- 👥 **지원 시스템**: 스터디 지원 및 지원자 관리
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 기술 스택

- **React 18**: 최신 React 기능 사용
- **TypeScript**: 타입 안정성
- **Vite**: 빠른 개발 및 빌드
- **React Router v6**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트
- **Context API**: 전역 상태 관리

## 프로젝트 구조

```
client/
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/          # React Context
│   │   └── AuthContext.tsx
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── StudyListPage.tsx
│   │   ├── StudyDetailPage.tsx
│   │   ├── StudyFormPage.tsx
│   │   ├── MyPage.tsx
│   │   └── ApplicantsPage.tsx
│   ├── services/         # API 서비스
│   │   └── api.ts
│   ├── styles/           # CSS 파일
│   │   ├── Navbar.css
│   │   ├── AuthPages.css
│   │   ├── StudyPages.css
│   │   ├── MyPage.css
│   │   └── ApplicantsPage.css
│   ├── types/            # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx           # 메인 App 컴포넌트
│   ├── App.css
│   ├── main.tsx          # 진입점
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 4. 프로덕션 미리보기

```bash
npm run preview
```

## API 설정

API 기본 URL은 `src/services/api.ts` 파일에서 설정됩니다.

```typescript
const BASE_URL = 'http://localhost:3000';
```

백엔드 서버 주소가 다른 경우 이 값을 수정하세요.

## 주요 페이지

- `/` - 스터디 목록 (메인 페이지)
- `/login` - 로그인
- `/register` - 회원가입
- `/studies/:id` - 스터디 상세
- `/studies/new` - 스터디 만들기 (인증 필요)
- `/studies/:id/edit` - 스터디 수정 (인증 필요)
- `/studies/:id/applicants` - 지원자 관리 (리더 전용)
- `/mypage` - 마이페이지 (인증 필요)

## 인증 시스템

- JWT 토큰은 localStorage에 저장됩니다
- Axios 인터셉터를 통해 자동으로 Authorization 헤더에 토큰 추가
- 401 응답 시 자동으로 로그아웃 처리

## 스타일링

- CSS Modules 대신 일반 CSS 사용
- 반응형 디자인 (모바일 우선)
- 깔끔하고 현대적인 UI/UX

## 개발 팁

1. **Vite의 Hot Module Replacement(HMR)**: 코드 변경 시 자동으로 브라우저가 갱신됩니다.
2. **TypeScript 타입 체크**: IDE에서 실시간 타입 체크가 가능합니다.
3. **React DevTools**: 크롬 확장 프로그램으로 컴포넌트 상태를 디버깅할 수 있습니다.

## 문제 해결

### 포트 충돌

다른 애플리케이션이 5173 포트를 사용 중이면 Vite가 자동으로 다른 포트를 선택합니다.

### CORS 에러

백엔드 서버에서 CORS를 허용해야 합니다. Express의 경우:

```javascript
app.use(cors());
```

### API 연결 실패

1. 백엔드 서버가 실행 중인지 확인
2. API BASE_URL이 올바른지 확인
3. 네트워크 탭에서 요청/응답 확인

## 라이선스

MIT

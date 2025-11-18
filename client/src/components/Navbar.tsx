import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          스터디 모집
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            스터디 목록
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/studies/new" className="navbar-link">
                스터디 만들기
              </Link>
              <Link to="/mypage" className="navbar-link">
                마이페이지
              </Link>
              <div className="navbar-user">
                <span className="user-name">{user?.name}님</span>
                <button onClick={logout} className="btn btn-sm btn-outline">
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                로그인
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


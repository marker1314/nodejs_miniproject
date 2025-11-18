import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudyListPage from './pages/StudyListPage';
import StudyDetailPage from './pages/StudyDetailPage';
import StudyFormPage from './pages/StudyFormPage';
import MyPage from './pages/MyPage';
import ApplicantsPage from './pages/ApplicantsPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<StudyListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/studies/:id" element={<StudyDetailPage />} />
              
              <Route
                path="/studies/new"
                element={
                  <ProtectedRoute>
                    <StudyFormPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/studies/:id/edit"
                element={
                  <ProtectedRoute>
                    <StudyFormPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/studies/:id/applicants"
                element={
                  <ProtectedRoute>
                    <ApplicantsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/mypage"
                element={
                  <ProtectedRoute>
                    <MyPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { StudyDetailResponse } from '../types';
import '../styles/StudyPages.css';

const StudyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [study, setStudy] = useState<StudyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applying, setApplying] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchStudy = async () => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const data = await studyAPI.getStudyById(Number(id));
      setStudy(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '스터디 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudy();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('정말로 이 스터디를 삭제하시겠습니까?')) return;

    try {
      await studyAPI.deleteStudy(Number(id));
      alert('스터디가 삭제되었습니다.');
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || '스터디 삭제에 실패했습니다.');
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setApplying(true);

    try {
      await studyAPI.applyToStudy(Number(id), { message: applyMessage });
      alert('스터디 지원이 완료되었습니다!');
      setShowApplyForm(false);
      setApplyMessage('');
      fetchStudy();
    } catch (err: any) {
      alert(err.response?.data?.message || '스터디 지원에 실패했습니다.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!study) return <div className="error-message">스터디를 찾을 수 없습니다.</div>;

  const isLeader = user?.id === study.leader?.id;
  const isDeadlinePassed = new Date(study.deadline) < new Date();

  return (
    <div className="study-detail-container">
      <div className="study-detail-header">
        <div className="breadcrumb">
          <Link to="/">스터디 목록</Link> &gt; 상세
        </div>
        {isLeader && (
          <div className="study-actions">
            <Link to={`/studies/${id}/edit`} className="btn btn-secondary">
              수정
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="study-detail-card">
        <div className="study-tags">
          <span className="tag tag-category">{study.category}</span>
          <span className="tag tag-region">{study.region}</span>
        </div>

        <h1 className="study-detail-title">{study.title}</h1>

        <div className="study-meta">
          <div className="meta-item">
            <strong>리더:</strong> {study.leader?.name}
          </div>
          <div className="meta-item">
            <strong>모집 인원:</strong> {study.membersCount || 0} / {study.maxMembers}명
          </div>
          <div className="meta-item">
            <strong>마감일:</strong> {new Date(study.deadline).toLocaleDateString()}
            {isDeadlinePassed && <span className="deadline-passed"> (마감됨)</span>}
          </div>
        </div>

        <div className="study-description">
          <h2>스터디 소개</h2>
          <p>{study.description}</p>
        </div>

        {isLeader && study.applicants && study.applicants.length > 0 && (
          <div className="applicants-section">
            <h2>지원자 목록</h2>
            <Link to={`/studies/${id}/applicants`} className="btn btn-primary">
              지원자 관리 ({study.applicants.length}명)
            </Link>
          </div>
        )}

        {!isLeader && isAuthenticated && !isDeadlinePassed && (
          <div className="apply-section">
            {!showApplyForm ? (
              <button
                onClick={() => setShowApplyForm(true)}
                className="btn btn-primary btn-large"
              >
                스터디 지원하기
              </button>
            ) : (
              <form onSubmit={handleApply} className="apply-form">
                <h3>지원 메시지</h3>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="지원 동기를 작성해주세요"
                  rows={5}
                  required
                />
                <div className="apply-actions">
                  <button type="submit" className="btn btn-primary" disabled={applying}>
                    {applying ? '지원 중...' : '지원하기'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="btn btn-outline"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>스터디에 지원하려면 로그인이 필요합니다.</p>
            <Link to="/login" className="btn btn-primary">
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyDetailPage;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mypageAPI } from '../services/api';
import type { Study } from '../types';
import '../styles/MyPage.css';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<'my-studies' | 'applied'>('my-studies');
  const [myStudies, setMyStudies] = useState<Study[]>([]);
  const [appliedStudies, setAppliedStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'my-studies') {
        const data = await mypageAPI.getMyStudies();
        setMyStudies(data);
      } else {
        const data = await mypageAPI.getMyAppliedStudies();
        setAppliedStudies(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStudyCard = (study: Study) => (
    <Link to={`/studies/${study.id}`} key={study.id} className="study-card">
      <div className="study-card-header">
        <span className="study-category">{study.category}</span>
        <span className="study-region">{study.region}</span>
      </div>
      <h3 className="study-title">{study.title}</h3>
      <p className="study-description">{study.description}</p>
      <div className="study-info">
        <span className="study-members">
          {study.membersCount || 0} / {study.maxMembers}명
        </span>
        <span className="study-deadline">
          마감: {new Date(study.deadline).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'my-studies' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-studies')}
        >
          내가 만든 스터디
        </button>
        <button
          className={`tab ${activeTab === 'applied' ? 'active' : ''}`}
          onClick={() => setActiveTab('applied')}
        >
          신청한 스터디
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : activeTab === 'my-studies' ? (
          <>
            {myStudies.length === 0 ? (
              <div className="no-data">
                <p>아직 만든 스터디가 없습니다.</p>
                <Link to="/studies/new" className="btn btn-primary">
                  스터디 만들기
                </Link>
              </div>
            ) : (
              <div className="studies-grid">{myStudies.map(renderStudyCard)}</div>
            )}
          </>
        ) : (
          <>
            {appliedStudies.length === 0 ? (
              <div className="no-data">
                <p>신청한 스터디가 없습니다.</p>
                <Link to="/" className="btn btn-primary">
                  스터디 둘러보기
                </Link>
              </div>
            ) : (
              <div className="studies-grid">{appliedStudies.map(renderStudyCard)}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPage;


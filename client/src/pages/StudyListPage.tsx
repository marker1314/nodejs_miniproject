import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studyAPI } from '../services/api';
import type { Study, StudyQueryParams } from '../types';
import '../styles/StudyPages.css';

const StudyListPage = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  // Filter states
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchStudies = async () => {
    setLoading(true);
    setError('');

    try {
      const params: StudyQueryParams = {
        page,
        limit,
      };

      if (category) params.category = category;
      if (region) params.region = region;
      if (keyword) params.keyword = keyword;

      const response = await studyAPI.getStudies(params);
      setStudies(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || '스터디 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, [page, category, region]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudies();
  };

  const handleReset = () => {
    setCategory('');
    setRegion('');
    setKeyword('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="study-list-container">
      <div className="study-list-header">
        <h1>스터디 모집 게시판</h1>
        <Link to="/studies/new" className="btn btn-primary">
          스터디 만들기
        </Link>
      </div>

      <div className="filter-section">
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">모든 카테고리</option>
              <option value="프로그래밍">프로그래밍</option>
              <option value="알고리즘">알고리즘</option>
              <option value="웹개발">웹개발</option>
              <option value="모바일">모바일</option>
              <option value="데이터">데이터</option>
              <option value="AI">AI</option>
              <option value="기타">기타</option>
            </select>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="filter-select"
            >
              <option value="">모든 지역</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="대전">대전</option>
              <option value="광주">광주</option>
              <option value="울산">울산</option>
              <option value="온라인">온라인</option>
              <option value="기타">기타</option>
            </select>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="filter-input"
            />

            <button type="submit" className="btn btn-secondary">
              검색
            </button>
            <button type="button" onClick={handleReset} className="btn btn-outline">
              초기화
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : studies.length === 0 ? (
        <div className="no-studies">등록된 스터디가 없습니다.</div>
      ) : (
        <>
          <div className="studies-grid">
            {studies.map((study) => (
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
                {study.leader && (
                  <div className="study-leader">리더: {study.leader.name}</div>
                )}
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn btn-outline"
              >
                이전
              </button>
              <span className="page-info">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn btn-outline"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudyListPage;


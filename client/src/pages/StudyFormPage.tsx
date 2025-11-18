import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studyAPI } from '../services/api';
import type { CreateStudyRequest } from '../types';
import '../styles/StudyPages.css';

const StudyFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateStudyRequest>({
    title: '',
    description: '',
    category: '',
    region: '',
    maxMembers: 5,
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && id) {
      fetchStudy();
    }
  }, [id, isEditMode]);

  const fetchStudy = async () => {
    if (!id) return;

    try {
      const study = await studyAPI.getStudyById(Number(id));
      setFormData({
        title: study.title,
        description: study.description,
        category: study.category,
        region: study.region,
        maxMembers: study.maxMembers,
        deadline: study.deadline.split('T')[0], // Convert to YYYY-MM-DD format
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '스터디 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxMembers' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode && id) {
        // Update study
        await studyAPI.updateStudy(Number(id), {
          title: formData.title,
          description: formData.description,
          maxMembers: formData.maxMembers,
        });
        alert('스터디가 수정되었습니다!');
        navigate(`/studies/${id}`);
      } else {
        // Create new study
        const newStudy = await studyAPI.createStudy(formData);
        alert('스터디가 생성되었습니다!');
        navigate(`/studies/${newStudy.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '스터디 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="study-form-container">
      <div className="study-form-card">
        <h1>{isEditMode ? '스터디 수정' : '스터디 만들기'}</h1>

        <form onSubmit={handleSubmit} className="study-form">
          <div className="form-group">
            <label htmlFor="title">스터디 제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="스터디 제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">스터디 설명 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              placeholder="스터디에 대한 자세한 설명을 입력하세요"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">카테고리 *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isEditMode}
              >
                <option value="">선택하세요</option>
                <option value="프로그래밍">프로그래밍</option>
                <option value="알고리즘">알고리즘</option>
                <option value="웹개발">웹개발</option>
                <option value="모바일">모바일</option>
                <option value="데이터">데이터</option>
                <option value="AI">AI</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="region">지역 *</label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                disabled={isEditMode}
              >
                <option value="">선택하세요</option>
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
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxMembers">최대 인원 *</label>
              <input
                type="number"
                id="maxMembers"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                required
                min="2"
                max="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">마감일 *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                disabled={isEditMode}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '저장 중...' : isEditMode ? '수정하기' : '생성하기'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyFormPage;


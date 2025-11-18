import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyAPI } from '../services/api';
import type { Application } from '../types';
import '../styles/ApplicantsPage.css';

const ApplicantsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const response = await studyAPI.getApplicants(Number(id));
      setApplicants(response.applicants);
    } catch (err: any) {
      setError(err.response?.data?.message || '지원자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applyId: number) => {
    if (!id || !window.confirm('이 지원자를 승인하시겠습니까?')) return;

    setProcessingId(applyId);

    try {
      await studyAPI.approveApplicant(Number(id), applyId);
      alert('지원자가 승인되었습니다.');
      fetchApplicants();
    } catch (err: any) {
      alert(err.response?.data?.message || '승인에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applyId: number) => {
    if (!id || !window.confirm('이 지원자를 거절하시겠습니까?')) return;

    setProcessingId(applyId);

    try {
      await studyAPI.rejectApplicant(Number(id), applyId);
      alert('지원자가 거절되었습니다.');
      fetchApplicants();
    } catch (err: any) {
      alert(err.response?.data?.message || '거절에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기 중';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거절됨';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="applicants-container">
      <div className="applicants-header">
        <h1>지원자 관리</h1>
        <button onClick={() => navigate(`/studies/${id}`)} className="btn btn-outline">
          돌아가기
        </button>
      </div>

      {applicants.length === 0 ? (
        <div className="no-applicants">아직 지원자가 없습니다.</div>
      ) : (
        <div className="applicants-list">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="applicant-card">
              <div className="applicant-header">
                <div className="applicant-info">
                  <h3>{applicant.user?.name}</h3>
                  <span className={`status ${getStatusClass(applicant.status)}`}>
                    {getStatusText(applicant.status)}
                  </span>
                </div>
              </div>

              <div className="applicant-message">
                <strong>지원 메시지:</strong>
                <p>{applicant.message}</p>
              </div>

              {applicant.status === 'pending' && (
                <div className="applicant-actions">
                  <button
                    onClick={() => handleApprove(applicant.id)}
                    disabled={processingId === applicant.id}
                    className="btn btn-success"
                  >
                    {processingId === applicant.id ? '처리 중...' : '승인'}
                  </button>
                  <button
                    onClick={() => handleReject(applicant.id)}
                    disabled={processingId === applicant.id}
                    className="btn btn-danger"
                  >
                    {processingId === applicant.id ? '처리 중...' : '거절'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;


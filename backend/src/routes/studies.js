const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const { authenticate } = require('../controllers/authController');

// GET /studies - 스터디 목록 조회
router.get('/', studyController.getStudies);

// GET /studies/:id - 스터디 상세 조회
router.get('/:id', studyController.getStudyById);

// POST /studies - 스터디 생성 (인증 필요)
router.post('/', authenticate, studyController.createStudy);

// PATCH /studies/:id - 스터디 수정 (인증 필요, 리더만)
router.patch('/:id', authenticate, studyController.updateStudy);

// DELETE /studies/:id - 스터디 삭제 (인증 필요, 리더만)
router.delete('/:id', authenticate, studyController.deleteStudy);

// POST /studies/:id/apply - 스터디 지원 (인증 필요)
router.post('/:id/apply', authenticate, studyController.applyToStudy);

// GET /studies/:id/applicants - 지원자 목록 조회 (인증 필요, 리더만)
router.get('/:id/applicants', authenticate, studyController.getApplicants);

// PATCH /studies/:id/applicants/:applyId/approve - 지원 승인 (인증 필요, 리더만)
router.patch('/:id/applicants/:applyId/approve', authenticate, studyController.approveApplicant);

// PATCH /studies/:id/applicants/:applyId/reject - 지원 거절 (인증 필요, 리더만)
router.patch('/:id/applicants/:applyId/reject', authenticate, studyController.rejectApplicant);

module.exports = router;

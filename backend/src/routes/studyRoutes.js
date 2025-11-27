// backend/src/routes/studyRoutes.js
const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');

// /api/studies
router.get('/', studyController.getStudies);             // 목록
router.get('/:studyId', studyController.getStudyById);   // 상세
router.post('/', studyController.createStudy);           // 작성
router.put('/:studyId', studyController.updateStudy);    // 수정
router.delete('/:studyId', studyController.deleteStudy); // 삭제

module.exports = router;

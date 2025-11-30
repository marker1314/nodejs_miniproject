const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const { authenticate } = require('../controllers/authController');

router.get('/', studyController.getStudies);
router.get('/:studyId', studyController.getStudyById);

router.post('/', authenticate, studyController.createStudy);
router.patch('/:studyId', authenticate, studyController.updateStudy);
router.delete('/:studyId', authenticate, studyController.deleteStudy);

router.post('/:studyId/apply', authenticate, studyController.applyStudy);
router.get('/:studyId/applicants', authenticate, studyController.getApplicants);
router.patch('/:studyId/applicants/:applyId/approve', authenticate, studyController.approveApplication);
router.patch('/:studyId/applicants/:applyId/reject', authenticate, studyController.rejectApplication);

module.exports = router;
const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const { authenticate } = require('../controllers/authController');

router.get('/studies', authenticate, studyController.getMyStudies);
router.get('/applied', authenticate, studyController.getMyAppliedStudies);

module.exports = router;
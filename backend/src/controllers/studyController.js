const { users } = require('./authController');

// 데이터 저장소 (임시)
let studies = [];
let applications = [];
let nextStudyId = 1;
let nextAppId = 1;

// 1. 스터디 목록 조회
exports.getStudies = (req, res) => {
    const sortedStudies = [...studies].sort((a, b) => b.id - a.id);
    res.status(200).json({
        data: sortedStudies,
        total: sortedStudies.length
    });
};

// 2. 스터디 상세 조회
exports.getStudyById = (req, res) => {
    const studyId = parseInt(req.params.studyId);
    const study = studies.find(s => s.id === studyId);

    if (!study) return res.status(404).json({ message: '스터디 없음' });

    const leader = users.find(u => u.id === study.leaderId);

    res.status(200).json({
        ...study,
        leader: leader ? { id: leader.id, name: leader.name } : null
    });
};

// 3. 스터디 생성
exports.createStudy = (req, res) => {
    const { title, description, category, region, maxMembers, deadline } = req.body;

    if (!title || !description || !category || !region || !maxMembers || !deadline) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    const newStudy = {
        id: nextStudyId++,
        title,
        description,
        category,
        region,
        maxMembers: parseInt(maxMembers),
        deadline,
        leaderId: req.user.id,
        createdAt: new Date().toISOString()
    };

    studies.push(newStudy);
    res.status(201).json(newStudy);
};

// 4. 스터디 수정
exports.updateStudy = (req, res) => {
    const studyId = parseInt(req.params.studyId);
    const study = studies.find(s => s.id === studyId);

    if (!study) return res.status(404).json({ message: '스터디 없음' });
    if (study.leaderId !== req.user.id) return res.status(403).json({ message: '권한 없음' });

    const { title, description, maxMembers } = req.body;
    if (title) study.title = title;
    if (description) study.description = description;
    if (maxMembers) study.maxMembers = parseInt(maxMembers);

    res.status(200).json(study);
};

// 5. 스터디 삭제
exports.deleteStudy = (req, res) => {
    const studyId = parseInt(req.params.studyId);
    const index = studies.findIndex(s => s.id === studyId);

    if (index === -1) return res.status(404).json({ message: '스터디 없음' });
    if (studies[index].leaderId !== req.user.id) return res.status(403).json({ message: '권한 없음' });

    studies.splice(index, 1);
    res.status(204).send();
};

// 6. 스터디 지원하기
exports.applyStudy = (req, res) => {
    const studyId = parseInt(req.params.studyId);
    const { message } = req.body;
    const userId = req.user.id;

    const study = studies.find(s => s.id === studyId);
    if (!study) return res.status(404).json({ message: '스터디 없음' });

    const exists = applications.find(a => a.studyId === studyId && a.userId === userId);
    if (exists) return res.status(409).json({ message: '이미 지원했습니다.' });

    const newApp = {
        id: nextAppId++,
        studyId,
        userId,
        message,
        status: 'pending'
    };
    applications.push(newApp);
    res.status(201).json(newApp);
};

// 7. 지원 승인
exports.approveApplication = (req, res) => {
    const studyId = parseInt(req.params.studyId);
    const applyId = parseInt(req.params.applyId);

    const app = applications.find(a => a.id === applyId);
    if (!app) return res.status(404).json({ message: '지원 내역 없음' });

    const study = studies.find(s => s.id === studyId);
    if (study.leaderId !== req.user.id) return res.status(403).json({ message: '권한 없음' });

    app.status = 'approved';
    res.status(204).send();
};

// 8. 지원 거절
exports.rejectApplication = (req, res) => {
    const studyId = parseInt(req.params.studyId);
    const applyId = parseInt(req.params.applyId);

    const app = applications.find(a => a.id === applyId);
    if (!app) return res.status(404).json({ message: '지원 내역 없음' });

    const study = studies.find(s => s.id === studyId);
    if (study.leaderId !== req.user.id) return res.status(403).json({ message: '권한 없음' });

    app.status = 'rejected';
    res.status(204).send();
};

// 9. 지원자 목록 조회
exports.getApplicants = (req, res) => {
    const studyId = parseInt(req.params.studyId);
    
    const study = studies.find(s => s.id === studyId);
    if (!study) return res.status(404).json({ message: '스터디 없음' });
    if (study.leaderId !== req.user.id) return res.status(403).json({ message: '권한 없음' });

    const studyApps = applications.filter(a => a.studyId === studyId);

    const result = studyApps.map(app => {
        const user = users.find(u => u.id === app.userId);
        return {
            id: app.id,
            user: user ? { id: user.id, name: user.name } : null,
            status: app.status,
            message: app.message
        };
    });

    res.status(200).json({ applicants: result });
};

// 10. 마이페이지 - 내가 만든 스터디
exports.getMyStudies = (req, res) => {
    const userId = req.user.id;
    const myStudies = studies.filter(s => s.leaderId === userId);

    const result = myStudies.map(s => {
        const approvedCount = applications.filter(a => a.studyId === s.id && a.status === 'approved').length;
        return {
            id: s.id,
            title: s.title,
            maxMembers: s.maxMembers,
            membersCount: approvedCount + 1,
            deadline: s.deadline
        };
    });

    res.status(200).json(result);
};

// 11. 마이페이지 - 내가 신청한 스터디
exports.getMyAppliedStudies = (req, res) => {
    const userId = req.user.id;
    const myApps = applications.filter(a => a.userId === userId);

    const result = myApps.map(app => ({
        id: app.id,
        studyId: app.studyId,
        status: app.status
    }));

    res.status(200).json(result);
};
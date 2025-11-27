const { users } = require('./authController');

// 메모리 내 데이터 저장소
const studies = [];
const applications = [];
let nextStudyId = 1;
let nextApplicationId = 1;

// 스터디 목록 조회
exports.getStudies = (req, res) => {
  try {
    const { category, region, keyword, page = 1, limit = 10 } = req.query;
    
    let filteredStudies = [...studies];

    // 카테고리 필터
    if (category) {
      filteredStudies = filteredStudies.filter(s => s.category === category);
    }

    // 지역 필터
    if (region) {
      filteredStudies = filteredStudies.filter(s => s.region === region);
    }

    // 키워드 검색
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredStudies = filteredStudies.filter(s => 
        s.title.toLowerCase().includes(lowerKeyword) ||
        s.description.toLowerCase().includes(lowerKeyword)
      );
    }

    // 페이지네이션
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedStudies = filteredStudies.slice(startIndex, endIndex);

    // 리더 정보 및 멤버 수 추가
    const studiesWithLeader = paginatedStudies.map(study => {
      const leader = users.find(u => u.id === study.leaderId);
      const studyApplications = applications.filter(a => a.studyId === study.id);
      const approvedCount = studyApplications.filter(a => a.status === 'approved').length;
      
      return {
        ...study,
        leader: leader ? { id: leader.id, name: leader.name } : null,
        membersCount: approvedCount + 1,
      };
    });

    res.json({
      data: studiesWithLeader,
      total: filteredStudies.length,
    });
  } catch (error) {
    console.error('Get studies error:', error);
    res.status(500).json({ message: '스터디 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 스터디 상세 조회
exports.getStudyById = (req, res) => {
  try {
    const studyId = parseInt(req.params.id);
    const study = studies.find(s => s.id === studyId);

    if (!study) {
      return res.status(404).json({ message: '스터디를 찾을 수 없습니다.' });
    }

    const leader = users.find(u => u.id === study.leaderId);
    const studyApplications = applications.filter(a => a.studyId === studyId);
    const approvedCount = studyApplications.filter(a => a.status === 'approved').length;

    const applicantsWithUser = studyApplications.map(app => {
      const user = users.find(u => u.id === app.userId);
      return {
        ...app,
        user: user ? { id: user.id, name: user.name } : null,
      };
    });

    res.json({
      ...study,
      leader: leader ? { id: leader.id, name: leader.name } : null,
      membersCount: approvedCount + 1,
      applicants: applicantsWithUser,
    });
  } catch (error) {
    console.error('Get study error:', error);
    res.status(500).json({ message: '스터디 조회 중 오류가 발생했습니다.' });
  }
};

// 스터디 생성
exports.createStudy = (req, res) => {
  try {
    const { title, description, category, region, maxMembers, deadline } = req.body;

    if (!title || !description || !category || !region || !maxMembers || !deadline) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    if (maxMembers < 2 || maxMembers > 100) {
      return res.status(400).json({ message: '최대 인원은 2명 이상 100명 이하여야 합니다.' });
    }

    const newStudy = {
      id: nextStudyId++,
      title,
      description,
      category,
      region,
      maxMembers,
      deadline,
      leaderId: req.user.id,
      createdAt: new Date(),
    };

    studies.push(newStudy);
    res.status(201).json(newStudy);
  } catch (error) {
    console.error('Create study error:', error);
    res.status(500).json({ message: '스터디 생성 중 오류가 발생했습니다.' });
  }
};

// 스터디 수정
exports.updateStudy = (req, res) => {
  try {
    const studyId = parseInt(req.params.id);
    const study = studies.find(s => s.id === studyId);

    if (!study) {
      return res.status(404).json({ message: '스터디를 찾을 수 없습니다.' });
    }

    if (study.leaderId !== req.user.id) {
      return res.status(403).json({ message: '스터디를 수정할 권한이 없습니다.' });
    }

    const { title, description, maxMembers } = req.body;

    if (title) study.title = title;
    if (description) study.description = description;
    if (maxMembers) {
      if (maxMembers < 2 || maxMembers > 100) {
        return res.status(400).json({ message: '최대 인원은 2명 이상 100명 이하여야 합니다.' });
      }
      study.maxMembers = maxMembers;
    }

    study.updatedAt = new Date();
    res.json({ message: '스터디가 수정되었습니다.' });
  } catch (error) {
    console.error('Update study error:', error);
    res.status(500).json({ message: '스터디 수정 중 오류가 발생했습니다.' });
  }
};

// 스터디 삭제
exports.deleteStudy = (req, res) => {
  try {
    const studyId = parseInt(req.params.id);
    const studyIndex = studies.findIndex(s => s.id === studyId);

    if (studyIndex === -1) {
      return res.status(404).json({ message: '스터디를 찾을 수 없습니다.' });
    }

    if (studies[studyIndex].leaderId !== req.user.id) {
      return res.status(403).json({ message: '스터디를 삭제할 권한이 없습니다.' });
    }

    studies.splice(studyIndex, 1);

    for (let i = applications.length - 1; i >= 0; i--) {
      if (applications[i].studyId === studyId) {
        applications.splice(i, 1);
      }
    }

    res.json({ message: '스터디가 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete study error:', error);
    res.status(500).json({ message: '스터디 삭제 중 오류가 발생했습니다.' });
  }
};

// 스터디 지원
exports.applyToStudy = (req, res) => {
  try {
    const studyId = parseInt(req.params.id);
    const { message } = req.body;

    const study = studies.find(s => s.id === studyId);
    if (!study) {
      return res.status(404).json({ message: '스터디를 찾을 수 없습니다.' });
    }

    if (study.leaderId === req.user.id) {
      return res.status(400).json({ message: '자신이 만든 스터디에는 지원할 수 없습니다.' });
    }

    const existingApplication = applications.find(
      a => a.studyId === studyId && a.userId === req.user.id
    );
    if (existingApplication) {
      return res.status(400).json({ message: '이미 지원한 스터디입니다.' });
    }

    if (new Date(study.deadline) < new Date()) {
      return res.status(400).json({ message: '마감된 스터디입니다.' });
    }

    const newApplication = {
      id: nextApplicationId++,
      studyId,
      userId: req.user.id,
      message: message || '',
      status: 'pending',
      createdAt: new Date(),
    };

    applications.push(newApplication);
    res.status(201).json(newApplication);
  } catch (error) {
    console.error('Apply to study error:', error);
    res.status(500).json({ message: '스터디 지원 중 오류가 발생했습니다.' });
  }
};

// 지원자 목록 조회
exports.getApplicants = (req, res) => {
  try {
    const studyId = parseInt(req.params.id);
    const study = studies.find(s => s.id === studyId);

    if (!study) {
      return res.status(404).json({ message: '스터디를 찾을 수 없습니다.' });
    }

    if (study.leaderId !== req.user.id) {
      return res.status(403).json({ message: '지원자를 조회할 권한이 없습니다.' });
    }

    const studyApplications = applications.filter(a => a.studyId === studyId);

    const applicantsWithUser = studyApplications.map(app => {
      const user = users.find(u => u.id === app.userId);
      return {
        ...app,
        user: user ? { id: user.id, name: user.name } : null,
      };
    });

    res.json({ applicants: applicantsWithUser });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ message: '지원자 조회 중 오류가 발생했습니다.' });
  }
};

// 지원 승인
exports.approveApplicant = (req, res) => {
  try {
    const studyId = parseInt(req.params.id);
    const applyId = parseInt(req.params.applyId);

    const study = studies.find(s => s.id === studyId);
    if (!study) {
      return res.status(404).json({ message: '스터디를 찾을 수 없습니다.' });
    }

    if (study.leaderId !== req.user.id) {
      return res.status(403).json({ message: '지원을 승인할 권한이 없습니다.' });
    }

    const application = applications.find(a => a.id === applyId && a.studyId === studyId);
    if (!application) {
      return res.status(404).json({ message: '지원을 찾을 수 없습니다.' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: '이미 처리된 지원입니다.' });
    }

    const approvedCount = applications.filter(
      a => a.studyId === studyId && a.status === 'approved'
    ).length;

    if (approvedCount + 1 >= study.maxMembers) {
      return res.status(400).json({ message: '최대 인원이 초과되었습니다.' });
    }

    application.status = 'approved';
    application.updatedAt = new Date();

    res.json({ message: '지원이 승인되었습니다.' });
  } catch (error) {
    console.error('Approve applicant error:', error);
    res.status(500).json({ message: '지원 승인 중 오류가 발생했습니다.' });
  }
};

// 지원 거절
exports.rejectApplicant = (req, res) => {
  try {
    const studyId = parseInt(req.params.id);
    const applyId = parseInt(req.params.applyId);

    const study = studies.find(s => s.id === studyId);
    if (!study) {
      return res.status(404).json({ message: '스터디를 찾을 수 없습니다.' });
    }

    if (study.leaderId !== req.user.id) {
      return res.status(403).json({ message: '지원을 거절할 권한이 없습니다.' });
    }

    const application = applications.find(a => a.id === applyId && a.studyId === studyId);
    if (!application) {
      return res.status(404).json({ message: '지원을 찾을 수 없습니다.' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: '이미 처리된 지원입니다.' });
    }

    application.status = 'rejected';
    application.updatedAt = new Date();

    res.json({ message: '지원이 거절되었습니다.' });
  } catch (error) {
    console.error('Reject applicant error:', error);
    res.status(500).json({ message: '지원 거절 중 오류가 발생했습니다.' });
  }
};

// 내가 만든 스터디 조회
exports.getMyStudies = (req, res) => {
  try {
    const myStudies = studies.filter(s => s.leaderId === req.user.id);

    const studiesWithInfo = myStudies.map(study => {
      const leader = users.find(u => u.id === study.leaderId);
      const studyApplications = applications.filter(a => a.studyId === study.id);
      const approvedCount = studyApplications.filter(a => a.status === 'approved').length;

      return {
        ...study,
        leader: leader ? { id: leader.id, name: leader.name } : null,
        membersCount: approvedCount + 1,
      };
    });

    res.json(studiesWithInfo);
  } catch (error) {
    console.error('Get my studies error:', error);
    res.status(500).json({ message: '스터디 조회 중 오류가 발생했습니다.' });
  }
};

// 내가 지원한 스터디 조회
exports.getMyAppliedStudies = (req, res) => {
  try {
    const myApplications = applications.filter(a => a.userId === req.user.id);

    const appliedStudies = myApplications.map(app => {
      const study = studies.find(s => s.id === app.studyId);
      if (!study) return null;

      const leader = users.find(u => u.id === study.leaderId);
      const studyApplications = applications.filter(a => a.studyId === study.id);
      const approvedCount = studyApplications.filter(a => a.status === 'approved').length;

      return {
        ...study,
        leader: leader ? { id: leader.id, name: leader.name } : null,
        membersCount: approvedCount + 1,
        applicationStatus: app.status,
      };
    }).filter(study => study !== null);

    res.json(appliedStudies);
  } catch (error) {
    console.error('Get my applied studies error:', error);
    res.status(500).json({ message: '스터디 조회 중 오류가 발생했습니다.' });
  }
};

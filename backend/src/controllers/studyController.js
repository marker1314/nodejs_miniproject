// backend/src/controllers/studyController.js

// 임시 메모리 데이터 (나중에 DB로 바꿀 예정)
let studies = [
  {
    id: 1,
    title: '알고리즘 스터디',
    description: '매주 화요일 저녁 7시, 백준 골드 목표',
    category: 'Algorithm',
    status: 'OPEN',
    maxMembers: 5,
    currentMembers: 2,
    writerId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'CS 전공 스터디',
    description: '운영체제 / 네트워크 교재 같이 보기',
    category: 'CS',
    status: 'OPEN',
    maxMembers: 6,
    currentMembers: 3,
    writerId: 2,
    createdAt: new Date().toISOString(),
  },
];

// 새 id 만드는 헬퍼 함수
const getNextId = () => {
  if (studies.length === 0) return 1;
  return Math.max(...studies.map((s) => s.id)) + 1;
};

// GET /api/studies  (목록 조회)
exports.getStudies = (req, res) => {
  res.json({ data: studies });
};

// GET /api/studies/:studyId  (상세 조회)
exports.getStudyById = (req, res) => {
  const id = Number(req.params.studyId);
  const study = studies.find((s) => s.id === id);

  if (!study) {
    return res.status(404).json({ message: 'Study not found' });
  }

  res.json(study);
};

// POST /api/studies  (작성)
exports.createStudy = (req, res) => {
  const { title, description, category, maxMembers } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: 'title과 description은 필수입니다.' });
  }

  const newId =
    studies.length === 0 ? 1 : Math.max(...studies.map((s) => s.id)) + 1;

  const newStudy = {
    id: getNextId(),
    title,
    description,
    category: category || null,
    status: 'OPEN',
    maxMembers: maxMembers ?? null,
    currentMembers: 0,
    writerId: 1, // 아직 로그인 없으니까 임시로 1
    createdAt: new Date().toISOString(),
  };

  studies.push(newStudy);
  res.status(201).json(newStudy);
};

// PUT /api/studies/:studyId  (수정)
exports.updateStudy = (req, res) => {
  const id = Number(req.params.studyId);
  const study = studies.find((s) => s.id === id);

  if (!study) {
    return res.status(404).json({ message: 'Study not found' });
  }

  const {
    title,
    description,
    category,
    status,
    maxMembers,
    currentMembers,
  } = req.body;

  // 값이 넘어온 것만 업데이트
  if (title !== undefined) study.title = title;
  if (description !== undefined) study.description = description;
  if (category !== undefined) study.category = category;
  if (status !== undefined) study.status = status;
  if (maxMembers !== undefined) study.maxMembers = maxMembers;
  if (currentMembers !== undefined) study.currentMembers = currentMembers;

  res.json(study);
};

// DELETE /api/studies/:studyId  (삭제)
exports.deleteStudy = (req, res) => {
  const id = Number(req.params.studyId);
  const index = studies.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Study not found' });
  }

  const deleted = studies.splice(index, 1)[0];
  res.json({ message: 'Study deleted', deleted });
};

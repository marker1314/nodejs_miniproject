// backend/src/data/studies.js
let nextId = 3;

const studies = [
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

module.exports = { studies, nextId };

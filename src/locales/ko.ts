export const ko = {
  // 공통
  common: {
    home: '홈',
    schedule: '시간표',
    assignments: '과제',
    login: '로그인',
    register: '회원가입',
    logout: '로그아웃',
    save: '저장',
    cancel: '취소',
    edit: '편집',
    delete: '삭제',
    add: '추가',
    view: '보기',
    search: '검색',
    filter: '필터',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    success: '성공적으로 처리되었습니다',
    theme: '테마',
    actions: '작업',
    and: '및',
  },

  // 네비게이션
  navigation: {
    home: '홈',
    scheduleView: '시간표 보기',
    addCourse: '수업 추가',
    assignmentList: '과제 목록',
    login: '로그인',
    register: '회원가입',
  },

  // Sidebar
  sidebar: {
    schedule: '시간표',
    assignments: '과제',
    courses: '수업',
    friends: '친구',
    settings: '설정',
    scheduleDescription: '시간표 보기',
    assignmentsDescription: '과제 목록',
    coursesDescription: '수업 목록',
    friendsDescription: '친구 목록',
    settingsDescription: '개인정보 및 설정'
  },

  // 메인 페이지
  home: {
    title: '대학생을 위한',
    subtitle: '스마트 스케줄러',
    description: '시간표 관리부터 과제 관리까지, 대학생활을 더욱 체계적이고 효율적으로 만들어보세요. 친구와 과제를 공유하고 함께 성장할 수 있습니다.',
    addFirstCourse: '첫 수업 추가하기',
    viewSchedule: '시간표 보기',
    features: {
      title: '주요 기능',
      subtitle: '스케줄러가 제공하는 핵심 기능들을 확인해보세요',
      schedule: {
        title: '시간표 관리',
        description: '요일별, 시간별로 수업을 체계적으로 관리하세요'
      },
      addCourse: {
        title: '수업 추가',
        description: '새로운 수업을 쉽게 추가하고 편집할 수 있습니다'
      },
      assignments: {
        title: '과제 관리',
        description: '각 수업별로 과제를 등록하고 마감일을 관리하세요'
      },
      sharing: {
        title: '친구와 공유',
        description: '과제를 친구와 공유하여 함께 학습하세요'
      }
    },
    quickActions: {
      title: '빠른 시작',
      subtitle: '지금 바로 시작해보세요',
      addCourse: '수업 추가하기',
      viewSchedule: '시간표 보기',
      checkAssignments: '과제 확인'
    }
  },

  // 인증
  auth: {
    login: {
      title: '로그인',
      subtitle: '계정이 없으신가요?',
      email: '이메일',
      password: '비밀번호',
      rememberMe: '로그인 상태 유지',
      forgotPassword: '비밀번호를 잊으셨나요?',
      loginButton: '로그인',
      or: '또는',
      googleLogin: 'Google로 로그인',
      emailPlaceholder: '이메일을 입력하세요',
      passwordPlaceholder: '비밀번호를 입력하세요'
    },
    register: {
      title: '회원가입',
      subtitle: '이미 계정이 있으신가요?',
      name: '이름',
      studentId: '학번',
      email: '이메일',
      password: '비밀번호',
      confirmPassword: '비밀번호 확인',
      registerButton: '회원가입',
      namePlaceholder: '이름을 입력하세요',
      studentIdPlaceholder: '학번을 입력하세요',
      emailPlaceholder: '이메일을 입력하세요',
      passwordPlaceholder: '비밀번호를 입력하세요',
      confirmPasswordPlaceholder: '비밀번호를 다시 입력하세요',
      terms: '회원가입을 통해 이용약관과 개인정보처리방침에 동의하게 됩니다.',
      termsLink: '이용약관',
      privacyLink: '개인정보처리방침'
    }
  },

  // 시간표
  schedule: {
    view: {
      title: '내 시간표',
      subtitle: '이번 학기 수업 일정을 확인하세요',

      courseList: '수업 목록',
      time: '시간',
      monday: '월',
      tuesday: '화',
      wednesday: '수',
      thursday: '목',
      friday: '금',
      saturday: '토',
      sunday: '일'
    },
    add: {
      title: '새 수업 추가',
      subtitle: '새로운 수업을 시간표에 추가하세요',
      backToSchedule: '시간표로 돌아가기',
      courseName: '수업명',
      courseCode: '과목 코드',
      professor: '교수명',
      dayOfWeek: '요일',
      startTime: '시작 시간',
      endTime: '종료 시간',
      room: '강의실',
      color: '수업 색상',
      preview: '미리보기',
      courseNamePlaceholder: '예: 웹 프로그래밍 기초',
      courseCodePlaceholder: '예: CS101',
      professorPlaceholder: '교수님 성함을 입력하세요',
      roomPlaceholder: '예: 101호, 온라인',
      monday: '월요일',
      tuesday: '화요일',
      wednesday: '수요일',
      thursday: '목요일',
      friday: '금요일',
      saturday: '토요일',
      sunday: '일요일',
      colorDescription: '시간표에서 사용되는 색상'
    }
  },

  // 과제
  assignments: {
    list: {
      title: '과제 관리',
      subtitle: '모든 과제를 한눈에 확인하고 관리하세요',
      addAssignment: '과제 추가',
      searchPlaceholder: '과제명이나 설명으로 검색...',
      allStatus: '전체 상태',
      pending: '진행중',
      completed: '완료',
      allPriority: '전체 우선순위',
      high: '높음',
      medium: '보통',
      low: '낮음',
      addFirstAssignment: '첫 과제 추가하기',
      noResults: '검색 조건에 맞는 과제가 없습니다.',
      noAssignments: '아직 등록된 과제가 없습니다.',
      total: '전체 과제',
      inProgress: '진행중',
      overdue: '기한 지남'
    }
  },

  // 수업 상세
  course: {
    detail: {
      backToSchedule: '시간표로 돌아가기',
      courseInfo: '수업 정보',
      courseColor: '수업 색상',
      colorDescription: '시간표에서 사용되는 색상',
      assignmentList: '과제 목록',
      noAssignments: '아직 등록된 과제가 없습니다.',
      addFirstAssignment: '첫 과제 추가하기'
    }
  },

  // 우선순위
  priority: {
    high: '높음',
    medium: '보통',
    low: '낮음'
  },

  // 마감일
  dueDate: {
    overdue: '지난지 {days}일',
    today: '오늘 마감',
    tomorrow: '내일 마감',
    daysLeft: '{days}일 남음'
  }
};

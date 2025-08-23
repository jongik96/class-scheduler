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
    unknown: '알 수 없음',
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
      addCourseDesc: '새로운 수업을 시간표에 추가하고 관리하세요',
      viewSchedule: '시간표 보기',
      viewScheduleDesc: '현재 시간표를 확인하고 수정하세요',
      checkAssignments: '과제 확인',
      checkAssignmentsDesc: '과제 현황을 확인하고 관리하세요'
    },
    footer: {
      description: '대학생을 위한 스마트한 시간표 및 과제 관리 시스템',
      copyright: '© 2024 Smart Scheduler',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
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
      googleLoginError: 'Google 로그인에 실패했습니다. 다시 시도해주세요.',
      loggingIn: '로그인 중...',
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
    },
    add: {
      title: '새 과제 추가',
      subtitle: '새로운 과제를 추가하세요',
      backToList: '과제 목록으로 돌아가기',
      assignmentTitle: '과제 제목',
      assignmentTitlePlaceholder: '과제 제목을 입력하세요',
      description: '설명',
      descriptionPlaceholder: '과제에 대한 설명을 입력하세요',
      course: '과목',
      coursePlaceholder: '과목을 선택하세요',
      dueDate: '마감일',
      priority: '우선순위',
      status: '상태',
      shareWithFriends: '친구와 공유',
      selectFriends: '공유할 친구를 선택하세요',
      noFriends: '등록된 친구가 없습니다',
      addFirstFriend: '친구를 먼저 추가해보세요',
      loadingFriends: '친구 목록 로딩 중...',
      creating: '과제 생성 중...',
      create: '과제 생성',
      sharingWithFriends: '{count}명의 친구와 과제를 공유합니다'
    },
    detail: {
      backToList: '과제 목록으로 돌아가기',
      subtitle: '과제 상세 정보 및 공유 현황',
      assignmentInfo: '과제 정보',
      assignmentTitle: '과제 제목',
      assignmentDescription: '과제 설명',
      course: '과목',
      dueDate: '마감일',
      priority: '우선순위',
      status: {
        completed: '완료',
        in_progress: '진행중',
        pending: '대기중'
      },
      progress: '진행 상황',
      progressPercent: '전체 진행률',
      noProgress: '아직 진행 상황이 기록되지 않았습니다.',
      sharedFriends: '공유된 친구',
      sharedFriendsCount: '{count}명',
      noSharedFriends: '공유된 친구가 없습니다',
      shareWithFriends: '과제를 친구와 공유해보세요',
      quickActions: '빠른 작업',
      shareAssignment: '친구와 공유하기',
      updateProgress: '진행 상황 업데이트',
      assignmentInfoSidebar: '과제 정보',
      createdDate: '생성일',
      assignmentId: '과제 ID',
      edit: '수정',
      delete: '삭제',
      admin: '관리자',
      editPermission: '편집',
      viewPermission: '보기',
      loading: '로딩 중...'
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
  },

  // 친구 관리
  friends: {
    title: '친구 관리',
    inviteFriends: '친구 초대하기',
    generateInviteLink: '초대 링크 생성',
    inviteLink: '초대 링크',
    copyLink: '링크 복사',
    linkCopied: '링크가 복사되었습니다!',
    qrCode: 'QR 코드',
    comingSoon: '곧 출시 예정',
    findFriends: '친구 찾기',
    searchPlaceholder: '이름, 닉네임, 전공으로 검색...',
    search: '검색',
    searching: '검색 중...',
    noSearchResults: '검색 결과가 없습니다',
    searchResults: '검색 결과',
    invite: '초대하기',
    friendsList: '친구 목록',
    noFriends: '친구가 없습니다',
    addFirstFriend: '첫 친구를 추가해보세요',
    loading: '로딩 중...',
    removeFriend: '친구 삭제',
    confirmRemove: '정말로 이 친구를 삭제하시겠습니까?',
    receivedInvites: '받은 초대',
    noInvites: '받은 초대가 없습니다',
    accept: '수락',
    reject: '거절',
    from: '보낸이',
    generating: '생성 중...'
  },

  // 친구 초대 페이지
  invite: {
    title: '친구 초대',
    processing: '처리 중...',
    success: '초대 수락 완료!',
    error: '오류 발생',
    successMessage: '친구 초대를 성공적으로 수락했습니다!',
    errorMessage: '친구 초대 수락에 실패했습니다. 초대 코드를 확인해주세요.',
    loginRequired: '친구 초대를 수락하려면 로그인이 필요합니다.',
    generalError: '오류가 발생했습니다. 다시 시도해주세요.',
    loginButton: '로그인하기',
    viewFriends: '친구 목록 보기',
    inviteCode: '초대 코드'
  },

  // 프로필 완성
  profile: {
    complete: {
      title: '프로필 완성하기',
      subtitle: '학생 정보를 입력하여 프로필을 완성해주세요',
      studentInfo: '학생 정보',
      studentId: '학번',
      studentIdPlaceholder: '학번을 입력하세요',
      major: '전공',
      majorPlaceholder: '전공을 입력하세요',
      grade: '학년',
      nickname: '닉네임',
      nicknamePlaceholder: '닉네임을 입력하세요',
      grade1: '1학년',
      grade2: '2학년',
      grade3: '3학년',
      grade4: '4학년',
      grade5: '5학년',
      grade6: '6학년',
      completeButton: '프로필 완성하기'
    }
  },

  // 사이드바 콘텐츠
  sidebarContent: {
    assignments: {
      title: '과제 목록',
      description: '과제 관리 기능이 여기에 표시됩니다.',
      goToList: '과제 목록 페이지로 이동'
    },
    courses: {
      title: '수업 목록',
      description: '수업 관리 기능이 여기에 표시됩니다.',
      goToList: '수업 목록 페이지로 이동'
    },
    settings: {
      title: '설정',
      description: '개인정보 및 설정 기능이 여기에 표시됩니다.',
      goToSettings: '설정 페이지로 이동'
    }
  },

  // 친구 초대 메시지
  friendInvite: {
    sentInvite: '님이 친구 초대',
    grade: '학년'
  }
};

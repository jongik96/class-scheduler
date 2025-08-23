export const en = {
  // Common
  common: {
    home: 'Home',
    schedule: 'Schedule',
    assignments: 'Assignments',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Successfully processed',
    theme: 'Theme',
    actions: 'Actions',
    and: 'and',
    unknown: 'Unknown',
  },

  // Navigation
  navigation: {
    home: 'Home',
    scheduleView: 'View Schedule',
    addCourse: 'Add Course',
    assignmentList: 'Assignment List',
    login: 'Login',
    register: 'Register',
  },

  // Sidebar
  sidebar: {
    schedule: 'Schedule',
    assignments: 'Assignments',
    courses: 'Courses',
    friends: 'Friends',
    settings: 'Settings',
    scheduleDescription: 'View Schedule',
    assignmentsDescription: 'Assignment List',
    coursesDescription: 'Course List',
    friendsDescription: 'Friends List',
    settingsDescription: 'Profile & Settings'
  },

  // Home page
  home: {
    title: 'Smart Scheduler for',
    subtitle: 'University Students',
    description: 'From schedule management to assignment management, make your university life more organized and efficient. Share assignments with friends and grow together.',
    addFirstCourse: 'Add First Course',
    viewSchedule: 'View Schedule',
    features: {
      title: 'Key Features',
      subtitle: 'Check out the core features provided by the scheduler',
      schedule: {
        title: 'Schedule Management',
        description: 'Manage classes systematically by day and time'
      },
      addCourse: {
        title: 'Add Course',
        description: 'Easily add and edit new courses'
      },
      assignments: {
        title: 'Assignment Management',
        description: 'Register assignments for each course and manage deadlines'
      },
      sharing: {
        title: 'Share with Friends',
        description: 'Share assignments with friends to learn together'
      }
    },
    quickActions: {
      title: 'Quick Start',
      subtitle: 'Start right now',
      addCourse: 'Add Course',
      addCourseDesc: 'Add new courses to your schedule and manage them',
      viewSchedule: 'View Schedule',
      viewScheduleDesc: 'Check and modify your current schedule',
      checkAssignments: 'Check Assignments',
      checkAssignmentsDesc: 'Check and manage your assignment status'
    },
    footer: {
      description: 'Smart schedule and assignment management system for university students',
      copyright: '© 2024 Smart Scheduler',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    }
  },

  // Authentication
  auth: {
    login: {
      title: 'Login',
      subtitle: "Don't have an account?",
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      loginButton: 'Login',
      or: 'or',
      googleLogin: 'Login with Google',
      googleLoginError: 'Google login failed. Please try again.',
      loggingIn: 'Signing in...',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password'
    },
    register: {
      title: 'Register',
      subtitle: 'Already have an account?',
      name: 'Name',
      studentId: 'Student ID',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      registerButton: 'Register',
      namePlaceholder: 'Enter your name',
      studentIdPlaceholder: 'Enter your student ID',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      confirmPasswordPlaceholder: 'Enter your password again',
      terms: 'By registering, you agree to the Terms of Service and Privacy Policy.',
      termsLink: 'Terms of Service',
      privacyLink: 'Privacy Policy'
    }
  },

  // Schedule
  schedule: {
    view: {
      title: 'My Schedule',
      subtitle: 'Check this semester\'s class schedule',
      courseList: 'Course List',
      time: 'Time',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    },
    add: {
      title: 'Add New Course',
      subtitle: 'Add a new course to your schedule',
      backToSchedule: 'Back to Schedule',
      courseName: 'Course Name',
      courseCode: 'Course Code',
      professor: 'Professor',
      dayOfWeek: 'Day of Week',
      startTime: 'Start Time',
      endTime: 'End Time',
      room: 'Room',
      color: 'Course Color',
      preview: 'Preview',
      courseNamePlaceholder: 'e.g., Web Programming Basics',
      courseCodePlaceholder: 'e.g., CS101',
      professorPlaceholder: 'Enter professor\'s name',
      roomPlaceholder: 'e.g., Room 101, Online',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      colorDescription: 'Color used in the schedule'
    }
  },

  // Assignments
  assignments: {
    list: {
      title: 'Assignment Management',
      subtitle: 'View and manage all assignments at a glance',
      addAssignment: 'Add Assignment',
      searchPlaceholder: 'Search by assignment name or description...',
      allStatus: 'All Status',
      pending: 'Pending',
      completed: 'Completed',
      allPriority: 'All Priority',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      addFirstAssignment: 'Add First Assignment',
      noResults: 'No assignments match your search criteria.',
      noAssignments: 'No assignments registered yet.',
      total: 'Total Assignments',
      inProgress: 'In Progress',
      overdue: 'Overdue'
    },
    add: {
      title: 'Add New Assignment',
      subtitle: 'Add a new assignment',
      backToList: 'Back to Assignment List',
      assignmentTitle: 'Assignment Title',
      assignmentTitlePlaceholder: 'Enter assignment title',
      description: 'Description',
      descriptionPlaceholder: 'Enter assignment description',
      course: 'Course',
      coursePlaceholder: 'Select a course',
      dueDate: 'Due Date',
      priority: 'Priority',
      status: 'Status',
      shareWithFriends: 'Share with Friends',
      selectFriends: 'Select friends to share with',
      noFriends: 'No friends registered',
      addFirstFriend: 'Add friends first',
      loadingFriends: 'Loading friends...',
      creating: 'Creating assignment...',
      create: 'Create Assignment',
      sharingWithFriends: 'Sharing assignment with {count} friends'
    },
    detail: {
      backToList: 'Back to Assignment List',
      subtitle: 'Assignment details and sharing status',
      assignmentInfo: 'Assignment Information',
      assignmentTitle: 'Assignment Title',
      assignmentDescription: 'Assignment Description',
      course: 'Course',
      dueDate: 'Due Date',
      priority: 'Priority',
      status: {
        completed: 'Completed',
        in_progress: 'In Progress',
        pending: 'Pending'
      },
      progress: 'Progress',
      progressPercent: 'Overall Progress',
      noProgress: 'No progress recorded yet.',
      sharedFriends: 'Shared Friends',
      sharedFriendsCount: '{count} friends',
      noSharedFriends: 'No shared friends',
      shareWithFriends: 'Share this assignment with friends',
      quickActions: 'Quick Actions',
      shareAssignment: 'Share with Friends',
      updateProgress: 'Update Progress',
      assignmentInfoSidebar: 'Assignment Info',
      createdDate: 'Created Date',
      assignmentId: 'Assignment ID',
      edit: 'Edit',
      delete: 'Delete',
      admin: 'Admin',
      editPermission: 'Edit',
      viewPermission: 'View',
      loading: 'Loading...'
    }
  },

  // Course detail
  course: {
    detail: {
      backToSchedule: 'Back to Schedule',
      courseInfo: 'Course Information',
      courseColor: 'Course Color',
      colorDescription: 'Color used in the schedule',
      assignmentList: 'Assignment List',
      noAssignments: 'No assignments registered yet.',
      addFirstAssignment: 'Add First Assignment'
    }
  },

  // Priority
  priority: {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  },

  // Due date
  dueDate: {
    overdue: '{days} days overdue',
    today: 'Due today',
    tomorrow: 'Due tomorrow',
    daysLeft: '{days} days left'
  },

  // Friends management
  friends: {
    title: 'Friends Management',
    inviteFriends: 'Invite Friends',
    generateInviteLink: 'Generate Invite Link',
    inviteLink: 'Invite Link',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied!',
    qrCode: 'QR Code',
    comingSoon: 'Coming Soon',
    findFriends: 'Find Friends',
    searchPlaceholder: 'Search by name, nickname, major...',
    search: 'Search',
    searching: 'Searching...',
    noSearchResults: 'No search results',
    searchResults: 'Search Results',
    invite: 'Invite',
    friendsList: 'Friends List',
    noFriends: 'No friends',
    addFirstFriend: 'Add your first friend',
    loading: 'Loading...',
    removeFriend: 'Remove Friend',
    confirmRemove: 'Are you sure you want to remove this friend?',
    receivedInvites: 'Received Invites',
    noInvites: 'No received invites',
    accept: 'Accept',
    reject: 'Reject',
    from: 'From',
    generating: 'Generating...'
  },

  // Friend invite page
  invite: {
    title: 'Friend Invite',
    processing: 'Processing...',
    success: 'Invite Accepted!',
    error: 'Error Occurred',
    successMessage: 'Friend invite accepted successfully!',
    errorMessage: 'Failed to accept friend invite. Please check the invite code.',
    loginRequired: 'Login required to accept friend invite.',
    generalError: 'An error occurred. Please try again.',
    loginButton: 'Login',
    viewFriends: 'View Friends',
    inviteCode: 'Invite Code'
  },

  // Profile completion
  profile: {
    complete: {
      title: 'Complete Profile',
      subtitle: 'Enter student information to complete your profile',
      studentInfo: 'Student Information',
      studentId: 'Student ID',
      studentIdPlaceholder: 'Enter your student ID',
      major: 'Major',
      majorPlaceholder: 'Enter your major',
      grade: 'Grade',
      nickname: 'Nickname',
      nicknamePlaceholder: 'Enter your nickname',
      grade1: 'Freshman',
      grade2: 'Sophomore',
      grade3: 'Junior',
      grade4: 'Senior',
      grade5: '5th Year',
      grade6: '6th Year',
      completeButton: 'Complete Profile'
    }
  },

  // Sidebar content
  sidebarContent: {
    assignments: {
      title: 'Assignment List',
      description: 'Assignment management features will be displayed here.',
      goToList: 'Go to Assignment List'
    },
    courses: {
      title: 'Course List',
      description: 'Course management features will be displayed here.',
      goToList: 'Go to Course List'
    },
    settings: {
      title: 'Settings',
      description: 'Profile and settings features will be displayed here.',
      goToSettings: 'Go to Settings'
    }
  },

  // Friend invite message
  friendInvite: {
    sentInvite: ' sent a friend invite',
    grade: 'Year'
  }
};

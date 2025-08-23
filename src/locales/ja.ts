export const ja = {
  // 共通
  common: {
    home: 'ホーム',
    schedule: 'スケジュール',
    assignments: '課題',
    login: 'ログイン',
    register: '登録',
    logout: 'ログアウト',
    save: '保存',
    cancel: 'キャンセル',
    edit: '編集',
    delete: '削除',
    add: '追加',
    view: '表示',
    search: '検索',
    filter: 'フィルター',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    success: '正常に処理されました',
    theme: 'テーマ',
    actions: 'アクション',
    and: 'および',
  },

  // ナビゲーション
  navigation: {
    home: 'ホーム',
    scheduleView: 'スケジュール表示',
    addCourse: '授業追加',
    assignmentList: '課題一覧',
    login: 'ログイン',
    register: '登録',
  },

  // サイドバー
  sidebar: {
    schedule: 'スケジュール',
    assignments: '課題',
    courses: '授業',
    friends: '友達',
    settings: '設定',
    scheduleDescription: 'スケジュール表示',
    assignmentsDescription: '課題一覧',
    coursesDescription: '授業一覧',
    friendsDescription: '友達一覧',
    settingsDescription: 'プロフィール・設定'
  },

  // ホームページ
  home: {
    title: '大学生のための',
    subtitle: 'スマートスケジューラー',
    description: 'スケジュール管理から課題管理まで、大学生活をより体系的で効率的にしましょう。友達と課題を共有して一緒に成長できます。',
    addFirstCourse: '最初の授業を追加',
    viewSchedule: 'スケジュール表示',
    features: {
      title: '主な機能',
      subtitle: 'スケジューラーが提供するコア機能をご確認ください',
      schedule: {
        title: 'スケジュール管理',
        description: '曜日別、時間別に授業を体系的に管理しましょう'
      },
      addCourse: {
        title: '授業追加',
        description: '新しい授業を簡単に追加・編集できます'
      },
      assignments: {
        title: '課題管理',
        description: '各授業の課題を登録し、締切日を管理しましょう'
      },
      sharing: {
        title: '友達と共有',
        description: '課題を友達と共有して一緒に学習しましょう'
      }
    },
    quickActions: {
      title: 'クイックスタート',
      subtitle: '今すぐ始めましょう',
      addCourse: '授業追加',
      viewSchedule: 'スケジュール表示',
      checkAssignments: '課題確認'
    }
  },

  // 認証
  auth: {
    login: {
      title: 'ログイン',
      subtitle: 'アカウントをお持ちでない方は',
      email: 'メールアドレス',
      password: 'パスワード',
      rememberMe: 'ログイン状態を保持',
      forgotPassword: 'パスワードをお忘れですか？',
      loginButton: 'ログイン',
      or: 'または',
      googleLogin: 'Googleでログイン',
      emailPlaceholder: 'メールアドレスを入力してください',
      passwordPlaceholder: 'パスワードを入力してください'
    },
    register: {
      title: '登録',
      subtitle: 'すでにアカウントをお持ちですか？',
      name: '名前',
      studentId: '学籍番号',
      email: 'メールアドレス',
      password: 'パスワード',
      confirmPassword: 'パスワード確認',
      registerButton: '登録',
      namePlaceholder: '名前を入力してください',
      studentIdPlaceholder: '学籍番号を入力してください',
      emailPlaceholder: 'メールアドレスを入力してください',
      passwordPlaceholder: 'パスワードを入力してください',
      confirmPasswordPlaceholder: 'パスワードを再入力してください',
      terms: '登録により、利用規約とプライバシーポリシーに同意したことになります。',
      termsLink: '利用規約',
      privacyLink: 'プライバシーポリシー'
    }
  },

  // スケジュール
  schedule: {
    view: {
      title: '私のスケジュール',
      subtitle: '今学期の授業スケジュールを確認しましょう',
      courseList: '授業一覧',
      time: '時間',
      monday: '月',
      tuesday: '火',
      wednesday: '水',
      thursday: '木',
      friday: '金',
      saturday: '土',
      sunday: '日'
    },
    add: {
      title: '新しい授業を追加',
      subtitle: 'スケジュールに新しい授業を追加しましょう',
      backToSchedule: 'スケジュールに戻る',
      courseName: '授業名',
      courseCode: '科目コード',
      professor: '教授名',
      dayOfWeek: '曜日',
      startTime: '開始時間',
      endTime: '終了時間',
      room: '教室',
      color: '授業の色',
      preview: 'プレビュー',
      courseNamePlaceholder: '例：Webプログラミング基礎',
      courseCodePlaceholder: '例：CS101',
      professorPlaceholder: '教授のお名前を入力してください',
      roomPlaceholder: '例：101号室、オンライン',
      monday: '月曜日',
      tuesday: '火曜日',
      wednesday: '水曜日',
      thursday: '木曜日',
      friday: '金曜日',
      saturday: '土曜日',
      sunday: '日曜日',
      colorDescription: 'スケジュールで使用される色'
    }
  },

  // 課題
  assignments: {
    list: {
      title: '課題管理',
      subtitle: 'すべての課題を一目で確認・管理しましょう',
      addAssignment: '課題追加',
      searchPlaceholder: '課題名や説明で検索...',
      allStatus: 'すべての状態',
      pending: '進行中',
      completed: '完了',
      allPriority: 'すべての優先度',
      high: '高',
      medium: '中',
      low: '低',
      addFirstAssignment: '最初の課題を追加',
      noResults: '検索条件に一致する課題がありません。',
      noAssignments: 'まだ登録された課題がありません。',
      total: '総課題数',
      inProgress: '進行中',
      overdue: '期限切れ'
    }
  },

  // 授業詳細
  course: {
    detail: {
      backToSchedule: 'スケジュールに戻る',
      courseInfo: '授業情報',
      courseColor: '授業の色',
      colorDescription: 'スケジュールで使用される色',
      assignmentList: '課題一覧',
      noAssignments: 'まだ登録された課題がありません。',
      addFirstAssignment: '最初の課題を追加'
    }
  },

  // 優先度
  priority: {
    high: '高',
    medium: '中',
    low: '低'
  },

  // 締切日
  dueDate: {
    overdue: '{days}日前に期限切れ',
    today: '今日が期限',
    tomorrow: '明日が期限',
    daysLeft: 'あと{days}日'
  }
};

export interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  dayOfWeek: number; // 0: 월요일, 1: 화요일, ..., 6: 일요일
  startTime: string; // HH:MM 형식
  endTime: string; // HH:MM 형식
  room: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  courseId: string;
  userId: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  sharedWith: string[]; // 공유된 친구들의 ID 배열
  createdAt: Date;
}

export interface Schedule {
  id: string;
  userId: string;
  name: string;
  courses: Course[];
  createdAt: Date;
}

export type Theme = 'white' | 'black' | 'pink';
export type Language = 'ko' | 'en' | 'ja';

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
  description?: string;
  due_date: string;
  course_id?: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  is_shared: boolean;
  created_at: string;
  updated_at: string;
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, MapPin, User, BookOpen, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

// 임시 데이터
const sampleCourse = {
  id: 1,
  name: '웹 프로그래밍 기초',
  code: 'CS101',
  professor: '김교수',
  dayOfWeek: 'monday',
  startTime: '09:00',
  endTime: '10:30',
  room: '101호',
  color: '#3b82f6'
};

const sampleAssignments = [
  {
    id: 1,
    title: 'HTML/CSS 기초 과제',
    description: '웹페이지 레이아웃 만들기',
    dueDate: '2024-01-15',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 2,
    title: 'JavaScript 기초 과제',
    description: '간단한 계산기 만들기',
    dueDate: '2024-01-20',
    priority: 'medium',
    status: 'completed'
  }
];

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const [assignments] = useState(sampleAssignments);

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return t('priority.high');
      case 'medium':
        return t('priority.medium');
      case 'low':
        return t('priority.low');
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return t('dueDate.overdue', { days: Math.abs(diffDays) });
    } else if (diffDays === 0) {
      return t('dueDate.today');
    } else if (diffDays === 1) {
      return t('dueDate.tomorrow');
    } else {
      return t('dueDate.daysLeft', { days: diffDays });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/schedule/view"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('course.detail.backToSchedule')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {sampleCourse.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {sampleCourse.code} • {sampleCourse.professor}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('course.detail.courseInfo')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.courseCode')}
                    </p>
                    <p className="text-gray-900 dark:text-white">{sampleCourse.code}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.professor')}
                    </p>
                    <p className="text-gray-900 dark:text-white">{sampleCourse.professor}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.dayOfWeek')}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {t(`schedule.view.${sampleCourse.dayOfWeek}`)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.startTime')} - {t('schedule.add.endTime')}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {sampleCourse.startTime} - {sampleCourse.endTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.room')}
                    </p>
                    <p className="text-gray-900 dark:text-white">{sampleCourse.room}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: sampleCourse.color }} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('course.detail.courseColor')}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {t('course.detail.colorDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('course.detail.assignmentList')}
                </h2>
                <Link
                  href="/assignment/add"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('assignments.list.addAssignment')}
                </Link>
              </div>
              
              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t('course.detail.noAssignments')}
                  </p>
                  <Link
                    href="/assignment/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('course.detail.addFirstAssignment')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {assignment.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(assignment.priority)}`}>
                              {getPriorityText(assignment.priority)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {assignment.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {getDaysUntilDue(assignment.dueDate)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            href={`/assignment/${assignment.id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('common.actions')}
              </h3>
              
              <div className="space-y-3">
                <Link
                  href={`/schedule/edit/${sampleCourse.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('common.edit')}
                </Link>
                
                <button className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

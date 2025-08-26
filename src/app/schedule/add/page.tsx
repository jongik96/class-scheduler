'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/AuthGuard';
import { coursesApi } from '@/lib/api';
import { COURSE_COLORS, DEFAULT_COURSE_COLOR, type CourseColor, migrateToPastelColor } from '@/lib/constants';

function AddCourseContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    professor: '',
    room: '',
    dayOfWeek: 'monday',
    startTime: '09:00',
    endTime: '10:30',
    color: DEFAULT_COURSE_COLOR,
    description: ''
  });

  const daysOfWeek = [
    { value: 'monday', label: t('schedule.add.monday') },
    { value: 'tuesday', label: t('schedule.add.tuesday') },
    { value: 'wednesday', label: t('schedule.add.wednesday') },
    { value: 'thursday', label: t('schedule.add.thursday') },
    { value: 'friday', label: t('schedule.add.friday') },
    { value: 'saturday', label: t('schedule.add.saturday') },
    { value: 'sunday', label: t('schedule.add.sunday') }
  ];

  const timeOptions = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // 시간 유효성 검사
    const startTimeIndex = timeOptions.indexOf(formData.startTime);
    const endTimeIndex = timeOptions.indexOf(formData.endTime);
    
    if (startTimeIndex >= endTimeIndex) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await coursesApi.createCourse({
        course_name: formData.courseName,
        course_code: formData.courseCode,
        professor: formData.professor,
        day_of_week: formData.dayOfWeek as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
        start_time: formData.startTime,
        end_time: formData.endTime,
        room: formData.room,
        color: formData.color,
        description: formData.description,
        is_active: true
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/schedule/view');
      }, 2000);
    } catch (error) {
      console.error('Course creation error:', error);
      alert('수업 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // 시작 시간이 변경되면 종료 시간 자동 조정
      if (field === 'startTime') {
        const startTimeIndex = timeOptions.indexOf(value);
        const currentEndTimeIndex = timeOptions.indexOf(newData.endTime);
        
        // 시작 시간이 종료 시간보다 늦으면 종료 시간을 시작 시간 + 1.5시간으로 설정
        if (startTimeIndex >= currentEndTimeIndex) {
          const newEndTimeIndex = Math.min(startTimeIndex + 3, timeOptions.length - 1); // 1.5시간 = 3개 슬롯
          newData.endTime = timeOptions[newEndTimeIndex];
        }
      }
      
      // 종료 시간이 시작 시간보다 이르면 시작 시간으로부터 1.5시간 후로 설정
      if (field === 'endTime') {
        const startTimeIndex = timeOptions.indexOf(newData.startTime);
        const endTimeIndex = timeOptions.indexOf(value);
        
        if (endTimeIndex <= startTimeIndex) {
          const newEndTimeIndex = Math.min(startTimeIndex + 3, timeOptions.length - 1);
          newData.endTime = timeOptions[newEndTimeIndex];
        }
      }
      
      return newData;
    });
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
            {t('schedule.add.backToSchedule')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('schedule.add.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('schedule.add.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Course Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.courseName')}
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => handleInputChange('courseName', e.target.value)}
                    placeholder={t('schedule.add.courseNamePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Course Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.courseCode')}
                  </label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => handleInputChange('courseCode', e.target.value)}
                    placeholder={t('schedule.add.courseCodePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Professor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.professor')}
                  </label>
                  <input
                    type="text"
                    value={formData.professor}
                    onChange={(e) => handleInputChange('professor', e.target.value)}
                    placeholder={t('schedule.add.professorPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Day of Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.dayOfWeek')}
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.startTime')}
                  </label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                     {t('common.timeRangeDescription')}
                   </p>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.endTime')}
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                     {t('common.endTimeDescription')}
                   </p>
                </div>

                {/* Room */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.room')}
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    placeholder={t('schedule.add.roomPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Color */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('schedule.add.color')}
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-5 gap-2">
                      {COURSE_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleInputChange('color', color)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                            formData.color === color
                              ? 'border-gray-900 dark:border-white shadow-lg'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                          title={`색상 선택: ${color}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('schedule.add.colorDescription')}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('common.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('common.descriptionPlaceholder')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-8">
                {isSuccess ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-green-800 dark:text-green-200 font-medium">
                        {t('common.courseAddedSuccess')}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {t('common.redirectingToSchedule')}
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('common.creating')}
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        {t('common.addCourse')}
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('common.preview')}
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded border" style={{ borderColor: migrateToPastelColor(formData.color) }}>
                  <div className="font-medium text-sm" style={{ color: migrateToPastelColor(formData.color) }}>
                    {formData.courseName || t('schedule.add.courseNamePlaceholder')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.courseCode || t('schedule.add.courseCodePlaceholder')} • {formData.professor || t('schedule.add.professorPlaceholder')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.room || t('schedule.add.roomPlaceholder')} • {formData.startTime} - {formData.endTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddCoursePage() {
  return (
    <AuthGuard requireAuth={true}>
      <AddCourseContent />
    </AuthGuard>
  );
}

# 대학생 시간표 관리 웹사이트

Next.js, React, Supabase를 사용한 대학생들을 위한 시간표 및 과제 관리 웹사이트입니다.

## 주요 기능

- 🎨 **3가지 테마**: 흰색, 검은색, 핑크 테마 지원
- 🌍 **다국어 지원**: 한국어, 영어, 일본어 지원
- 📅 **시간표 관리**: 강의 추가, 편집, 조회
- 📚 **과제 관리**: 과제 목록 및 상세 정보
- 🔐 **인증 시스템**: Google, LINE OAuth 로그인 지원
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (인증, 데이터베이스)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성하세요
2. Authentication > Providers에서 Google과 LINE OAuth를 활성화하세요
3. Google OAuth 설정:
   - Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
   - 승인된 리디렉션 URI에 `https://your-project.supabase.co/auth/v1/callback` 추가
4. LINE OAuth 설정:
   - LINE Developers Console에서 채널 생성
   - Callback URL에 `https://your-project.supabase.co/auth/v1/callback` 추가

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

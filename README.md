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

## 프로덕션 배포 시 OAuth 설정

### Google OAuth 설정 (프로덕션)

1. **Google Cloud Console 설정**:
   ```bash
   # 승인된 리디렉션 URI에 다음을 추가:
   https://yourdomain.com/auth/callback
   https://yourdomain.com/auth/callback/
   ```

2. **Supabase 프로젝트 설정**:
   ```bash
   # Authentication > URL Configuration
   Site URL: https://yourdomain.com
   Redirect URLs: https://yourdomain.com/auth/callback
   ```

3. **환경 변수 확인**:
   ```bash
   # 프로덕션 환경에서 다음이 올바르게 설정되어 있는지 확인:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### OAuth 문제 해결 가이드

#### 1. "Unable to exchange external code" 에러

**원인**: OAuth 코드를 토큰으로 교환하지 못함

**해결 방법**:
- [ ] Google Cloud Console에서 리디렉션 URI 확인
- [ ] Supabase 프로젝트 URL과 API 키 확인
- [ ] Google OAuth 클라이언트 ID/시크릿 확인
- [ ] Supabase Auth 설정 재확인

#### 2. "server_error" 에러

**원인**: Supabase 서버 측 OAuth 처리 오류

**해결 방법**:
- [ ] Supabase 프로젝트 상태 확인
- [ ] Google OAuth 설정 재검토
- [ ] 리디렉션 URI 정확성 확인
- [ ] 몇 분 후 다시 시도

#### 3. 세션 생성 실패

**원인**: 인증 후 세션 설정 실패

**해결 방법**:
- [ ] 브라우저 캐시 및 쿠키 삭제
- [ ] 다른 브라우저에서 시도
- [ ] 인터넷 연결 상태 확인
- [ ] Supabase 로그 확인

### 디버깅 방법

1. **브라우저 개발자 도구**:
   - Console 탭에서 에러 메시지 확인
   - Network 탭에서 OAuth 요청/응답 확인

2. **Supabase 로그**:
   - Supabase 대시보드 > Logs에서 인증 관련 에러 확인

3. **환경 변수 확인**:
   ```bash
   # 브라우저 콘솔에서 확인
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
   ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

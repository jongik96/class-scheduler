// 파스텔톤 색상 팔레트 - 수업 시간표용
export const COURSE_COLORS = [
  '#FFB3BA', // 파스텔 핑크
  '#BAFFC9', // 파스텔 그린
  '#BAE1FF', // 파스텔 블루
  '#FFFFBA', // 파스텔 옐로우
  '#E8BAFF', // 파스텔 퍼플
  '#FFD4BA', // 파스텔 오렌지
  '#BAFFE8', // 파스텔 민트
  '#FFBAE8', // 파스텔 로즈
  '#BAE8FF', // 파스텔 스카이블루
  '#E8FFBA', // 파스텔 라임
] as const;

export type CourseColor = typeof COURSE_COLORS[number];

// 기본 색상 (새 수업 생성 시 사용)
export const DEFAULT_COURSE_COLOR: CourseColor = COURSE_COLORS[0];

// 기존 색상을 파스텔톤으로 변환하는 함수
export function migrateToPastelColor(oldColor: string): CourseColor {
  // 기존 색상이 이미 파스텔톤에 포함되어 있으면 그대로 사용
  if (COURSE_COLORS.includes(oldColor as CourseColor)) {
    return oldColor as CourseColor;
  }
  
  // 기존 색상을 파스텔톤으로 매핑
  // 색상 유사성을 기반으로 가장 적합한 파스텔톤 선택
  const colorMap: Record<string, CourseColor> = {
    // 빨간색 계열
    '#FF0000': '#FFB3BA', '#FF4444': '#FFB3BA', '#FF6666': '#FFB3BA',
    // 파란색 계열
    '#0000FF': '#BAE1FF', '#4444FF': '#BAE1FF', '#6666FF': '#BAE1FF',
    // 초록색 계열
    '#00FF00': '#BAFFC9', '#44FF44': '#BAFFC9', '#66FF66': '#BAFFC9',
    // 노란색 계열
    '#FFFF00': '#FFFFBA', '#FFFF44': '#FFFFBA', '#FFFF66': '#FFFFBA',
    // 보라색 계열
    '#800080': '#E8BAFF', '#9933CC': '#E8BAFF', '#AA66CC': '#E8BAFF',
    // 주황색 계열
    '#FF8000': '#FFD4BA', '#FF9933': '#FFD4BA', '#FFAA66': '#FFD4BA',
    // 청록색 계열
    '#00FFFF': '#BAFFE8', '#44FFFF': '#BAFFE8', '#66FFFF': '#BAFFE8',
    // 분홍색 계열
    '#FF00FF': '#FFBAE8', '#FF44FF': '#FFBAE8', '#FF66FF': '#FFBAE8',
    // 하늘색 계열
    '#87CEEB': '#BAE8FF', '#87CEFA': '#BAE8FF',
    // 연두색 계열
    '#90EE90': '#E8FFBA', '#98FB98': '#E8FFBA', '#9ACD32': '#E8FFBA',
  };
  
  // 정확한 매칭이 있으면 사용
  if (colorMap[oldColor]) {
    return colorMap[oldColor];
  }
  
  // 색상 유사성을 기반으로 가장 적합한 파스텔톤 선택
  // 간단한 휴리스틱: 색상의 밝기와 채도를 고려
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const rgb = hexToRgb(oldColor);
  if (!rgb) return DEFAULT_COURSE_COLOR;
  
  // 밝기 계산 (0-255)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  
  // 밝기에 따라 파스텔톤 선택
  if (brightness < 100) return '#E8BAFF'; // 어두운 색상 → 보라
  if (brightness < 150) return '#FFB3BA'; // 중간 어두운 색상 → 핑크
  if (brightness < 200) return '#FFD4BA'; // 중간 색상 → 주황
  return '#FFFFBA'; // 밝은 색상 → 노랑
}

export type RelatedTool = { id: string; category: "calculator" | "online"; ko: string; en: string; href: string };

// Add each new public tool here once. Blog admin and article buttons consume this catalog.
export const RELATED_TOOLS: RelatedTool[] = [
  { id: "area", category: "calculator", ko: "평수·면적 변환 계산기", en: "Area Converter", href: "/area" },
  { id: "loan", category: "calculator", ko: "대출 이자 계산기", en: "Loan Calculator", href: "/loan" },
  { id: "brokerage", category: "calculator", ko: "부동산 중개수수료 계산기", en: "Real Estate Brokerage Fee Calculator", href: "/brokerage" },
  { id: "salary", category: "calculator", ko: "연봉 실수령액 계산기", en: "Salary Calculator", href: "/salary" },
  { id: "severance", category: "calculator", ko: "퇴직금 계산기", en: "Severance Pay Calculator", href: "/severance" },
  { id: "dsr", category: "calculator", ko: "DSR 계산기", en: "DSR Calculator", href: "/dsr" },
  { id: "fuel", category: "calculator", ko: "연료비 계산기", en: "Fuel Cost Calculator", href: "/fuel" },
  { id: "rent-conversion", category: "calculator", ko: "전월세 전환 계산기", en: "Rent Conversion Calculator", href: "/rent-conversion" },
  { id: "savings", category: "calculator", ko: "저축 계산기", en: "Savings Calculator", href: "/savings" },
  { id: "vat", category: "calculator", ko: "부가세 계산기", en: "VAT Calculator", href: "/vat" },
  { id: "volume", category: "calculator", ko: "부피 계산기", en: "Volume Calculator", href: "/volume" },
  { id: "date", category: "calculator", ko: "날짜 계산기", en: "Date Calculator", href: "/date" },
  { id: "tip", category: "calculator", ko: "팁 계산기", en: "Tip Calculator", href: "/tip" },
  { id: "qr-code-generator", category: "online", ko: "QR 코드 생성기", en: "QR Code Generator", href: "/qr-code-generator" },
  { id: "image-compressor", category: "online", ko: "이미지 압축기", en: "Image Compressor", href: "/image-compressor" },
  { id: "image-resizer", category: "online", ko: "이미지 크기 조절기", en: "Image Resizer", href: "/image-resizer" },
  { id: "image-converter", category: "online", ko: "이미지 파일 변환기", en: "Image Converter", href: "/image-converter" },
  { id: "background-remover", category: "online", ko: "AI 이미지 배경 제거", en: "AI Background Remover", href: "/background-remover" },
  { id: "image-to-text", category: "online", ko: "이미지 텍스트 추출", en: "Image to Text (OCR)", href: "/image-to-text" },
  { id: "image-to-pdf", category: "online", ko: "이미지를 PDF로 변환", en: "Image to PDF", href: "/image-to-pdf" },
  { id: "pdf-merge", category: "online", ko: "PDF 합치기", en: "Merge PDF", href: "/pdf-merge" },
  { id: "pdf-split", category: "online", ko: "PDF 분할", en: "Split PDF", href: "/pdf-split" },
  { id: "pdf-rotate", category: "online", ko: "PDF 회전", en: "Rotate PDF", href: "/pdf-rotate" },
  { id: "pdf-organize", category: "online", ko: "PDF 페이지 정리", en: "Organize PDF Pages", href: "/pdf-organize" },
  { id: "text-to-speech", category: "online", ko: "텍스트 음성 변환기", en: "Text to Speech", href: "/text-to-speech" },
];

export function getRelatedTools(ids: unknown): RelatedTool[] {
  if (!Array.isArray(ids)) return [];
  const selected = new Set(ids.filter((id): id is string => typeof id === "string"));
  return RELATED_TOOLS.filter((tool) => selected.has(tool.id));
}

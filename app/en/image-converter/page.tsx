import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import ImageFormatConverter from "../../../components/ImageFormatConverter";

export const metadata: Metadata = {
 title: "Free Image Converter | Convert HEIC, JPG, PNG & WebP - UTILWISE",
 description: "Convert iPhone HEIC/HEIF photos and JPG, PNG, or WebP images online for free. Batch convert files and process photos privately in your browser.",
 alternates: { canonical: "/en/image-converter", languages: { en: "/en/image-converter", "ko-KR": "/image-converter" } },
 openGraph: { title: "Free Image Format Converter | HEIC, JPG, PNG & WebP - UTILWISE", description: "Convert iPhone HEIC photos and JPG, PNG, or WebP images directly in your browser.", url: "https://utilwise.kr/en/image-converter", siteName: "UTILWISE", locale: "en_US", type: "website" }
};
const faq = [
 { question: "Can I convert HEIC and HEIF photos?", answer: "Yes. Convert HEIC/HEIF photos, including iPhone images, to JPG, PNG, or WebP. The browser may load a conversion module from an external CDN the first time." },
 { question: "Can I convert multiple images at once?", answer: "Yes. Batch conversion is supported. Each file can be up to 20 MB, with a maximum width and height of 12,000 pixels." },
 { question: "Are my photos uploaded to a server?", answer: "No. Image conversion runs in your browser and selected photo files are not uploaded to UTILWISE servers." },
 { question: "Will transparent backgrounds be preserved?", answer: "PNG and WebP can preserve transparency. JPG does not support transparency, so transparent areas are filled with white." },
 { question: "Will EXIF photo information be preserved?", answer: "When converting HEIC/HEIF files, EXIF metadata such as capture date or GPS location may not be preserved." }
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
 return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher/></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1>Free Online Image Format Converter</h1><p className="sub">Convert iPhone HEIC/HEIF photos and JPG, PNG, or WebP images to the format you need.</p><ImageFormatConverter lang="en"/><article className="image-tool-guide">
 <h2>What is image format conversion?</h2><p>Image conversion changes how a photo or graphic is stored. Choose a format based on device compatibility, transparency, website requirements, and file size.</p>
 <h2>Supported image formats</h2><ul><li><strong>HEIC/HEIF:</strong> High-efficiency photo formats commonly used by iPhones. Convert them to JPG, PNG, or WebP.</li><li><strong>JPG:</strong> Suitable for photos and broad compatibility, but it does not support transparency.</li><li><strong>PNG:</strong> Useful for graphics that need a transparent background.</li><li><strong>WebP:</strong> An efficient image format commonly used on the web.</li></ul>
 <h2>How to convert images</h2><ol><li>Select image files or drag them into the upload area.</li><li>Choose JPG, PNG, or WebP as the output format and adjust quality if needed.</li><li>Convert, review the preview, and download your files.</li></ol>
 <h2>Supported files and privacy</h2><ul><li>Input: JPG, PNG, WebP, HEIC, and HEIF</li><li>Output: JPG, PNG, and WebP</li><li>Up to 20 MB per file; maximum 12,000 px per side</li><li>Processed locally in your browser; photos are not uploaded</li></ul><p>You can select multiple images for batch conversion. The first HEIC/HEIF conversion may download a conversion module from an external CDN. EXIF metadata, such as capture date or GPS location, may not be preserved.</p>
 <h2>Frequently asked questions</h2>{faq.map(item=><div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
 <h2>Related image tools</h2><p>Use the <Link href="/en/image-compressor">image compressor</Link> to reduce file size or the <Link href="/en/image-resizer">image resizer</Link> to change dimensions. To extract text from a photo, try the <Link href="/en/image-to-text">image to text OCR tool</Link>.</p>
 </article></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJsonLd).replace(/</g,"\\u003c")}} /></main>;
}

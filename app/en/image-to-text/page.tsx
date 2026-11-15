import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import ImageToTextOCR from "../../../components/ImageToTextOCR";

export const metadata: Metadata = {
 title: "Free Image to Text OCR | Extract Text from Photos & Screenshots - UTILWISE",
 description: "Extract Korean and English text from photos, screenshots, and scanned images with a free online OCR tool. Copy recognized text or save it as a TXT file. Images are processed in your browser.",
 alternates: { canonical: "/en/image-to-text", languages: { en: "/en/image-to-text", "ko-KR": "/image-to-text" } },
 openGraph: { title: "Free Image to Text OCR | Korean & English Text Extractor - UTILWISE", description: "Turn text in photos and screenshots into editable text you can copy or download.", url: "https://utilwise.kr/en/image-to-text", siteName: "UTILWISE", locale: "en_US", type: "website" }
};
const faq = [
 { question: "Can it recognize Korean and English together?", answer: "Yes. Choose Korean + English, Korean only, or English only. Select Korean + English for images containing both languages." },
 { question: "Are my images uploaded to a server?", answer: "No. OCR runs in your browser and image files are not uploaded to UTILWISE servers. On first use, the OCR engine and language data are downloaded from an external CDN." },
 { question: "What image size is supported?", answer: "You can select image files up to 15 MB. Large or complex images may take longer depending on your device performance and available memory." },
 { question: "Can it accurately recognize handwriting and tables?", answer: "Recognition depends on image quality and text layout. Blurry photos, tiny text, handwriting, tilted documents, and tables can cause errors. Review the result against the original." },
 { question: "Can I extract text directly from a PDF?", answer: "This tool currently accepts image files. Convert a PDF page to an image first, then upload that image for OCR." }
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
 return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/text-tools">Text Tools</Link><LanguageSwitcher/></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE TEXT TOOLS</div><h1>Free Image to Text Converter (OCR)</h1><p className="sub">Extract Korean and English text from photos, screenshots, and scanned images into editable text.</p><ImageToTextOCR lang="en"/><article className="image-tool-guide">
 <h2>What is image to text OCR?</h2><p>Optical character recognition (OCR) analyzes text in photos and screenshots and converts it into editable content. Use it to capture text from photographed documents, screen captures, signs, and printed materials.</p>
 <h2>How to extract text from an image</h2><ol><li>Select an image or drag it into the upload area.</li><li>Choose Korean + English, Korean only, or English only.</li><li>Select Extract Text and wait for recognition to finish.</li><li>Review and edit the result, then copy it or download a TXT file.</li></ol>
 <h2>Tips for better OCR accuracy</h2><p>Use a sharp image with clear contrast between text and background. Photograph documents straight on and make sure no text is cropped. The tool enlarges small images, applies grayscale and contrast enhancement, and compares multiple page-layout recognition results. Blurry or tilted photos, handwriting, tables, and busy backgrounds can still cause errors. Check important text against the original.</p>
 <h2>Supported languages, files, and privacy</h2><ul><li>Languages: Korean + English, Korean only, or English only</li><li>Image files up to 15 MB</li><li>Output: editable text, clipboard copy, and TXT download</li><li>Processing: OCR runs in your browser; images are not uploaded</li></ul><p>An internet connection is required on first use to download the OCR engine and language data from an external CDN. Recognition quality and processing time depend on image quality and device performance.</p>
 <h2>Frequently asked questions</h2>{faq.map(item=><div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
 <h2>Related tools</h2><p>Use the <Link href="/en/image-converter">image format converter</Link> to change an image format, or explore <Link href="/en/text-tools">text tools</Link> to work with extracted content.</p>
 </article></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJsonLd).replace(/</g,"\\u003c")}} /></main>;
}

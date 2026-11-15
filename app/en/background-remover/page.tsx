import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import BackgroundRemover from "../../../components/BackgroundRemover";

export const metadata: Metadata = {
  title: "Free AI Background Remover | Remove Photo Background to PNG - UTILWISE",
  description: "Remove image backgrounds online with AI and download transparent PNG files for free. No sign-up required. Photos stay in your browser and are not uploaded to UTILWISE.",
  alternates: { canonical: "/en/background-remover", languages: { en: "/en/background-remover", "ko-KR": "/background-remover" } },
  openGraph: { title: "Free AI Background Remover", description: "Remove photo backgrounds online and save transparent PNG images for free. No sign-up required.", url: "https://utilwise.kr/en/background-remover", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

const faq = [
  { question: "Is this AI background remover free?", answer: "Yes. You can remove image backgrounds without an account or payment. Image processing runs in your browser." },
  { question: "Are my photos uploaded to a server?", answer: "No. Your selected photo is processed in your browser and is not uploaded to UTILWISE. The AI model files are downloaded from an external repository on first use." },
  { question: "Which image formats and sizes are supported?", answer: "JPG, PNG, and WebP images up to 20 MB per file and 4,096 px per dimension are supported. The result is saved as a transparent PNG." },
  { question: "Can it remove complex backgrounds and fine hair?", answer: "The AI separates the subject from its background, but edge quality can vary with lighting, background complexity, image resolution, and fine details." }
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher/></nav></header>
    <section className="wrap section image-tool-page background-remover-page">
      <div className="eyebrow">UTILWISE ONLINE TOOLS</div>
      <h1>Free AI Background Remover</h1>
      <p className="sub">Remove a photo background online and download a transparent PNG for free. No account or sign-up required.</p>
      <BackgroundRemover lang="en"/>
      <div className="image-tool-guide">
        <h2>Remove backgrounds from product photos and portraits</h2>
        <p>This free AI background remover separates a main subject—such as a person, product, or object—from its photo background. Create transparent product images for online stores, profile pictures, presentation assets, and design graphics.</p>
        <h2>How to remove a photo background</h2>
        <ol><li>Choose a JPG, PNG, or WebP image, or drag it into the upload area.</li><li>Review the estimated area identified as the background.</li><li>Run high-quality background removal and check the result.</li><li>Download the transparent PNG file.</li></ol>
        <h2>Supported image formats and limits</h2>
        <ul><li>Input formats: JPG, PNG, and WebP</li><li>File size: up to 20 MB per image</li><li>Image dimensions: up to 4,096 px per side</li><li>Output: transparent PNG</li><li>Processing: AI runs locally in your browser</li></ul>
        <p>The first use downloads AI model files from an external repository; your browser may cache them for later use. Your photo itself is not sent to UTILWISE. Results can vary with lighting, image resolution, subject edges, and background complexity, so review the preview before downloading.</p>
        <h2>Frequently asked questions</h2>
        {faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
        <p>AI model: BiRefNet Lite ONNX (MIT License), based on ZhengPeng7/BiRefNet_lite.</p>
        <h2>Related image tools</h2>
        <p>After removing a background, use the <Link href="/en/image-compressor">image compressor</Link>, <Link href="/en/image-resizer">image resizer</Link>, or <Link href="/en/image-converter">image format converter</Link> to prepare your file.</p>
      </div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
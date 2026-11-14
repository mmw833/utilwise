import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import BackgroundRemover from "../../../components/BackgroundRemover";

export const metadata: Metadata = {
  title: "Free AI Background Remover | Remove Image Background - UTILWISE",
  description: "Remove photo backgrounds with AI and download transparent PNG images for free. No sign-up required. Images are processed locally in your browser, not uploaded to our servers.",
  alternates: { canonical: "/en/background-remover", languages: { en: "/en/background-remover", "ko-KR": "/background-remover" } },
  openGraph: { title: "Free AI Background Remover", description: "Automatically remove photo backgrounds in your browser and download transparent PNG files.", url: "https://utilwise.kr/en/background-remover", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher/></nav></header>
    <section className="wrap section image-tool-page background-remover-page">
      <div className="eyebrow">UTILWISE ONLINE TOOLS</div>
      <h1>Free AI Background Remover</h1>
      <p className="sub">Choose a photo and let AI remove its background. Download a transparent PNG in seconds.</p>
      <BackgroundRemover lang="en"/>
      <div className="image-tool-guide">
        <h2>What is an AI background remover?</h2>
        <p>An AI background remover separates the main subject from the background and makes the background transparent. Use it to prepare profile photos, product images, presentation assets, and graphics.</p>
        <h2>How to remove an image background</h2>
        <ol><li>Select a JPG, PNG, or WebP image, or drag it into the upload area.</li><li>Choose Remove background and wait for the AI model to process the image.</li><li>Preview the transparent result or choose a preview background color.</li><li>Download the transparent PNG.</li></ol>
        <p>Your image is processed in your browser and is not sent to UTILWISE servers. The AI model is downloaded on first use and may be reused from your browser cache. The model can process a range of people and objects, but edge quality varies with the source image.</p>
        <h2>Frequently asked questions</h2>
        <h3>Is this tool free?</h3><p>Yes. You can use it without an account or payment. No external inference API is used for image processing.</p>
        <h3>Are my photos uploaded or stored?</h3><p>No. Your photo is processed locally in your browser. The browser downloads the AI model from an external model repository, but your image itself is not uploaded.</p>
        <h3>Which image formats are supported?</h3><p>JPG, PNG, and WebP images up to 20 MB per file are supported. Results are saved as transparent PNG files.</p>
        <h3>Can it remove complex backgrounds and fine hair?</h3><p>The AI model is designed to create soft subject edges, but results can vary depending on lighting, background complexity, and the subject in the original photo.</p>
        <p>AI model: BEN2 ONNX (MIT License), provided by ONNX Community and based on Prama LLC's BEN2.</p>
        <h2>Related image tools</h2><p>Try the <Link href="/en/image-compressor">image compressor</Link> or <Link href="/en/image-resizer">image resizer</Link>.</p>
      </div>
    </section>
  </main>;
}

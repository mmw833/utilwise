import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import TextToSpeechTool from "../../../components/TextToSpeechTool";

export const metadata: Metadata = {
  title: "Free Text to Speech Converter | AI TTS WAV Download - UTILWISE",
  description: "Convert Korean and English text to AI speech online, preview different voices, and download WAV audio for free. No sign-up required; your text stays in your browser.",
  alternates: { canonical: "/en/text-to-speech", languages: { en: "/en/text-to-speech", "ko-KR": "/text-to-speech" } },
  openGraph: { title: "Free Text to Speech Converter | UTILWISE", description: "Turn text into AI-generated speech, preview the voice, and save a WAV audio file.", url: "https://utilwise.kr/en/text-to-speech", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

const faq = [
  { question: "Which languages does this text to speech tool support?", answer: "You can choose Korean, English, Japanese, Spanish, French, and German. Pronunciation and voice quality may vary by language and text." },
  { question: "Is my text uploaded to a server?", answer: "No. Text processing and speech inference run in your browser. The speech model files are downloaded from an external repository on first use." },
  { question: "Can I download the generated audio?", answer: "Yes. Generated speech can currently be downloaded as a WAV audio file." },
  { question: "Why does the first setup take time?", answer: "The first setup downloads approximately 398 MB of speech models and prepares the runtime in your browser. Your browser may cache the files for later use." }
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/text-tools">Text Tools</Link><LanguageSwitcher/></nav></header>
    <section className="wrap section tts-page">
      <div className="eyebrow">UTILWISE TEXT TOOLS</div>
      <h1>Free Text to Speech Converter</h1>
      <p className="sub">Convert Korean and English text into AI speech, preview the selected voice, and download a WAV file for free.</p>
      <TextToSpeechTool lang="en"/>
      <article className="text-tool-guide">
        <h2>What is text to speech?</h2>
        <p>Text-to-speech (TTS) turns written words into computer-generated speech. Use it for language listening practice, checking pronunciation, listening to documents, reviewing presentation scripts, or creating personal audio notes.</p>
        <h2>How to convert text to speech</h2>
        <ol><li>Type or paste up to 3,000 characters.</li><li>Choose a language, voice, speaking speed, and generation quality.</li><li>Load the speech engine and preview the selected voice.</li><li>Generate the full audio, listen to the result, and download the WAV file.</li></ol>
        <h2>Supported languages and audio format</h2>
        <p>Choose Korean, English, Japanese, Spanish, French, or German. Pronunciation and naturalness may vary by voice, language, and text. WAV is the currently supported download format.</p>
        <h2>Privacy and first-time model download</h2>
        <p>Your text is processed in your browser and is not sent to UTILWISE. The first setup downloads approximately 398 MB of speech models from an external repository, so Wi-Fi is recommended. Loading and generation speed depend on your device memory and browser performance.</p>
        <h2>Frequently asked questions</h2>
        {faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
        <h2>Related text tools</h2>
        <p>Check your script with the <Link href="/en/text-tools/character-counter">character and word counter</Link> or estimate its length with the <Link href="/en/text-tools/speech-time">speech time calculator</Link>.</p>
      </article>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
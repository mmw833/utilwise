"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

type Lang = "ko" | "en";
type Mode = "url" | "text" | "wifi" | "email" | "phone";

const copy = {
  ko: {
    title:"QR 코드 생성기", subtitle:"웹사이트, 텍스트, Wi-Fi, 이메일, 전화번호를 QR 코드로 만들어 보세요.",
    mode:"QR 코드 유형", url:"웹사이트 URL", text:"일반 텍스트", wifi:"Wi-Fi 연결", email:"이메일", phone:"전화번호",
    content:"내용", urlPlaceholder:"https://example.com", textPlaceholder:"QR 코드로 만들 텍스트를 입력하세요.",
    network:"Wi-Fi 이름 (SSID)", password:"비밀번호", security:"보안 방식", none:"암호 없음", emailAddress:"받는 사람 이메일", subject:"제목 (선택)", body:"메시지 (선택)", phoneNumber:"전화번호",
    size:"이미지 크기", small:"작게", medium:"보통", large:"크게", generate:"QR 코드 생성", download:"PNG 다운로드",
    empty:"내용을 입력하면 QR 코드가 생성됩니다.", invalidUrl:"http 또는 https로 시작하는 올바른 URL을 입력하세요.",
    invalidEmail:"올바른 이메일 주소를 입력하세요.", invalidWifi:"Wi-Fi 비밀번호를 입력하거나 암호 없음 방식을 선택하세요.", invalidPhone:"전화번호를 입력하세요.", error:"QR 코드를 생성하지 못했습니다. 입력 내용을 확인해 주세요.",
    privacy:"입력한 내용과 QR 코드는 이 브라우저 안에서 처리됩니다. 입력값은 UTILWISE 서버로 전송되지 않습니다.",
    guide:"QR 코드 사용 안내", guideText:"생성한 QR 코드를 다운로드해 인쇄물, 안내문, 명함, 매장 안내 등에 사용할 수 있습니다. 실제 사용 전에 휴대전화 카메라로 스캔해 연결과 내용을 확인하세요.",
    faq:"자주 묻는 질문", q1:"QR 코드에 입력한 정보가 서버로 전송되나요?",a1:"아니요. QR 코드는 브라우저에서 생성되며 입력 내용은 UTILWISE 서버로 전송되지 않습니다.",
    q2:"Wi-Fi QR 코드는 어떻게 사용하나요?",a2:"Wi-Fi 유형을 선택하고 네트워크 이름과 비밀번호를 입력한 뒤 생성하세요. 지원되는 휴대전화 카메라로 스캔하면 네트워크 연결 안내가 표시됩니다.",
    q3:"QR 코드를 상업적으로 사용할 수 있나요?",a3:"다운로드한 QR 이미지는 자유롭게 사용할 수 있습니다. 다만 QR 코드가 연결하는 웹사이트나 콘텐츠의 권리는 별도로 확인해야 합니다.",
    secure:"WPA/WPA2", open:"암호 없음"
  },
  en: {
    title:"QR Code Generator", subtitle:"Create QR codes for websites, text, Wi-Fi, email, and phone numbers.",
    mode:"QR code type", url:"Website URL", text:"Plain text", wifi:"Wi-Fi", email:"Email", phone:"Phone",
    content:"Content", urlPlaceholder:"https://example.com", textPlaceholder:"Enter the text you want to encode.",
    network:"Wi-Fi network name (SSID)", password:"Password", security:"Security", none:"No password", emailAddress:"Recipient email", subject:"Subject (optional)", body:"Message (optional)", phoneNumber:"Phone number",
    size:"Image size", small:"Small", medium:"Medium", large:"Large", generate:"Generate QR code", download:"Download PNG",
    empty:"Enter content to generate your QR code.", invalidUrl:"Enter a valid URL beginning with http:// or https://.",
    invalidEmail:"Enter a valid email address.", invalidWifi:"Enter a Wi-Fi password or choose No password.", invalidPhone:"Enter a phone number.", error:"Could not generate the QR code. Please check your input.",
    privacy:"Your content and QR code are processed in this browser. Nothing you enter is sent to UTILWISE servers.",
    guide:"How to use your QR code", guideText:"Download your QR code and add it to print materials, signs, business cards, or in-store information. Scan it with a phone camera before sharing or printing to make sure it works as expected.",
    faq:"Frequently asked questions", q1:"Is my QR code data sent to a server?",a1:"No. The QR code is generated in your browser, and your content is not sent to UTILWISE servers.",
    q2:"How do I use a Wi-Fi QR code?",a2:"Choose Wi-Fi, enter the network name and password, then generate the code. A compatible phone camera can scan it and offer to connect.",
    q3:"Can I use the downloaded QR code commercially?",a3:"You can use the downloaded QR image freely. Make sure you have the necessary rights to any website or content the code links to.",
    secure:"WPA/WPA2", open:"No password"
  }
};

const escapeWifi = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/:/g, "\\:");

export default function QRCodeGenerator({ lang = "ko" }: { lang?: Lang }) {
  const t = copy[lang];
  const [mode,setMode] = useState<Mode>("url");
  const [url,setUrl] = useState("");
  const [plainText,setPlainText] = useState("");
  const [ssid,setSsid] = useState("");
  const [password,setPassword] = useState("");
  const [security,setSecurity] = useState<"WPA"|"nopass">("WPA");
  const [email,setEmail] = useState("");
  const [subject,setSubject] = useState("");
  const [body,setBody] = useState("");
  const [phone,setPhone] = useState("");
  const [size,setSize] = useState(320);
  const [image,setImage] = useState("");
  const [error,setError] = useState("");

  const payload = useMemo(() => {
    if (mode === "url") return url.trim();
    if (mode === "text") return plainText;
    if (mode === "wifi") {
      if (!ssid.trim()) return "";
      return `WIFI:T:${security};S:${escapeWifi(ssid.trim())};P:${security === "nopass" ? "" : escapeWifi(password)};;`;
    }
    if (mode === "email") {
      if (!email.trim()) return "";
      const params = new URLSearchParams();
      if (subject) params.set("subject",subject);
      if (body) params.set("body",body);
      const query = params.toString();\n      return `mailto:${email.trim()}${query ? `?${query}` : ""}`;
    }
    return phone.trim() ? `tel:${phone.trim()}` : "";
  },[mode,url,plainText,ssid,password,security,email,subject,body,phone]);

  useEffect(() => {
    let active = true;
    setError("");
    if (!payload.trim()) { setImage(""); return () => { active = false; }; }
    if (mode === "url" && !/^https?:\/\//i.test(payload)) {
      setImage(""); setError(t.invalidUrl); return () => { active = false; };
    }
    if (mode === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setImage(""); setError(t.invalidEmail); return () => { active = false; };
    }
    if (mode === "phone" && !/^[+\d][\d\s().-]{2,}$/.test(phone.trim())) {
      setImage(""); setError(t.invalidPhone); return () => { active = false; };
    }
    QRCode.toDataURL(payload,{width:size,margin:2,errorCorrectionLevel:"M",color:{dark:"#172b4d",light:"#ffffff"}})
      .then(data => { if(active) setImage(data); })
      .catch(() => { if(active) { setImage(""); setError(t.error); } });
    return () => { active = false; };
  },[payload,mode,email,phone,size,t]);

  return <div className="qr-page">
    <div className="qr-layout">
      <section className="panel qr-form">
        <h2>{t.mode}</h2>
        <div className="qr-mode-grid">
          {(["url","text","wifi","email","phone"] as Mode[]).map(item=><button type="button" key={item} className={`tab ${mode===item?"active":""}`} onClick={()=>{setMode(item);setError("");setImage("");}}>{t[item]}</button>)}
        </div>
        {mode === "url" && <div className="field"><label htmlFor="qr-url">{t.url}</label><input id="qr-url" type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder={t.urlPlaceholder}/></div>}
        {mode === "text" && <div className="field"><label htmlFor="qr-text">{t.content}</label><textarea id="qr-text" value={plainText} onChange={e=>setPlainText(e.target.value)} placeholder={t.textPlaceholder}/></div>}
        {mode === "wifi" && <>
          <div className="field"><label htmlFor="qr-ssid">{t.network}</label><input id="qr-ssid" value={ssid} onChange={e=>setSsid(e.target.value)} autoComplete="off"/></div>
          <div className="field"><label htmlFor="qr-security">{t.security}</label><select id="qr-security" value={security} onChange={e=>setSecurity(e.target.value as "WPA"|"nopass")}><option value="WPA">{t.secure}</option><option value="nopass">{t.open}</option></select></div>
          {security === "WPA" && <div className="field"><label htmlFor="qr-password">{t.password}</label><input id="qr-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password"/></div>}
        </>}
        {mode === "email" && <>
          <div className="field"><label htmlFor="qr-email">{t.emailAddress}</label><input id="qr-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></div>
          <div className="field"><label htmlFor="qr-subject">{t.subject}</label><input id="qr-subject" value={subject} onChange={e=>setSubject(e.target.value)}/></div>
          <div className="field"><label htmlFor="qr-body">{t.body}</label><textarea id="qr-body" value={body} onChange={e=>setBody(e.target.value)}/></div>
        </>}
        {mode === "phone" && <div className="field"><label htmlFor="qr-phone">{t.phoneNumber}</label><input id="qr-phone" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 555 123 4567"/></div>}
        <div className="field"><label htmlFor="qr-size">{t.size}</label><select id="qr-size" value={size} onChange={e=>setSize(Number(e.target.value))}><option value={240}>{t.small} (240px)</option><option value={320}>{t.medium} (320px)</option><option value={480}>{t.large} (480px)</option></select></div>
        <p className="hint">{t.privacy}</p>
      </section>
      <section className="panel qr-preview">
        <h2>{t.title}</h2>
        <div className="qr-image-frame">{image ? <img src={image} alt={t.title} width={size} height={size}/> : <div className="qr-empty">{error || t.empty}</div>}</div>
        {error && <p className="qr-error" role="alert">{error}</p>}
        {image && <a className="primary qr-download" href={image} download="utilwise-qr-code.png">{t.download}</a>}
      </section>
    </div>
    <section className="qr-guide">
      <h2>{t.guide}</h2><p>{t.guideText}</p>
      <h2>{t.faq}</h2>
      <h3>Q. {t.q1}</h3><p>{t.a1}</p>
      <h3>Q. {t.q2}</h3><p>{t.a2}</p>
      <h3>Q. {t.q3}</h3><p>{t.a3}</p>
    </section>
  </div>;
}

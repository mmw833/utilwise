"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
export default function LanguageSwitcher(){
 const pathname=usePathname();
 const isEnglish=pathname==="/en"||pathname.startsWith("/en/");
 const koreanPath=isEnglish?(pathname.replace(/^\/en(?=\/|$)/,"")||"/"):pathname;
 const englishPath=isEnglish?pathname:(pathname==="/" ? "/en" : "/en"+pathname);
 return <div className="language-switcher" aria-label="Language">
  <Link href={koreanPath} aria-current={!isEnglish?"true":undefined}>한국어</Link>
  <span aria-hidden="true">|</span>
  <Link href={englishPath} aria-current={isEnglish?"true":undefined}>English</Link>
 </div>;
}

"use client";

import { useMemo, useState } from "react";

type Lang = "ko" | "en";
type Shape = "box" | "cylinder";
type Unit = "mm" | "cm" | "m";

const copy = {
  ko: {
    title: "부피 계산기", shape: "도형 선택", box: "직육면체", cylinder: "원기둥",
    unit: "입력 단위", length: "가로", width: "세로", height: "높이",
    diameter: "지름", result: "부피 계산 결과", cubicM: "세제곱미터", liters: "리터",
    cubicCm: "세제곱센티미터", milliliters: "밀리리터", formula: "계산 공식과 이용 안내",
    boxFormula: "직육면체 부피 = 가로 × 세로 × 높이입니다. 입력한 길이를 미터로 환산한 뒤 세 변을 곱합니다.",
    cylinderFormula: "원기둥 부피 = π × (지름 ÷ 2)² × 높이입니다. 입력한 지름과 높이를 미터로 환산해 계산합니다.",
    example: "가로 100cm × 세로 50cm × 높이 40cm인 직육면체의 부피는 0.2㎥이며, 물 약 200L를 담을 수 있는 크기입니다.",
    notice: "계산 결과는 입력한 치수가 정확하다는 가정에 따른 기하학적 부피입니다. 실제 수납 가능 용량은 벽 두께, 내부 구조, 모서리 형태 등에 따라 달라질 수 있습니다.",
    faq: "자주 묻는 질문", q1: "1㎥는 몇 리터인가요?", a1: "1㎥는 1,000L입니다.",
    q2: "원기둥은 어떤 값을 입력하나요?", a2: "밑면의 지름과 높이를 입력하면 원기둥 부피를 계산합니다.",
    q3: "단위를 바꾸면 결과도 달라지나요?", a3: "아니요. mm, cm, m 중 어떤 단위를 선택해도 같은 실제 길이라면 부피는 동일합니다.",
    guideTitle: "부피 단위 변환", go: "계산 결과는 입력값에 따라 자동으로 갱신됩니다."
  },
  en: {
    title: "Volume Calculator", shape: "Shape", box: "Rectangular prism", cylinder: "Cylinder",
    unit: "Input unit", length: "Length", width: "Width", height: "Height",
    diameter: "Diameter", result: "Volume result", cubicM: "Cubic meters", liters: "Liters",
    cubicCm: "Cubic centimeters", milliliters: "Milliliters", formula: "Formula and guide",
    boxFormula: "Rectangular prism volume = length × width × height. Dimensions are converted to meters before multiplication.",
    cylinderFormula: "Cylinder volume = π × (diameter ÷ 2)² × height. Diameter and height are converted to meters before calculation.",
    example: "A rectangular prism measuring 100 cm × 50 cm × 40 cm has a volume of 0.2 m³, or 200 liters.",
    notice: "This is the geometric volume based on the dimensions entered. Usable capacity may be lower because of wall thickness, internal structures, and rounded edges.",
    faq: "Frequently asked questions", q1: "How many liters are in one cubic meter?", a1: "One cubic meter equals 1,000 liters.",
    q2: "What do I enter for a cylinder?", a2: "Enter the base diameter and height to calculate the cylinder volume.",
    q3: "Does changing the input unit change the actual volume?", a3: "No. The result is the same for equivalent dimensions entered in mm, cm, or m.",
    guideTitle: "Volume unit conversion", go: "Results update automatically when you change an input."
  }
};

const unitToMeters: Record<Unit, number> = { mm: 0.001, cm: 0.01, m: 1 };
const numberFormat = (value: number, digits = 4) =>
  Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: digits }) : "0";

export default function VolumeCalculator({ lang = "ko" }: { lang?: Lang }) {
  const t = copy[lang];
  const [shape, setShape] = useState<Shape>("box");
  const [unit, setUnit] = useState<Unit>("cm");
  const [length, setLength] = useState("100");
  const [width, setWidth] = useState("50");
  const [height, setHeight] = useState("40");
  const [diameter, setDiameter] = useState("30");

  const volume = useMemo(() => {
    const factor = unitToMeters[unit];
    const h = Math.max(0, Number(height) || 0) * factor;
    if (shape === "cylinder") {
      const radius = Math.max(0, Number(diameter) || 0) * factor / 2;
      return Math.PI * radius * radius * h;
    }
    const l = Math.max(0, Number(length) || 0) * factor;
    const w = Math.max(0, Number(width) || 0) * factor;
    return l * w * h;
  }, [shape, unit, length, width, height, diameter]);

  const rows = [
    [t.cubicM, `${numberFormat(volume, 6)} m³`],
    [t.liters, `${numberFormat(volume * 1000, 3)} L`],
    [t.cubicCm, `${numberFormat(volume * 1_000_000, 2)} cm³`],
    [t.milliliters, `${numberFormat(volume * 1_000_000, 2)} mL`]
  ];

  return <div className="volume-calculator">
    <div className="calc-layout">
      <section className="panel">
        <h2>{t.shape}</h2>
        <div className="tabs">
          <button type="button" className={`tab ${shape === "box" ? "active" : ""}`} onClick={() => setShape("box")}>{t.box}</button>
          <button type="button" className={`tab ${shape === "cylinder" ? "active" : ""}`} onClick={() => setShape("cylinder")}>{t.cylinder}</button>
        </div>
        <div className="field">
          <label htmlFor="volume-unit">{t.unit}</label>
          <select id="volume-unit" value={unit} onChange={e => setUnit(e.target.value as Unit)}>
            <option value="mm">mm</option><option value="cm">cm</option><option value="m">m</option>
          </select>
        </div>
        {shape === "box" ? <>
          <div className="field"><label htmlFor="volume-length">{t.length} ({unit})</label><input id="volume-length" type="number" min="0" step="any" value={length} onChange={e => setLength(e.target.value)} /></div>
          <div className="field"><label htmlFor="volume-width">{t.width} ({unit})</label><input id="volume-width" type="number" min="0" step="any" value={width} onChange={e => setWidth(e.target.value)} /></div>
        </> : <div className="field"><label htmlFor="volume-diameter">{t.diameter} ({unit})</label><input id="volume-diameter" type="number" min="0" step="any" value={diameter} onChange={e => setDiameter(e.target.value)} /></div>}
        <div className="field"><label htmlFor="volume-height">{t.height} ({unit})</label><input id="volume-height" type="number" min="0" step="any" value={height} onChange={e => setHeight(e.target.value)} /></div>
        <p className="hint">{t.go}</p>
      </section>
      <section className="panel">
        <h2>{t.result}</h2>
        <div className="result"><small>{t.cubicM}</small><strong>{numberFormat(volume, 6)} m³</strong>
          {rows.slice(1).map(([label, value]) => <div className="result-row" key={label}><span>{label}</span><b>{value}</b></div>)}
        </div>
      </section>
    </div>
    <section className="volume-guide">
      <h2>{t.formula}</h2>
      <h3>{shape === "box" ? t.box : t.cylinder}</h3>
      <p>{shape === "box" ? t.boxFormula : t.cylinderFormula}</p>
      <h3>{t.guideTitle}</h3>
      <p>1 m³ = 1,000 L = 1,000,000 cm³ = 1,000,000 mL</p>
      <h3>{lang === "ko" ? "계산 예시" : "Example"}</h3>
      <p>{t.example}</p>
      <h3>{t.faq}</h3>
      <p><b>Q. {t.q1}</b><br />{t.a1}</p>
      <p><b>Q. {t.q2}</b><br />{t.a2}</p>
      <p><b>Q. {t.q3}</b><br />{t.a3}</p>
      <div className="notice">{t.notice}</div>
    </section>
  </div>;
}

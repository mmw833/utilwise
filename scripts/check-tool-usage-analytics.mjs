import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const required = [
  "migrations/0004_tool_usage_analytics.sql",
  "app/api/analytics/tool-usage/route.ts",
  "app/admin/blog/usage/page.tsx",
  "components/AdminToolUsageAnalytics.tsx",
  "lib/analytics/tool-usage.ts",
];
for (const path of required) if (!existsSync(join(process.cwd(), path))) throw new Error(`Missing usage analytics file: ${path}`);
const migration=readFileSync(required[0],"utf8");
for (const token of ["tool_usage_events","event_id TEXT PRIMARY KEY","event_date TEXT NOT NULL"]) if(!migration.includes(token)) throw new Error(`Usage migration missing: ${token}`);
const api=readFileSync(required[1],"utf8");
for (const token of ["isAdminAuthenticated","INSERT OR IGNORE","event_date BETWEEN","tool_id"]) if(!api.includes(token)) throw new Error(`Usage API missing: ${token}`);
const tests=[
  ["app/mbti/test/page.tsx","mbti"],["app/en/mbti/test/page.tsx","mbti"],
  ["components/BigFiveExperience.tsx","big-five"],["components/EQExperience.tsx","eq"],
  ["components/EQExperienceEnglish.tsx","eq"],["components/PsychologyExperience.tsx","psychology"],
  ["components/PsychologyCollection.tsx","psychology-"],["components/ZombieExperience.tsx","psychology-zombie"],
];
for(const [path,id] of tests){const source=readFileSync(join(process.cwd(),path),"utf8");if(!source.includes("trackToolUsageStart")||!source.includes("trackToolUsage(")||!source.includes(id))throw new Error(`Missing start/completion tracking: ${path}`);}
const ko=readFileSync(join(process.cwd(),"app/tools.tsx"),"utf8");\nconst en=readFileSync(join(process.cwd(),"app/en/[tool]/EnglishCalculator.tsx"),"utf8");\nif(!ko.includes("trackToolUsage(toolId")||!ko.includes("onChangeCapture")||!en.includes("trackToolUsage(tool")||!en.includes("onChangeCapture")) throw new Error("Calculator usage tracking is not connected.");\nconsole.log("Tool usage analytics structure, personality tests, and calculator tracking checks passed.");

#!/usr/bin/env node
// matfia-brain 훅: 세션 시작 때 서버에서 판단 원칙 요약을 받아 컨텍스트에 넣는다.
// 이 파일에는 지식이 없다 — 내용은 매번 서버(오른팔 승인 상태 확인)에서 받는다.
// 어떤 실패도 세션을 막지 않는다: 항상 exit 0.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = (process.env.MATFIA_BRAIN_URL || "https://www.vibemafiaclub.com").replace(/\/+$/, "");
const TOKEN = process.env.MATFIA_BRAIN_TOKEN?.trim();
// 세션을 자주 열어도 하루 호출 상한(get_principles 50회)을 다 쓰지 않게 1시간 재사용한다. 401이면 바로 지운다
const CACHE_MS = 60 * 60_000;
const TIMEOUT_MS = 5_000;

let event = "SessionStart";
try {
  const input = JSON.parse(readFileSync(0, "utf8") || "{}");
  if (input.hook_event_name) event = input.hook_event_name;
} catch {
  // 입력이 없거나 JSON이 아니어도 SessionStart로 본다
}
const isSession = event === "SessionStart";

function done(context, notice) {
  const out = {};
  if (context) out.hookSpecificOutput = { hookEventName: event, additionalContext: context };
  // 알림은 세션 시작 때만 사용자에게 한 줄로 보여준다(서브에이전트마다 반복하지 않는다)
  if (notice && isSession) out.systemMessage = `matfia-brain: ${notice}`;
  if (Object.keys(out).length) process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

if (!TOKEN) done(null, "MATFIA_BRAIN_TOKEN이 없어 판단 원칙을 불러오지 않았습니다. https://www.vibemafiaclub.com/mypage 에서 토큰을 발급해 환경변수로 설정하세요.");

const cacheDir = process.env.CLAUDE_PLUGIN_DATA || path.join(tmpdir(), "matfia-brain");
const cacheFile = path.join(cacheDir, `principles-${createHash("sha256").update(TOKEN).digest("hex").slice(0, 16)}.txt`);
const clearCache = () => rmSync(cacheFile, { force: true });

try {
  if (Date.now() - statSync(cacheFile).mtimeMs < CACHE_MS) done(readFileSync(cacheFile, "utf8"));
} catch {
  // 캐시 없음 → 서버에서 받는다
}

let res;
try {
  res = await fetch(`${BASE}/api/brain/principles`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "text/plain" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
} catch {
  done(null, "서버에 연결하지 못해 이번 세션에는 판단 원칙 없이 진행합니다.");
}

if (res.status === 401) {
  clearCache();
  done(null, "토큰이 유효하지 않거나 마피아 프리미엄 멤버십이 확인되지 않습니다. 마이페이지에서 상태를 확인하고 토큰을 다시 발급하세요.");
}
if (res.status === 429) done(null, "오늘 판단 원칙 호출 한도를 다 써서 이번 세션에는 넣지 않았습니다.");
if (!res.ok) done(null, `서버 응답 오류(${res.status})로 이번 세션에는 판단 원칙 없이 진행합니다.`);

const text = (await res.text()).trim();
if (!text) done(null);
try {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cacheFile, text, { mode: 0o600 });
} catch {
  // 캐시 실패는 무시
}
done(text);

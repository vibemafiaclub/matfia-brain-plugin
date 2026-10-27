#!/usr/bin/env node
// matfia 훅: 세션 시작 때 서버에서 판단 원칙 요약을 받아 컨텍스트에 넣는다.
// 원칙 요약은 공개 문서라 토큰이 필요 없다(카드 본문은 MCP 로그인 연결 뒤에 있다). 이 파일에는 지식이 없다.
// 어떤 실패도 세션을 막지 않는다: 항상 exit 0.
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = (process.env.MATFIA_BRAIN_URL || "https://www.vibemafiaclub.com").replace(/\/+$/, "");
const CACHE_MS = 60 * 60_000;
const TIMEOUT_MS = 5_000;

let event = "SessionStart";
try {
  const input = JSON.parse(readFileSync(0, "utf8") || "{}");
  if (input.hook_event_name) event = input.hook_event_name;
} catch {
  // 입력이 없거나 JSON이 아니어도 SessionStart로 본다
}

function done(context, notice) {
  const out = {};
  if (context) out.hookSpecificOutput = { hookEventName: event, additionalContext: context };
  if (notice && event === "SessionStart") out.systemMessage = `마피아MCP: ${notice}`;
  if (Object.keys(out).length) process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

const cacheDir = process.env.CLAUDE_PLUGIN_DATA || path.join(tmpdir(), "matfia");
const cacheFile = path.join(cacheDir, "principles.txt");
try {
  if (Date.now() - statSync(cacheFile).mtimeMs < CACHE_MS) done(readFileSync(cacheFile, "utf8"));
} catch {
  // 캐시 없음 → 서버에서 받는다
}

let res;
try {
  res = await fetch(`${BASE}/api/brain/principles`, { headers: { Accept: "text/plain" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
} catch {
  done(null, "서버에 연결하지 못해 이번 세션에는 판단 원칙 없이 진행합니다.");
}
if (!res.ok) done(null, `서버 응답 오류(${res.status})로 이번 세션에는 판단 원칙 없이 진행합니다.`);
const text = (await res.text()).trim();
if (!text) done(null);
try {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cacheFile, text);
} catch {
  // 캐시 실패는 무시
}
done(text);

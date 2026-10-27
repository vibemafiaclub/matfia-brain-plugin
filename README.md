# 마피아MCP + Skill팩 — Claude Code 플러그인

바이브마피아클럽 최수민이 AI와 일하며 실제로 바로잡은 판단을 Claude Code가 작업 중에 꺼내 쓰게 하는 플러그인입니다. 하루 10회 무료, 구독(https://www.vibemafiaclub.com/brain)하면 제한이 없습니다.

- 세션이 시작될 때 판단 원칙 요약을 컨텍스트에 넣습니다(훅).
- 계획·결정 직전에 Claude가 `search_cards`로 비슷한 상황의 판단 카드를 찾아봅니다(MCP, 로그인 연결).
- 스킬 4개: `/matfia:plan`(기획 잡기) · `/matfia:design`(디자인 점검) · `/matfia:review`(설계 검토) · `/matfia:teach`(왜 그런지 배우기)
- 이 플러그인 파일에는 지식이 없습니다. 카드는 서버에만 있습니다.

## 설치

```bash
claude plugin marketplace add vibemafiaclub/matfia-brain-plugin
claude plugin install matfia@matfia-brain-plugin
```

Claude Code를 다시 켜고 `/mcp`에서 `matfia-brain`을 골라 로그인(카카오·구글)하면 연결됩니다.

## 옛 플러그인(matfia-brain)을 쓰고 있다면

2026-10-27부터 플러그인 이름이 `matfia`로 바뀌었습니다. 옛 플러그인도 계속 동작하지만 스킬이 없고 토큰을 직접 넣어야 합니다. 옮기려면:

```bash
claude plugin install matfia@matfia-brain-plugin
claude plugin uninstall matfia-brain
```

다시 켜고 `/mcp`에서 로그인하면 끝입니다.

## 다른 AI에서 쓰기

Claude(웹·앱)·ChatGPT·Cursor 등은 커넥터 주소 `https://www.vibemafiaclub.com/api/brain/mcp`를 추가하고 로그인하면 됩니다. 자세한 방법: https://www.vibemafiaclub.com/brain#connect

> `matfia/skills/`는 자동 생성 파일입니다(원본: 바이브마피아클럽 내부 레포). 직접 고치지 마세요.

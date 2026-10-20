# 마피아MCP(matfia-brain) — Claude Code 플러그인

최수민이 AI와 일하며 실제로 교정한 판단을 Claude Code가 작업 중에 꺼내 쓰게 하는 플러그인입니다. 마피아MCP 구독(월 39,900원, https://www.vibemafiaclub.com/brain) 또는 이용권이 있으면 쓸 수 있습니다.

- 세션이 시작될 때 판단 원칙 요약을 컨텍스트에 넣습니다(훅).
- 계획·결정 직전에 Claude가 `search_cards`로 비슷한 상황의 에피소드 카드를 찾아봅니다(MCP).
- 이 플러그인 파일에는 지식이 없습니다. 내용은 매번 서버에서 받고, 구독·이용권이 끝나면 바로 막힙니다.

## 설치

1. [마이페이지](https://www.vibemafiaclub.com/mypage)에서 **Claude Code 플러그인 토큰 발급**을 누르고 토큰을 복사합니다.
2. 셸 설정(`~/.zshrc` 등)에 추가하고 터미널을 다시 엽니다.
   ```bash
   export MATFIA_BRAIN_TOKEN=mfb_...
   ```
3. Claude Code에서:
   ```
   /plugin marketplace add vibemafiaclub/matfia-brain-plugin
   /plugin install matfia-brain@matfia-brain-plugin
   ```
4. Claude Code를 다시 시작하고 `/mcp`에서 `matfia-brain`이 연결됐는지 확인합니다.


## 쓰는 법

따로 할 일은 없습니다. 계획을 세우거나 방향을 정할 때 Claude가 알아서 카드를 찾습니다. 직접 시키려면 "마피아MCP에서 비슷한 카드 찾아봐"라고 말하면 됩니다.

| 도구 | 하는 일 | 하루 상한 |
|---|---|---|
| `search_cards(situation)` | 상황·결정을 넣으면 관련 카드 요약 최대 5개 | 200회 |
| `get_card(id)` | 카드 전문 | 60회 |
| `get_principles()` | 판단 원칙 요약 | 50회(훅 호출 포함) |

## 문제 해결

- 세션 시작 때 `마피아MCP: ...` 알림이 뜨면 그 안내를 따르세요. 실패해도 세션은 그대로 진행됩니다.
- 토큰을 다시 발급하면 이전 토큰은 바로 무효가 됩니다. 새 토큰으로 환경변수를 바꾸세요.
- 테스트 서버를 쓰려면 `MATFIA_BRAIN_URL`로 주소를 바꿀 수 있습니다.

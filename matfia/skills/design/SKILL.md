---
name: design
description: 마피아MCP 디자인 점검 — 사용자가 화면·UI·랜딩페이지·디자인을 봐 달라거나 '디자인 점검해줘', 'AI스러워 보여'라고 할 때 쓴다.
argument-hint: [target]
---

# 마피아MCP · 디자인 점검

> 이 스킬은 마피아MCP 연결이 필요합니다. search_cards 도구가 보이지 않으면 진행하지 말고 "마피아MCP를 먼저 연결해 주세요: https://www.vibemafiaclub.com/brain#connect"라고 안내하세요.
> 이 파일은 자동 생성됩니다(원본: context-hub packages/db/src/brain-skills.ts). 직접 고치지 마세요.

점검 대상: $ARGUMENTS (비어 있으면: 사용자가 가리킨 화면)

마피아MCP로 이 화면의 디자인을 점검하세요.
1. 대상을 실제로 보고(파일·스크린샷·URL) 결정 지점을 3~7개 나열합니다: 첫 화면에서 할 일 하나가 보이는가, 정보 위계, 문구, 여백·정렬, 상태(빈 화면·오류·로딩), 모바일.
2. 지점마다 search_cards를 stage=디자인으로 한 번씩 부르고, 이미 정해진 조건(브랜드·대상 사용자)을 situation에 함께 적습니다.
3. 카드 판단과 어긋나는 점, 바꿀 점부터 보고합니다. 고칠 때는 고치기 전/후를 나란히 보여 줍니다.

# Sprint 6-4: AutoPick

## Scope

Ctrl 키를 눌렀다 떼면 AutoPick 메뉴가 열리고, Source에서 인식된 항목(숫자, URL, 대문자 단어 등)을 선택하여 Target에 삽입하는 기능을 구현한다.

### 생성/수정할 파일

```
src/renderer/components/editor/AutoPickMenu.tsx    # AutoPick 팝업 메뉴
src/renderer/hooks/useAutoPick.ts                  # AutoPick 로직 훅
src/main/autopick/recognizer.ts                    # Source 텍스트 패턴 인식
src/renderer/components/editor/TipTapEditor.tsx    # (수정) Ctrl 키 이벤트 핸들링
src/renderer/styles/autopick.css                   # AutoPick 스타일
```

## 주요 동작 흐름

### AutoPick 메뉴

```
입력: TipTap 에디터에서 Ctrl 키를 눌렀다 뗌 (keyup, 다른 키와 조합 아닌 단독 Ctrl)
과정:
  1. 현재 세그먼트의 source 분석
  2. 인식 대상 추출:
     - Numbers: 숫자 패턴 (정수, 소수, 천단위 구분)
     - URLs/email: http://, https://, mailto:, @ 패턴
     - 대문자 단어: 전체 대문자 또는 첫글자 대문자 단어
  3. AutoPick 메뉴 팝업 (커서 위치 근처)
  4. 항목 클릭 또는 숫자 키 → Target 커서 위치에 삽입
출력: 선택 항목이 Target 커서 위치에 삽입

메뉴 닫기: Esc, 다른 곳 클릭, 항목 선택
메뉴 비어있음: Source에 인식 대상 없으면 메뉴 안 열림
```

### 숫자 포맷 변환

```
Source(영어): "1,234.56"
Target(한국어): "1,234.56" (동일 — 한국어도 같은 포맷)

Source(독일어): "1.234,56"
Target(영어): "1,234.56" (소수점/천단위 구분 교환)

기본: Source 숫자를 그대로 삽입 (포맷 변환은 Phase 13 Options에서 추가)
```

## 시각적 스펙

### AutoPick 메뉴

```
위치: TipTap 커서 위치 아래 (absolute positioning)
width: 240px, max-height: 200px (스크롤)
background: var(--color-bg-primary)
border: 1px solid var(--color-border-default)
border-radius: 8px
box-shadow: 0 4px 12px rgba(0,0,0,0.15)

각 항목: height 32px, padding 0 12px
  아이콘 (16px): # (숫자), @ (URL/email), Aa (대문자)
  텍스트: 인식된 값
  hover: background var(--color-bg-secondary)
  선택: background var(--color-accent-primary), color #fff
```

## Acceptance Criteria

- [ ] Ctrl 단독 눌렀다 뗌 → AutoPick 메뉴 표시
- [ ] 숫자, URL, 대문자 단어 인식
- [ ] 항목 클릭 → Target 커서 위치에 삽입
- [ ] Esc → 메뉴 닫기
- [ ] Source에 인식 대상 없으면 메뉴 안 열림
- [ ] Ctrl+B (Bold) 등 조합키는 AutoPick 트리거 안 함

## QA Checklist

- [ ] Source "Price: $1,234.56" → Ctrl → 메뉴에 "$1,234.56" 표시
- [ ] Source "Visit https://example.com" → URL 항목 표시
- [ ] 항목 클릭 → Target에 삽입
- [ ] Ctrl+B → AutoPick 안 열림 (Bold만 적용)
- [ ] 빈 Source → Ctrl → 메뉴 안 열림

## Dependencies

- Sprint 6-3 완료 필수

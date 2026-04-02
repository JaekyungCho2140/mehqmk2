# Sprint 5-3: TM 에디터 연동

## Scope

에디터에서 Ctrl+Enter 시 확인된 번역을 TM에 저장하고, 세그먼트 이동 시 TM에서 매치를 조회하여 EditPanel에 매치율을 표시한다. TM 연동의 핵심 워크플로우를 완성한다.

### 생성/수정할 파일

```
src/renderer/components/editor/MatchIndicator.tsx  # 매치율 표시 (EditPanel 내)
src/renderer/components/editor/MatchList.tsx        # 매치 결과 리스트 (간이, Phase 6 Results Pane 전)
src/renderer/hooks/useTmIntegration.ts              # TM 연동 훅
src/renderer/views/TranslationEditor.tsx            # (수정) TM 연동 통합
src/renderer/components/editor/EditPanel.tsx        # (수정) 매치 표시 영역
src/renderer/components/editor/StatusBar.tsx        # (수정) TM 매치율 표시
src/shared/types/ipc.ts                             # (수정) tm:add-entry 채널
src/main/ipc/tm.ts                                  # (수정) add-entry 핸들러
src/renderer/styles/match.css                       # 매치 표시 스타일
```

## 주요 동작 흐름

### 1. Ctrl+Enter → TM 저장

```
입력: 에디터에서 Ctrl+Enter (번역 확인)
과정 (Sprint 3-4 확인 로직 확장):
  1. 기존 확인 로직 실행 (상태 변경, DB 저장)
  2. 프로젝트에 Working TM이 연결되어 있으면:
     a. source/target 쌍 수집
     b. 이전/다음 세그먼트 source (context) 수집
     c. tm.addEntry({ tmId, source, target, prevSource, nextSource, contextId, createdBy })
     d. main: INSERT OR REPLACE INTO translation_units
     e. TM entry_count 갱신
  3. 다음 세그먼트로 이동
출력: TM에 번역 저장 + 확인 + 다음 이동

Working TM 없음: TM 저장 스킵, 나머지 동작은 동일
Ctrl+Shift+Enter: TM 저장 없이 확인 (기존 동작 유지)
```

### 2. 세그먼트 이동 → TM 조회

```
입력: 세그먼트 전환 (클릭, Arrow, Tab 등)
과정:
  1. 새 세그먼트의 source 텍스트
  2. 이전/다음 세그먼트의 source (context)
  3. tm.search({ projectId, source, prevSource, nextSource, contextId }) 호출
  4. TmMatch[] 반환 → MatchList에 표시
출력:
  - 매치 있음: MatchList에 결과 표시 + MatchIndicator에 최고 매치율
  - 매치 없음: "TM 매치 없음" 메시지

비동기: 검색은 비동기로 수행, 에디터 입력은 블로킹하지 않음
```

### 3. TM 매치 삽입

```
입력: MatchList에서 매치 항목 더블클릭 또는 Ctrl+1~9
과정:
  1. 선택한 매치의 target을 TipTap 에디터에 삽입 (setContent)
  2. 세그먼트 status → 'pre-translated' (사용자 미편집 상태)
  3. match_rate 기록
출력: Target에 TM 번역 삽입, status 변경
```

### 4. StatusBar 매치율 표시

```
위치: StatusBar 우측에 매치율 표시
형태: "TM: 101%" 또는 "TM: —"
색상: 100%+ → 초록, 85-99% → 파랑, 50-84% → 주황
```

## 시각적 스펙

### MatchIndicator (EditPanel 내)

```
위치: EditPanel Source 영역 우측 상단
형태: 배지 (border-radius: 4px, padding: 2px 8px)
  - 102%: bg #16a34a, color #fff, "102%"
  - 101%: bg #22c55e, color #fff
  - 100%: bg #3b82f6, color #fff
  - 85-99%: bg #60a5fa, color #fff
  - 50-84%: bg #f59e0b, color #fff
  - 없음: 표시 안 함
```

### MatchList (EditPanel 하단에 임시 표시)

```
위치: EditPanel 아래, height: 120px (접기 가능)
목록: 각 항목 = 매치율 배지 + Source 미리보기 + Target 미리보기 + TM 이름
  - 행 높이: 32px
  - 더블클릭 → 삽입
  - Ctrl+1~9: 번호별 삽입
  - 최대 5개 표시 (스크롤)

참고: Phase 6에서 Translation Results Pane으로 대체
```

## Acceptance Criteria

- [ ] Ctrl+Enter → Working TM에 번역 저장
- [ ] Ctrl+Shift+Enter → TM 저장 없이 확인
- [ ] 세그먼트 이동 → TM 매치 조회 + MatchList 표시
- [ ] MatchList에서 더블클릭 → Target에 삽입
- [ ] Ctrl+1~9로 매치 삽입
- [ ] MatchIndicator에 최고 매치율 표시
- [ ] StatusBar에 TM 매치율 표시
- [ ] Working TM 없는 프로젝트 → TM 기능 비활성 (에러 없음)

## QA Checklist

- [ ] 프로젝트에 Working TM 연결 → Ctrl+Enter → TM에 엔트리 추가 확인
- [ ] 같은 source 세그먼트로 이동 → TM 매치 100% 표시
- [ ] 매치 더블클릭 → Target에 삽입
- [ ] Working TM 없는 프로젝트 → Ctrl+Enter → 확인만, 에러 없음
- [ ] 여러 세그먼트 연속 확인 → TM 엔트리 누적

## Regression Checklist

- [ ] Sprint 5-2: Match Scoring 엔진
- [ ] Sprint 5-1: TM 생성, DB
- [ ] Phase 4: Import/Export
- [ ] Phase 3: 에디터 (확인, 네비게이션, 서식)

## Dependencies

- Sprint 5-2 완료 필수

## Out of Scope

- Translation Results Pane 전체 UI (Phase 6)
- Auto-insert (Phase 6)
- Fragment Assembly (Phase 6)

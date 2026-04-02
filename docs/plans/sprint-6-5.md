# Sprint 6-5: Concordance 검색

## Scope

Ctrl+K로 TM에서 단어/표현을 검색하는 Concordance 기능을 구현한다. KWIC(Key Word In Context) 표시 모드와 Source+Target 모드를 제공하고, 와일드카드 검색과 Guess translation을 지원한다.

### 생성/수정할 파일

```
src/renderer/components/concordance/ConcordancePanel.tsx  # Concordance 패널
src/renderer/components/concordance/KwicView.tsx          # KWIC 3열 뷰
src/renderer/components/concordance/FullView.tsx          # Source+Target 뷰
src/renderer/hooks/useConcordance.ts                      # Concordance 로직 훅
src/main/tm/concordance.ts                                # TM Concordance 검색 엔진
src/shared/types/ipc.ts                                   # (수정) tm:concordance 채널
src/main/ipc/tm.ts                                        # (수정) concordance 핸들러
src/renderer/styles/concordance.css                       # Concordance 스타일
```

## 주요 동작 흐름

### Concordance 검색

```
입력: TipTap에서 텍스트 선택 후 Ctrl+K (또는 선택 없이 Ctrl+K → 현재 단어)
과정:
  1. 선택 텍스트 또는 커서 위치 단어 추출
  2. tm.concordance({ query, projectId, options }) 호출
  3. TM의 모든 translation_units에서 source/target에 query 포함된 엔트리 검색
  4. 결과를 Concordance 패널에 표시
출력: Concordance 패널 열림 (Results Pane 내 또는 별도 탭)

와일드카드:
  * → 0개 이상 문자 (선택적)
  + → 1개 이상 문자 (필수)
  예: "trans*tion" → "translation", "transition"

옵션:
  - Case sensitive (기본 OFF)
  - 와일드카드 자동 추가 (기본 ON → 양쪽에 * 자동)
  - Guess translation: Source 매치 부분에 대응하는 Target 부분을 녹색 하이라이트
```

### KWIC 표시 모드

```
3열: 왼쪽 컨텍스트 | 키워드(하이라이트) | 오른쪽 컨텍스트
정렬: 키워드 기준 알파벳순
```

### Source+Target 모드

```
2행: Source 전체 (검색어 하이라이트) / Target 전체 (Guess translation 하이라이트)
```

### 삽입

```
결과에서 우클릭 → Insert (전체 Target) 또는 Insert selected (선택 부분)
더블클릭 → 전체 Target 삽입
```

## 시각적 스펙

### Concordance 패널

```
위치: Results Pane 내 탭 또는 에디터 하단 패널 (토글)
height: 200px (리사이즈 가능)

상단: 검색 바 (query 입력 + "Search" 버튼 + Case/Wildcard 토글)
모드 전환: KWIC / Source+Target 탭

KWIC 행: font-size: 13px, monospace
  왼쪽 컨텍스트: text-align right, color var(--color-text-secondary)
  키워드: font-weight bold, background #fef3c7
  오른쪽 컨텍스트: text-align left, color var(--color-text-secondary)

Guess translation: background #dcfce7 (연한 초록)
```

## Acceptance Criteria

- [ ] Ctrl+K → Concordance 패널 열림, 선택 텍스트로 검색
- [ ] KWIC 모드: 3열 키워드 중심 표시
- [ ] Source+Target 모드: 전체 텍스트 + 하이라이트
- [ ] 와일드카드 * / + 동작
- [ ] Case sensitive 토글
- [ ] Guess translation (녹색 하이라이트)
- [ ] 결과 더블클릭 → Target에 삽입
- [ ] 결과 없음 → "일치하는 항목이 없습니다" 메시지

## QA Checklist

- [ ] 텍스트 선택 → Ctrl+K → Concordance 검색 결과
- [ ] "trans*" 검색 → "translation", "transport" 등 매칭
- [ ] KWIC ↔ Source+Target 모드 전환
- [ ] 더블클릭 → 삽입
- [ ] TM 비어있을 때 → "일치 없음"

## Dependencies

- Sprint 6-4 완료 필수

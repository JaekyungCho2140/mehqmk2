# Sprint 5-2: TM Match Scoring 엔진

## Scope

TM에서 세그먼트를 검색하고 매치율을 계산하는 엔진을 구현한다. Levenshtein 퍼지 매칭, Context match(101%/102%), Number Substitution을 포함한다.

### 생성/수정할 파일

```
src/main/tm/match-engine.ts               # 매치 엔진 메인
src/main/tm/levenshtein.ts                 # Levenshtein 거리 계산
src/main/tm/number-substitution.ts         # 숫자 치환 로직
src/main/tm/scoring.ts                     # 매치율 계산 + 정렬
src/shared/types/tm.ts                     # (수정) MatchResult 타입
src/shared/types/ipc.ts                    # (수정) tm:search 채널
src/main/ipc/tm.ts                         # (수정) search 핸들러
src/preload/index.ts                       # (수정) tm.search API
```

## 핵심 데이터 모델

### MatchResult 타입

```typescript
export interface TmMatch {
  tu_id: string;
  tm_name: string;
  tm_role: TmRole;
  source: string;         // TM 엔트리의 source
  target: string;         // TM 엔트리의 target
  match_rate: number;     // 0-102
  match_type: 'double-context' | 'context' | 'exact' | 'fuzzy';
  penalties: string[];    // 적용된 페널티 목록
  created_by: string;
  modified_at: string;
}
```

### IPC 채널

```typescript
TM_SEARCH: 'tm:search',  // { projectId, source, prevSource?, nextSource?, contextId? } → TmMatch[]
```

## 주요 동작 흐름

### 1. TM 검색

```
입력: source 텍스트 + context 정보
과정:
  1. 프로젝트에 연결된 모든 TM에서 검색
  2. 각 translation_unit과 source 비교
  3. 매치율 계산:
     a. source 완전 일치 + prev/next/contextId 모두 일치 → 102% (Double context)
     b. source 완전 일치 + prev 또는 next 일치 → 101% (Context)
     c. source 완전 일치 → 100% (Exact)
     d. 유사도 50%+ → 50-99% (Fuzzy, Levenshtein 기반)
  4. Number Substitution: 숫자만 다른 경우 자동 치환 후 100% 매치
  5. 매치율 내림차순 정렬, 동률 시 Working > Master > Reference 순
출력: TmMatch[] (최대 10개)

최소 매치율: 50% (기본, TM Settings에서 변경 가능)
```

### 2. Levenshtein 퍼지 매칭

```
알고리즘:
  1. source와 TU.source를 단어 단위로 분리
  2. 5단어 이하 또는 128자 미만: 문자 단위 Levenshtein
  3. 그 외: 단어 단위 Levenshtein
  4. 매치율 = (1 - distance/max_length) * 100
  5. 긴 단어 일치에 높은 가중치 (단어 길이 비례)

성능 최적화:
  - 먼저 source 길이 비교로 후보 필터 (±50% 이내)
  - SQLite LIKE로 첫 단어 프리필터
  - 최대 100개 후보만 정밀 비교
```

### 3. Number Substitution

```
입력: source "There are 15 items", TU.source "There are 10 items"
과정:
  1. 숫자 패턴 감지 (\d+[\d,.]*\d*)
  2. 숫자 제외 텍스트 비교 → 일치
  3. target의 숫자를 source의 숫자로 치환
출력: match_rate 100%, target "10개 항목 있습니다" → "15개 항목 있습니다"

지원 패턴:
  - 정수: 10, 1000
  - 소수: 3.14, 1,000.5
  - CJK 숫자: 一, 二, 三 (선택적)
```

## Acceptance Criteria

- [ ] Exact match(100%) 정확 동작
- [ ] Context match: 101% (prev/next), 102% (double context)
- [ ] Fuzzy match: Levenshtein 기반 50-99% 범위
- [ ] Number Substitution: 숫자만 다른 경우 자동 치환
- [ ] 매치 결과 정렬: 매치율 → TM 역할 순
- [ ] 최대 10개 결과 반환
- [ ] 50% 미만은 결과에서 제외

## QA Checklist

- [ ] TM에 "Hello world" 저장 → "Hello world" 검색 → 100%
- [ ] Context 포함 검색 → 101% 또는 102%
- [ ] "There are 10 items" 저장 → "There are 15 items" 검색 → 100% (숫자 치환)
- [ ] "Hello world" 저장 → "Hello worl" 검색 → 90%+ fuzzy
- [ ] 빈 TM에서 검색 → 결과 없음

## Regression Checklist

- [ ] Sprint 5-1: TM 생성, DB

## Dependencies

- Sprint 5-1 완료 필수

## Out of Scope

- Fragment Assembly (Phase 6)
- MatchPatch (Phase 6)
- FTS5 인덱스 (성능 문제 시 추가)

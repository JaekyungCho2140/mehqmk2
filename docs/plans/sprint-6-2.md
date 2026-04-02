# Sprint 6-2: 색상 코딩 + 매치율 단계 + 램프 + 정렬

## Scope

Results Pane에 매치 유형별 색상 코딩 7종, 매치율 6단계 표시, 차이 표시 램프 8종, 결과 정렬 로직을 구현한다.

### 생성/수정할 파일

```
src/renderer/components/results/ResultItem.tsx    # (수정) 색상 코딩, 램프
src/renderer/components/results/DiffLamps.tsx     # 차이 표시 램프 컴포넌트
src/renderer/components/results/ResultsList.tsx   # (수정) 정렬 로직
src/renderer/styles/results.css                   # (수정) 색상 변수
src/shared/types/tm.ts                            # (수정) match source 타입
```

## 핵심 동작

### 색상 코딩 7종

```
결과 항목 좌측에 4px 컬러 바:
  빨강 (#ef4444): TM 매치
  파랑 (#3b82f6): TB 히트 (Phase 7)
  검정 (#1a1a2e): 금지 용어 (Phase 7)
  보라 (#8b5cf6): Fragment Assembly (Sprint 6-6)
  연한주황 (#fb923c): LSC (제외)
  회색 (#9ca3af): Non-translatable (Phase 9)
  초록 (#22c55e): Auto-translation rules (Phase 9)

현재 Phase 6: 빨강(TM), 보라(Fragment)만 활성. 나머지는 Phase 7~9에서 추가.
```

### 매치율 6단계 배지

```
102% (Double context): bg #16a34a, "102% DC"
101% (Context): bg #22c55e, "101% C"
100% (Exact): bg #3b82f6, "100%"
95-99% (High fuzzy): bg #60a5fa, "97%"
75-94% (Medium fuzzy): bg #f59e0b, "85%"
50-74% (Low fuzzy): bg #fb923c, "62%"
```

### 차이 표시 램프 (8종)

```
ResultItem 우측에 작은 원형 인디케이터 (8x8px):
  좌측 2개: Alignment(정렬 차이) / Source Edit(source 편집 여부)
  우측 6개: Spaces / Punctuation / Case / Formatting / Tags / Numbers

색상: 차이 있음 = #f59e0b (노란), 차이 없음 = #d1d5db (회색)

비교 로직 (현재 source vs TU source):
  Spaces: 공백 수/위치 차이
  Punctuation: 구두점 차이
  Case: 대소문자 차이
  Numbers: 숫자 차이
  Formatting/Tags: Phase 8에서 활성
```

### 정렬 로직

```
1순위: 매치율 (내림차순)
2순위: TM Role (Working > Master > Reference)
3순위: 수정일 (최신순)

동일 매치율 + 동일 Role → 최신 수정일 우선
```

## Acceptance Criteria

- [ ] TM 매치에 빨간 컬러 바 표시
- [ ] 매치율 6단계 배지 올바른 색상
- [ ] 램프 8종 표시 (차이 감지 시 노란색)
- [ ] 정렬: 매치율 → Role → 수정일 순

## QA Checklist

- [ ] 100% 매치 → 파란 배지, 빨간 컬러 바
- [ ] 85% 퍼지 → 주황 배지
- [ ] 대소문자만 다른 매치 → Case 램프 노란색
- [ ] 숫자만 다른 매치 → Numbers 램프 노란색
- [ ] Working TM 매치가 Reference TM보다 상위 정렬

## Dependencies

- Sprint 6-1 완료 필수

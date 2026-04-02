# Sprint 6-6: Fragment Assembly + Translation Results Settings

## Scope

TM에서 정확 매치를 조합하여 전체 세그먼트를 커버하는 Fragment Assembly 엔진을 구현한다. Translation Results Settings 다이얼로그도 추가한다.

### 생성/수정할 파일

```
src/main/tm/fragment-assembly.ts                       # Fragment Assembly 엔진
src/renderer/components/results/FragmentResult.tsx     # Fragment 결과 표시 (보라색)
src/renderer/components/ResultsSettingsDialog.tsx      # Translation Results Settings
src/shared/types/tm.ts                                 # (수정) FragmentMatch 타입
src/shared/types/ipc.ts                                # (수정) tm:fragment 채널
src/main/ipc/tm.ts                                     # (수정) fragment 핸들러
```

## 주요 동작 흐름

### Fragment Assembly

```
입력: source 텍스트 (기존 TM 매치가 100% 미만일 때 자동 실행)
과정:
  1. source를 단어/구 단위로 분리
  2. 각 부분을 TM에서 정확 매치 검색 (퍼지 불가)
  3. 매칭된 조각들을 조합하여 전체 target 생성
  4. 미매칭 부분은 source 텍스트로 삽입
  5. 커버리지 % 계산 (매칭 단어 수 / 전체 단어 수)
출력: FragmentMatch (보라색 표시, 커버리지 %)

커버리지 임계값: 기본 70% (설정 가능)
임계값 미달 시 결과에서 제외
```

### Translation Results Settings

```
다이얼로그 항목:
  TM 탭:
    - 최대 히트 수: 10 (기본)
    - 동일 target 중복 제거: ON (기본)
    - 최소 매치율: 50% (TM Settings에서도 설정 가능)
  
  Fragment 탭:
    - Fragment Assembly 활성화: ON (기본)
    - 최소 커버리지: 70% (기본)
  
  표시 탭:
    - 표시 지연: 0ms (기본, 삽입은 항상 즉시)
    - 비교 박스 모드: Traditional Compare (기본)
```

## Acceptance Criteria

- [ ] Fragment Assembly: source 분리 → TM 정확 매치 → 조합
- [ ] Fragment 결과가 Results Pane에 보라색으로 표시
- [ ] 커버리지 % 표시
- [ ] 커버리지 임계값 미달 → 결과 제외
- [ ] Translation Results Settings 다이얼로그 동작
- [ ] 설정 저장/복원

## QA Checklist

- [ ] TM에 "Hello" → "안녕", "world" → "세계" 있을 때 "Hello world" → Fragment "안녕 세계" (보라)
- [ ] 커버리지 100% → 결과 표시 / 30% → 임계값 미달 → 결과 없음
- [ ] Results Settings → 최대 히트 5 → 결과 5개까지만

## Dependencies

- Sprint 6-5 완료 필수

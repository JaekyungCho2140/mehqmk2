# memoQ Translation Editor 기능 상세 조사

> 출처: docs.memoq.com/current/en/ (memoQ 12.2 기준)
> 조사일: 2026-04-01

---

## 1. Find and Replace

memoQ에는 두 가지 찾기/바꾸기 모드가 존재한다: Quick Find와 Advanced Find and Replace.

### 1-1. Quick Find

**접근**:
- `Ctrl+F` (찾기 전용)
- `Ctrl+H` (찾기 및 바꾸기)
- Edit 리본 > Find / Replace 버튼
- Project Home Translations 패널에서 `Ctrl+F/H` → 다중 문서 검색 모드
- Quick Find 상태에서 `Ctrl+F/H` 한번 더 → Advanced Find and Replace 전환

**핵심 동작**:
- Enter → 첫 번째 매치로 이동
- Find Next 아이콘 → 다음 매치로 이동
- Find All → 별도 탭에 모든 매치 목록 생성
- Highlight All → 매칭 텍스트에 노란 하이라이트 적용
- Clear Highlighted Matches → 하이라이트 제거
- Replace This → 현재 매치 교체 후 다음으로 이동
- Replace All → 문서 전체의 모든 매치 교체
- `Esc` → 창 닫기

**설정 옵션**:
- Case Sensitive 아이콘: 대소문자 구분 토글
- Match Scope (단어 매칭 아이콘):
  - Anything: 부분 단어 매칭 허용
  - Match whole words only: 완전한 단어만 매칭
  - Entire segment/field: 세그먼트 전체가 정확히 일치해야 함
- Regular Expressions 아이콘: 정규식 모드 활성화
  - Regex Assistant 아이콘 접근 가능
  - Replace에서 `$1`, `$2` 등 변수 사용
  - 유효하지 않은 regex 시 느낌표(!) 표시

**단축키**: `Ctrl+F`, `Ctrl+H`, `Esc`

**엣지 케이스/제한**:
- 드롭다운 히스토리는 memoQ 종료 시 초기화됨
- Replace With 빈 상태에서 Replace All → 매칭 텍스트 모두 삭제됨 (경고 없음)

---

### 1-2. Advanced Find and Replace

**접근**:
- 에디터에서 `Ctrl+F` 두 번 (Quick Find → Advanced)
- Edit 리본 > Find And Replace 섹션 > Advanced 아이콘
- Project Home Translations 패널에서 `Ctrl+H` 또는 `Ctrl+F` (문서 열지 않은 상태)
- TM 편집: Resource Console > Translation memories > Edit
- LiveDocs: Resource Console > LiveDocs > 문서/쌍 더블클릭

**핵심 동작**:
- **Find Next**: 가장 가까운 매치로 이동, 하이라이트, 창 유지
- **Replace This**: 현재 매치 교체, 다음으로 이동, 창 유지
- **Replace All**: 열린 문서의 모든 매치 교체, 카운트 표시
- **Find All**: 지정 문서 검색, 결과 목록을 새 탭에 표시, 창 닫힘
- **Preview and Replace**: 하나씩 교체 가능한 결과 목록 표시, 창 닫힘
- **Mark All**: 매칭 세그먼트의 Comments 아이콘에 아웃라인 표시 (목록 미생성)
- **Highlight All**: 노란 하이라이트 적용
- **Clear Highlighting**: 하이라이트 제거

**검색 위치 (Find Where)**:
- Source / Target 체크박스 (기본: 둘 다 선택)
- Comments 체크박스
- Context ID 체크박스
- Search In 드롭다운:
  - 에디터에서: Current document / All documents / Selected documents / Open views
  - Translations 패널에서: All documents in project / Selected documents / Open views
  - LiveDocs/TM: 단일 코퍼스/메모리

**설정 옵션**:
- Case Sensitive 아이콘
- 정규식 모드 스위처: 에디터에서만 사용 가능 (TM/TB 편집 시 불가)
- Match 옵션:
  - Anything
  - Only whole words
  - Entire segment/field
  - **Do not replace if formatting would change** (포맷 보존)
- **Search within tags as well**: `<mq:ch>` 등 인라인 태그 내부 검색

**정규식 모드 특이사항**:
- Find What 필드가 멀티라인으로 변경 (드롭다운 불가)
- `<` `>` 네비게이션 아이콘으로 이전 검색어 접근
- 모든 Match 제어 옵션 비활성화 (anywhere 매칭)
- Information 아이콘 → regex 도움말 페이지

**단축키**: `Ctrl+F` (×2), `Ctrl+H`

**엣지 케이스/제한**:
- 드롭다운 히스토리 memoQ 종료 시 초기화
- 정규식 모드는 에디터에서만 사용 가능
- 창은 작업 중 열려 있음 (세그먼트 클릭, 편집 후 돌아올 수 있음)

---

## 2. Concordance

**접근**:
- `Ctrl+K` (소스 또는 타겟 세그먼트에서)
- Translation 리본 > Concordance 버튼
- 텍스트 선택 후 열기 또는 빈 상태로 열어 직접 입력

**핵심 동작**:
- TM과 LiveDocs 코퍼스에서 단어/표현 검색
- 매칭 엔트리 목록 표시 → 번역에 삽입 가능

**표시 모드**:

| 모드 | 설명 |
|------|------|
| KWIC (Keyword in Context) | 3열 기본 레이아웃, 결과 선택 시 번역 표시 |
| Source+Target | 소스, 타겟, 메타데이터를 각 행에 표시. 모든 번역 동시 확인 가능 |

**설정 옵션**:
- **Put selected text in quotes**: 정확한 구문 매칭
- **Add wildcards to selected text**: 유연한 단어 매칭
- **Case sensitive**: 대소문자 구분
- **Find different numbers, too**: 다른 숫자도 매칭 (예: Step 1, Step 2)
- **Limit spin box**: 최대 히트 수 제한 (빠른 결과)
- **Close dialog on insert**: 텍스트 삽입 후 창 자동 닫기
- **Guess translation**: 추정 번역을 녹색으로 하이라이트 (진한 녹색 = 높은 신뢰도)
- **Filter target box**: 타겟 언어 단어로 결과 필터
- **Filter source box**: 소스 언어 단어로 결과 필터
- **Auto-detect source/target**: 검색 언어 방향 자동 감지

**와일드카드 문법**:
- `*` (끝): 선택적 어미 변화 (예: `turn*` → turn, turnover, turnaround)
- `+` (끝): 필수 어미 차이
- `*` (시작): 선택적 시작 변화
- `+` (시작): 필수 시작 차이

**삽입 동작**:
- **Insert**: 전체 번역 삽입
- **Insert selected**: 하이라이트된 부분만 삽입
- 우클릭 > **Insert <text>**: 추정 번역 삽입 (Source+Target 모드)
- 우클릭 > **Insert translation**: 번역 삽입 서브메뉴

**편집/관리**:
- 우클릭 > **View/Edit Entry**: TM 엔트리 편집기 열기
- 우클릭 > **Delete entry**: TM 엔트리 삭제
- 텍스트 선택 후 우클릭 > **Add term** (또는 `Ctrl+E`): 용어집 엔트리 생성

**단축키**: `Ctrl+K`, `Ctrl+E` (용어 추가)

**엣지 케이스/제한**:
- 텍스트 미선택 시 빈 창으로 열림 → 직접 입력
- Guess translation 설정은 세션 간 유지 (수동 해제 필요)
- 모든 설정은 세션 간 유지 (기본값 자동 복원 안 됨)
- Close dialog on insert 체크 해제 시 삽입 후에도 창 유지

---

## 3. MT Concordance

**접근**:
- `Ctrl+Shift+K`
- Translation 리본 > Concordance 아이콘 하단 클릭 > 드롭다운에서 MT Concordance 선택

**핵심 동작**:
- 소스 언어 텍스트를 선택하여 MT 서비스로 번역
- 결과는 Translation results 패널 상단에 노란색으로 표시
- 각 활성 MT 서비스가 하나의 번역 결과 제공

**삽입 방법**:
- 더블클릭
- `Ctrl+1` (첫 번째 제안)
- `Ctrl+2` (두 번째 제안)
- 이후 번호 패턴 동일

**설정**:
- Edit machine translation settings에서 활성화된 MT 서비스만 결과 반환

**엣지 케이스/제한**:
- 전체 세그먼트에 매치가 없고 TM Concordance도 도움이 안 될 때 보조 수단
- 삽입된 번역은 반드시 수동 편집 필요

---

## 4. Inline Tags

### 4-1. 태그 조작 명령 (Edit 리본 Tag Commands)

**접근**: Edit 리본 > Tag Commands 메뉴

**핵심 동작과 단축키**:

| 동작 | 단축키 | 설명 |
|------|--------|------|
| Copy Next Tag Sequence | `F9` | 소스의 다음 인라인 태그 시퀀스를 타겟으로 복사. 연속된 태그가 하나의 시퀀스. 텍스트 선택 후 F9 → 선택 영역을 여는/닫는 태그로 감쌈 |
| Tag Insertion Toggle | `F6` | 자동 태그 삽입 모드 활성화/비활성화. 수동 클릭으로 태그 삽입 |
| Insert All Tags | `Alt+F8` | 소스의 모든 태그를 타겟의 한 위치에 삽입. 태그 위치가 중요하지 않을 때만 사용 |
| Arrange Tags | `Alt+F6` | 잘못 배치된 태그 시퀀스를 올바른 순서로 정렬 |
| Remove All Tags | `Ctrl+F8` | 현재 타겟 셀의 모든 태그 제거 |
| Insert New Inline Tag | (없음) | 소스에 없는 새 인라인 태그 삽입. Inline Tag 창 열림 |
| Edit Inline Tag | `Ctrl+F9` | 선택된 태그 수정. Inline Tag 창 열림 |
| Quick Insert Tag | `Ctrl+F10` | 소스 문서 유형에 허용된 태그 목록 표시. 쌍 태그는 동시 삽입 |

**태그 표시 레벨** (4단계):
- **Short**: 번호만 표시 (콤팩트)
- **Medium**: 유형과 이름 표시
- **Filtered**: 문서 정의에 따른 속성 표시
- **Long**: 모든 속성 표시

### 4-2. Insert New Inline Tag 대화상자

**접근**: Edit 리본 > Tag Commands > Insert New Inline Tag (커서를 타겟 셀에 위치)

**설정 옵션**:
- **태그 이름 드롭다운**: 문서 유형에 따라 허용된 태그 필터링
- **태그 유형** (상호 배타적):
  - Open (여는 태그 — 이후 닫는 태그 필수)
  - Close (닫는 태그 — 이전 여는 태그와 쌍)
  - Empty (독립 태그)
- **속성 관리**:
  - 속성 이름 드롭다운 (태그 호환성 필터링)
  - 속성 값 텍스트 입력
  - Add / Remove 버튼
  - 다중 속성 지원

**엣지 케이스/제한**:
- 모든 설정이 문서에 유효해야 함 — 그렇지 않으면 내보낸 문서가 사용 불가능
- XML 문서에서 속성을 직접 제어할 수 있을 때만 사용 권장
- 여는 태그 삽입 시 반드시 닫는 태그를 같은 세그먼트 또는 이후 세그먼트에 삽입해야 함
- 태그 쌍은 겹칠 수 없음

---

## 5. Insert Symbol

**접근**:
- `Ctrl+Shift+I`
- Edit 리본 > Insert Symbol

**핵심 동작**:
- 심볼 더블클릭 → 타겟 텍스트에 삽입
- Unicode 코드 직접 입력 (Decimal 또는 Hexadecimal) → Insert 클릭
- History 박스에서 최근 사용 심볼 접근

**설정 옵션**:
- **Group 드롭다운**: 다른 문자 그룹 선택
- **Range 드롭다운**: 대체 Unicode 범위 선택
- **Preview Font 드롭다운**: 글꼴 변경 (박스로 표시될 때 유용)
- **Automatically close form after insertion 체크박스**: 더블클릭 삽입 후 창 자동 닫기

**단축키**: `Ctrl+Shift+I`

**심볼 단축키 커스터마이징**:
- Options > Keyboard shortcuts > 단축키 세트 Edit (또는 Default Clone 후 편집)
- 하단의 Special characters 클릭
- Range/Group으로 문자 탐색 또는 Decimal/Hex 코드 직접 입력
- Assign shortcut 박스에 원하는 키 조합 입력 → + 클릭
- 이미 사용 중인 단축키를 재할당하면 원래 명령에서 제거됨

**엣지 케이스/제한**:
- Unicode 범위가 불완전하면 글꼴 변경해도 박스로 표시될 수 있음
- 심볼 가시성은 키보드와 사용 가능한 글꼴에 따라 다름

---

## 6. Clear Translations

**접근**: Preparation 리본 > Clear translations

**범위 옵션 (라디오 버튼, 상호 배타적)**:
- **Project**: 현재 프로젝트의 모든 문서의 모든 세그먼트
- **Active document**: 현재 열린 에디터 문서만
- **Selected documents**: Translations 뷰에서만 (에디터 활성 시 불가)
- **From cursor**: 현재 위치 아래의 세그먼트
- **Open documents**: 에디터 탭에 열린 모든 문서
- **Selection**: 현재 문서의 선택된 세그먼트만
- **Work on views 체크박스**: 프로젝트 뷰를 통해 처리 (뷰가 하나 이상 존재할 때만 사용 가능)

**삭제 옵션**:
- **All translations**: 상태 무관 모든 번역 삭제
- **Unconfirmed segments**: 확인되지 않은 세그먼트의 번역 삭제 (사전 번역 검토 후 유용)
- **Unconfirmed fuzzy or assembled**: 퍼지 매치/조각 기반 번역 제거, 100%/101% 매치 보존

**핵심 동작**:
- 번역을 문서에서만 제거 — TM에 이미 저장된 번역은 그대로 유지
- OK → 실행, Cancel → 취소

**엣지 케이스/제한**:
- Selected documents는 Translations 뷰에서만 선택 가능 (에디터가 활성화된 상태에서 불가)
- TM에 저장된 번역에는 영향 없음

---

## 7. Translation Results Pane (번역 결과 패널)

**접근**: 에디터에서 세그먼트 이동 시 자동 표시. 리소스를 백그라운드에서 조회하여 제안 표시.

### 7-1. 상단: 결과 목록

**레이아웃**: 왼쪽=소스, 중간=식별 번호, 오른쪽=타겟

**색상 코드**:

| 색상 | 소스 |
|------|------|
| 빨강 | TM 및 LiveDocs |
| 파랑 | 용어집 및 용어 서비스 |
| 검정 | 금지 용어 (경고만) |
| 보라 | 조각 조합 매치 |
| 연한 주황 | 자동 Concordance (LSC) |
| 진한 주황 | 기계 번역 |
| 노랑 | MT Concordance |
| 회색 | 비번역 항목 |
| 녹색 | 자동 번역 규칙 |

**매치율 시스템**:
- **102%**: 더블 컨텍스트 (구조화 문서)
- **101%**: 단순 컨텍스트 매치
- **100%**: 동일 세그먼트, 다른 컨텍스트. TC (Track Changes) 매치 포함
- **95-99%**: 높은 퍼지 (숫자, 구두점, 태그, 공백 차이)
- **85-94%**: 중간 1 (~10단어 세그먼트에서 1단어 차이)
- **75-84%**: 중간 2 (2단어 차이)
- **50-74%**: 낮음 (6단어 미만 세그먼트에만 유용)

**TM/LiveDocs 결과 정렬 순위**:
1. 최고 매치율 우선
2. 동일 매치율 시:
   - 저장된 매치율 (XLIFF:doc 전용) > Master TM > LiveDocs > Working TM > Reference TM
3. 카테고리 내: 최신 Modified date 우선

### 7-2. 용어집 기능

- 용어 선택 시 하단에 상세 정보 확장
- **Edit entry** 아이콘: 엔트리 편집
- **Update from active segment**: 예제 추가
- Concordance 예제: 구문 선택 → `Ctrl+K` → 히트 선택 → Update from active segment
- 복사: `Ctrl+C`, 우클릭 메뉴 (Copy selection / Copy term pair info / Copy entry info)

**Qterm 용어집**:
- 적절한 권한으로 엔트리 추가/편집 가능
- Discussion 아이콘: 요약, 문제 기술, 제안 해결책 입력
- 기존 토론은 Related discussions 아래 표시
- 서버/Qterm에서 토론 비활성화 시 또는 그룹 멤버십 제외 시 참여 불가

**히트 관리**:
- 많은 용어 히트 시 관련도 낮은 결과 자동 숨김
- 긴 매치가 짧은 매치를 숨김 (기본)
- 눈 아이콘 클릭 → 숨겨진 매치 표시
- 랭킹: 용어집 우선순위 + 프로젝트 상세 (Project name > Client name > Subject > Domain)

### 7-3. 중간: Compare Boxes

TM/LiveDocs 매치 선택 시 3개 비교 상자:
1. 현재 소스 세그먼트
2. 선택된 제안의 소스
3. 선택된 제안의 타겟

**두 가지 뷰**:

| 뷰 | 설명 |
|----|------|
| Track Changes View | 두 번째 상자에 삽입/삭제를 Track Changes 스타일로 표시 |
| Traditional Compare View | 검정=동일, 빨강=차이(조정 필요), 파랑=누락 단어(추가 필요) |

**뷰 전환**:
- 결과 목록 위 눈 아이콘 더블클릭 → Translation results settings → Compare boxes
- Options 아이콘 > Miscellaneous > Lookup results 탭 > Compare boxes 섹션

**색상 변경**: Options > Appearance > Compare boxes 탭

### 7-4. 하단: 메타 정보 상자

TM 엔트리 표시:
- Subject (Sub), Domain (Dom), Project (Pro), Client (Cli)
- TM/LiveDocs 코퍼스 이름
- 생성자/마지막 수정자 사용자명
- 생성/수정 날짜 시간
- 매치율
- 사용자 역할 (translator, reviewer 1, reviewer 2)

### 7-5. 인디케이터 "램프"

**왼쪽 2개 램프**:
- 자동 정렬 결과
- 소스 세그먼트 편집 후 TM 재전송

**6개 추가 램프** (95-101% 매치 시 점등):
- 공백 차이
- 구두점 차이
- 대소문자 차이
- 볼드/이탤릭/밑줄 포맷 차이
- 태그 차이
- 숫자 및 엔터티 차이

- **회색 램프**: memoQ가 차이를 자동 수정함
- **컬러 램프**: 수동 수정 필요
- 숫자/엔터티 램프 활성화: Project Home > Settings > TM Settings 탭에서 "Adjust fuzzy hits" 비활성화 필요

### 7-6. 필터링 및 정렬

- **닫힌 눈 아이콘**: 숨겨진 제안 있음
- 클릭 또는 `Ctrl+Shift+D` → 열린 눈 (모든 제안 표시) 토글
- Translation results settings에서 숨길 항목 설정

### 7-7. Fragment Assembly (조각 조합)

**메커니즘**:
- 긴 세그먼트에 정확한 TM 매치 없을 때, TM과 용어집에서 짧은 조각 매치를 검색하여 자동 조합
- **색상**: 보라색
- **삽입**: `Ctrl+Down`으로 이동 → `Ctrl+Space`로 삽입
- **대안**: 보라색 제안 더블클릭 또는 `Ctrl+번호` (처음 9개)

**작동 방식**:
- 세그먼트 시작부터 가장 긴 가능한 조각 검색
- 조각 미발견 시 단어별 이동
- 정확한 TM 매치만 사용 (퍼지 매치 불가)
- 용어집에서 접두사 매칭 미사용
- 전체 소스 세그먼트 커버; 미커버 단어는 소스 언어로 유지

**용어집 히트 선택 기준**:
- 긴 히트 우선
- 동일 길이: 용어집 우선순위 + 프로젝트 상세 매칭 점수
- 상세 중요도: Project name > Client name > Subject > Domain

### 7-8. MatchPatch

TM 퍼지 매치와 용어집 엔트리를 결합하여 개선된 번역 생성.

**표시**: 매치율 앞에 느낌표 (예: `!92%`), 원본→개선 매치율 (예: `73%->93%`)

**활성화**: Options > Miscellaneous > Lookup results 탭 > "Patch fuzzy TM matches"

**제한**:
- 최대 패치 매치율: 94%
- MT 서비스 1회만 검색, 첫 번역 사용
- 3자 이하 단어 건너뜀
- 숫자, 태그 패치 불가
- 사전 번역(pre-translation) 중 작동 안 함
- 일반적으로 1-2개 차이만 패치

**MatchPatch with MT**:
- Edit machine translation settings > Settings 탭 > MatchPatch 드롭다운
- 용어집/TM 패칭 실패 시 선택된 MT 서비스 사용

### 7-9. 단축키 요약

| 동작 | 단축키 |
|------|--------|
| 결과 목록 위/아래 이동 | `Ctrl+Up` / `Ctrl+Down` (NumLock OFF 필수) |
| 필터 가시성 토글 | `Ctrl+Shift+D` |
| 조각 매치 삽입 | `Ctrl+Space` (이동 후) |
| 번호로 삽입 | `Ctrl+[1-9]` |
| Concordance 예제 추가 | `Ctrl+K` (구문 선택 후) |

---

## 8. Translation Results Settings

**접근**:
- 결과 목록 위 눈 아이콘 더블클릭
- Options 아이콘 > Miscellaneous > Lookup results 탭

**설정 옵션**:

### TM & LiveDocs 필터링
- **Filter and limit translation memory and corpus hits**: 동일 타겟 세그먼트당 하나의 히트만 표시
- **Maximum number of TM and corpus hits shown**: 표시 제안 수 제한
- **Show corpus hits without translation**: 단일 언어 LiveDocs 문서의 제안 표시

### MatchPatch 설정
- **Patch fuzzy TM matches**: 자동 패칭 활성화
- **Include TM fragments (LSC hits)**: TM 조각을 용어와 함께 사용
- **Store patched match rate**: 원본 대신 개선된 매치율 저장

### 용어집 제안
- **Longest source term hides shorter matches**: 긴 용어에 포함된 짧은 용어 숨김
- **One source term gives only one translation**: 동일 소스 용어당 번역 하나만 표시

### 용어집 정렬
- 텍스트 내 출현 순서
- 소스 용어 알파벳 순서
- **Order term base hits primarily by rank**: 용어집 랭킹 및 상세(client, domain, subject) 기준 정렬

### 추가 설정
- **Show term base hits with empty target**: 현재 타겟 언어 번역이 없는 제안 표시
- **Delay before showing translation results**: 타이핑 속도 저하 방지를 위한 밀리초 지연

---

## 9. Track Changes (변경 내용 비교)

**접근**: Review 리본 > Compare versions > Custom

**핵심 동작**:
- 현재 문서와 이전 버전을 비교하여 차이점을 Microsoft Word Track Changes 스타일로 표시
- 이전 버전 선택 (Minor versions 목록) → OK → 에디터에 하이라이트로 비교 결과 표시

**중요 구분**: 이 기능은 "변경 추적을 켜는 것이 아니라" 두 버전을 비교하는 도구임

**요구사항**:
- 문서에 이전 버전이 존재해야 함
- 버전 넘버링의 보조 번호가 0보다 커야 함 (예: 1.2)

**동작 특성**:
- 비교 하이라이트가 표시된 상태로 편집 계속 가능

**제한**:
- 이전 버전이 없으면 사용 불가

---

## 10. View Pane (뷰 패널)

**접근**: View 리본 > View pane 토글. 에디터 하단 Grid 아래에 위치.

### 3가지 모드

#### 10-1. Translation Preview (HTML 미리보기)
- **기본 모드**: 포맷된 문서 미리보기 표시
- 세그먼트 번역 시 소스가 번역된 텍스트로 대체됨
- 현재 세그먼트 빨간 테두리로 하이라이트
- `Ctrl+F`: 미리보기 내 검색 (포커스 상태에서)
- 미리보기 클릭 → Grid가 해당 위치로 이동

**지원 포맷**: Word, Excel, PowerPoint, HTML, XML (XSLT 포함), 다국어 Excel, 텍스트, WPML XLIFF

**제한**:
- 웹페이지가 완성 문서와 동일하게 보이지 않을 수 있음
- XML/XML 기반 문서는 포맷이 아닌 구조 표시
- 일부 미지원 포맷은 미리보기 불가

#### 10-2. Review 모드
- 현재 세그먼트의 QA 및 LQA 경고 표시
- **Ignore 체크박스**: 개별 경고 무시
- **Refresh 아이콘**: 경고 새로고침
- **Ignore all of type**: 경고 행 호버 → 아이콘 클릭 → 프로젝트 전체 해당 유형 억제
- LQA 모델 활성 시: QA 경고를 LQA 경고로 변환 아이콘

#### 10-3. Active Comments 모드
- 현재 행의 코멘트 표시
- 연필 아이콘: 답글, 휴지통 아이콘: 삭제
- Notes 창보다 더 많은 텍스트 표시 가능

### 창 관리
- **분리**: 타이틀 바 드래그 → 보조 모니터로 이동 및 최대화
- **재도킹**: 뷰 창을 memoQ 창 위로 드래그 → 도킹 아이콘 표시
- **기본 위치 복원**: 가운데 아이콘으로 드래그

---

## 11. Notes and Discussions (노트 및 토론)

**접근**:
- 문서 수준: Translations > 문서명 옆 Notes 아이콘 더블클릭
- 세그먼트 수준: 세그먼트 선택 > 상태 박스의 Notes 아이콘 더블클릭
- Review/Quick Access 리본 > Comments 버튼
- `Ctrl+M`

**노트 관리**:
- **추가**: 심각도 선택 (Information, Warning, Error, Other) → Applies to 선택 → 텍스트 입력 → OK
- **Applies to 범위**:
  - 문서 수준: Document
  - 세그먼트 수준: Entire row, Source, Target, Selected source text, Selected target text
- **편집**: Edit 아이콘 > 수정 > Apply
- **삭제**: Delete 아이콘
- **취소**: Cancel edit (변경 취소)

**시각적 표시**:
- 코멘트 없음: 회색 아이콘
- 코멘트 있음: 주황색 아이콘

**메타데이터**: 작성자, 추가 날짜

### Discussions (온라인 프로젝트 전용)

**요구사항**: 온라인 프로젝트의 로컬 체크아웃, memoQ TMS에서 토론 활성화

**동작**:
- Discussion 탭 > Refresh > Start topic
- 토론 팔로우, 상태 변경, 제안 수정, 토픽 할당
- Reply + Send 버튼

**제한**:
- 상태/제안 변경은 할당된 사용자만 가능
- 일반적으로 "Resolved"로 상태 변경

**단축키**: `Ctrl+M`

**엣지 케이스**:
- Cancel 클릭해도 변경사항 자동 저장 (에디터/프로젝트 홈 복귀 제외)

---

## 12. Warnings (경고)

**접근**: 에디터에서 경고(번개 아이콘) 또는 에러(느낌표 아이콘) 더블클릭

**표시 지표**:
- 번개 아이콘: 경고
- 느낌표 아이콘: 에러
- 타겟 열 옆, 매치율 아래 표시

**창 내용**:
- 단일 세그먼트의 QA 이슈 목록
- 경고 코드 번호
- 각 경고 설명
- 개별 경고 무시 체크박스

**동작**:
- **Ignore 체크박스**: 특정 경고 무시. 모든 경고 무시 시 번개 아이콘 회색으로 변경

**QA 검사 유형**:
- **Quick checks**: 세그먼트 확인(confirm) 시 실행
- **Consistency checks** (동일 세그먼트 다른 번역 비교): Run QA 명령 시에만 실행

**관련 기능**:
- Run QA 창에서 "Proceed to resolve warnings after QA" 활성화 → "Resolve errors and warnings" 탭으로 진행

### Resolve Errors and Warnings 탭

**접근**:
- Review 리본 > Quality Assurance 드롭다운 > "Resolve errors and warnings"
- 범위 선택 후 OK → memoQ가 영향받는 세그먼트 수집 후 탭 열림

**상단 레이아웃**:
- 위치 정보 (문서명, 타겟 언어, 행 번호)
- 설명 (상세 이슈 설명)
- 수정 필드 (자동 수정 제안 가능 시)
- 편집 가능 세그먼트 영역

**하단 레이아웃**:
- 이슈 세그먼트 목록
- 열: Document, Row, Code, Description, Ignore 체크박스, Error/Warning 아이콘

**색상 코드**:
- 빨강: 에러
- 연한 파랑: 무시된 경고
- 녹색: 수정/확인된 항목
- 회색: 사용 불가 세그먼트 (필터링된 문서)

**동작 및 단축키**:

| 동작 | 단축키/방법 |
|------|-------------|
| 목록 이동 | Up/Down/PageUp/PageDown |
| 자동 수정 적용 | `Ctrl+Alt+Space` 또는 버튼 |
| 세그먼트 확인 (TM 업데이트) | `Ctrl+Enter` |
| 세그먼트 확인 (TM 미업데이트) | `Ctrl+Shift+Enter` |
| 경고 무시 | `Ctrl+Space` 또는 Ignore 버튼 |
| 탭 닫기 | `Ctrl+F4` 또는 Close 버튼 |

**Ignore 옵션** (Review 리본 드롭다운):
- Ignore and move to next: 단일 경고 해제
- Ignore all of this kind: 같은 유형 모든 경고
- Ignore all for this row: 한 세그먼트의 모든 경고

**Review 리본 컨트롤**:
- Refresh data: 동시 편집 시 목록 업데이트
- Hide ignored items: 해제된 경고 숨김
- Hide warnings: 에러만 표시
- Export report: HTML 리포트 생성 (TM 전용)

**제한**:
- 임베디드 에디터에서 Translation results 패널/예측 타이핑 사용 불가
- 이슈 더블클릭 → 전체 에디터로 문서 열기 가능
- 문서 필터 적용 중 탭 열면 세그먼트 회색 처리
- TM 변경 시 경고 자동 업데이트 안 됨

---

## 13. Row History (행 이력)

**접근**:
- 에디터에서 세그먼트 우클릭 > Row History
- 세그먼트에 커서 위치 → Review 리본 > Row History

**표시 열**:
- **아이콘 열 3개**: 코멘트 변경, 상태 변경, 소스 텍스트 변경 각각 표시
- **Target**: 타겟 세그먼트 텍스트
- **Version**: 문서 버전 번호
- **Date**: 변경 발생 시간
- **User**: 변경 수행자

**동작**:
- **Restore**: 이전 버전 우클릭 > "Restore selected version" → 해당 버전으로 세그먼트 복원

**기능**:
- 문서 버전 간 이전 세그먼트 번역 검토
- 변경 내용 식별 (코멘트, 상태, 소스 텍스트)
- 소스 텍스트 포함 이전 버전 복원 가능

---

## 14. Regex Assistant

**접근**: 정규식을 지원하는 memoQ 텍스트 필드의 아이콘으로 접근

**사용 가능 위치**:
- Quick Find (Find what, Replace with 필드)
- Advanced Find and Replace (별도 버튼)
- 에디터 (Source/Target 필터 필드)
- Edit QA settings (Regex 탭 필드)
- Length information rule 창
- Segmentation rule set 편집기
- Auto-translation rule set 편집기
- Regex tagger
- Regex text filter
- ZIP filter
- MSG filter (Email threads 탭)

**핵심 동작**:

### 내장 정규식 사용
- **Regex library 드롭다운**: 키워드로 필터, 매칭 항목 노란색 하이라이트
- 마지막 선택 regex가 상단에 표시
- 선택 시 Find what 필드에 자동 입력; 교체 문자열은 Replace with에 입력

### 테스트
- **Testing ground 필드**: 텍스트 붙여넣기 → 매치 하이라이트 미리보기
- 교체 문자열 존재 시 **After replace 필드**에 예상 결과 표시
- 에디터 사용자: 소스/타겟 세그먼트 직접 삽입 가능

### 커스텀 정규식 빌드
- **Regex cheat sheet 드롭다운**: .NET 플레이버 정규식 문법 요소 제공
- 토큰 선택하여 증분적으로 표현식 구성

### 라이브러리 관리
- **Add to Regex library**: 이름, 콤마 구분 라벨, 설명 입력하여 저장
- 저장된 regex는 "Your saved regexes" 섹션에 표시
- **Edit your Regex library**: 사용자 생성 regex만 표시, 패턴/이름/라벨/설명 수정 가능
- 내장 regex는 편집/삭제 불가
- 개별 Delete 아이콘 또는 체크박스 선택 후 "Delete selected regexes" (영구 삭제)
- **Manage selected labels**: 여러 엔트리에 카테고리 일괄 추가/제거

### Import/Export
- 선택된 regex를 XML 파일로 내보내기 (라벨 제거 옵션: "Remove labels on export")
- XML 파일에서 가져오기 (라벨 제거 또는 일괄 라벨 추가 옵션)
- 중복 이름의 가져온 regex는 자동으로 번호 접미사 추가

**창 관리**:
- 작업 중 열려 있음, 드래그 가능
- 우상단 흰색 X 아이콘으로 닫기

---

## 15. Regex Tagger

**접근**:
- **문서 가져오기 시**: Document Import Options > Change filter and configuration > Add cascading filter > Regex tagger 선택
- **에디터에서**: Preparation 리본 > Regex Tagger → "Tag current document" 창

**핵심 목적**: 텍스트 부분을 인라인 태그로 변환하여 코드, 플레이스홀더, XML 태그 등 번역 시 변경되면 안 되는 구조적 요소 보호

**장점**:
- 보호된 콘텐츠의 우발적 변경 방지
- `F9` 또는 Ctrl로 빠른 태그 복사
- TM 매칭 향상 (태그 없이 90% 미만 → 태그 적용 시 95%+)

**설정/구성**:
- **정규식 규칙**: 패턴 입력
- **태그 유형**: opening tag, closing tag, empty tag
- **Required 체크박스**: 타겟에 태그 누락 시 에러 플래그
- **Display text** (대체 규칙): `$0` = 매치된 텍스트, `$1`/`$2` = 특정 패턴 그룹
- **Rules handle tabs and newlines**: 줄바꿈/탭 태그화 허용 (이전 필터가 변환한 것)
- 기존 필터 구성 로드/저장 가능

**동작 버튼**:
- **Add**: 정의 후 새 규칙 삽입
- **Change**: 선택된 기존 규칙 수정
- **Delete**: 규칙 제거
- **Up/Down**: 규칙 재정렬 (겹치는 패턴 시 순서 중요)

**미리보기/테스트**:
- **Input text** 상자: 매칭 콘텐츠 표시
- **Result** 상자: 태그 적용 결과 (매치 빨간색 하이라이트)
- **Apply only selected rule**: 하나의 패턴 미리보기만 격리

**제한**:
- Regex Tagger만으로 문서 가져오기 불가 — 반드시 cascading chain의 두 번째 이후 필터로 사용
- 세그먼트에 기본적으로 탭/줄바꿈 포함 불가 (태그화 필요)

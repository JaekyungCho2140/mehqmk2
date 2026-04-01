# memoQ Translation Editor - 전체 기능 상세 추출

> 출처: docs.memoq.com/current/en/ (memoQ 12.2 기준)
> 추출일: 2026-04-01

---

## 1. Translation Editor 개요

### 접근 방법
- Project home > Translations > 문서 더블클릭 또는 우클릭 > "Open For Translation"
- 별도 에디터 탭으로 열림

### 레이아웃 구성
- **Grid** (중앙): 세그먼트 기반 번역 작업 영역
- **Translation Results Pane** (우측 또는 상단): 자동 제안 표시
- **View Pane** (하단): 문서 미리보기/QA/코멘트
- **Status Bar** (최하단): 진행률, 세그먼트 상태, QA 에러 수

### 레이아웃 커스터마이징
- 기본 레이아웃 / "Results on top" 프리셋
- **F11**: 레이아웃 프리셋 토글
- View 리본 > Reset to Default
- 각 패인 드래그 가능 (Grid, View, Translation Results)
- View Pane 분리하여 세컨드 모니터로 이동 가능

### Status Bar 표시 항목
- 서버 연결 상태
- 프로젝트 완성도 (단어/세그먼트/문자 기준 퍼센트)
- 상태별 세그먼트 수: TR, R1, R2, Ed, Rej, Empty, Pre, Frag, MT
- QA 에러 수
- 편집 모드 (Insertion / Overtype)
- 현재 위치 및 세그먼트 길이
- 태그 길이 (문자 수와 별도로 + 표기)

---

## 2. The Grid (세그먼트 그리드)

### 기본 구조
각 행(row)에 포함되는 요소:
- 세그먼트 번호/행 식별자
- Source 셀 (좌측 또는 상단)
- Target 셀 (우측 또는 하단)
- Auto-propagate 아이콘 (토글)
- Status 박스 (우측 끝): 색상, 매치율, 코멘트 아이콘
- 경고/에러 아이콘 (주황 번개 또는 빨간 에러 심볼)

### 네비게이션 & 이동

| 단축키 | 동작 |
|--------|------|
| Arrow Up/Down | 세그먼트 간 이동 |
| Page Up/Down | 한 화면 분량 이동 |
| Ctrl+Left/Right | 단어 단위 이동 |
| Ctrl+Page Up | 세그먼트 시작으로 이동 |
| Ctrl+Page Down | 세그먼트 끝으로 이동 |
| Ctrl+Home | 문서 시작으로 이동 |
| Ctrl+End | 문서 끝으로 이동 |
| 마우스 휠 / 스크롤바 | 대체 네비게이션 |

### 텍스트 선택

| 단축키 | 동작 |
|--------|------|
| Shift+Arrow | 문자/줄 단위 선택 |
| Shift+Ctrl+Arrow | 단어 단위 선택 |
| Ctrl+A | Target 셀 전체 선택 |
| Shift+Click (세그먼트 번호) | 여러 세그먼트 전체 선택 |
| Ctrl+Shift+A | 문서 내 모든 세그먼트 선택 |
| Ctrl+Shift+End | 현재부터 문서 끝까지 선택 |
| Ctrl+Shift+Home | 현재부터 문서 시작까지 선택 |

**주의**: 첫/마지막 줄에 도달하면서 선택하면 전체 세그먼트 선택 모드가 활성화됨

### 번역 확인 (Confirmation)

| 단축키 | 동작 |
|--------|------|
| Ctrl+Enter | 번역 확인 + TM 저장 + 다음 세그먼트 이동 |
| Ctrl+Shift+Enter | 번역 확인 (TM 저장 없이) |

- 모든 변경은 자동 저장됨 (미확인 세그먼트 포함)
- 확인 시 상태가 자동으로 "Confirmed"로 변경

### 텍스트 조작

| 단축키 | 동작 |
|--------|------|
| Ctrl+C | 복사 |
| Ctrl+X | 잘라내기 |
| Ctrl+V (Ctrl+Z 문서기준) | 붙여넣기 |
| Ctrl+Z | 실행 취소 |
| Ctrl+Shift+S | Source 셀 전체를 Target으로 복사 (기존 내용 대체) |
| Ctrl+Shift+T | 선택한 Source 텍스트 부분을 Target 캐럿 위치에 삽입 |
| Ctrl+Shift+N | 선택 텍스트를 다음 단어 뒤로 이동 |
| Ctrl+Shift+B | 선택 텍스트를 이전 단어 앞으로 이동 |
| 드래그 앤 드롭 | Target 셀 내/간 마우스 드래그 |

- 복수 세그먼트 선택 후 Ctrl+Shift+S로 일괄 Source→Target 복사 가능
- Undo 메뉴: Edit 리본의 Undo 아이콘 드롭다운
- Undo는 문서가 열려 있는 동안만 사용 가능

### 서식 지정

| 단축키 | 동작 |
|--------|------|
| Ctrl+B | 굵게 |
| Ctrl+I | 기울임 |
| Ctrl+U | 밑줄 |
| Shift+F3 | 대소문자 변경 메뉴 (lowercase, Initial capitals, ALL CAPITALS) |

- 지원 서식: bold, italic, underline, superscript, subscript
- **제한**: 모든 문서 포맷에서 지원되는 것은 아님

### Source 텍스트 편집

| 단축키 | 동작 |
|--------|------|
| F2 | Source 셀 편집 모드 진입 (녹색 배경) |
| Tab 또는 Target 셀 클릭 | 편집 확인 |

- **주의**: Source에서 태그를 절대 삭제하지 말 것
- TM에 편집 전/후 두 버전 모두 저장됨

### 인라인 태그 (Inline Tags)

| 단축키 | 동작 |
|--------|------|
| F9 | 다음 태그 시퀀스 복사 (또는 첫 매칭 시퀀스) |
| F9 (텍스트 선택 후) | 선택 텍스트를 태그 쌍으로 감쌈 |
| Ctrl+F8 | Target 셀의 모든 태그 제거 |
| F6 | 태그 삽입 모드 활성화 |
| Alt+F8 | 모든 태그 삽입 (비권장 - 일괄 삽입) |
| Alt+F6 | 태그 정렬 (순서 수정) |
| Ctrl+F9 | 인라인 태그 편집 |
| Ctrl+F10 | 빠른 태그 삽입 (목록에서 선택) |

**태그 표시 옵션** (Edit 리본):
- **Short**: 번호만 있는 축약 형태
- **Medium**: 타입과 이름만
- **Filtered**: 타입, 이름, 관련 속성
- **Long**: 전체 태그 정보 (모든 속성 포함)

### 특수 문자 & 제어 문자
- Edit 리본 > Frequent Symbols: 자주 쓰는 특수 문자 삽입
- Edit 리본 > Customize Symbol Shortcuts: 커스텀 심볼 추가
- Edit 리본 > Insert Symbol (Ctrl+Shift+I): 키보드에 없는 문자 삽입 창
- Edit 리본 > Non-Printing Characters: 공백, 비줄바꿈 공백 표시 토글
- LTR/RTL 마커: 아랍어/히브리어 양방향 텍스트용

### 세그먼트 조작

| 단축키 | 동작 |
|--------|------|
| Ctrl+J | 두 세그먼트 결합 (캐럿이 첫 세그먼트에 위치) |
| Ctrl+T | 세그먼트 분할 (캐럿 위치에서) |

- Edit 리본 > Add Abbreviation: 약어 추가
- 재분절(Resegment): 현재 문서 또는 전체 문서 대상 가능
- **제한**: 다른 Excel 셀이나 XML 요소의 세그먼트는 결합 불가

### 필터링 & 정렬

**필터 바 컨트롤:**
- Source 필터 박스: 소스 텍스트 내용으로 필터
- Target 필터 박스: 타겟 텍스트 내용으로 필터
- **Ctrl+Shift+F**: 선택 텍스트로 필터 (다시 누르면 토글)

**필터 옵션 (설정 아이콘):**
- Case-sensitive: 대소문자 구분 토글
- Use regex: 정규식 필터 활성화
- Include comments: 세그먼트 코멘트까지 검색 확장
- Include context IDs: 구조화 문서 식별자 검색
- Do not include source or target text: 코멘트/컨텍스트만 검색
- Highlight all: 매칭 구문 하이라이트
- Clear previous filter results: 필터 간 초기화
- Matching options: Anything / Whole words only

**정렬 옵션:**
- No sorting (문서 순서)
- Alphabetical by source/target
- Source/target text length
- Match rate
- Frequency
- Last changed
- Row status
- 오름차순/내림차순 토글

### Auto-propagation

| 단축키/방법 | 동작 |
|-------------|------|
| 더블클릭 auto-propagate 아이콘 | 특정 세그먼트 on/off 토글 |
| 우클릭 > Disable/Enable auto-propagation | 대체 토글 |
| Ctrl+Shift+H | 키보드 토글 |

- 아이콘 표시: 아래 화살표(활성) / 빨간 X 있는 아래 화살표(비활성)
- 설정은 재임포트 후에도 유지됨

### 세그먼트 상태 표시 (색상 코딩)

| 상태 | 색상/아이콘 |
|------|-------------|
| Not started | 회색 |
| Edited | 분홍 |
| Pre-translated | 파랑 |
| Assembled from fragments | 보라 |
| Machine-translated | 주황 |
| Translator confirmed | 초록 + 단일 체크 |
| Reviewer 1 confirmed | 초록 + 체크+플러스 |
| Reviewer 2 confirmed | 초록 + 이중 체크 |
| Locked | 자물쇠 아이콘, 회색 배경 |
| Rejected | 빨강 + X 연필 |

- Status 박스 더블클릭: Change segment status 창 열기
- Pre-translated 세그먼트에 매치율 퍼센트 표시

### 표시 배열 옵션
- View 리본 > Active Row 아이콘 드롭다운:
  - **In the middle (horizontal)**: Target 셀이 Source 아래 배치
  - **Anywhere**: 기본 좌우 배열

### 문서 닫기
- 에디터 탭 닫기 버튼 또는 **Ctrl+F4**: Project home으로 복귀

---

## 3. Translation Results Pane (번역 결과 패인)

### 3단 구조

#### 상단: 결과 목록
- **Ctrl+Up/Down**: 결과 하이라이트 이동
- NumLock OFF 필수 (Page Up/Down, Home, End, 화살표 단축키 사용 시)
- 컬럼: 소스어 항목(좌), 식별 번호(중), 타겟어 대응(우)

#### 중단: 비교 박스
**Track Changes 뷰**: 차이가 tracked changes로 표시; 삽입/삭제가 박스2에만 하이라이트

**Traditional Compare 뷰**: 색상 코딩 - 검정(동일), 빨강(차이), 파랑(누락 단어)

#### 하단: 메타 정보
TM 항목 표시 정보:
- Subject, domain, project ID, client
- TM/corpus 이름, 수정자 사용자명, 생성/수정 타임스탬프
- 매치율, 사용자 역할 (translator/reviewer 1/reviewer 2)

### 결과 색상 코딩 & 소스 유형

| 색상 | 소스 | 상세 |
|------|------|------|
| 빨강 | Translation memories / LiveDocs | 이중언어 문서, 정렬 쌍, TM 히트 |
| 파랑 | Term bases | 일반 용어 DB, 용어 추출 세션, 외부 용어 서비스 |
| 검정 | Forbidden terms | 삽입 불가; 경고로만 표시 |
| 보라 | Fragment assembly | 작은 조각에서 조립 |
| 연한 주황 | Automated concordance (LSC) | 최장 부분문자열 매칭 |
| 진한 주황 | Machine translation | 설정된 MT 플러그인 |
| 노랑 | MT concordance | 기계번역된 구문 |
| 회색 | Non-translatable items | 번역 불가 항목 |
| 초록 | Auto-translation rules | 패턴 기반 규칙 (날짜, 단위, 통화) |

### 매치율 카테고리

| 카테고리 | 매치율 | 설명 |
|----------|--------|------|
| Context match | 101% (단순) / 102% (이중 컨텍스트) | 구조화 문서의 이중 컨텍스트 |
| Exact match | 100% | TC(Track Changes) 매치 포함 |
| High fuzzy | 95-99% | 숫자, 구두점, 태그, 공백 차이 |
| Medium fuzzy 1 | 85-94% | ~10단어 세그먼트에서 1단어 차이 |
| Medium fuzzy 2 | 75-84% | ~10단어 세그먼트에서 2단어 차이 |
| Low fuzzy | 50-74% | 6단어 미만 세그먼트에 유용 |

### 결과 정렬 순서
1. 최고 매치율 우선
2. 매치율 동일 시: 저장된 매치율 > Master TM > LiveDocs > Working TM > Reference TM
3. 카테고리 내: 최신(Modified date 기준) 우선

### 차이 표시 램프 (Lamps)

**좌측 2개 램프:**
- 자동 정렬 표시
- Source 텍스트 편집 후 TM 재전송 표시

**우측 6개 램프 (95-101% 매치 시):**
- 공백 문자 차이
- 구두점 차이
- 대소문자 차이
- Bold/Italic/Underline 서식 차이
- 태그 차이
- 숫자/엔티티 차이

**램프 상태**: 색상 점등(수동 수정 필요) / 회색 점등(memoQ 자동 수정 완료)

### 필터링 & 가시성
- **닫힌 눈 아이콘**: TM, LiveDocs, 용어 DB의 숨겨진 제안 표시
- **클릭 또는 Ctrl+Shift+D**: 모든 제안 표시 (열린 눈으로 변경)
- **더블클릭 눈 아이콘**: Translation Results Settings 창 열기

### 삽입 방법

| 방법 | 동작 |
|------|------|
| Ctrl+Space | 첫 번째(최상위) 제안 삽입 |
| Ctrl+숫자(1-9) | 해당 번호의 제안 직접 삽입 |
| Ctrl+Down/Up | 제안 간 이동, Ctrl+Enter로 삽입 |
| 더블클릭 | Translation results 목록에서 삽입 |

### Term Base 기능
- 항목 확장/축소: 삼각형 아이콘 클릭
- 우클릭 > "View/edit": TM 항목 편집 창 열기
- "Edit entry" 아이콘: 용어 DB 항목 창
- "Update from active segment": 현재 세그먼트를 예시로 추가
- 복사 옵션: "Copy selection", "Copy term pair info", "Copy entry info"

**Qterm (서버 용어 DB) 기능:**
- 항목 추가/편집 직접 가능
- 문서명, 수정일, 수정자 정보 포함
- Discussion 기능: 요약, 문제 기술, 해결 제안

### Fragment Assembly (조각 조립)
- TM에서 정확 매치만 검색 (퍼지 불가), 용어 DB(접두사 매칭 없음)
- 항상 전체 소스 세그먼트 커버; 찾지 못한 단어는 소스 언어로 삽입
- **Ctrl+3** (또는 Ctrl+화살표) 후 **Ctrl+Space**로 삽입
- 보라색으로 표시

### MatchPatch 기능
- **기능**: TM 퍼지 매치 + 용어 DB 히트를 결합하여 매치 품질 향상
- **표시**: 매치율 앞 느낌표 (예: "!92%"); 하단에 원래→개선 비율 표시 (예: "73%->93%")
- **활성화**: Options > Miscellaneous > Lookup Results 탭 > "Patch fuzzy TM matches" 체크박스
- **포함 옵션**: "Include TM fragments (LSC hits)"
- **저장 옵션**: "Store patched match rate instead of the original match rate"
- MatchPatch with MT: Edit Machine Translation Settings > Settings 탭에서 MT 서비스 선택
- **제한**: 숫자, 태그는 패치 불가; 프리트랜슬레이션 중 불가; 3자 이하 단어 미검색
- **패널티**: 패치된 매치율은 최대 94%를 초과하지 않음

---

## 4. Translation Results Settings (번역 결과 설정)

### 접근 방법
- Translation Results Pane 상단의 눈 아이콘 더블클릭

### TM & LiveDocs 필터링
- "Select this checkbox to show only one hit for identical target segments": 동일 타겟 중복 제거
- Maximum number of TM/corpus hits: 표시 제안 수 조정
- "Show corpus hits without translation": 번역 없는 단일 언어 문서 제안 표시

### 용어 DB 제안 관리
- **"Longest source term hides shorter matches"**: 중첩 용어 숨김 (예: "translation memory" 있으면 "translation" 숨김)
- **용어 정렬 옵션**:
  - 텍스트 내 출현 순서
  - 소스 용어 알파벳 순
- **"Order term base hits primarily by rank"**: 활성화 시 용어 DB 랭킹/메타데이터 우선 정렬
- **"Show term base hits with empty target"**: 타겟 언어 번역이 없는 용어 표시

### 표시 타이밍
- "Delay before showing translation results": 밀리초 단위 표시 지연 설정
- **중요**: 지연은 제안 목록 표시에만 영향; 세그먼트 자동 삽입은 즉시 실행

---

## 4.5. Automatic Lookup and Insertion (자동 조회 및 삽입)

### 접근 방법
- Translation 리본 > Translation Settings > Automatic Lookup and Insertion

### 핵심 동작
- 세그먼트로 이동하면 memoQ가 자동으로 TM, 용어 DB, 모든 리소스에서 매치 검색
- 결과는 Translation Results Pane에 자동 표시

### 검색 리소스
- Translation memories (TM)
- Term bases
- LiveDocs corpora
- External TM plugins (체크박스로 활성화)
- Machine translation plugins (설정 필요)
- Fragment-assembled matches

### 설정 옵션

| 설정 | 설명 | 기본값 |
|------|------|--------|
| Automatically scan segments | 리소스 자동 검색 활성화 | 활성 |
| Automatically insert best result after confirming segments | 확인 후 최적 결과 자동 삽입 | 활성 |
| Keep processing segments until one meets Goto next conditions | Goto next 조건 충족 전까지 자동 연속 처리 | - |
| Insert MT hit if no suitable TM hit is present | TM 매치 없을 때 MT 결과 삽입 | - |
| Insert assembled hit if no suitable TM hit is present | TM 매치 없을 때 조각 조립 결과 삽입 | - |
| Copy source to target if no other match found | 매치 없을 때 소스를 타겟으로 복사 | 비활성 |
| Include TM plugins | 외부 TM 플러그인 검색 포함 | - |

### 삽입 우선순위
1. Best TM or corpus hit (최소 매치율 임계값 설정 가능)
2. Machine translation (활성화 시)
3. Fragment-assembled hit (최소 커버리지 % 설정 가능)
4. Source-to-target copy (최후 수단)

### Fragment Coverage 설정
- 최소 문자 커버리지 퍼센트 설정 (예: 60% = 40% 소스 텍스트 잔여 허용)

### 범위
- **설정은 memoQ 전역 적용**: 모든 프로젝트, 모든 문서에 동일 설정 사용

---

## 5. Go to Next Segment (다음 세그먼트로 이동)

### 접근 방법
- **Ctrl+Shift+G**: 대화상자 열기
- **Ctrl+G**: 마지막 점프 조건 반복
- Edit 리본 > Go To Next 화살표 > Settings

### 기본 네비게이션
- 행 번호 직접 입력 후 Enter/OK로 점프 (Ctrl+G로 반복 불가)

### Common Filters 탭
- All rows (필터 없음)
- Not confirmed in any role
- Confirmation status (Translator / Reviewer 1 / Reviewer 2)
- Pre-translated
- Match rate 범위 (예: 80-90%)
- Error
- Change/conflict marks
- Repetitions / Non-repetitions
- Locked / Not locked

### Status 탭 (상세 필터)

**Row Status:**
- Not started, Edited, Assembled from fragments
- Pre-translated 변형 (100% 미만, unambiguous, 100%/101%)
- Machine translated, X-translated
- 확인 상태들, Rejected

**Lock Status:**
- Both locked and unlocked
- Only locked rows
- Only unlocked rows

**Other Properties:**
- Auto-joined/split 세그먼트
- Error, Unsuppressed warning
- Repetition status
- Track Changes 매치
- Commented 세그먼트
- Auto-propagated content
- Find/Replace marked 세그먼트
- Change-tracked 세그먼트

### Conflicts and Changes 탭
**Bilingual Update:** 문서 업데이트 시 수정된 세그먼트

**Online Synchronization:**
- 서버에서 다운로드된 변경
- 충돌: 클라이언트 버전이 서버에 저장됨
- 충돌: 클라이언트 버전이 서버에 의해 거부됨

**Last Changed:**
- 사용자명 필터
- 번역자명 필터 ("Get user names" 버튼)
- 수정 후 날짜/시간

**Inserted Match:**
- 편집된 매치 vs 미수정 매치
- 처음부터 번역된 세그먼트

### Comment and Tags 탭
- 코멘트 표현식 (쉼표 구분)
- 언어 품질 에러
- memoQ 서식 태그 (소스/타겟)
- 특정 텍스트를 가진 인라인 태그
- **고급 인라인 태그 쿼리** (`>` 구문):
  - `tagname`: 모든 발생
  - `tagname>attribute`: 특정 속성
  - `tagname>attribute>value`: 속성 값
  - 홑따옴표: 정확 매치
  - 이스케이프: `\"`, `\'`

### 방향 제어
- **Down**: 기본 정방향
- **Up**: 역방향

### 자동 점프
- "Automatically jump after confirmation" 체크박스: Confirm, Ctrl+Enter, Ctrl+Shift+R 후 자동 이동

### 결과 액션
- **OK**: 조건 저장 + 즉시 점프
- **Remember**: 조건 저장 (점프 안 함)
- **Cancel**: 저장 없이 취소

### 매칭 로직
- 탭 간 조건: AND 로직
- 그룹 내 체크박스: OR 로직

---

## 6. Change Segment Status (세그먼트 상태 변경)

### 접근 방법
- Preparation 리본 (편집기 또는 Project home에서)

### 변경 가능 상태
- Not started, Edited, Pre-translated
- **제한**: Confirmed로는 직접 변경 불가

### 범위 옵션 (라디오 버튼)
- **Project**: 프로젝트 내 모든 문서의 모든 세그먼트
- **Active document**: 현재 보고 있는 문서
- **Selected documents**: 사전 선택된 복수 문서
- **From cursor**: 현재 위치 아래 세그먼트
- **Open documents**: 열려 있는 모든 에디터 탭
- **Selection**: 현재 선택된 세그먼트만
- **Work on views**: 프로젝트 뷰의 세그먼트 (있는 경우)

### 필터 옵션
"Only rows with the following status" 체크박스:
- Translator confirmed
- Reviewer 1 confirmed
- Reviewer 2 confirmed
- Edited
- Pre-translated
- 또는 "All rows in scope"

### 권장 워크플로우
1. Confirmed → Pre-translated로 변경 (프리트랜슬레이션 매치용)
2. 나머지 Confirmed → Edited로 변경
3. Edited에 프리트랜슬레이션 적용하려면 → Not started로 복원

---

## 7. Lock Segments (세그먼트 잠금)

### 접근 방법
- Preparation 리본 > Lock/Unlock Segments
- **Ctrl+Shift+L**: 단일 또는 복수 선택 세그먼트 잠금/해제

### 시각적 표시
- 잠긴 세그먼트: 회색 배경 + 자물쇠 아이콘

### 동작
- 잠긴 세그먼트는 편집 불가
- Auto-propagation 비활성화: 반복 번역이 잠긴 세그먼트를 채우지 않음

### 범위 옵션
- Project / Active document / Selected documents / From cursor / Open documents / Selection / Work on views

### 세그먼트 상태 필터
- Translator confirmed / Reviewer 1 confirmed / Reviewer 2 confirmed
- Pre-translated / Repetitions / Non-repetitions / All rows

### 언어 감지 기능
- 프로젝트 소스 언어와 다른 언어의 세그먼트를 자동 감지하여 잠금
- 잠금 시 소스를 타겟으로 복사
- 기존 번역은 보존
- 최소 길이 설정: 기본 3단어 이상 (짧은 세그먼트는 감지 부정확)

### 통계 통합
- 잠긴 세그먼트는 프로젝트 통계에서 집계 또는 제외 가능

---

## 8. Advanced Filters (고급 필터)

### 접근 방법
- 번역 에디터 상단의 Advanced filters 아이콘

### 4개 탭

#### 탭 1: Common Filters
- All rows (필터 없음)
- Not confirmed in any role
- Translator/Reviewer 1/Reviewer 2 confirmed
- Pre-translated
- Match rate 범위
- Error
- Change/conflict marks
- Repetitions / Non-repetitions
- Locked / Unlocked

#### 탭 2: Status (상세)
**매치율 필터**: 이중 입력 박스로 범위 지정

**Row Status 체크박스:**
- Not started, Edited, Assembled from fragments
- Pre-translated 변형들
- Machine translated, X-translated
- 확인 레벨들 (Translator, Reviewer 1, Reviewer 2)
- Rejected

**잠금 상태:**
- Both / Only locked / Only unlocked

**기타 속성:**
- Auto-joined/split, Errors, Warnings, Repetitions
- TC matches, Comments, Auto-propagated, Find/Replace marked, Change-tracked

#### 탭 3: Conflicts and Changes
- Bilingual Update 감지
- Online Synchronization (서버 변경, 충돌)
- Last Changed (사용자, 날짜/시간)
- Inserted Match (편집됨/미편집)

#### 탭 4: Tags and QA
- LQA 에러 감지
- memoQ 미해석 서식 태그 (소스/타겟)
- 인라인 태그 텍스트 검색 (쉼표 구분)
- 고급 태그 필터 (`>` 구문 사용)

### 로직 규칙
- 체크된 조건 간: OR
- "Locked or not": AND
- 순차 필터 옵션: Filtering options 창

---

## 9. AutoPick (자동 선택)

### 핵심 동작
- 번역 중 **Ctrl을 눌렀다 떼면** AutoPick 메뉴 열림
- 메뉴에서 항목 선택하여 Target 셀에 삽입
- 한 번 삽입된 항목은 해당 세그먼트에서 다시 제안하지 않음

### 설정 옵션
- Enable/Disable 체크박스
- "Always show AutoPick markers in the source text": 소스에 파란 마커 표시
- "Do not show text that is already there in the translation": 중복 방지

### 인식 가능 콘텐츠
- Tags
- Numbers
- URLs and email addresses
- All-uppercase words
- Terms, auto-translatables, non-translatables

### 숫자 포맷 옵션
- 타겟 언어 규칙에 따른 숫자 포맷
- 소수점 기호 (마침표 / 쉼표)
- 음수 부호 스타일 (dash, en-dash, minus)
- Unicode 숫자 셋 선택
- 자릿수 구분 기호 (공백, 아포스트로피, 따옴표)
- 숫자와 측정 단위 사이 간격
- 10,000 미만 그룹화 스킵
- 소스에 없어도 그룹화 기호 강제 적용

### 범위
- 설정은 모든 memoQ 프로젝트/문서에 전역 적용

---

## 10. Predictive Typing (예측 입력)

### 제안 표시 모드
- **Text only**: Target 셀에 텍스트로만 표시
- **Text and list**: 셀과 팝업 목록 모두 표시 (기본)
- **List only**: 팝업 목록으로만 표시

### 제안 소스
- Term bases
- Non-translatables
- Automatic concordance hits
- Muses
- Auto-translation rules

### 설정 옵션

**Concordance:**
- "Include LSC hits in predictive typing": 자동 concordance 매치 포함 여부

**대소문자:**
- "Lookup is case-sensitive" (기본 활성): 대소문자 불일치 제안 차단
- 비활성화 시 대소문자 불일치 제안 허용

**트리거 임계값:**
- "Muse suggestions" 박스: Muse 제안 활성화 전 필요 문자 수
- "All other suggestions" 박스: 기타 제안 활성화 전 필요 문자 수
- 기본: 첫 문자에 제안 시작; 두 번째 문자에 Muse 제안 추가

**대문자 처리:**
- Base on original match (소스 포맷 우선)
- Adjust to typing (사용자 입력 대문자 반영)
- Intelligent capitalization (소스/타겟 세그먼트 컨텍스트 분석)

### 키보드 조작

| 단축키 | 동작 |
|--------|------|
| Enter / Tab | 선택된 제안 수락 |
| Down arrow + Tab/Enter | 대체 제안 선택 후 수락 |
| Esc | 제안 목록 닫기 |

---

## 11. Clear Translations (번역 지우기)

### 접근 방법
- Preparation 리본 > Clear translations

### 핵심 동작
- 문서의 Target 세그먼트에서 번역 삭제
- **TM에 저장된 번역은 삭제되지 않음** (문서에서만 제거)

### 범위 옵션
- Project / Active document / Selected documents / From cursor / Open documents / Selection

### 필터 옵션
1. **All translations**: 상태 무관 전체 삭제
2. **Unconfirmed segments**: 미확인 번역만 삭제
3. **Unconfirmed fuzzy or assembled**: 퍼지/조각 번역만 삭제 (100%/101% 매치 보존)

### 추가 설정
- **Work on views**: 프로젝트 뷰 세그먼트 처리 (뷰 존재 시)

---

## 12. Review Changes and Conflicts (변경 및 충돌 검토)

### 접근 방법
- Preparation 리본 > Changes and Conflicts > Review Changes and Conflicts

### 변경 마크 유형
1. **Changed by Others**: 다른 사용자가 세그먼트를 변경
2. **You Won**: 내 변경이 서버에 저장됨

### 네비게이션
- 목록에서 개별 항목 클릭
- **Ctrl+Down/Up**: 목록 내 이동

### 충돌 해결 (서버 버전이 내 것을 덮어씀)

| 단축키 | 동작 |
|--------|------|
| Ctrl+Enter | 서버 버전으로 확인 |
| Ctrl+Shift+Enter | Working TM 업데이트 없이 확인 |
| Ctrl+Space | 서버 버전 무시, 내 번역 유지 |
| Dismiss 체크박스 | 개별 충돌 표시 |
| Dismiss all changes | 모든 세그먼트 원래 내용으로 복원 |

### 변경 해결 (내 버전이 서버를 덮어씀)

| 단축키 | 동작 |
|--------|------|
| Ctrl+Enter | 세그먼트 확인, 내 버전 서버 유지 |
| Ctrl+Shift+Enter | Working TM 업데이트 없이 확인 |
| Ctrl+Space | 서버 버전으로 대체 |

### 범위 선택 (Review Conflict and Change Marks 창)
- Project / Active document / Selected documents / From cursor / Open documents / Selection / Work on views
- 단일 언어 필터링 가능

---

## 13. Track Changes (변경 추적)

### 활성화 방법
- Review 리본 > Track changes 클릭

### 핵심 동작
- Microsoft Word 스타일로 삽입/변경/삭제 표시
- 각 변경에 사용자명과 타임스탬프 기록
- 소스 문서의 tracked changes도 마크업으로 표시

### 표시 옵션
- Review 리본 > Show changes 드롭다운:
  - Final version only (최종 버전만)
  - With markup (마크업 포함)

### Track Changes Matches (TC 매치)
- 소스에 tracked changes가 있을 때 나타나는 특수 100%/101% 매치
- 변경 전 텍스트를 기준으로 TM 조회
- 이전 번역한 문서의 편집 버전 번역 시 유용

### 버전 비교 (Compare Versions)
- Review 리본 > History > Compare versions 드롭다운:
  - **Off**: 비교 없음
  - **Against Last Received Version**: 마지막 임포트 버전과 비교
  - **Against Last Delivered Version**: 마지막 익스포트 버전과 비교
  - **Against Last Inserted Match**: 마지막 프리트랜슬레이션 스냅샷과 비교
  - **Custom**: Track changes against previous version 창 열기

### Export 제한
- Word, SDLXLIFF, table RTF 문서에서만 tracked changes 내보내기 가능

### 거부 (Rejection)
- **Shift+Enter**: 세그먼트 거부 (LQA 모델 활성 시 LQA 에러 창 열림)

---

## 14. View Pane (뷰 패인)

### 위치 & 토글
- 번역 에디터 하단, Grid 아래
- View 리본 > "View pane" 버튼으로 on/off

### 3가지 표시 모드 (우상단 버튼)

#### 1. Translation Preview (HTML Preview)
- 번역 문서의 포맷/구조 미리보기
- 현재 세그먼트 빨간 테두리로 하이라이트
- 미리보기 클릭 시 Grid가 해당 위치로 점프
- **Ctrl+F**: 미리보기 내 텍스트 검색
- 지원 포맷: Word, Excel, PowerPoint, HTML, XML (XSLT 포함), multilingual Excel, text, WPML XLIFF, XML
- **제한**: 미리보기는 근사치; XML은 구조만 표시; 모든 포맷 보장 안 됨

#### 2. Review Mode
- 현재 세그먼트의 QA/LQA 경고 표시
- 개별 경고에 "Ignore" 체크박스
- Refresh 아이콘으로 QA 경고 목록 갱신
- 경고 위 호버: "같은 유형의 모든 경고 무시" 아이콘
- LQA 모델 활성 시: QA 경고를 LQA 경고로 변환 아이콘

#### 3. Active Comments Mode
- 현재 세그먼트의 코멘트 표시
- 연필 아이콘: 응답
- 쓰레기통 아이콘: 삭제
- Notes 창보다 더 넓은 표시 공간

### 도킹 기능
- 타이틀바 드래그로 메인 창에서 분리
- 세컨드 모니터로 이동 가능
- 재도킹 시 위치 아이콘 표시
- 중앙 아이콘: 원래 위치로 복귀

---

## 15. Notes and Discussions (노트 및 토론)

### 접근 방법
- **문서 레벨**: Project Home > Translations > 문서 옆 Notes 아이콘 더블클릭
- **세그먼트 레벨**: 세그먼트 Status 박스의 Notes 아이콘 더블클릭
- **리본**: Review/Quick Access 리본 > Comments 버튼
- **단축키**: **Ctrl+M**

### 노트 기능

**심각도 레벨:**
- Information, Warning, Error, Other

**적용 대상 옵션 (세그먼트 컨텍스트):**
- Entire row
- Source
- Target
- Selected source text
- Selected target text
- 문서 컨텍스트에서는 항상 "Document"

**편집 & 관리:**
- 연필 아이콘: 기존 노트 편집 (심각도, 코멘트 텍스트)
- 쓰레기통 아이콘: 삭제
- 작성자명 + 타임스탬프 자동 기록

### 토론 기능 (온라인 프로젝트 전용)

**전제 조건:**
- 온라인 프로젝트 체크아웃 필수
- memoQ TMS에서 활성화 필요

**토론 기능:**
- "Start topic": 토론 시작
- Follow topics: 알림 수신
- 토픽 상태 변경 (보통 "Resolved"로)
- 토픽 내 제안 변경
- 토픽을 사용자에게 할당
- 텍스트 입력으로 토픽에 답변
- Refresh로 업데이트 확인

**저장 동작:**
- 토론 변경은 Cancel을 클릭해도 유지됨
- 노트 변경은 자동 저장

### 텍스트 마킹 (하이라이트)
- Quick Access/Review 리본 > Mark text: 선택 텍스트 녹색 하이라이트
- 마크 색상: Information, Warning, Error, Other
- Review/Quick Access 리본 > Notes: 하이라이트에 코멘트 추가
- 주황 삼각형: 삭제된 하이라이트 콘텐츠 표시

---

## 16. Warnings (경고)

### 핵심 동작
- 번역 에디터에서 단일 세그먼트의 QA 경고 표시

### 아이콘 유형
- **번개 아이콘**: Warnings
- **느낌표 아이콘**: Errors
- Target 컬럼 옆 매치율 아래에 표시

### 활성화 방법
- 경고/에러 아이콘 더블클릭
- Review 리본 > Quality Assurance 버튼 (복수 세그먼트)

### 사용자 액션
- 개별 경고 검토
- "Ignore checkbox"로 특정 경고 무시
- 모든 경고 무시 시: 번개 아이콘이 회색으로 변경

### 동작 특성
- 세그먼트 확인 시 "quick" 체크만 수행 (전체 일관성 체크 아님)
- 전체 QA 실행은 확인보다 더 광범위한 검증 수행
- 확인 후 일관성 체크 미실행 시 경고 사라질 수 있음
- "Resolve errors and warnings" 탭: 복수 세그먼트 동시 해결
- "Proceed to resolve warnings after QA" 옵션: QA 후 자동으로 경고 해결 도구 열기

---

## 17. Row History (행 이력)

### 접근 방법
- 세그먼트 우클릭 > "Row History"
- 세그먼트에 커서 놓고 Review 리본 > Row History

### 표시 컬럼
1. Comments indicator: 코멘트 변경 여부
2. Status indicator: 세그먼트 상태 변경 여부
3. Source indicator: 소스 텍스트 수정 여부
4. Target: 타겟 세그먼트 텍스트
5. Version: 문서 버전 번호
6. Date: 변경 타임스탬프
7. User: 변경자

### 핵심 기능
- 이전 번역 버전 검토
- **복원**: 우클릭 > "Restore selected version"으로 세그먼트를 이전 상태로 복원
- 소스 세그먼트도 이전 버전으로 복원 가능

### 요구사항
- 문서에 복수 버전이 있어야 유효

---

## 18. Regex Assistant (정규식 도우미)

### 접근 가능 위치
- Quick Find / Advanced Find and Replace
- 번역 에디터 (Source/Target 필터 필드)
- Edit QA settings
- Length information rule creation
- Segmentation rule set editor
- Auto-translation rule set editor
- Regex tagger / Regex text filter
- ZIP filter / MSG filter

### 핵심 기능

**Regex Library:**
- 사전 구축된 정규식 드롭다운 선택
- 검색 가능 필터 (하이라이트 텍스트)
- "Last selected regex" 표시

**Testing Ground:**
- 텍스트 입력/붙여넣기로 매치 미리보기
- 소스/타겟 세그먼트 삽입 링크
- 매칭 부분 하이라이트
- "After replace" 필드로 결과 미리보기

**커스텀 정규식 구축:**
- .NET flavor 정규식 구문 요소 치트시트 드롭다운

### 정규식 관리
- **저장**: "Add to Regex library" (이름, 라벨, 설명)
- **편집**: "Edit your Regex library" 창
- **일괄 작업**: 체크박스로 복수 선택 후 삭제/라벨 관리
- **라벨 관리**: 라벨 수 표시, 추가/제거
- **Import/Export**: XML 파일 (라벨 관리 옵션 포함, 중복 이름은 숫자 접미사)

---

## 19. Regex Tagger (정규식 태거)

### 핵심 기능
- 정규식으로 텍스트를 인라인 태그로 변환
- 코드, 플레이스홀더, XML 태그를 번역 변경으로부터 보호

### 태그 이점
- 구조 요소 실수 방지
- 번역 중 변경 불가
- F9/Ctrl로 쉽게 복사
- TM 매칭률 향상 (태그 없이 <90% → 태그 있으면 >95%)

### 필터 기능
- 독립 임포트 필터로는 사용 불가
- 캐스케이딩 필터의 2번째/3번째 필터로 사용 가능
- 복수 Regex tagger 순차 체인 지원
- 번역 에디터에서 직접 적용 (재임포트 불필요)

### 설정 옵션
- 정규식 텍스트 입력
- 태그 유형: opening / closing / empty
- "Required" 체크박스: 태그 에러 플래그
- Display text 필드 + 치환 규칙 ($0, $1, $2 변수)
- "Rules handle tabs and newlines" 체크박스

### 규칙 관리
- Add / Change / Delete
- Up/Down 화살표로 순서 변경
- 필터 설정 드롭다운 (프리셋 로드/저장)

### 테스트 & 미리보기
- Input 텍스트 박스: 매칭 부분 표시
- Result 박스: 태그된 출력 (빨간 하이라이트)
- "Apply only selected rule" 라디오 버튼

### 접근 위치
- 문서 임포트 워크플로우 (캐스케이딩 필터 체인)
- 번역 에디터 (Preparation 리본)

---

## 20. Find and Replace (찾기 및 바꾸기)

### Quick Find

**접근:**
- **Ctrl+F**: Quick find 창
- **Ctrl+H**: Quick find and replace 창
- Edit 리본 > Find/Replace 버튼

**검색 옵션:**
- Case sensitive 모드 (아이콘 토글)
- 매칭 범위: Any matches / Whole words only / Entire segment
- Standard 텍스트 검색 / 정규식 모드
- Regex Assistant 사용 가능

**네비게이션 & 결과:**
- **Enter**: 다음 매치 찾기
- Find all: 별도 결과 탭에 전체 매치 목록
- Highlight all: 노란 하이라이트
- Clear highlighted: 하이라이트 제거

**바꾸기:**
- "Replace this": 현재 매치 교체
- "Replace all": 전체 교체
- 정규식 변수 ($1, $2 등) 지원
- 빈 Replace 필드 + Replace all = 전체 삭제

**단축키:**
- **Esc**: 창 닫기

### Advanced Find and Replace

**접근:**
- **Ctrl+F** (Quick find에서 한 번 더)
- **Ctrl+H** (Project home에서 직접)
- Edit 리본 > Advanced 아이콘

**검색 설정:**
- Find What: 텍스트 입력 + 이전 검색 드롭다운
- "Search within tags as well" 체크박스
- Case-sensitive 아이콘 토글
- Replace With: 정규식 변수 지원

**검색 위치 (Find Where):**
- Source text / Target text / Comments / Context ID 체크박스

**검색 범위 (Search In):**
- 번역 에디터: Current/all documents, selected segments
- Project home: All/selected documents
- Views: 특정 뷰
- TM/LiveDocs: 해당 리소스만

**매치 동작:**
- Anything / Only whole words / Entire segment
- "Do not replace if formatting would change" 체크박스

**액션 버튼:**

| 버튼 | 기능 |
|------|------|
| Find next | 첫/다음 매치로 점프 + 하이라이트 |
| Replace this | 현재 매치 교체 + 다음으로 이동 |
| Replace all | 전체 교체 (건수 표시) |
| Find all | 별도 탭에 전체 매치 목록 |
| Preview and replace | 인터랙티브 교체 목록 |
| Mark all | 매칭 세그먼트 마크 (Comments 아이콘 윤곽) |
| Highlight all | 노란 하이라이트 |
| Clear highlighting | 하이라이트 제거 |

### Find and Replace List (결과 목록)

**네비게이션:**
- 세그먼트 클릭으로 선택
- **Ctrl+Up/Down**: 세그먼트 간 이동

**편집:**
- Target 텍스트 직접 편집 가능 ("번역 에디터처럼")
- **Ctrl+Space** 또는 Replace 버튼: 단일 세그먼트 교체
- Replace 체크박스 선택 후 "Replace in selected rows": 복수 교체

**확인:**
- **Ctrl+Enter**: 확인 + Working TM 저장
- **Ctrl+Shift+R**: TM 업데이트 없이 확인

---

## 21. Concordance (일치 검색)

### 접근 방법
- **Ctrl+K**: 소스/타겟 텍스트 선택 후
- Translation 리본 > Concordance 버튼
- 텍스트 미선택 시 빈 창; 수동 검색어 입력 가능

### 검색 모드

#### Source Language 검색
- 기본 뷰: KWIC (Keyword in Context) 3열 레이아웃
- 선택한 행당 하나의 번역 표시
- 전체 번역 상세는 창 하단

#### Source+Target 뷰
- 소스, 타겟, 메타데이터를 단일 행으로 표시
- 항목 소스(TM/corpus), 수정일, 원본 문서 표시

#### Target Language 검색
- 타겟 언어 텍스트 선택 후 검색
- "Filter source box"로 소스 언어 구문 필터

### 검색 설정

| 설정 | 용도 |
|------|------|
| Put selected text in quotes | 정확 구문 매칭 토글 |
| Add wildcards to selected text | 자동 와일드카드 포함 토글 |
| Case sensitive | 대소문자 정확 매칭 |
| Find different numbers, too | 숫자 변형 매치 (Step 1, Step 2 등) |
| Auto-detect source/target | 검색 언어 자동 감지 |
| Guess translation | 추정 번역 녹색 강도로 하이라이트 |
| Filter target/source boxes | 타겟/소스 용어로 결과 좁히기 |
| Limit spin box | 최대 반환 히트 수 제한 |
| Close dialog on insert | 삽입 후 자동 닫기 토글 |

### 와일드카드 구문
- `*` (단어 끝): 선택적 끝 변형 (turn* → "turn", "turnover")
- `+` (단어 끝): 필수 끝 차이 (turn+ → "turn" 제외)
- `*` (단어 앞): 선택적 시작 변형
- `+` (단어 앞): 필수 시작 차이

### 삽입 명령
- **Insert**: 완전한 번역 삽입
- **Insert selected**: 선택된 텍스트 부분 삽입
- **Insert <text>**: 추정 번역 삽입

### 용어 DB 통합
- 우클릭 > "Add term" 또는 **Ctrl+E**: 용어 추가
- Create term base entry 창 열림 (프로젝트 용어 DB 필요)

### 추가 기능
- TM 항목 편집: 우클릭 > "View/Edit Entry"
- TM 항목 삭제: 우클릭 > "Delete entry"
- 설정 유지: 세션 간 보존
- 복수 번역: "Insert translation" 서브메뉴

---

## 22. Insert Symbol (심볼 삽입)

### 접근 방법
- Edit 리본 > Insert Symbol
- **Ctrl+Shift+I**

### 삽입 방법
- 심볼 더블클릭
- History 박스에서 최근 사용 심볼 더블클릭
- Unicode 코드 입력 (Decimal/Hexadecimal) 후 Insert

### 네비게이션 & 표시
- **Group 드롭다운**: 카테고리별 심볼 필터
- **Range 드롭다운**: Unicode 문자 범위 전환
- **Preview font 드롭다운**: 폰트 변경으로 미표시 심볼 확인

### Frequent Symbols 기능
- 자주 쓰는 문자 퀵 액세스 메뉴
- "Customize symbol shortcuts"로 키보드 단축키 설정 가능

### 자동 닫기
- 삽입 후 자동 창 닫기 체크박스 (세션 간 유지)

---

## 23. MT Concordance (MT 일치 검색)

### 접근 방법
- **Ctrl+Shift+K**
- Translation 리본 > Concordance 아이콘 드롭다운 > MT Concordance

### 핵심 기능
- TM/용어 DB에 충분한 매치가 없을 때 MT 서비스에서 검색
- 선택한 소스 언어 텍스트를 MT 서비스로 검색

### 결과 표시
- Translation Results Pane 상단에 **노란색**으로 표시
- 활성화된 각 MT 서비스당 하나의 결과

### 삽입 방법
- 더블클릭
- **Ctrl+1** (첫 번째 제안)
- **Ctrl+2** (두 번째 제안)
- 표준 TM 매치 삽입과 동일 패턴

### 설정 의존성
- "Edit machine translation settings" 창에서 설정된 MT 서비스에 의존
- 활성화된 서비스만 결과 생성

---

## 24. Pre-translation (프리트랜슬레이션)

### 접근 방법
- Preparation 리본 > Pre-translate

### 핵심 동작
- Pre-translate and statistics 창 열기
- 선택적 세그먼트 선택 후 프리트랜슬레이션 가능

### 보호 규칙
- Edited 또는 Confirmed 세그먼트는 덮어쓰지 않음

### 소스
- Translation memories
- LiveDocs corpora
- Machine translation
- Fragment assembly

### 통계
- 동시 통계 분석 실행 가능

---

## 25. Quality Assurance (품질 보증)

### 접근 방법
- Preparation 리본 > Run QA
- Review 리본 > Quality Assurance

### 동작
- 세그먼트 확인 시 "quick" 체크만 수행
- 전체 QA 실행은 더 광범위한 검증
- "Proceed to resolve warnings after QA" 옵션

---

## 전체 키보드 단축키 요약

### 네비게이션
| 단축키 | 동작 |
|--------|------|
| Arrow Up/Down | 세그먼트 간 이동 |
| Page Up/Down | 화면 단위 이동 |
| Ctrl+Home/End | 문서 시작/끝 이동 |
| Ctrl+Page Up/Down | 세그먼트 시작/끝 이동 |
| Ctrl+Left/Right | 단어 단위 이동 |
| Ctrl+Shift+G | Go to Next Segment 대화상자 |
| Ctrl+G | 마지막 점프 반복 |
| Ctrl+Tab | 열린 문서 탭 간 이동 |

### 편집 & 확인
| 단축키 | 동작 |
|--------|------|
| Ctrl+Enter | 확인 + TM 저장 + 다음 세그먼트 |
| Ctrl+Shift+Enter | 확인 (TM 저장 없이) |
| Ctrl+Shift+R | Confirm Without Update (TM 업데이트 없이 확인) |
| Ctrl+Shift+U | Confirm and Update Rows |
| Ctrl+Z | 실행 취소 |
| Ctrl+Y | 다시 실행 (Redo) |
| Ctrl+Shift+S | Source → Target 복사 |
| Ctrl+Shift+T | 선택 Source → Target 삽입 |
| Ctrl+Shift+N | 텍스트를 다음 단어 뒤로 이동 |
| Ctrl+Shift+B | 텍스트를 이전 단어 앞으로 이동 |
| Shift+Enter | 세그먼트 거부 |
| F2 | Source 편집 모드 |

### 서식
| 단축키 | 동작 |
|--------|------|
| Ctrl+B | 굵게 |
| Ctrl+I | 기울임 |
| Ctrl+U | 밑줄 |
| Ctrl+Shift++ | 위 첨자 (Superscript) |
| Ctrl+Shift+] | 아래 첨자 (Subscript) |
| Shift+F3 | 대소문자 변경 |

### 태그
| 단축키 | 동작 |
|--------|------|
| F9 | 다음 태그 복사 |
| F6 | 태그 삽입 모드 |
| Ctrl+F8 | 모든 태그 제거 |
| Alt+F8 | 모든 태그 삽입 |
| Alt+F6 | 태그 정렬 |
| Ctrl+F9 | 태그 편집 |
| Ctrl+F10 | 빠른 태그 삽입 |

### 세그먼트 조작
| 단축키 | 동작 |
|--------|------|
| Ctrl+J | 세그먼트 결합 |
| Ctrl+T | 세그먼트 분할 |
| Ctrl+Shift+L | 단일/복수 선택 세그먼트 잠금/해제 |
| Ctrl+L | 여러 세그먼트 일괄 잠금/해제 |
| Ctrl+Alt+L | Lock Special |
| Ctrl+Alt+U | Unlock Special |
| Ctrl+Shift+H | Auto-propagation 토글 |

### 검색 & 필터
| 단축키 | 동작 |
|--------|------|
| Ctrl+F | Quick Find |
| Ctrl+H | Quick Find and Replace |
| Ctrl+Shift+F | 선택 텍스트 필터 |
| Ctrl+K | Concordance |
| Ctrl+Shift+K | MT Concordance |
| Ctrl+E | 용어 추가 |

### 제안 & 삽입
| 단축키 | 동작 |
|--------|------|
| Ctrl+Space | 첫 번째 제안 삽입 |
| Ctrl+1~9 | 번호별 제안 삽입 |
| Ctrl+Up/Down | 제안 탐색 |
| F4 | Fragment-assembled hit 삽입 |
| Ctrl+Shift+D | 필터된 제안 표시 토글 |
| Ctrl (누르고 떼기) | AutoPick 메뉴 |
| Tab/Enter | Predictive typing 수락 |
| Ctrl+P | 용어 조회 (Look Up Term) |

### 기타
| 단축키 | 동작 |
|--------|------|
| Ctrl+M | Notes 창 열기 |
| Ctrl+W | Warnings 편집 |
| Ctrl+Shift+M | 선택 텍스트 마킹 (하이라이트) |
| Ctrl+Shift+I | Insert Symbol 창 |
| Ctrl+Shift+E | Non-breaking Space 삽입 |
| Ctrl+Shift+O | AutoCorrect |
| Ctrl+O | Non-translatable 추가 |
| Ctrl+A | Target 셀 전체 선택 |
| Ctrl+Shift+A | 모든 세그먼트 선택 |
| Ctrl+Tab | 열린 탭 간 이동 |
| F7 | 맞춤법 검사 |
| F11 | 레이아웃 프리셋 토글 |
| Ctrl+F4 | 에디터 탭 닫기 |

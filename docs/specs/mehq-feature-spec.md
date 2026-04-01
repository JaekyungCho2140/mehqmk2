# mehQ 구현 기능 명세

> memoQ 12.2 기능 카탈로그에서 선별된 구현 대상.
> 로컬 전용 앱 — MT(Machine Translation), 서버 의존 기능 제외.
> 상세 동작 참조: `docs/specs/memoq-*-research.md`

---

## 0. 최초 실행 마법사 (mehQ 고유)

> memoQ에는 없는 mehQ 고유 기능

### 0.1 Welcome Wizard
- 앱 최초 실행 시 자동 표시 (사용자 데이터가 없을 때)
- **Step 1: 사용자 이름 등록**
  - 이름 입력 (필수)
  - 이 이름은 TM 엔트리의 Created by/Modified by, Track Changes 기록, 세그먼트 확인 이력에 사용
  - 나중에 Options에서 변경 가능
- **Step 2: 기본 작업 디렉토리 설정**
  - 프로젝트 기본 저장 경로 선택 (Browse)
  - 기본값: ~/Documents/mehQ
- **Step 3: 인터페이스 언어 선택** (선택)
  - 앱 UI 언어 설정
- Finish → Dashboard로 진입

---

## 1. Translation Editor (번역 에디터)

### 1.1 에디터 레이아웃
- **Grid (세그먼트 그리드)**: 소스/타겟 2열 구조, 세그먼트 번호, Status 박스, 경고 아이콘
  - 레이아웃: Grid(중앙) + Translation Results(우측) + View Pane(하단) + Status Bar(최하단)
  - F11: 레이아웃 프리셋 토글 (기본 / Results on top)
  - 각 패인 드래그 이동 가능, View Pane 별도 모니터 분리 가능
- **Status Bar**: 완성도(%), 상태별 세그먼트 수(TR/R1/R2/Ed/Rej/Empty/Pre/Frag), QA 에러 수, 편집 모드(Insert/Overtype), 태그 길이

### 1.2 네비게이션
- **기본 이동**: Arrow Up/Down(세그먼트 간), Page Up/Down(화면 단위), Ctrl+Home/End(문서 시작/끝)
- **단어 단위 이동**: Ctrl+Left/Right
- **세그먼트 내 이동**: Ctrl+Page Up/Down(세그먼트 시작/끝)
- **Go to Segment**: Ctrl+Shift+G(조건 설정), Ctrl+G(마지막 조건 반복)
  - 4탭 필터: Common / Status / Conflicts / Tags+QA
  - 탭 간 AND 로직, 그룹 내 OR 로직
  - Common: All rows, Not confirmed, Pre-translated, Match rate 범위, Error, Repetitions, Locked
  - Status: Row status(10종), Lock status, Other(auto-joined/split, errors, warnings, comments, TC matches, propagated, marked)
  - Conflicts: Bilingual update, Last changed(사용자/날짜), Inserted match(편집됨/미편집)
  - Tags: LQA 에러, 서식 태그, 인라인 태그 텍스트(`tagname>attribute>value` 구문)
  - "Automatically jump after confirmation" 체크박스

### 1.3 텍스트 선택
- **문자/줄 선택**: Shift+Arrow
- **단어 선택**: Shift+Ctrl+Arrow, 더블클릭
- **셀 전체 선택**: Ctrl+A (Target 셀)
- **멀티 세그먼트 선택**: Shift+Click(세그먼트 번호), Ctrl+Shift+A(전체), Ctrl+Shift+Home/End(시작/끝까지)

### 1.4 번역 확인 (Confirmation)
- **Ctrl+Enter**: 번역 확인 + TM 저장 + 다음 세그먼트 이동
- **Ctrl+Shift+Enter**: 번역 확인 (TM 저장 없이)
- **Ctrl+Shift+R**: Confirm Without Update
- **Ctrl+Shift+U**: Confirm and Update Rows
- 확인 시 상태 자동 "Confirmed" 변경, 모든 변경 자동 저장

### 1.5 텍스트 조작
- **기본**: Ctrl+C/X/V/Z (복사/잘라내기/붙여넣기/실행취소), Ctrl+Y (Redo)
- **Source→Target 복사**: Ctrl+Shift+S (전체), Ctrl+Shift+T (선택 부분 삽입)
- **텍스트 이동**: Ctrl+Shift+N (다음 단어 뒤로), Ctrl+Shift+B (이전 단어 앞으로)
- **드래그 앤 드롭**: Target 셀 내/간 마우스 드래그
- **복수 세그먼트 일괄 Source→Target**: 멀티 선택 후 Ctrl+Shift+S

### 1.6 서식
- **Bold/Italic/Underline**: Ctrl+B/I/U
- **Superscript/Subscript**: Ctrl+Shift++ / Ctrl+Shift+]
- **대소문자 변경**: Shift+F3 (lowercase / Initial capitals / ALL CAPITALS)
- 제한: 모든 문서 포맷에서 지원되는 것은 아님

### 1.7 Source 텍스트 편집
- **F2**: Source 셀 편집 모드 진입 (녹색 배경)
- **Tab 또는 Target 클릭**: 편집 확인
- TM에 편집 전/후 두 버전 모두 저장
- 주의: Source에서 태그를 절대 삭제하지 말 것

### 1.8 인라인 태그
- **F9**: 다음 태그 시퀀스 복사 / 선택 텍스트를 태그 쌍으로 감쌈
- **F6**: 태그 삽입 모드 토글 (수동 클릭 삽입)
- **Alt+F8**: 모든 태그 일괄 삽입
- **Alt+F6**: 태그 순서 정렬
- **Ctrl+F8**: Target 셀 모든 태그 제거
- **Ctrl+F9**: 인라인 태그 편집
- **Ctrl+F10**: 빠른 태그 삽입 (목록에서 선택)
- **태그 표시 모드**: Short(번호만) / Medium(타입+이름) / Filtered(관련 속성) / Long(전체)
- 태그 유형: Uninterpreted formatting({1},{2}), Inline(opening/closing/empty), Special inline(mq:ch, mq:nt 등 10종)

### 1.9 특수 문자
- **Insert Symbol** (Ctrl+Shift+I): Unicode 문자 삽입 창
- **Frequent Symbols**: 자주 쓰는 특수 문자 빠른 삽입
- **Customize Symbol Shortcuts**: 커스텀 심볼 단축키 설정
- **Non-Printing Characters**: 공백, 비줄바꿈 공백 표시 토글
- **Ctrl+Shift+E**: Non-breaking Space 삽입

### 1.10 세그먼트 조작
- **Ctrl+J**: 두 세그먼트 결합 (캐럿이 첫 세그먼트에 위치)
- **Ctrl+T**: 세그먼트 분할 (캐럿 위치)
- **Resegment**: 현재/전체 문서 재분절
- 제한: 다른 Excel 셀이나 XML 요소의 세그먼트는 결합 불가

### 1.11 세그먼트 상태
- **상태 종류**: Not started(회색), Edited(분홍), Pre-translated(파랑), Assembled(보라), Translator confirmed(초록+체크), R1 confirmed(초록+체크+), R2 confirmed(초록+이중체크), Locked(자물쇠+회색), Rejected(빨강+X)
- **Status 박스 더블클릭**: Change segment status 창 열기
- **Change Segment Status**: 범위(Project/Active/Selected/From cursor/Open/Selection/Views) + 필터(상태별)
- Pre-translated 세그먼트에 매치율 % 표시

### 1.12 세그먼트 잠금
- **Ctrl+Shift+L**: 단일/복수 세그먼트 잠금/해제 토글
- 잠긴 세그먼트: 회색 배경 + 자물쇠, 편집 불가, Auto-propagation 비활성화
- **범위**: Project/Active/Selected/From cursor/Open/Selection/Views
- **상태 필터**: Confirmed/Pre-translated/Repetitions/All
- **언어 감지 자동 잠금**: 소스 언어와 다른 세그먼트 감지 → 잠금 + Source→Target 복사 (최소 3단어)

### 1.13 필터링 & 정렬
- **Source/Target 필터 박스**: 텍스트 내용 필터
- **Ctrl+Shift+F**: 선택 텍스트로 필터 토글
- **필터 옵션**: Case-sensitive, Regex, Include comments, Include context IDs, Highlight all, Whole words only
- **정렬**: No sorting(문서 순서), Alphabetical(source/target), Length, Match rate, Frequency, Last changed, Row status, 오름차순/내림차순
- **Advanced Filters**: 4탭(Common/Status/Conflicts/Tags+QA), 탭 간 AND, 그룹 내 OR

### 1.14 Auto-propagation
- **더블클릭 아이콘 / Ctrl+Shift+H**: 특정 세그먼트 on/off 토글
- 확인된 번역을 동일 Source의 다른 세그먼트에 자동 전파
- 아이콘: 아래 화살표(활성) / 빨간 X(비활성)
- 설정 재임포트 후에도 유지

### 1.15 Translation Results Pane
- **3단 구조**: 결과 목록(상단) + 비교 박스(중단) + 메타 정보(하단)
- **Ctrl+Up/Down**: 결과 하이라이트 이동
- **삽입**: Ctrl+Space(최상위), Ctrl+1~9(번호별), 더블클릭
- **색상 코딩 7종**: 빨강(TM/LiveDocs), 파랑(TB), 검정(금지 용어), 보라(Fragment), 연한주황(LSC), 회색(Non-translatable), 초록(Auto-translation rules)
- **매치율 6단계**: 102%(Double context) → 101%(Context) → 100%(Exact) → 95-99%(High fuzzy) → 75-94%(Medium fuzzy) → 50-74%(Low fuzzy)
- **정렬 순서**: 매치율 → 저장된 매치율>Master>LiveDocs>Working>Reference → 최신순
- **차이 표시 램프**: 좌2(정렬/Source 편집) + 우6(공백/구두점/대소문자/서식/태그/숫자)
- **비교 박스**: Track Changes 뷰 / Traditional Compare(검정=동일, 빨강=차이, 파랑=누락)
- **필터링**: 눈 아이콘(숨겨진 제안 표시), Ctrl+Shift+D

### 1.16 Translation Results Settings
- **TM/LiveDocs 필터**: 동일 타겟 중복 제거, 최대 히트 수, 번역 없는 코퍼스 히트
- **용어 정렬**: 텍스트 출현 순 / 알파벳 순, 랭킹 우선 정렬, 긴 용어가 짧은 매치 숨김
- **표시 지연**: 밀리초 단위 (삽입은 즉시)

### 1.17 Automatic Lookup and Insertion
- 세그먼트 이동 시 TM/TB/LiveDocs/Fragment 자동 검색
- **삽입 우선순위**: Best TM/corpus hit → Fragment → Source copy
- **설정**: Automatically scan, Auto-insert best result, Keep processing until Goto next, Copy source if no match
- Fragment Coverage 최소 % 설정
- 전역 적용 (모든 프로젝트)

### 1.18 AutoPick
- **Ctrl 눌렀다 떼기**: AutoPick 메뉴 열림 → 항목 선택 삽입
- **인식 대상**: Tags, Numbers, URLs/email, 대문자 단어, Terms, Auto-translatables, Non-translatables
- **숫자 포맷**: 타겟 언어 규칙, 소수점/음수/자릿수 구분 기호, Unicode 숫자 셋

### 1.19 Predictive Typing
- **표시 모드**: Text only / Text and list(기본) / List only
- **제안 소스**: Term bases, Non-translatables, LSC hits, Auto-translation rules
- **Enter/Tab**: 제안 수락, Down+Tab: 대체 선택, Esc: 닫기
- **대문자 처리**: Base on original / Adjust to typing / Intelligent capitalization
- **트리거 임계값**: 문자 수 설정

### 1.20 Find and Replace
- **Quick Find** (Ctrl+F): Enter→첫 매치, Find All→결과 탭, Highlight All, Replace This, Replace All
- **Advanced Find** (Ctrl+F ×2): Find Next, Replace All, Find All, Preview and Replace, Mark All
  - 검색 위치: Source/Target/Comments/Context ID, 범위: Current/All/Selected/Views
  - **Search within tags**: 인라인 태그 내부 검색
  - **Do not replace if formatting would change**: 포맷 보존
- **공통 옵션**: Case sensitive, Match scope(Anything/Whole words/Entire segment), Regex 모드
- Regex 모드에서 `$1`, `$2` 변수 사용, 유효하지 않은 regex 시 `!` 표시

### 1.21 Concordance
- **Ctrl+K**: TM+LiveDocs에서 단어/표현 검색
- **표시 모드**: KWIC(3열) / Source+Target(전체 번역 동시 확인)
- **와일드카드**: `*`(선택적 변화), `+`(필수 변화) — 시작/끝에 사용
- **설정**: 따옴표(정확 매칭), 와일드카드 자동 추가, Case sensitive, 다른 숫자도 매칭, Guess translation(녹색 하이라이트)
- **삽입**: Insert(전체), Insert selected(부분), 우클릭 메뉴
- **편집**: View/Edit Entry, Delete entry, Add term(Ctrl+E)

### 1.22 Clear Translations
- 범위: Project/Active/Selected/From cursor/Open/Selection
- 필터: All / Unconfirmed / Unconfirmed fuzzy or assembled
- TM 저장된 번역은 삭제 안 됨 (문서에서만 제거)

### 1.23 Track Changes
- **Review 리본 > Track changes**: MS Word 스타일 삽입/변경/삭제 추적
- 사용자명 + 타임스탬프 기록
- **표시**: Final version only / With markup
- **TC 매치**: 소스에 tracked changes 있을 때 변경 전 텍스트로 TM 조회 → 100%/101%
- **Compare Versions**: Off / Against Last Received / Against Last Delivered / Against Last Inserted Match / Custom
- **거부**: Shift+Enter (LQA 모델 시 에러 창)
- Export: Word, SDLXLIFF, table RTF만 지원

### 1.24 View Pane
- **3가지 모드**: Translation Preview(HTML 미리보기, 현재 세그먼트 빨간 테두리) / Review / Comments
- View 리본 > View pane 토글
- 클릭 시 Grid가 해당 위치로 점프

### 1.25 Notes
- **심각도 4레벨**: Information, Warning, Error, Critical
- 세그먼트별 노트 추가

### 1.26 Warnings
- QA 경고/에러 표시: 주황 번개(경고), 빨간 에러 심볼
- **Ctrl+W**: Edit Warnings
- Ignore 기능: 개별 경고 무시

### 1.27 Row History
- 세그먼트 버전 이력 표시
- 이전 버전으로 복원 가능

### 1.28 Regex Assistant
- 정규식 라이브러리 (카테고리별 패턴)
- 실시간 테스트 (매칭 결과 미리보기)
- Import/Export 가능

### 1.29 Regex Tagger
- 정규식 패턴 → 인라인 태그 자동 변환
- 캐스케이딩 필터로 사용 가능 (Import 체인 마지막)

---

## 2. Translation Memory (TM)

### 2.1 TM 생성
- **데이터 모델**: Source/Target segment, Previous/Next segment(context), Context ID, Created by/at, Modified by/at, Last modified role(Translator/R1/R2), Document name, Full path, Project/Client/Domain/Subject, Corrected, Aligned, Custom fields(최대 20개)
- **TM 유형**: Local TM만 지원 (서버/동기화 TM 제외)
- **Context 시스템**: Simple(이전/이후 → 101%), Double(텍스트 흐름+ID → 102%), No context(비권장)
- **설정**: Name, Source/Target language, Path, Allow Multiple Translations, Allow reverse lookup, Store document name/full path
- **Custom Fields 탭**: 최대 20개, Add/Edit/Remove, XML Export/Import scheme

### 2.2 TM Match Scoring
- **매치 유형**: 102%(Double context) → 101%(Context) → 100%(Exact) → 95-99%(Nearly exact) → 85-94%(High fuzzy) → 75-84%(Medium fuzzy) → 50-74%(Low fuzzy)
- **알고리즘**: 긴 단어 일치에 높은 가중치, 5단어 이하/128자 미만은 Levenshtein
- **Number Substitution**: 숫자만 다를 때 자동 치환(천단위/소수점/플러스), CJK 라틴 숫자 지원
- **매치율 조정**: Penalties(TM 신뢰도, 미검토 정렬), Patching(`!` 표시), Asterisk(`*100%` = 동점 중 하나)

### 2.3 TM Settings
- **Thresholds**: Minimum match, Good match 임계값
- **Penalties**: 정렬 세그먼트 자동 차감
- **Adjust fuzzy hits**: 숫자/구두점/대소문자/태그 자동 조정 (기본 활성)
- **Roles**: Working TM(확인 시 저장), Master TM(최종 승인), Reference TM(참조용)
- Import/Export 가능, 프로젝트당 1개 적용

### 2.4 TM Editor
- **접근**: Project home / Resource console > 우클릭 > Edit
- **편집**: New(빈 행 추가), Delete, Find and Replace(Ctrl+H)
- **태그 관리**: 더블클릭 삭제, "All tags" 전체 삭제 (Undo 불가)
- **필터링**: Quick filter(소스/타겟 박스), Case sensitive, Advanced filter(깔때기)
- **Flagging**: Ctrl+M(플래그 토글), 플래그된 항목만 필터
- 변경 자동 저장 안 됨 → Ctrl+S 필수

### 2.5 TM Import/Export
- **Import Wizard**: TMX, CSV
- **Export**: TMX 형식
- **TM Repair**: 손상된 TM 복구 마법사

### 2.6 Fragment Assembly
- TM에서 정확 매치만 검색(퍼지 불가), TB(접두사 매칭 없음)
- 전체 소스 커버, 미발견 단어는 소스로 삽입
- Ctrl+3 후 Ctrl+Space 삽입, 보라색 표시
- 커버리지 임계값 설정 가능

### 2.7 MatchPatch
- TM 퍼지 매치 + TB 히트 결합 → 매치 품질 향상
- `!92%` 형태 표시, 원래→개선 비율(예: 73%→93%)
- Options > Miscellaneous > "Patch fuzzy TM matches"
- 패치 매치율 최대 94%, 3자 이하 단어 미검색, 프리트랜슬레이션 중 불가

---

## 3. Term Base (TB)

### 3.1 TB 생성 & 데이터 모델
- **3-레벨 계층**: Entry(ID/Note/metadata) → Language(Definition) → Term(text/matching/grammar/forbidden)
- **Entry 레벨**: ID, Note, Created by/at, Modified by/at, Domain, Client, Project, Subject, Custom fields
- **Language 레벨**: Language code, Definition
- **Term 레벨**: Term text, Matching type, Case sensitivity, Prefix length, Forbidden(금지 용어), Grammar info

### 3.2 Term Matching
- **4가지 타입**: Fuzzy, 50% Prefix, Exact, Custom(wildcard)
- **Case sensitivity 3종**: Ignore case, First character, Full case sensitive
- **Forbidden term**: 삽입 불가, 검정색으로 경고만 표시

### 3.3 TB Editor
- 엔트리 생성/편집/삭제
- 필터/정렬, 검색

### 3.4 Term Extraction
- 소스 텍스트에서 용어 후보 자동 추출
- Score 기반 후보 관리
- TB로 직접 통합

### 3.5 Look up Term
- **Ctrl+P**: 에디터에서 용어 검색, 하이라이트

### 3.6 TB Import/Export
- **Import**: CSV, TSV, Excel, TMX, TBX v3, MultiTerm XML
- **Export**: CSV, XLSX, MultiTerm XML
- **TB Repair**: 손상된 TB 복구

---

## 4. LiveDocs

- **4가지 콘텐츠 타입**: Library(monolingual), ActiveTM(bilingual), LiveAlign(aligned pairs), EZAttach(binary)
- **Bilingual Editor**: Source/Target 자유 편집 (세그먼트 split/merge 불가, TM/TB 미사용)
- **Monolingual Editor**: 단일 언어 문서 편집
- **Document Linking**: Source-Target 문서 연결
- **Export**: XLIFF(.mqxlz), TM으로 변환
- Corpus 생성 시 언어 없이 생성, 문서 추가 시 결정

---

## 5. Resources

### 5.1 Resource Console
- **Heavy 4종**: TM, TB, LiveDocs, (Muses 제외)
- **Light 리소스**: Segmentation rules, QA settings, LQA models, Auto-translation rules, Non-translatable lists, Ignore lists, AutoCorrect lists, Filter configurations, Export path rules, Keyboard shortcuts, TM settings, Font substitution, Stop word lists

### 5.2 Segmentation Rules
- SRX 1.0 호환, regex 기반 break/no-break 규칙
- 언어별 규칙 세트
- Import/Export 가능

### 5.3 QA Settings (8개 탭)
- **Segments and Terms**: 용어 일관성(source→target/target→source/양방향), 금지 용어, 세그먼트 길이 비율, 빈 Target, 포맷 일관성
- **Consistency**: 중복 단어, 동일 세그먼트 일관성(포맷/대소문자/방향), TM/Corpus 매치 비교
- **Numbers**: 숫자 형식 검증, 전각 숫자, 영숫자 코드, 측정 단위, 언어별 숫자 커스텀
- **Punctuation**: 언어별 구두점, 괄호/따옴표/아포스트로피, 구두점 전후 공백, 마침 구두점 일치
- **Spaces, Capitals, Characters**: 이중 공백, 끝 공백, 대소문자, 금지 문자(직접 입력/Unicode), 맞춤법/문법
- **Inline Tags**: Well-formedness, 겹침 태그, Unicode 엔티티, 누락/추가 태그, 순서, 전후 공백
- **Length**: 문자 기반(row comment), 픽셀 기반(폰트/스타일/크기, 무시 불가→내보내기 차단)
- **Regex**: 금지 매치, 누락 매치, 카운트 차이, 교체 규칙, 태그→텍스트 확장
- **Severity 탭**: 각 QA 결과를 Warning 또는 Error로 개별 설정
- 100+ 자동 검사 항목 (코드 1001~3309)

### 5.4 LQA Models
- **지원 표준**: J2450, LISA, TAUS, mehQ 고유
- **QA Model 탭**: 심각도 레벨(추가/수정/제거/순서), 오류 카테고리/서브카테고리, 페널티 포인트(1000단어당)
- **QA Mappings 탭**: 자동 QA 경고 → LQA 오류 카테고리 매핑
- **Pass/Fail 탭**: Relative/Normalized score 임계값(기본 0.90), 조건별 행(오류 수/타입/텍스트 단위)
- 오류 시 코멘트 필수 옵션

### 5.5 Auto-Translation Rules
- Regex 패턴 → 자동 번역 치환
- 단위 변환 수식: `Dest = Source × Scale + Offset`
- 날짜, 통화, 측정 단위 등 패턴

### 5.6 Non-translatable Lists
- 번역 제외 패턴 목록 (정규식 지원)
- 회색 하이라이트, Source→Target 자동 복사

### 5.7 Ignore Lists
- 맞춤법 검사 제외 단어 목록

### 5.8 AutoCorrect Lists
- 자동 교정 규칙 (입력→대체 쌍)
- Ctrl+Shift+O: AutoCorrect 토글

### 5.9 Filter Configurations
- 문서 형식별 Import 필터 세부 설정
- 캐스케이딩 필터 체인

### 5.10 Export Path Rules
- 번역 완료 문서의 Export 경로 자동 결정

---

## 6. Project Management

### 6.1 New Project Wizard
- **5단계**: Details(이름/언어/Client/Domain/Deadline) → Documents(드래그앤드롭/Import) → TMs(선택/생성/Import) → TBs(선택/생성/Import/랭킹) → Finish
- 어느 단계에서든 Finish 가능 (남은 단계 건너뜀)
- 템플릿 사용 권장

### 6.2 Clone Project
- 설정만 복제(문서 제외)
- 기본명: 원본 + "- clone"
- 체크박스: TM/TB, Corpora, Light resources 각각 포함 여부

### 6.3 Project Home
- **PM 뷰**: General + Reports + Settings 탭
- **Translator 뷰**: Reports + Settings 탭
- **Reports**: Progress, Analysis, Change-Tracked, Post-Translation Analysis, Edit Distance — Create/Show/Export/Delete

### 6.4 Project Settings
- General, Auto-translation, Export path, Font substitution, LiveDocs, LQA, Non-translatable, QA, Segmentation, TM Settings

---

## 7. Dashboard

### 7.1 Dashboard
- **프로젝트 생성**: New Project(템플릿/직접)
- **프로젝트 관리**: Open, Move To Recycle Bin, Back Up, Restore
- **상태 아이콘**: 미시작 → 빈 → 번역 진행 → 번역 완료 → R1 확인 → R2 확인

### 7.2 Project List
- **컬럼**: Type, Name, Size, Status, Progress(색상 바), Deadline, Languages, Created, Last accessed, Commands
- **Two-row view**: Sub/Dom/Cli/Pro 추가 컬럼
- **정렬**: name/size/status/progress/deadline/languages/created/last accessed
- **Size 단위**: Characters/Segments/Words

### 7.3 Details Pane
- Project Data, Creation, Type, Size, Languages, Progress 섹션

### 7.4 Filtering & Alerts
- 프로젝트 검색, 상태 필터, 정렬
- 마감 경고 아이콘, 진행률 알림

---

## 8. Preparation & Analysis

### 8.1 Pre-translate and Statistics
- **범위**: Project/Active/Selected/From cursor/Open/Selection/Views
- **매치 임계값**: Context(101-102%), Exact(100%), Good match, Any match(60%+), Single match only
- **Fragment Assembly**: 활성화, 커버리지(Full single/Full multiple/Partial %), 용어/비번역/숫자/자동번역 포함, 대소문자 보존
- **Confirm/Lock 탭**: 매치율 임계값, 상태 변경(Pre-translated/T confirmed/R1/R2), Lock
- **Versioning 탭**: 사전/사후 스냅샷, 코멘트
- **Statistics 탭**: 통계 수행

### 8.2 Analysis Reports
- **타입**: Progress, Analysis, Post-Translation Analysis (PTA)
- 타겟 언어: All 또는 개별
- 단위: Words(기본)/Characters/Segments
- Create/Show/Hide/Export(CSV)/Delete

### 8.3 Statistics
- 단어/세그먼트/문자 수
- 매치율 분포 (Repetitions, 101%, 100%, 95-99%, 85-94%, 75-84%, 50-74%, No match)

### 8.4 Edit Distance Reports
- **유형**: Inserted matches vs current / Between versions(T→R1, T→R2, R1→R2, Last delivery→Current)
- **측정**: Levenshtein(문자 차이), Fuzzy(% 범위 그룹)
- 옵션: 파일별, 확인된 세그먼트만
- Export: CSV, HTML

### 8.5 LQA Reports
- **타입**: Statistics(오류 수/품질 메트릭) / Error Lists(번역가별 상세)
- 그룹핑: 카테고리별, 심각도별, 전체 세부
- Export: HTML/CSV(Statistics), XLSX/HTML(Error Lists)

---

## 9. Document Formats

### 9.1 Monolingual 형식
- **Web**: HTML(.html/.htm), ASP.NET(.aspx), JSP, PHP, Include(.inc)
- **데이터**: Java properties, JSON, YAML, XML(.xml/.sgm/.ttml), .NET Resource(.resx)
- **문서**: Markdown(.md), Plain text(.txt/.ini/.reg), COTI(.zip/.coti), ZIP
- **MS Office**: Word(.doc/.docx/.rtf), Excel(.xls/.xlsx), PowerPoint(.ppt/.pptx), Visio(.vsd/.vsdx), Help(.hhc/.hhk), Outlook(.msg)
- **기타**: OpenDocument(.odt/.odp/.ods), PDF, Multilingual tables(.csv/.tsv), SubRip(.srt), DITA, SVG, FreeMind(.mm)

### 9.2 Bilingual 형식
- PO Gettext(.po), SDLXLIFF, SDL TagEditor(.ttx), TMX, Bilingual DOC/RTF, TXML, XLIFF(.xlf), Xliff:doc, Phrase XLIFF(.mxliff)
- **mehQ Bilingual**: mehQ XLIFF(.mqxliff/.mqxlz), Table RTF

### 9.3 Import Settings
- **필터 선택**: 확장자 자동 인식 또는 수동 오버라이드
- **Cascading Filters**: 1차→2차 필터 체인 (1차가 inline tag 반환 시 불가, Regex tagger는 마지막)
- **구성 관리**: Save/Save new, [o]/[c]/[s] 마커
- **Import Options**: 뷰 전환, 에러만 표시, 필터 변경(단일/복수), Bilingual 업데이트 자동 인식
- **임베디드 처리**: 이미지 추출, Office 임베디드 객체
- **Preview**: Word/Excel/PPT/HTML/XML/Text 지원, 비활성화 가능
- **Tags**: Uninterpreted formatting({1},{2}), Inline(opening/closing/empty), Special inline(10종)

---

## 10. Alignment

- **LiveAlign 기반**: 즉시 매치 제공 (검토 없이도 사용 가능)
- **4가지 링크 타입**: Auto(자동 정렬), Manual(수동), Cross(교차), Insertion(삽입)
- **매치율 페널티**: 미확인 -5%, Cross link -10%, 수동 미검토 -15%
- **앵커 옵션**: 용어 앵커링, Bold/Italic 비교, Inline tags 비교
- **정렬 범위**: 전체 / 현재부터
- **TM 내보내기**: 확인된 파란 링크만 내보내기

---

## 11. Options & Settings

### 11.1 Appearance
- **4탭**: Translation Grid / Lookup Results / Compare Boxes / Tracked Changes
- **Translation Grid**: 폰트 6종(Source/Target × 일반/CJK/Tag), 세그먼트 상태별 6가지 색상
- **색상 스킴**: Default(밝은) / Inverted(어두운)
- **Tracked Changes**: 리뷰어별 색상 7명 순환

### 11.2 Keyboard Shortcuts
- **7카테고리 100+개**: Translation Editor(50+), Formatting(13), Concordance(2), Alignment(6), TB Editor(11), Term Extractor(10), TM Editor(12), General(6)
- **세트 시스템**: 기본 세트 수정 불가, Clone → 편집
- Import/Export 가능

### 11.3 Advanced Lookup
- **Subsegment Leverage (LSC)**: 최소 길이, CJK별 설정
- **Fragment Assembly**: 5가지 매치 구성요소, 커버리지 임계값

### 11.4 Miscellaneous
- **9탭 40+설정**: Translation, Import/Export, Lookup Results, Languages, Weighted Counts, Default TM Scheme, Editing Time, Proxy, Discussions

### 11.5 Spelling/Grammar
- **이중 엔진**: Word / Hunspell
- **F7**: 맞춤법 검사 실행

### 11.6 Default Resources
- 리소스 타입별 기본값 설정

---

## 제거된 기능 (참고)

### MT (Machine Translation) — 전체 제거
- Built-in 22개 서비스, Intento, MT Settings, Self-learning MT, AIQE, MT Concordance

### 서버 의존 기능 — 전체 제거
- Online TM / Synchronized TM
- Online Project (Check out, Deliver/Return, Assign Documents, Workflow Status)
- Packages (Handoff/Delivery)
- Archive Wizard (서버 아카이브)
- Publish Project (로컬→서버 변환)
- Discussions (온라인 토론)
- Views (온라인 프로젝트 전용 기능은 제외)

### 기타 제외
- LTR/RTL 마커
- TM+ 포맷 선택 (단일 포맷 사용)
- TB Moderation 워크플로우
- Muses (코퍼스 기반 예측 — 복잡도 대비 효용 낮음)
- Backup Wizard (앱 자체 백업 — 파일 시스템 백업으로 대체)
- Handoff Wizard (서버 없이 불필요)
- Image formats (번역 대상 아님)
- Adobe formats (InDesign, FrameMaker, Photoshop — 복잡도 높음)
- TM-driven Segmentation
- Editing Time Reports

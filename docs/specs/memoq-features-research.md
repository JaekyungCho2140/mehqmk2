# memoQ 기능 상세 조사: TM, TB, LiveDocs, Resources, QA, LQA

> 출처: docs.memoq.com/current/en/ (2026-04-01 크롤링)
> 404 페이지: concepts-tm-match-scoring.html, edit-tm-entry.html, create-entry.html, bilingual-doc-editor.html, concepts-lqa-models.html → 대체 URL에서 수집 완료

---

## 1. Translation Memory (TM)

### 1.1 TM 개요 (concepts-translation-memories)

**접근**: Resource console > Translation memories / Project home > Translation memories

**핵심 동작**:
- 세그먼트 확인(Confirm) → 소스+타겟 쌍이 TM에 자동 저장
- 미번역 세그먼트 진입 → TM 자동 조회(lookup) → Translation results pane에 매치 표시
- Concordance 검색 → TM 내 단어/표현 직접 검색

**데이터 모델** (TM 엔트리):
- Source segment: text (소스 언어 세그먼트)
- Target segment: text (타겟 언어 세그먼트)
- Previous segment (context): text (이전 세그먼트 — Simple/Double context)
- Next segment (context): text (다음 세그먼트)
- Context ID: string (구조화 문서용 ID 기반 컨텍스트)
- Created by: string (생성자)
- Created at: datetime (생성 시각)
- Modified by: string (최종 수정자)
- Modified at: datetime (최종 수정 시각)
- Last modified role: enum (Translator | Reviewer 1 | Reviewer 2)
- Document name: string (선택적 — 문서명 저장 시)
- Full path: string (선택적 — 전체 경로 저장 시)
- Project: string
- Client: string
- Domain: string
- Subject: string
- Corrected: boolean (소스 수정 후 TM 저장 여부)
- Aligned: boolean (정렬로 생성된 엔트리 여부)
- Custom fields: 최대 20개 (사용자 정의 필드)

**TM 유형**:
- **Local TM**: 사용자 컴퓨터에 물리적으로 저장
- **Online TM**: 원격 서버(memoQ TMS), 인터넷/LAN으로 접근. 팀원 모두 동일 TM에 추가
- **Synchronized (Offline) TM**: 원격 TM의 로컬 복사본. 오프라인 작업 가능, 재연결 시 동기화

**Working TM vs Master TM**:
- Working TM: 번역/리뷰 중 세그먼트 확인 시 저장 대상
- Master TM: 프로젝트 완료 후 최종 승인된 번역 저장소
- 온라인 프로젝트에서 Working TM = Master TM 가능하나, 로컬 복사본에서 변경 가능
- 기본 권한: PM만 Master TM admin, 번역자는 lookup만 가능
- 동기화 시 PM의 온라인 설정이 로컬 변경을 덮어씀

**Roles in TM**:
- memoQ 2013 R2+ TM에 Role 필드 자동 포함
- Translator, Reviewer 1, Reviewer 2 세 역할
- 동일 소스+동일 컨텍스트에 3개의 다른 번역 저장 가능 (역할별)
- 역할별 페널티 적용 가능
- Translation results pane에서 체크박스로 특정 역할 결과 필터링
- 101% 매치에는 역할이 영향 없음 (페널티 사용 시 제외)

**Context 시스템**:
- Simple context (기본값): 이전/이후 세그먼트 텍스트 저장 → 101% 매치
- Double context: 텍스트 흐름 + ID 동시 매칭 → 102% 매치
- No context: 컨텍스트 미저장 → 최대 100% 매치 (비권장)
- Running text (Word, HTML 등): 이전/이후 문장이 컨텍스트
- 구조화 문서 (Excel, XML): 인접 요소/속성 또는 다른 열이 컨텍스트
- **중요**: 동일 소스 텍스트 + 다른 컨텍스트 = 별도 TM 엔트리

**Multiple Translations**:
- 생성 시 설정. 비활성화(기본) 시 새 번역이 기존 번역 대체
- 활성화 시 동일 세그먼트에 여러 번역 저장
- 주로 컨텍스트 미지원 도구에서 TMX 임포트 시 사용 (참조용 권장)

**엣지 케이스/제한**:
- 여러 TM 동시 사용 시 각각에서 101% 매치 가능
- 컨텍스트 있는 TM에서 동일 소스 = "101% 1개 + 100% 여러 개"
- Pre-translation 시 100% 매치 앞에 `*` 표시 = 여러 100% 매치 중 하나 삽입됨
- Subvendor PM은 Master TM 업데이트 불가 (lookup 권한만)
- 컨텍스트를 이용한 문서 복구: 101% 매치만으로 이전 번역 정확 복원 가능

---

### 1.2 TM Match Scoring (concepts-tm-match-scoring-and-number-su)

**접근**: 자동 (세그먼트 이동 시 백그라운드 계산)

**매치 유형 및 점수**:
| 매치 유형 | 점수 범위 | 조건 |
|-----------|----------|------|
| Double Context (XLT) | 102% | 소스 동일 + 텍스트 흐름 컨텍스트 동일 + ID 동일 |
| Context Match | 101% | 소스 동일 + 컨텍스트(이전/이후 또는 ID) 동일 |
| Exact Match | 100% | 소스 텍스트 완전 일치 |
| Nearly Exact | 95-99% | 소스 일치하나 숫자/태그/구두점/공백 차이 |
| High Fuzzy | 85-94% | 긴 세그먼트에서 약 1단어 차이 |
| Medium Fuzzy | 75-84% | 긴 세그먼트에서 약 2단어 차이 |
| Low Fuzzy | 50-74% | 2단어 이상 차이 |

**알고리즘**:
- 동일 단어 가중치: 짧은 단어 < 긴 단어 (긴 단어 일치가 더 높은 점수)
- 5단어 이하 또는 128자 미만 세그먼트: **Levenshtein 알고리즘** 사용
- 숫자만 다른 경우: 자동 숫자 조정 후 99% 또는 100% 반환 (v7.8.100+)

**Number Substitution**:
- 소스와 TM 매치가 숫자만 다를 때 자동 치환
- 처리 가능: 천단위 구분자(1.000 vs 1000), 비줄바꿈 공백, 소수점 형식(.99), 플러스 기호(U+002B, U+FF0B)
- CJK 텍스트의 라틴 숫자 지원, 네이티브 CJK 숫자 형식 미지원
- 태그 조정: 99% Fuzzy를 100%로 올릴 수 있음 (Inline tag strictness 설정 기반)

**매치율 조정**:
- **Penalties**: TM 소스 신뢰도 낮음, 번역자 신뢰도 낮음, 미검토 정렬, LiveDocs 미검토 등
- **Patching**: 용어집 매치로 태그/텍스트 조정 → `!` 표시
- **Asterisk**: `*100%`, `*101%`, `*102%` = 여러 동점 매치 중 하나 삽입됨

---

### 1.3 TM Settings (concepts-tm-settings)

**접근**: Project home > Settings > TM settings / Resource console > TM settings

**설정 옵션**:
- **Thresholds (임계값)**: 매치로 간주할 최소 점수, Good match 기준 점수 (기본값 자동 설정)
- **Penalties (페널티)**: 정렬로 생성된 세그먼트에 자동 차감되는 % / 특정 프로젝트 사용자에 대한 페널티
- **Adjust fuzzy hits (기본 활성)**: 100% 미만 매치에서 숫자, 문장 끝 구두점, 대소문자, 인라인 태그 자동 조정. 비활성 시 수동 조정 필요
- 여러 TM 설정 세트 생성 가능, 프로젝트당 1개만 적용
- Import/Export 가능
- 온라인 세트 클론하여 로컬 사용 가능

---

### 1.4 새 TM 생성 (new-translation-memory)

**접근**: Resource console > Translation memories > Create new / Project home > Translation memories > Create/Use New

**설정 옵션**:
- **Name**: 고유 이름 (필수)
- **Source Language**: 드롭다운 선택
- **Target Language**: 드롭다운 선택
- **Path**: 로컬 TM 폴더 경로 (수정 비권장)
- **TM+**: memoQ 10.5+ 기본값. 체크 해제 시 Classic TM
- **Context 유형**: Simple context (101%) / Double context (102%) / No context (비권장)
- **Allow Multiple Translations**: 비권장, 다른 도구에서 TMX 임포트 시에만
- **Allow reverse lookup**: 소스↔타겟 양방향 조회 (기본 활성)
- **Store document name**: 세그먼트와 함께 문서명 저장
- **Store full path**: 동일 문서명 구분용

**Custom Fields 탭**:
- 최대 20개 사용자 정의 필드
- Add / Edit / Remove
- Export scheme to XML / Import scheme from XML
- **주의**: TM 저장 후 필드 삭제 불가 → TMX로 내보내기 → 새 TM 생성 → 필드 없이 재임포트 필요

---

### 1.5 TM 엔트리 편집 (view-or-edit-tm-entry)

**접근**: 번역 에디터 > Translation results list > TM 매치 우클릭 > View/Edit

**핵심 동작**:
- 소스/타겟 텍스트 직접 편집
- "More" 클릭 → 확장 뷰 (메타데이터 표시)

**표시 필드 (확장 뷰)**:
- Created by / Created at
- Modified by / Modified at
- Project, Client, Domain, Subject
- Custom fields (드롭다운 선택 또는 직접 입력 → Add 클릭)

**동작**:
- Commit: 변경 저장 후 번역 에디터 복귀
- Cancel: 변경 없이 복귀
- Edit TM: 전체 TM 에디터를 별도 탭으로 열기
- Delete: Translation results list에서 우클릭으로 삭제

**엣지 케이스**: LiveDocs 매치는 다른 아이콘 표시, 클릭 시 LiveDocs 문서 에디터 열림

---

### 1.6 TM 에디터 (edit-translation-memory)

**접근**: Project home > Translation memories > 우클릭 > Edit / Resource console > 우클릭 > Edit

**핵심 동작**:
- TU 목록 표시 → 필터링 → 개별 TU 편집
- 동시 편집 제한: 온라인 TM은 한 번에 한 명만 편집 가능

**편집 기능**:
- New (리본): 빈 행 추가 (-1 번호) → 소스 입력 → Tab → 타겟 입력
- Delete: 행 선택 → Delete → 확인
- Find and Replace (Ctrl+H): 소스/타겟/양쪽 검색 범위 지정
- Tag 관리: 더블클릭으로 개별 태그 삭제, "All tags"로 행의 모든 태그 삭제 (**Undo 불가**)
- **변경 자동 저장 안 됨** → Ctrl+S 필수

**필터링**:
- Quick filter: 소스/타겟 열 위 텍스트 박스 → Enter
- Case sensitive: "aA" 체크박스
- Advanced filter: 깔때기 아이콘 또는 Filter/Sort 리본 버튼
- 소스+타겟 필터 = AND 논리
- Show All: 필터 해제

**Flagging 시스템**:
- 행 플래그: Ctrl+M 또는 Flag 아이콘
- Flag All: 필터된 결과 전체 플래그
- Ctrl+G: 플래그된 행 사이 이동
- Show only flagged: 플래그된 엔트리만 표시
- Clear flags: 플래그 해제 (필터 적용 시 필터된 행만)

**Segment Details 패널** (우측):
- Read-only: Created by/at, Modified by/at, Last modified role, Document name, Corrected, Aligned
- Editable: Subject, Domain, Project, Client
- Context: Previous segment, Next segment, Context ID
- Custom fields: 값 추가/수정/삭제

**중복 제거**:
- Remove Duplicates 리본 버튼 → 중복 정의/처리 설정
- 그룹별 Master + Merge unit 표시
- 동작: Mark As Master (Ctrl+Space), Mark For Merge (Ctrl+Alt+Space), Mark For Deletion (Ctrl+D), Mark To Skip (Ctrl+Shift+Space)
- Merge Current (Ctrl+Enter) / Merge Selection (Ctrl+Shift+Enter)

**Import/Export**:
- Import: TMX 또는 CSV 파일 선택 → 설정 창 → 임포트 후 Remove Duplicates 권장
- Export: TMX 형식으로 내보내기
- Partial export: 필터 적용 → Export → 필터된 항목만 내보내기 확인

---

### 1.7 TM 파일 임포트 위자드 (import-tm-files-wizard)

**접근**: Dashboard > Translation memories > Import / Resource console

**지원 형식**:
- **TMX**: 임포트 설정 필요
- **CSV**: 소스/타겟 언어 지정 + 열 매핑 필요
- **SDLTM**: 설정 없이 자동 임포트

**3가지 임포트 시나리오**:
1. **기존 TM에 모든 파일 임포트**: 기본 선택
2. **새 단일 TM에 모든 파일 임포트**: 로컬/원격 선택, 이름/소스/타겟 언어 설정
3. **각 파일을 개별 TM으로 임포트**: CSV는 언어 드롭다운 필요, 이름/언어 자동 추출

**Step 2 - TM 설정**:
- Context: Simple (101%) / Double (102%) / No context
- Allow multiple translations (비권장)
- Allow reverse lookup
- Store document name / Store full path
- 메타데이터: Project, Client, Domain, Subject, Description, Created by (프로젝트에서 임포트 시 자동 채움)

**Step 3 - 임포트 설정 확인**:
- 파일별 설정 변경: "Change settings" 링크
- 일괄 설정: 여러 파일 선택 → "Change import settings of selected"
- 파일 제거: 체크박스 → "Remove selected"
- Import all 클릭으로 시작

---

## 2. Term Base (TB)

### 2.1 TB 개요 (concepts-term-bases)

**접근**: Resource console > Term bases / Project home > Term bases

**핵심 동작**:
- 번역 시 소스 텍스트 자동 스캔 → 매칭 용어 하이라이트
- 번역 에디터에서 새 용어 생성 가능 (Ctrl+E, Ctrl+Q)
- 프로젝트당 여러 TB 사용 가능
- Moderation: 원격/동기화 TB에서 용어 추가 시 terminologist 승인 필요 (선택적)

**TB 유형**:
- **Local TB**: 사용자 컴퓨터에 저장
- **Online TB**: 원격 서버, 인터넷/LAN 접근
- **Synchronized TB**: 원격 주 복사본 + 로컬 캐시, 재연결 시 동기화

**다국어 구조**:
- 생성 시 여러 언어 선택 (소스/타겟 구분 없음)
- 나중에 언어 추가 가능 (Resource console 속성, TB 에디터, 추가 타겟 언어 프로젝트)
- 프로젝트 소스 언어 + 최소 1개 타겟 언어 포함 시 사용 가능
- Neutral 언어 ↔ Region-specific 언어 호환 (조회 시)
- **주의**: 번역 그리드에서 새 용어 추가 시 neutral/region-specific 구분 엄격

**Moderation**:
- Unmoderated: 제한 없이 용어 추가
- Moderated: terminologist 승인 전까지 다른 사용자에게 비표시 (제안자에게는 즉시 표시)

---

### 2.2 TB 엔트리 내부 구조 (concepts-term-bases-inside-an-entry)

**데이터 모델 (3단계 계층)**:

#### Entry Level (개념 단위):
- ID: auto-generated (변경 불가)
- Note: text (코멘트/참조)
- Project: string
- Domain: string
- Client: string
- Subject: string
- Image: binary (개념 설명 이미지, 선택적)
- Created by / Modified by: string (자동)
- Created at / Modified at: datetime (자동)

#### Language Level (언어별):
- Definition: text (해당 언어로의 개념 설명, 언어당 1개)

#### Term Level (개별 용어):
- Term text: string
- **Matching type**: Fuzzy | 50% prefix (기본) | Exact | Custom (와일드카드)
  - 50% prefix: 용어 시작 부분의 50% 이상 일치 시 매칭
  - Fuzzy: 80%+ 유사도
  - Exact: 완전 일치만
  - Custom: `|` 또는 `*` 와일드카드로 정밀 어간 매칭
- **Case sensitivity**: Yes | Permissive (기본) | No
  - Permissive: 대문자 필수 매칭, 소문자는 유연
  - Yes: 대소문자 완전 일치
  - No: 대소문자 무시
- **Forbidden**: boolean (금지 용어 — 번역에 사용하면 안 되는 용어)
- Example: text (사용 예시)
- Part of speech: string
- Gender: string
- Number: string

---

### 2.3 새 TB 생성 (new-term-base)

**접근**: Resource console > Term bases > Create new / Project home > Term bases > Create/Use New

**설정 옵션**:
- **Name**: 고유 이름 (필수)
- **Project**: 프로젝트명
- **Client**: 클라이언트명
- **Domain**: 주제/장르
- **Subject**: 주제 분야
- **Description**: 보충 설명
- **Author**: 엔트리 생성자 사용자명
- **Languages**: 체크박스로 다국어 선택 (최소 2개), 동일 메인 언어의 sublanguage 개별 선택 가능
- **Moderated**: 체크박스 (terminologist 승인 워크플로)
- **Late Disclosure**: 체크 해제 시 승인 대기 중에도 엔트리 즉시 표시
- **New term defaults**: 대소문자 민감도, 형태 매칭 기본값 설정

**엣지 케이스**:
- 프로젝트 언어 제외 시 경고 → "Add missing language(s)" 옵션
- 기본 설정에서 언어 제거 시 검색 결과 감소 경고

---

### 2.4 TB 엔트리 생성 (create-term-base-entry)

**접근**: 번역 에디터 > 소스 텍스트 선택 > Ctrl+E (대화상자) 또는 Ctrl+Q (즉시 추가)

**핵심 동작**:
- 소스 텍스트 선택 (선택적으로 타겟도) → Ctrl+E → Create term base entry 창
- 선택한 텍스트가 자동으로 채워짐
- Ctrl+Q: 대화상자 없이 즉시 추가

**설정 옵션**:
- Matching type: 50% prefix (기본) / Fuzzy / Exact / Custom (`|`, `*` 와일드카드)
- Case sensitivity: Permissive (기본) / Yes / No
- Part of speech, Gender, Number
- Usage example
- Forbidden 마킹
- Language-specific definition
- Entry-level 메타데이터: Domain, Client, Subject, Project
- Image 첨부

**중복 처리**:
- 중복 용어 존재 시 Duplicates 탭이 주황색으로 하이라이트
- 기존 엔트리에 새 용어 병합 가능 (별도 엔트리 대신)

**Qterm 통합**: 설정 시 양쪽 시스템에 동시 생성 가능

---

### 2.5 용어 조회 (look-up-term)

**접근**: Translation 리본 > Look Up Term / Ctrl+P

**핵심 동작**:
- 텍스트 선택 후 열기 → Search for 박스에 자동 입력
- 검색 대상: All term bases 또는 특정 TB 선택
- Search in target language 체크박스: 타겟 언어 용어 검색
- Only exact matches / Anywhere in term 라디오 버튼

**결과 표시**: 소스 용어, 타겟 용어, TB 이름. 우선순위: Project home의 TB 우선순위 설정 순

**편집 기능**:
- Add new term (소스/타겟 각각)
- Change: 용어 수정
- Toggle Case: lower → UPPER → Title → Sentence → original 순환
- Move Up/Down: 우선순위 조정
- Delete: 용어 삭제
- EuroTermBank 검색 지원

---

### 2.6 용어 추출 에디터 (term-extraction-editor)

**접근**: Preparation 리본 > Extract Terms → 후보 목록 에디터 탭 자동 열림

**소스**: 소스 문서, TM, LiveDocs 코퍼스에서 후보 추출

**후보 목록 열**:
| 열 | 설명 |
|----|------|
| Status | Candidate (초기) / Accepted (Ctrl+Enter) / Dropped (Ctrl+D) |
| Position | 목록 내 위치 |
| Score ($) | 빈도+길이 기반 신뢰도. TB 매치 시 높음 |
| Length | 문자 수 |
| Hides shorter | 긴 후보 내 하위 구문 숨김 토글 |
| Source | 추출된 용어 (편집 가능) |
| Source example | 사용 컨텍스트 (Ctrl+S로 복사) |
| Target | 번역 (직접 입력/드래그/우클릭 "Add as Target") |
| Target example | 번역 컨텍스트 (Ctrl+T로 복사) |

**정렬**: Status (accepted 우선) → Score (내림차순) → Frequency (내림차순) → 알파벳

**필터링**:
- Filter 텍스트 박스: 매칭 후보만 표시
- "Only with TB result" 체크박스: TB 매치 있는 후보만

**주요 명령**:
- Drop Term (Ctrl+D): Dropped 표시 → 목록 끝으로
- Accept as term (Ctrl+Enter): Accepted → 최종 TB에 복사 → 목록 앞으로
- Hide/unhide shorter (Ctrl+L): 하위 구성 요소 숨김 토글
- Merge candidates (Ctrl+J): 2+ 후보 병합 → 첫 번째가 메인, 나머지 "Also"
- Unmerge (Ctrl+T): 병합 해제
- Prefix merge and hide (Ctrl+M): `|` 문자로 접두사 공유 후보 자동 병합
- Add as stop word: 선택 텍스트/후보/모든 dropped를 stop word 목록에 추가
- Re-sort now (Ctrl+R): 정리 후 첫 미처리 후보로 이동

**번역 입력 방법**:
1. 직접 입력 (세미콜론으로 여러 번역 구분)
2. TB 매치 드래그 (우하단 패널)
3. Occurrences 패널 드래그 (좌하단 — 파란 배경=TM 매치, 흰 배경=소스 문서)
4. Look Up Terms Now 버튼

**내보내기**:
- Export To Term Base: Accepted 용어+번역+예시를 선택한 TB로
- Export to Excel: XLSX 파일로 저장
- Export To TaaS: TaaS 컬렉션에 업로드

**통계**: Candidate statistics (TB 매칭 결과, 상태 분포 — 수량/퍼센트, HTML 내보내기)

---

## 3. LiveDocs

### 3.1 LiveDocs 개요 (concepts-livedocs)

**접근**: Project home > LiveDocs / Resource console > LiveDocs

**핵심 동작**:
- 코퍼스에 다양한 유형의 문서 저장 → 번역 시 매치 제공
- Concordance 검색으로 단어/시퀀스 확인

**코퍼스 콘텐츠 유형**:
| 기술 | 문서 유형 | 동작 |
|------|----------|------|
| **ActiveTM** | 이중언어 문서 (XLIFF, table RTF, Trados DOC/RTF) | TM처럼 매치 제공. 임포트 즉시 사용 가능. TM 오염 방지 |
| **LiveAlign** | 원본+번역 문서 쌍 | 수동 정렬 없이 결과 제공. 즉석(on-the-fly) 정렬 수정 가능 |
| **Library** | 단일언어 문서 (타겟 언어) | Concordance로 용어 조사 |
| **EZAttach** | 바이너리 참조 자료 (PDF, 도면 등) | 적절한 뷰어에서 열기 |

**LiveDocs 유형**:
- Local: 사용자 컴퓨터
- Online: 원격 서버 (팀 협업, 문서 추가/편집)

**엣지 케이스**:
- ActiveTM: "의심스러운 콘텐츠로 TM 오염 방지" 목적
- LiveAlign: 전통적 정렬의 "먼저 정렬해야 사용" 제약 제거

---

### 3.2 이중언어 문서 에디터 (livedocs-bilingual-document-ac)

**접근**: Project home > LiveDocs > 이중언어 문서 선택 > View/Edit / Resource console

**핵심 동작**:
- Translation editor의 단순화 버전
- 소스/타겟 셀 자유 편집
- **제약**: 세그먼트 분할/결합 불가, TM/TB 사용 불가

**기능**:
- Document Preview: 서식화된 미리보기로 탐색
- Keywords: 문서에 키워드 입력/적용
- 3번째 열: 마지막 변경 시간 + 사용자명
- Read-only 모드: Resource console에서 접근 시 기본 읽기 전용 → View/Edit로 편집 모드
- **Re-indexing**: 편집 완료 후 "Apply" 클릭 → 재인덱싱 → LiveDocs 검색에 반영

---

## 4. Resources

### 4.1 세그먼테이션 규칙 (concepts-segmentation-rules)

**접근**: Resource console > Segmentation rules / Project home > Settings

**핵심 동작**:
- 문서 임포트 시 텍스트를 세그먼트(번역 단위)로 분할
- 구두점 기반 분할 (기본: 마침표 = 문장 끝)
- 예외: 서수 번호 등에서 마침표가 문장 끝이 아닌 경우

**기술적 기반**: 정규식(Regular Expressions) 기반

**설정 옵션**:
- 소스 언어별 규칙 세트 (편집 가능)
- 대부분 사전 설정된 규칙 제공
- SRX (Segmentation Rule eXchange) 1.0 표준 호환 → 다른 CAT 도구에서 마이그레이션 지원
- SRX 파일 임포트 가능

**Import/Export**: SRX 1.0 형식

---

### 4.2 Auto-Translation Rules (concepts-auto-translation-rules)

**접근**: Resource console > Auto-translation rules / 자동 (번역 시 백그라운드)

**핵심 동작**:
- 미번역 세그먼트 진입 → TM 조회 → TB 조회 → **Auto-translation rules 적용** (우선순위 순)
- 매칭 부분 소스 셀에 자동 하이라이트 (기본 녹색)
- 더블클릭 또는 Translation results pane에서 선택 적용

**기술적 기반**: 정규식 (소스 패턴 → 타겟 치환 패턴)

**적용 대상**:
- 날짜 및 숫자 값
- 법률 참조
- 측정 단위 변환
- 단순 카탈로그 항목 (fragment assembly와 조합 시)

**사전 설치**: 기본 규칙 세트 포함 (설정 없이 즉시 사용)

---

### 4.3 Non-Translatable Lists (concepts-non-translatable-lists)

**접근**: Resource console > Non-translatable lists / Project home > Settings

**핵심 동작**:
- 지정된 텍스트를 번역하지 않고 타겟 셀에 그대로 복사
- 미수정 세그먼트 진입 → TM → TB → **Non-translatable list** 순서로 검색
- 매칭 부분 회색 하이라이트, Translation results에 회색 매치로 표시

**설정 옵션**:
- 프로젝트당 여러 Non-translatable list 사용 가능
- 1개를 Primary로 지정 → 번역 에디터에서 새 표현 직접 추가 가능

---

### 4.4 AutoCorrect Lists (concepts-autocorrect-lists)

**접근**: Resource console / Translation 리본 > Translation settings

**핵심 동작**:
- 타이핑 중 실시간(on-the-fly) 텍스트 치환
- 약어 → 전체 표현 자동 확장 (예: "FYI" → "For your information")
- 대소문자 자동 교정: Shift 늦게 누른 경우 자동 수정
- CAPS LOCK 실수 자동 교정

---

### 4.5 Ignore Lists (concepts-ignore-lists)

**접근**: Translation 리본 > Spelling > Ignore these (**Project home Settings에서 사용 불가**)

**핵심 동작**:
- 맞춤법 검사 시 무시할 단어/표현 목록
- 스펠 체크 엔진 호출 전 ignore list 검색 → 매칭 시 정확한 것으로 처리

**매칭 규칙**:
- 단어 = 공백으로 구분된 비공백 문자 시퀀스
- 소문자 목록 항목 → 대문자/혼합 케이스 버전도 수용
- 마침표 있는 텍스트 → 마침표 없는 목록 항목과 매칭
- **역방향 미지원**: 목록에 마침표 있는 항목 vs 텍스트에 마침표 없는 경우 매칭 안 됨

---

## 5. QA (Quality Assurance)

### 5.1 QA Warnings 개요 (concepts-quality-assurance-qa-warnings)

**접근**: Project home > Settings > QA settings / QA 실행

**핵심 동작**:
- 100+ 자동 검사 수행: 숫자, 공백, 구두점, 용어 일관성, 세그먼트 길이 등
- 정규식 검사로 거의 모든 자동 검사 가능

**QA Warning 전체 카테고리 및 코드**:

#### Tag 관련 (1000-2000):
| 코드 | 설명 |
|------|------|
| 1001 | 제거 필요한 추가 태그 |
| 1002 | 누락된 필수 태그 |
| 2001 | 태그의 필수 속성 누락 |
| 2003 | 겹치는 태그 쌍 |
| 2004 | 소스의 필수 태그 누락 |
| 2005 | Off-codepage 문자 |
| 2006 | 문자의 여러 의미 |
| 2007 | 문서 설정에 없는 미정의 태그 |
| 2008 | 태그의 인식 불가 속성 |
| 2009 | 번역 가능 속성에 직접 텍스트 |
| 2010 | 잘못된 형식의 인라인 태그 |
| 2011 | 번역에서 누락된 인라인 태그 |
| 2012 | 번역 가능 속성이 있는 누락 태그 |
| 2013 | 번역 가능 속성이 잘못된 세그먼트 참조 |
| 2014 | 잘못 배치/누락된 번역 가능 속성 |
| 2015 | 추가 인라인 태그 |
| 2016 | 소스 대비 변경된 태그 순서 |
| 2017 | 변경된 비번역 태그 시퀀스 |

#### Content/Formatting (3000):
| 코드 | 설명 |
|------|------|
| 3010 | 빈 타겟 세그먼트 |
| 3020 | 끝 구두점 다름 |
| 3030 | 첫 글자 대소문자 다름 |
| 3050 | 연속 공백 |
| 3061 | 비표준 숫자 형식 |
| 3062 | 숫자 불일치 |
| 3063 | 숫자 누락 |
| 3064 | 추가 숫자 |
| 3065 | 전각 숫자 |
| 3067 | 엄격한 형식 불일치 |
| 3068 | 다른 숫자 서식 |
| 3069 | 숫자 그룹화 필요 |
| 3071-3076 | 기호 주변 공백 (정규/비줄바꿈 공백 누락/추가) |
| 3077 | 인용부호/괄호 수 다름 |
| 3078 | 언어에 맞지 않는 구두점 |
| 3079 | 잘못된 구두점 시퀀스 |
| 3080 | 언어별 구두점 누락 |
| 3081 | 번역이 소스보다 짧음 |
| 3082 | 번역이 크게 김 |
| 3083 | 문자 제한 초과 |
| 3084 | 설정된 길이 제한 초과 |
| 3085 | 중복 단어 |
| 3086 | 추가 구두점 |
| 3087 | 구두점 누락 |
| 3088 | 짝 없는 구두점 |
| 3089 | 인용부호/괄호 소스와 불일치 |
| 3091 | 번역에서 용어 누락 |
| 3092 | 번역에 추가 용어 |
| 3093 | 금지 용어 번역 |
| 3094 | Non-translatable 요소 누락 |
| 3095 | 추가 Non-translatable 요소 |
| 3096 | Non-translatable 수 다름 |
| 3097 | 소스 대응 없는 금지 용어 |
| 3098 | 소스의 금지 용어 |
| 3100 | 동일 소스, 다른 번역 (일관성) |
| 3101 | 다른 소스, 동일 번역 |
| 3110 | 세그먼트 끝 추가 공백 |
| 3131 | 서식 누락 (Bold/Italic/Underline) |
| 3132 | 추가 서식 |
| 3133-3134 | 소스↔번역 서식 불일치 |
| 3140 | Auto-translatable 요소 누락 |
| 3151-3153 | Exact/context 매치 불일치 |
| 3161 | 맞춤법 오류 |
| 3162 | 문법 오류 |
| 3180 | 픽셀 기반 길이 초과 |
| 3181 | 픽셀 기반 길이 규칙 없음 |
| 3182 | 문자열 길이 측정 실패 |
| 3190-3197 | 태그 전/후 공백 (누락/추가/비줄바꿈) |

#### 고급 검사 (3200+):
| 코드 | 설명 |
|------|------|
| 3200 | 금지 정규식 매치 |
| 3201 | 누락된 정규식 매치 |
| 3202 | 정규식 매치 수 다름 |
| 3203 | 누락된 정규식 치환 |
| 3204 | 금지된 정규식 치환 |
| 3205 | 정규식 매치/치환 수 다름 |
| 3206 | 금지 정규식 매치 (소스 무관) |
| 3220 | 삭제 누락 |
| 3221 | 삽입 누락 |
| 3301 | 측정 단위 추가됨 |
| 3302 | 측정 단위 제거됨 |
| 3303 | 측정 단위 변경됨 |
| 3304 | 영숫자 코드 추가됨 |
| 3305 | 영숫자 코드 제거됨 |
| 3306 | 영숫자 코드 불일치 |
| 3307 | 날짜 추가됨 |
| 3308 | 날짜 제거됨 |
| 3309 | 날짜 불일치 |

---

### 5.2 QA Settings 편집 (edit-qa-settings)

**접근**: Resource console > QA settings > Create/Edit / Project home > Settings > QA settings

**제한**: 기본 QA 설정은 직접 편집 불가 → 클론 필요

#### Tab 1: Segments and Terms

**Terminology**:
- "Check for consistent use of terminology": 프로젝트 TB와 일관성 확인
- 방향: Source→Target / Target→Source / Both ways
- "Warn if forbidden term is used": 소스 대응 없이도 경고 가능

**Segment Length**:
- 비율 기반: 타겟/소스 평균 비율 (예: 1.20 = 20% 길게), 문자/단어 선택
- 허용 편차 % (문자/단어 각각)
- 절대값: "Warn if translation is longer than N characters"

**Other**:
- 타겟=소스 경고 (미번역)
- 빈 타겟 경고
- Bold/Italic/Underline 확인
- Auto-translatables 확인
- Non-translatables 일관성 확인 (3방향) + Exact matching 옵션

#### Tab 2: Consistency

**Consistent Translation**:
- 중복 단어 검출 (공백 구분)
- 동일 세그먼트 일관 번역 확인 (서식/대소문자 민감도 선택)
- 양방향 확인

**TMs/Corpora 대비**:
- Best exact/context 매치와 번역 다를 때 경고
- Most recent exact/context 매치와 다를 때 경고
- 여러 exact/context 매치 존재 시 경고 (다른 타겟 세그먼트일 때만)
- Insertion/deletion 일관성 확인

#### Tab 3: Numbers

- 숫자 형식 확인
- 소스/타겟 숫자 매칭 확인
- 언어별 숫자 형식 설정 사용
- 영숫자 코드 확인
- 측정 단위 포함
- 측정 단위 문자 시퀀스 편집 가능
- 언어별 사용자 정의 숫자 형식 (Edit/Reset to default)

#### Tab 4: Punctuation

- 언어별 구두점만 허용
- 괄호/인용부호/아포스트로피 누락 경고
- 구두점 전/후 공백 확인
- 구두점 시퀀스 정확성 (말줄임표/마침표 예외 설정)
- 소스/타겟 끝 구두점 일치 확인
- 구두점 시퀀스 규칙: 최대 4개 연속, 좌/우 인용부호/괄호 조합, 대시/하이픈 배치
- 언어별 사용자 정의 구두점 (괄호, 아포스트로피, 인용부호, 문장 끝 부호)

#### Tab 5: Spaces, Capitals, Characters

- 연속 공백 경고
- 세그먼트 끝 추가 공백 감지
- 첫 글자 대소문자 일치 확인
- 금지 문자 목록 (U+ 형식 유니코드)
- 맞춤법 오류 경고 (Non-translatable list 예외 옵션)
- 맞춤법 제안 건너뛰기
- 문법 오류 경고
- 특정 태그를 공백으로 처리 (예: `<br/>`, `<img/>`) — 꺾쇠/슬래시 없이 입력

#### Tab 6: Inline Tags

- 소스 대비 Well-formedness 확인
- 겹치는 태그 쌍 확인
- 미정의 엔티티 유니코드 문자 경고
- 여러 엔티티로 정의된 유니코드 문자 경고
- 타겟의 누락/추가 태그 경고
- 변경된 태그 순서 경고 (문제 태그 하이라이트)
- 태그 전/후 공백 소스 일치 확인
- 열기/닫기 태그 형식 확인

#### Tab 7: Length

**문자 기반**: 행/코멘트에 저장된 값 기반 길이 확인

**픽셀 기반**:
- 정규식 규칙: 글꼴, 스타일, 크기 추출 ($1, $2, $3 그룹 참조)
- 글꼴 파라미터: Arial, 10pt, BI 스타일
- **"These warnings cannot be ignored"** → 길이 위반 시 내보내기 불가
- 크기 정보 미발견 시 경고
- 문자열 측정 실패 시 경고 (글꼴 가용성)

#### Tab 8: Regex

**7가지 경고 유형**:
1. Forbidden regex match in target for source
2. Missing regex match in target
3. Counts of regex matches differ
4. Missing regex replacement in target
5. Forbidden regex replacement in target
6. Counts of regex matches/replacements differ
7. Forbidden regex match in target (source-independent)

**설정 필드**: Source regex, Target regex/replacement, Correction ($1/$2 플레이스홀더), Description, "Expand tags to text before processing"

**관리**: Add, Update, Delete, Clear all, Move up/Down

#### Tab: Severity

- 모든 결과 기본 Warning
- 개별 결과를 Error 또는 Warning으로 설정
- 코드/설명으로 검색 가능

---

## 6. LQA (Linguistic Quality Assurance)

### 6.1 LQA 개요 (concepts-linguistic-quality-assurance)

**접근**: Project home > Settings > LQA settings

**핵심 동작**:
- 인간 리뷰어의 구조화된 피드백 → 번역 채점/등급 부여
- QA(자동 형식 검사)와 **별개** — LQA는 인간 피드백

**지원 표준**:
- J2450
- LISA
- TAUS
- memoQ 자체 모델

**프로젝트 통합**: 프로젝트 생성 시 LQA 모델 할당

---

### 6.2 LQA 모델 편집 (edit-lqa-models)

**접근**: Resource console > LQA settings > Edit / Project home > Settings > LQA models > Edit

**주의**: 내장 프로필 직접 편집 가능하나, memoQ 업데이트 시 덮어쓰기 가능 → 클론 후 수정 권장

#### QA Model 탭: 오류 카테고리 및 채점

**카테고리 구조**: Main category > Subcategory > Grading columns

**카테고리 추가**: Add → 노란 하이라이트 행 → Category 입력 → Tab → Subcategory → Grading 열 완성

**Penalty Points 시스템**:
- "The QA model uses penalty points" 체크박스로 활성화
- 문서 채점 시 각 오류의 페널티 포인트 합산
- 3가지 구성:
  1. Penalty points only: 카테고리당 1개 페널티 값
  2. Severity levels only: 카테고리별 해당 심각도 체크박스
  3. Both: 각 심각도 열에 페널티 값 입력

**Severity Levels**:
- 낮음 → 높음 순서
- Add (이름 입력 → Add), Modify (클릭 → 변경 → Update), Delete (Remove)
- Move Up/Down으로 순서 변경
- "The QA model uses severity levels" 체크박스

#### QA Mappings 탭

- 자동 QA 경고 → LQA 오류 카테고리 매핑
- 빈 행에서 Automatic QA type 드롭다운 선택 → LQA 카테고리 선택
- 카테고리는 QA Model 탭에 미리 존재해야 함
- 심각도는 여기서 지정 불가

#### Pass/Fail Criteria 탭

**Penalty Points 사용 시**:
- **Method 1 - Relative Score**: `(1 - total_points / total_words) < s` → 오류 밀도 측정
  - 기본 분모: 1,000 단어 (w= 필드로 조정 가능: 100, 10,000 등)
- **Method 2 - Normalized Score**: `(1 - total_points / total_words) < s` → 백분율 품질
  - 기본값 0.90 (페널티가 단어 수의 10% 미만)

**Penalty Points 미사용 시**:
- 테이블 기반 조건:
  - 오류 수 입력
  - Error type 선택 (카테고리 또는 심각도)
  - 텍스트 단위 수 (정수)
  - 단위 유형: Word / Segment / Document
- 예: "3000 단어당 20개 minor errors 또는 3개 major errors 시 실패"
- 옵션: "Count multiple occurrences of the same error as one" (동일 오류 텍스트 반복 = 1회로)

**필수 피드백**: "Require commenting on errors" 체크박스 → 설명 없이 LQA 정보 저장 불가

**Export 동작**: 이중언어 문서 내보내기 시 LQA 모델 임베드. 임포트 시 원래 LQA 모델 유지

---

## 404 URL 상태 요약

| 원래 URL | 대체 URL | 상태 |
|----------|---------|------|
| concepts-tm-match-scoring.html | concepts-tm-match-scoring-and-number-su.html + concepts-match-rates-from-translation-m.html | 수집 완료 |
| edit-tm-entry.html | view-or-edit-tm-entry.html + edit-translation-memory.html | 수집 완료 |
| create-entry.html | create-term-base-entry.html | 수집 완료 |
| bilingual-doc-editor.html | livedocs-bilingual-document-ac.html | 수집 완료 |
| concepts-lqa-models.html | concepts-linguistic-quality-assurance.html | 수집 완료 |

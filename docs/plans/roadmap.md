# mehQ 구현 로드맵

> 총 14 Phase, 약 36주(9개월). 각 Phase 완료 시 동작하는 앱 보장.
> MT/서버 기능 제외, 로컬 전용.

---

## 전체 타임라인

| Phase | 이름 | 기간 | 복잡도 | 핵심 산출물 |
|-------|------|------|--------|-------------|
| 1 | Foundation | 2주 | 낮음 | 앱 셸 + Welcome Wizard + SQLite |
| 2 | Project & Dashboard | 3주 | 중간 | 프로젝트 CRUD + Dashboard |
| 3 | Editor Core | 4주 | **매우 높음** | AG Grid + ProseMirror 에디터 |
| 4 | Document Import | 3주 | 중간~높음 | XLIFF/PO Import/Export |
| 5 | Translation Memory | 3주 | 높음 | TM 매칭 엔진 + 에디터 연동 |
| 6 | Results & Lookup | 3주 | 높음 | Results Pane + AutoPick + Concordance |
| 7 | Term Base | 3주 | 중간 | TB 매칭 + Import/Export |
| 8 | Editor Advanced | 3주 | **매우 높음** | 인라인 태그 + Track Changes + F&R |
| 9 | Resources & QA | 3주 | 높음 | QA 100+ 검사 + Resource Console |
| 10 | Monolingual Formats | 3주 | **매우 높음** | Python sidecar + 30+ 포맷 |
| 11 | LiveDocs & Alignment | 3주 | 높음 | 코퍼스 + LiveAlign |
| 12 | Preparation & Analysis | 2주 | 중간 | Pre-translate + 보고서 |
| 13 | Options & Appearance | 2주 | 중간 | 테마 + 단축키 + 맞춤법 |
| 14 | Polish & Integration | 2주 | 중간 | 최적화 + 릴리스 |

---

## 의존성 그래프

```
Phase 1 (Foundation)
  └── Phase 2 (Project/Dashboard)
        └── Phase 3 (Editor Core)  ◄── 최대 리스크
              └── Phase 4 (Document Import)
                    ├── Phase 5 (TM)
                    │     └── Phase 6 (Results/Lookup)
                    │           └── Phase 7 (TB)
                    │                 └── Phase 8 (Editor Advanced)
                    │                       └── Phase 9 (Resources/QA)
                    │                             ├── Phase 10 (Monolingual) ─┐
                    │                             └── Phase 11 (LiveDocs)  ───┤ 병렬 가능
                    └── Phase 12 (Preparation) ← Phase 5~9 필요             │
              └── Phase 13 (Options) ← Phase 3 이후 언제든 가능              │
  Phase 14 (Polish) ← 전체 완료 후 ─────────────────────────────────────────┘
```

---

## Phase 1: Foundation (2주)

**목표**: Electron + React 앱 셸, 빌드 파이프라인, Welcome Wizard

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 1-1 | 2일 | Electron Forge + Vite + React 보일러플레이트, main/preload/renderer 구조 |
| 1-2 | 2일 | SQLite 연결(better-sqlite3), user_settings 스키마, IPC 통신 레이어 |
| 1-3 | 3일 | Welcome Wizard UI(사용자 이름/작업 디렉토리/UI 언어), 설정 저장, 최초 실행 감지 |
| 1-4 | 3일 | Playwright E2E 설정, ESLint/Prettier, 빈 Dashboard 셸 |

### 리스크
- better-sqlite3 네이티브 모듈 ABI 호환 (Electron rebuild)

### 완료 시 앱 상태
> Welcome Wizard → 빈 Dashboard. 설정은 SQLite에 저장.

---

## Phase 2: Project & Dashboard (3주)

**목표**: 프로젝트 생성/관리, Dashboard 목록

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 2-1 | 3일 | DB 스키마(projects, documents), Project CRUD API, New Project Wizard(Details+Finish) |
| 2-2 | 3일 | Dashboard: AG Grid 프로젝트 목록, Two-row view, 정렬, 검색 |
| 2-3 | 2일 | Details Pane, 상태 아이콘(7단계), 마감 경고, Clone Project |
| 2-4 | 2일 | Project Home 셸(PM/Translator 뷰), Project Settings 기본 |
| 2-5 | 2일 | E2E: 프로젝트 CRUD 전체 플로우 |

### 리스크
- AG Grid Community 기능 범위 확인 필요

### 완료 시 앱 상태
> 프로젝트 생성/관리, Dashboard 목록 표시. 프로젝트 열기 → 빈 에디터.

---

## Phase 3: Editor Core (4주) ⚠️ 최대 리스크

**목표**: AG Grid 세그먼트 그리드 + ProseMirror 인라인 편집

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 3-1 | 3일 | AG Grid 세그먼트 그리드: Source/Target 2열, 세그먼트 번호, Status 박스 |
| 3-2 | 3일 | **ProseMirror(TipTap) + AG Grid 통합**: 셀 내 리치 텍스트 편집, 포커스 관리 |
| 3-3 | 3일 | 네비게이션: 키보드 이동, 셀 간 포커스, 멀티 세그먼트 선택 |
| 3-4 | 3일 | 번역 확인 로직: 상태 전이, 자동 저장, Ctrl+Enter 플로우 |
| 3-5 | 3일 | 서식(B/I/U), 텍스트 조작(Source→Target, Undo/Redo), 대소문자 변경 |
| 3-6 | 2일 | Status Bar(완성도 %, 상태별 카운트), 기본 필터링/정렬 |
| 3-7 | 3일 | 세그먼트 상태 시스템: 9종 상태 + 색상 CSS 변수, Change Status 다이얼로그 |
| 3-8 | 2일 | E2E: 세그먼트 이동/편집/확인/상태변경 |

### 리스크 (최대)
- **AG Grid + ProseMirror 통합**: 셀 편집기 커스텀 컴포넌트, 포커스/키 이벤트 충돌
- **가상 스크롤 + 에디터 인스턴스**: 수천 세그먼트 성능
- **완화**: Sprint 3-2에서 POC 먼저 검증, 실패 시 셀 외부 에디터 패널 대안

### 완료 시 앱 상태
> 하드코딩 세그먼트로 번역 편집/확인/상태 변경, 서식 적용, 필터/정렬 동작.

---

## Phase 4: Document Import & Bilingual (3주)

**목표**: XLIFF/PO 등 bilingual 파일 Import/Export

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 4-1 | 3일 | XLIFF 파서(1.2+2.0), 세그먼트 추출, segments DB 테이블 |
| 4-2 | 3일 | PO Gettext, TMX, mehQ XLIFF 파서 |
| 4-3 | 2일 | New Project Wizard Documents 단계: 드래그앤드롭, Import, 필터 자동 선택 |
| 4-4 | 2일 | Export: XLIFF/PO 내보내기, 번역 상태 반영 |
| 4-5 | 2일 | Filter Configurations 기본 UI, Import Settings |
| 4-6 | 2일 | E2E: XLIFF Import → 편집 → 확인 → Export → 재Import round-trip |

### 리스크
- XLIFF 1.2 vs 2.0 파서 복잡도
- 인라인 태그 round-trip 데이터 무손실

### 완료 시 앱 상태
> **최소 CAT 도구 완성**: XLIFF/PO Import → 번역 → Export.

---

## Phase 5: Translation Memory (3주)

**목표**: TM 생성/매칭/에디터 연동

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 5-1 | 3일 | TM DB 스키마(translation_units, context_pairs), CRUD API, TM 생성 다이얼로그 |
| 5-2 | 3일 | Match Scoring 엔진: Levenshtein 퍼지, Context match(101%/102%), Number Substitution |
| 5-3 | 3일 | 에디터 연동: Ctrl+Enter→TM 저장, 세그먼트 이동→TM 조회, 매치율 표시 |
| 5-4 | 2일 | TM Editor: AG Grid, Find&Replace, Flagging |
| 5-5 | 2일 | TM Import/Export(TMX/CSV), TM Settings, Working/Master/Reference Role |
| 5-6 | 2일 | E2E: TM 생성 → 확인 → TM 히트 표시 |

### 리스크
- 대규모 TM(10만+) 검색 성능 → SQLite FTS5 또는 인메모리 인덱스

### 완료 시 앱 상태
> TM 연동: 확인 시 TM 저장, 세그먼트 이동 시 TM 히트 표시.

---

## Phase 6: Results & Lookup (3주)

**목표**: Translation Results Pane, 자동 조회, AutoPick, Concordance

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 6-1 | 3일 | Translation Results Pane: 3단 레이아웃, 비교 박스, 메타 정보 |
| 6-2 | 3일 | 색상 코딩 7종, 매치율 6단계, 램프(8종), 정렬 로직 |
| 6-3 | 2일 | Automatic Lookup: TM/Fragment 자동 검색, 삽입 우선순위, Auto-insert |
| 6-4 | 2일 | AutoPick: Ctrl 토글, Tags/Numbers/URLs 인식, 숫자 포맷 |
| 6-5 | 2일 | Concordance: Ctrl+K, KWIC/Source+Target, 와일드카드, Guess translation |
| 6-6 | 2일 | Fragment Assembly 엔진, Translation Results Settings |
| 6-7 | 2일 | E2E: Results 표시 → 삽입 → AutoPick → Concordance |

### 완료 시 앱 상태
> 세그먼트 이동 시 TM/Fragment 결과 자동 표시, 삽입, Concordance 검색.

---

## Phase 7: Term Base (3주)

**목표**: TB 생성/매칭/에디터 연동

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 7-1 | 3일 | TB DB 스키마(entries/languages/terms), CRUD, 생성 다이얼로그 |
| 7-2 | 3일 | Term Matching: Fuzzy/Prefix/Exact, Case sensitivity 3종, Forbidden term |
| 7-3 | 2일 | 에디터 연동: Results Pane TB 히트(파랑), Ctrl+P, MatchPatch 통합 |
| 7-4 | 2일 | TB Editor: AG Grid, 필터/정렬 |
| 7-5 | 2일 | TB Import/Export(CSV/Excel/TBX), Term Extraction 기본 |
| 7-6 | 2일 | E2E: TB 생성 → 용어 추가 → 에디터 매칭 |

### 완료 시 앱 상태
> TM + TB 모두 동작. Results Pane에 TM 히트 + TB 용어 통합 표시.

---

## Phase 8: Editor Advanced (3주) ⚠️ 높은 복잡도

**목표**: 인라인 태그, 세그먼트 조작, Track Changes, Find&Replace 등

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 8-1 | 3일 | **인라인 태그**: ProseMirror 커스텀 노드, 4가지 표시 모드, F9/F6/Alt+F8 |
| 8-2 | 2일 | Source 편집(F2), Join/Split/Resegment, 세그먼트 잠금 |
| 8-3 | 2일 | 특수 문자(Unicode 팔레트), Non-breaking Space, Non-Printing Characters |
| 8-4 | 3일 | **Find & Replace**: Quick Find + Advanced, Regex, Search within tags |
| 8-5 | 2일 | Auto-propagation, Clear Translations, Predictive Typing |
| 8-6 | 3일 | **Track Changes**: 삽입/변경/삭제 추적, Compare Versions |
| 8-7 | 2일 | Notes(심각도 4레벨), Row History(버전 이력, 복원), E2E |

### 리스크
- 인라인 태그 ProseMirror nodeView + atom 구현
- Track Changes prosemirror-changeset 통합

### 완료 시 앱 상태
> 전문 번역가 수준 에디터: 태그, 분할/결합, Track Changes, F&R, Auto-propagation 완성.

---

## Phase 9: Resources & QA (3주)

**목표**: Resource Console, QA 100+ 검사, LQA, Segmentation Rules

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 9-1 | 3일 | Resource Console UI: 리소스 타입별 목록/생성/편집 프레임워크 |
| 9-2 | 3일 | QA Settings 8탭 UI + 검사 엔진 코어(Segments, Consistency, Numbers, Punctuation) |
| 9-3 | 3일 | QA 검사 확장: Spaces/Capitals, Inline Tags, Length, Regex |
| 9-4 | 2일 | Segmentation Rules(SRX), QA Warnings 에디터 연동 |
| 9-5 | 2일 | LQA Models(J2450/LISA/TAUS, Pass/Fail), Auto-Translation Rules |
| 9-6 | 2일 | Non-translatable/Ignore/AutoCorrect Lists, Export Path Rules |
| 9-7 | 2일 | Regex Assistant(라이브러리+테스트), Regex Tagger, E2E |

### 완료 시 앱 상태
> QA 실시간 동작, 경고/에러 에디터 표시. SRX 분절, LQA 스코어링, 리소스 관리.

---

## Phase 10: Monolingual Formats (3주) ⚠️ 높은 복잡도

**목표**: Python sidecar, 30+ monolingual 포맷

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 10-1 | 3일 | Python sidecar: child_process, JSON-RPC IPC, 헬스체크 |
| 10-2 | 3일 | 1차: JSON/YAML/XML 파서, round-trip Export |
| 10-3 | 3일 | 1차 계속: HTML/Markdown/Plain text/Java properties/.resx |
| 10-4 | 3일 | 2차: MS Office(python-docx/openpyxl/python-pptx), Cascading Filters |
| 10-5 | 2일 | 3차: OpenDocument, SubRip(.srt), CSV/TSV |
| 10-6 | 2일 | Filter Configs 완성, E2E: 주요 포맷 round-trip |

### 완료 시 앱 상태
> 30+ 문서 포맷 Import. JSON/YAML/XML/Office 등 실무 워크플로우.

---

## Phase 11: LiveDocs & Alignment (3주)

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 11-1 | 3일 | LiveDocs DB, Corpus 생성, 문서 추가 |
| 11-2 | 3일 | LiveDocs 검색 → Results Pane/Concordance 통합 |
| 11-3 | 2일 | Bilingual/Monolingual Editor (에디터 컴포넌트 재사용) |
| 11-4 | 3일 | LiveAlign: 자동 정렬, 4가지 링크 타입, 페널티 |
| 11-5 | 2일 | 앵커 옵션, TM 내보내기, Document Linking |
| 11-6 | 2일 | E2E: LiveDocs → 에디터 히트 → LiveAlign → TM Export |

### 완료 시 앱 상태
> TM + TB + LiveDocs 3대 리소스 완성. 기존 번역 정렬→TM 변환.

---

## Phase 12: Preparation & Analysis (2주)

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 12-1 | 3일 | Pre-translate: TM/TB/Fragment 소스, 임계값, Confirm/Lock, 진행바 |
| 12-2 | 3일 | Statistics/Analysis Reports: 매치율 분포, Export(CSV/HTML) |
| 12-3 | 2일 | Edit Distance/LQA Reports, Project Home Reports 탭 |
| 12-4 | 2일 | View Pane(Preview/Review/Comments), Go to Segment 4탭 완성, Advanced Filters 4탭 |
| 12-5 | 2일 | E2E: Pre-translate → 통계 → 보고서 Export |

### 완료 시 앱 상태
> Pre-translate, 통계/분석 보고서, View Pane 미리보기.

---

## Phase 13: Options & Appearance (2주)

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 13-1 | 3일 | Keyboard Shortcuts: 중앙 레지스트리, 100+개, 세트 Clone/편집, Import/Export |
| 13-2 | 3일 | Appearance: CSS 변수 테마, 폰트 6종, Default/Inverted 스킴, 상태별 색상 |
| 13-3 | 2일 | Miscellaneous 9탭, Advanced Lookup, Default Resources |
| 13-4 | 2일 | Spelling/Grammar(Hunspell), F7, Export Path Rules |
| 13-5 | 2일 | E2E: 테마 변경 → 단축키 커스텀 → 맞춤법 검사 |

### 완료 시 앱 상태
> 외관/단축키 커스터마이즈, 맞춤법 검사.

---

## Phase 14: Polish & Integration (2주)

### Sprint 분할

| Sprint | 기간 | 내용 |
|--------|------|------|
| 14-1 | 3일 | 미완성 기능: 레이아웃 프리셋, 패인 드래그, 언어 감지 잠금, Compare Versions |
| 14-2 | 3일 | 성능: 5만+ 세그먼트 프로파일링, 가상 스크롤 튜닝, TM 벤치마크, 메모리 점검 |
| 14-3 | 2일 | 통합 E2E: XLIFF Import → TM/TB → Pre-translate → 편집 → QA → Export |
| 14-4 | 2일 | 앱 패키징(macOS .dmg), 릴리스 노트, 알려진 제한 문서화 |

### 완료 시 앱 상태
> **mehQ v1.0 릴리스**: 전문 번역가가 실무에서 사용 가능한 CAT 도구.

---

## 크로스커팅 관심사 (Phase 1부터 적용)

1. **CSS 변수 체계**: 모든 색상/폰트/간격을 CSS 변수로 (Phase 13 테마 전제)
2. **Typed IPC**: main-renderer 통신 타입 안전 패턴 (Phase 2에서 확립)
3. **DB 마이그레이션**: SQLite 스키마 변경 시스템 (Phase 1에서 구축)
4. **단축키 레지스트리**: 모든 단축키 중앙 등록 (Phase 3부터)
5. **E2E 테스트**: 매 Phase 필수 (Phase 14 부담 감소)

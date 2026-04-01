# memoQ Document Formats, Alignment, Options/Settings, Muses, MT Settings - Research

> Source: memoQ 12.2 공식 문서에서 추출 (2026-04-01)

---

## 1. Document Formats (지원 형식)

### 지원 문서 형식 전체 목록

**접근**: Documents 리본 > Import 하위 화살표 > Import with options > Change filter and configuration

#### Monolingual 형식

| 카테고리 | 형식 (확장자) |
|----------|-------------|
| **Adobe** | InDesign (.inx), IDML (.idml), InCopy (.icml), FrameMaker (.mif, .mi2), Photoshop (.psd) |
| **COTI** | Common Translation Interface packages (.zip, .coti) |
| **HTML** | .html, .htm, .shtml (SSI), .aspx (ASP.NET), .jsp (Jakarta Server Pages), .php |
| **Include** | .inc |
| **Image** | .bmp, .dib, .gif, .jpg, .jpeg, .jpe, .jif, .jfif, .jfi, .png, .tif, .tiff |
| **Java** | properties (.properties) |
| **JSON** | .json |
| **Markdown** | .md |
| **MS Excel** | 2003- (.xls, .xlt, .xlsb, .xml, .xlsm), 2007+ (.xlsx, .xltx) |
| **MS PowerPoint** | 2003- (.ppt, .pps, .pot, .pptm), 2007+ (.pptx, .ppsx, .sldx, .potx) |
| **MS Visio** | .vsd, .vsdx, .vdx, .vsdm, .vss, .vssx, .vssm, .vtx, .vstm, .vdw, .vsr, .vstx, .vsx |
| **MS Word** | 2003- (.doc, .rtf, .bak, .dot, .docm, .dotm), 2007+ (.docx, .dotx) |
| **MS Help** | .hhc, .hhk |
| **Multilingual tables** | .csv, .tsv, .txt, .xlsx, .xls, .xlsm |
| **Multilingual XML** | .mulix |
| **Outlook** | .msg |
| **OpenDocument** | .odf, .odt, .odp, .ods |
| **PDF** | .pdf |
| **Plain text** | .txt, .inf, .ini, .reg |
| **.NET Resource** | .xml, .resx |
| **SubRip** | .srt |
| **WordPress XLIFF** | .xlf, .xlif, .xliff (WPML) |
| **XML** | .xml, .sgm, .sgml, .ttml |
| **YAML** | .yaml, .yml |
| **ZIP** | .zip |
| **AuthorIT** | .xml |
| **DITA** | .dita, .xml, .ditamap, .bookmap |
| **FreeMind** | .mm |
| **SVG** | .svg |
| **Typo3** | .xml |

#### Bilingual 형식

| 형식 | 확장자 |
|------|--------|
| PO Gettext | .po |
| SDL Trados Studio XLIFF | .sdlxliff |
| SDL Trados TagEditor | .ttx |
| TMX | .tmx |
| Bilingual (Trados) DOC/RTF | .doc, .rtf, .bak |
| WordFast Pro / GlobalLink TransStudio TXML | .txml |
| XLIFF | .xlf, .xlif, .xliff |
| Xliff:doc | .xliffdoc |
| Phrase (Memsource) XLIFF | .mxliff |

#### memoQ Bilingual 형식

| 형식 | 확장자 |
|------|--------|
| memoQ XLIFF | .mqxliff, .mqxlz |
| Table RTF | .rtf |

#### Package 형식

| 형식 | 확장자 |
|------|--------|
| SDL Trados Studio packages | .sdlppx |
| STAR Transit packages | .pxf, .ppf |
| TIPP packages | (별도 확장자) |
| memoQ handoff package | .mqout |
| SDL World Server | .xlz, .wsxz |

**핵심 동작**:
- 모든 형식에 Regex tagger 또는 cascading filter를 적용 가능
- memoQ는 파일 확장자로 문서 형식을 인식하되, 수동으로 다른 필터를 선택 가능
- 확장자가 불명확한 파일은 주황색 번개 볼트(또는 빨간 삼각형)로 표시 -> 수동 필터 선택 필수

---

## 2. Document Import Settings

### 핵심 동작
**접근**: Documents 리본 > Import 하위 화살표 > Import with options > 파일 선택 > Change filter & configuration

- **동작**: [Import with options 선택] -> [파일 선택 Open] -> [Document import options 창] -> [Change filter & configuration] -> [Document import settings 창]
- 문서 형식별로 설정 창이 다름
- Skeleton: 번역 대상이 아닌 서식/구조 정보를 별도 저장

### Preview 지원 형식
MS Word, Excel, PowerPoint, HTML, XML (XSLT 포함), WPML XLIFF, Multilingual Excel, Text, XML

### Filter Configuration 선택
- **Filter 드롭다운**: 다른 필터 선택 가능
- **Filter configuration 드롭다운**: 저장된 필터 구성 선택
- 온라인 프로젝트: 로컬 또는 연결된 서버에 필터 구성이 있어야 함
- Save 아이콘: 기존 구성 덮어쓰기
- Save new 아이콘: 새 구성으로 저장 (이름/설명 입력)

### Reimport 시 필터 기억 방식
- **[o]** = Original configuration (동일 구성이 존재하고 변경 없음)
- **[c]** = Changed configuration (동일 구성이 존재하나 변경됨)
- **[s]** = Stored configuration (원래 구성이 삭제됨, 프로젝트 데이터에서 복원)
- Reimport 시 문서의 새 major version 생성 -> X-Translate로 이전 번역 복구 필요

### Cascading Filters (체이닝)
- 첫 번째 필터 처리 후 두 번째 필터 적용 가능
- 예: Excel 셀 내 HTML 마크업 -> HTML 필터 적용
- 예: Plain text의 name=value -> Regex tagger로 name= 부분 태깅
- **제약**: 첫 번째 필터가 inline tag를 반환하면 두 번째 필터 불가
- **제약**: Regex tagger는 체인의 마지막이어야 함 (단, 추가 Regex tagger는 가능)
- XML/HTML 기반 필터의 공백 문자: cascading 시 첫 필터가 공백을 그대로 통과시키고, 두 번째 필터 처리 후 인라인 태그로 변환

---

## 3. Document Import Options

### 핵심 동작
**접근**: Documents 리본 > Import 화살표 > Import with options

### 설정 옵션

| 기능 | 동작 |
|------|------|
| **뷰 전환** | Change view 링크 -> File type 그룹 / No grouping (flat view) |
| **그룹 접기/펼치기** | 화살표 클릭 또는 더블클릭, Collapse all / Expand all |
| **전체 경로 표시** | Change view > Show full path 체크박스 |
| **에러만 표시** | Change view > Show errors and warnings only |
| **파일 제거** | 체크박스 선택 후 Remove 링크 |
| **필터 변경 (단일)** | Filter & configuration 드롭다운에서 직접 선택 |
| **필터 변경 (복수)** | Ctrl+클릭으로 선택 후 Change filter & configuration |
| **Bilingual 업데이트** | 자동 인식, Action & languages = "Import as new"면 업데이트 불가 |
| **Reimport** | Change action & languages > Reimport 옵션 |
| **임베디드 이미지** | Import embedded images 체크박스 |
| **임베디드 객체** | Import embedded objects 체크박스 (기본 체크됨) |
| **Preview 끄기** | Create preview 체크박스 해제 |
| **대상 언어 선택** | Change action & languages > 언어 체크박스 |
| **버전 이력** | Record version history 체크박스 (끄지 않는 것 권장) |

### 엣지 케이스
- 확장자가 memoQ에 없는 경우: 빨간 삼각형 표시, 수동 필터 선택 필수
- Bilingual 업데이트 불가 시: 새 문서로 임포트 후 TM으로 Confirm and update rows -> Pre-translate
- 5개 초과 문서 내보내기 시: 자동 열기 안 됨
- Composite filter로 Office/ZIP 내 임베디드 객체 제어 가능
- Content-connected/template-based 프로젝트: 모든 문서가 워크플로 끝에 도달해야 자동 내보내기

---

## 4. Filter Configurations

**접근**: Documents 리본 > Import with options > Change filter and configuration

**핵심 동작**:
- 파일 필터의 세부 설정을 조정하는 리소스
- Import With Options에서 사용
- 다른 사용자와 공유 가능
- XML, Excel 등 옵션이 많은 형식에 특히 유용
- 예: INX의 인덱스 항목 임포트 여부, Word의 목차 임포트 여부, Excel의 셀 범위 제외, XML의 translate="yes" 세그먼트만 임포트

---

## 5. Tags (태그)

### Uninterpreted Formatting Tags
- Bold, Italic, Underline 외 서식 변경 지점에 {1}, {2}, {3} 등의 placeholder 삽입
- 인라인 이미지, 줄바꿈, 탭도 태그로 표시
- **삽입**: F9 키 (순서대로 삽입, 순서 변경 불가, 역방향 이동 후 F9 시 재번호 매김)
- 임포트 후 태그의 실제 의미는 무시됨 -> 내보내기 시 복원
- 모든 소스 태그를 타겟에 삽입해야 함 -> 미삽입 시 번개/느낌표 아이콘 경고

### Inline Tags
- Opening tag, Closing tag, Empty tag 구분
- 타입/이름/속성 표시, 자유롭게 재배치/추가/삭제 가능
- 기본 색상: 회색
- XML 문서의 non-translated 인라인 태그: 내용과 함께 단일 태그로 대체

### Special Inline Tags

| 태그 | 출처/용도 |
|------|----------|
| tw:it | TTX, Trados bilingual RTF |
| st:it | Star Transit (Treat markup as XML 비활성화 시) |
| mq:nt | RTF/DOCX 내 인라인 비번역 텍스트 |
| mq:it | memoQ table RTF (잘못된 입력), Java properties HTML 태그 |
| mq:ch | 특수 문자 placeholder (DOCX 탭, Symbols/WingDings 폰트) |
| mq:gap | (더 이상 사용 안 함) |
| mq:rxt-req | Regex Tagger 필수 태그 |
| mq:rxt | Regex Tagger 일반 태그 |
| mq:txml-ut | Wordfast TXML 태그 |
| mq:pi | HTML/XML processing information 태그 |
| bpt/ept/ph/it | XLIFF 필터 (Mask with bpt, ept, ph or it 옵션 선택 시, val 속성 있을 때만) |

### XML Quality Assurance
- 인라인 태그 조작으로 잘못된 문서 생성 가능 -> QA 경고/오류 목록 제공
- Resolve errors and warnings 탭에서 해결 방법 안내

### 엣지 케이스
- Special inline tags는 paired가 아님, 항상 새 번호 부여 (단, 같은 세그먼트 내 동일 타입/이름/속성이면 예외)
- 세그먼트 경계의 서식 변경 = invisible tag -> 조인 시 visible로 전환
- "mq:rxt" 태그로 필터링하여 태깅된 텍스트 검색 가능

---

## 6. Alignment Editor

### 핵심 동작
**접근**: Project home > LiveDocs > 코퍼스 선택 > 문서 쌍 우클릭 > View/Edit
또는 Resource Console > LiveDocs > 문서 쌍 우클릭 > View/Edit
또는 Translation results에서 매치 우클릭 > Show Document

**동작**: [소스+번역 문서 추가] -> [자동 세그먼테이션 및 정렬] -> [수동 검토/수정] -> [확인 및 TM 내보내기]

### LiveAlign 기술
- 문서 쌍을 LiveDocs에 추가하면 즉시 매치 제공 시작
- 모든 정렬을 검토하지 않아도 매치 사용 가능 -> 오류 발견 시 해당 부분만 수정
- 번역 에디터에서 직접 정렬 에디터로 이동 가능

### Connection Line 타입

| 라인 | 의미 |
|------|------|
| **진한 초록** (Solid green, 4단계 명암) | 자동 링크 (Auto link), 진할수록 높은 신뢰도 |
| **파란색** (Solid blue) | 수동 링크 (사용자가 생성/확인) |
| **분홍색** (Pink) | 교차 링크 (Cross link, 세그먼트 순서가 다를 때) |
| **빨간 스텁** (Short red stubs) | 삽입 (Insertion, 대응 세그먼트 없음) |

### 조작 명령

| 명령 | 단축키 | 동작 |
|------|--------|------|
| 세그먼트 병합 | Ctrl+J | 현재 세그먼트와 다음 세그먼트 합침 (소스/타겟 중 커서 위치 쪽) |
| 세그먼트 분할 | Ctrl+T | 커서 위치에서 분할 |
| 텍스트 편집 | 직접 입력 | 약 5초 후 자동 저장, Ctrl+S로 즉시 저장 |
| 동기화 링크 | Alignment 리본 > Create Synchro Link | 소스+타겟 세그먼트 선택 후 파란 링크 생성 |
| 교차 링크 | Ctrl+O | 순서가 다른 세그먼트 연결 (분홍 곡선) |
| 삽입 표시 | Ctrl+I | 대응 없는 세그먼트 표시 |
| 용어집 검색 | Ctrl+K | 선택 텍스트로 Concordance 실행 |
| 용어 추가 | Ctrl+Q (직접 추가) / Ctrl+E (대화상자) | 선택한 소스+타겟 표현을 용어집에 추가 |
| 수동 용어 조회 | Ctrl+P | 프로젝트 용어집에서 조회 |
| 재정렬 | Ctrl+Shift+R | Alignment options 창 열림 |
| TM 내보내기 | Alignment 리본 > Export to TM | 확인된 링크만 내보내기 (파란 링크만, 녹색 제외) |

### 매치율 패널티

| 조건 | 패널티 |
|------|--------|
| 문서 미확인 (Alignment is finished 미체크) | -10% (최대 90%) |
| Auto link 미확인 | -5% (최대 95%) |
| 미확인 문서 + Auto link | -15% (최대 85%) |

### 확인 절차
- 단일 auto link 확인: 양쪽 세그먼트 선택 > Create Synchro Link
- 전체 auto link 확인: Alignment 리본 > Confirm All Auto Links
- 문서 확인: "Alignment is finished" 체크박스 선택 후 닫기

### 제약사항
- 빈 공간을 넘어서 병합(Join) 불가
- Ctrl+Q 추가 시 성공 여부 표시 안 됨 -> Ctrl+E (대화상자) 사용 권장
- Resource Console에서 시작하면 Use terms as anchors 사용 불가

---

## 7. Alignment Options

### 핵심 동작
**접근**: Alignment 리본 > Run Aligner 또는 Ctrl+Shift+R

### 자동 정렬 알고리즘
- 기본: 세그먼트 길이 비교 기반 매칭
- 1:2 또는 2:1 세그먼트 매칭 자동 수행
- 세그먼트 순서를 따름

### Anchor 옵션

| 옵션 | 설명 |
|------|------|
| **Use terms as anchors** | 프로젝트 용어집의 소스 용어와 타겟 번역이 같은 세그먼트에 있으면 앵커로 사용 |
| **Look up terms now** | 정렬 전 모든 가능한 용어를 미리 조회 (용어가 많을 때 빠름) |
| **Term base with the highest rank only** | 최고 순위 용어집만 사용 (대규모 참조 용어집이 있을 때 속도 향상) |
| **Minimum term length** | 짧은 용어는 false anchor가 될 수 있음, 최소 문자 수 설정 |
| **Compare bold/italic/underline** | 동일 서식의 텍스트를 찾아 매칭 (Word, PPT, HTML에 적합) |
| **Compare inline tags** | 동일 인라인 태그를 찾아 매칭 (Word 2007+, HTML, XML, InDesign 등) |

### 범위 선택

| 옵션 | 동작 |
|------|------|
| **Entire document** | 전체 문서 재정렬 |
| **From current segment** | 현재 세그먼트부터만 재정렬 |

**중요**: 수동 링크, 교차 링크, 삽입 표시된 세그먼트는 재정렬 대상에서 제외

---

## 8. Options - Appearance

### 핵심 동작
**접근**: Options 아이콘 (톱니바퀴) > Appearance

### 설정 탭

#### General
- **UI 언어 변경**: User interface language 드롭다운 (변경 후 재시작 필요)
- **리본 커스터마이즈**: Customize the ribbon 버튼 -> Quick Access toolbar 및 Quick Access/Workflow 리본 아이콘 추가/제거

#### Color Scheme
- **Default** / **Inverted** 2가지
- Inverted: 약 90% 대비 (진정한 블랙이 아닌 톤다운), 눈 피로 감소
- 전체 화면 모드 + 단일 모니터 권장
- memoQ 메인 창이 있는 화면에만 적용, 다른 화면 영향 없음
- Translation results의 히트 타입 색상(TM, LiveDocs, TB, Non-translatables) 기본 유지, 수정 가능

#### Translation grid 탭

**Editor Fonts**:
| 설정 | 대상 |
|------|------|
| Font family and size | 알파벳 언어 |
| Chinese font family | 중국어 |
| Japanese font family | 일본어 |
| Korean font family | 한국어 |
| CCJK font size | 중국어(번체/간체), 일본어, 한국어 |
| Other scripts | 기타 언어 폰트 선택 |
| Grid icon size / Score font size | 그리드 아이콘/점수 상대 크기 |
| Show non-printing characters | 공백/탭/줄바꿈 표시 |

**Colors**:
| 설정 | 대상 |
|------|------|
| Text color | 일반 텍스트 |
| memoQ {tag} color | 레거시 서식 태그 |
| Inline tag color | 인라인 태그 배경 |
| Inline tag text color | 인라인 태그 텍스트 |
| Special tag color | 특수 태그 |
| Alternating row colors | 교대 행 배경 |
| Highlight active cell | 활성 셀 강조 |

**Segment Status Colors**:
| 상태 | 색상 설정 |
|------|----------|
| Not started | 미시작 |
| Edited | 편집됨 (미확인) |
| Pre-translated | 사전번역됨 |
| Fragments | Fragment-assembled / MT 매치 |
| Confirmed | 확인됨 |
| Rejected | 리뷰어 거부 |

#### Lookup results 탭
- Font size / CCJK 크기 설정
- 매치 타입별 색상 (강조/일반 2가지)
- 매치 타입 활성화/비활성화 (Enabled 체크박스)
- 매치 순서 변경 (Move up / Move down)

#### Compare boxes 탭
- Font size / CCJK 크기
- Traditional view / Track changes view 별 텍스트 색상, 배경 색상, 스타일
- 두 뷰 전환: Miscellaneous > Lookup results 탭에서

#### Tracked changes 탭
- 리뷰어별 삽입/삭제 색상
- Mark insertions with underline 체크박스 (기본 선택)
- Mark deletions with strikethrough 체크박스 (기본 선택)
- 7명 초과 작성자: 색상 재순환 (8번째 = 1번째 색상)

---

## 9. Options - Keyboard Shortcuts

### 핵심 동작
**접근**: Options > Keyboard shortcuts

- Keyboard shortcut set = 단축키 모음
- 한 번에 하나의 set만 활성화 가능
- 기본 set 편집 불가 -> Clone 후 편집

### 워크플로
1. 기본 set 선택 > Clone
2. 복제본 선택 > Edit > Customize memoQ shortcuts 창
3. 단축키 설정 후 OK
4. 새 set 체크박스 선택 -> 즉시 적용

### 관리
- Create, Delete, Edit, Import, Export (Resource Console과 동일)
- 검색: Name/Description 박스에 이름 일부 입력

---

## 10. Options - Miscellaneous

### 핵심 동작
**접근**: Options > Miscellaneous

### Translation 탭

| 설정 | 기본값 | 설명 |
|------|--------|------|
| Warn when confirming identical source/target | OFF | 소스=타겟인 세그먼트 확인 시 경고 |
| No warning if only formatting/tags differ | ON (경고 활성 시) | 서식/태그만 다르면 경고 안 함 |
| Only warn if content word exists | ON | 숫자/구두점만 있으면 경고 안 함 |
| Enable preview for translations | ON | 임포트 시 Preview 생성 |
| Auto sync offline TMs/TBs | OFF | 온라인 프로젝트 동기화 시 오프라인 TM/TB도 동기화 |
| Progress based on | Words (기본) | Segments / Words / Characters 중 선택 |
| Allow replacement in source segments | OFF | Find and Replace가 소스에서도 작동 |
| Enable pop-up notifications | ON | 하단 팝업 알림 |

### Import/Export 탭

| 설정 | 기본값 | 설명 |
|------|--------|------|
| Import image files | OFF | 이미지 파일 번역용 임포트 |
| Import embedded images | OFF | 임베디드 이미지 임포트 |
| Export comments to DOCX | OFF (모두) | Information / Warning / Error / Other / All 레벨별 체크박스 |
| Auto open after export | ON | 내보내기 후 자동 열기 |
| Auto open bilingual/table after export | ON | 바이링구얼/테이블 내보내기 후 자동 열기 |
| Tracked changes export | Accept all (기본) | Accept all / Reject all / Export track changes |

**주의**: 5개 초과 문서 동시 내보내기 시 자동 열기 안 됨

### Lookup results 탭

| 설정 | 기본값 | 설명 |
|------|--------|------|
| Append space to inserted terms | OFF | 용어 삽입 시 끝에 공백 추가 |
| Inserting TM/corpus match overwrites target | ON | TM/코퍼스 매치 삽입 시 전체 교체 |
| Show highlights | ON | 소스의 용어/자동번역 요소 강조 |
| Patch fuzzy TM matches | - | 자동 매치 수정 (Include TM fragments, Store patched rate). 수정 매치 최대 94% |
| Filter and limit TM/corpus hits | ON | 동일 매치 제거, 개수 제한 |
| Max TM/corpus hits | 5 | 최대 표시 수 |
| Show corpus hits without translation | ON | 번역 없는 코퍼스 히트 표시 |
| Longest source term hides shorter | ON | 긴 용어가 짧은 매치를 숨김 |
| Display order of TB hits | Order of appearance (기본) | Alphabetical 선택 가능 |
| Order TB hits by rank and metadata | - | 용어집 순위 + 메타데이터(client, domain, subject) 기반 정렬 |
| Show TB hits with empty target | ON | 타겟 없는 용어집 항목 표시 |
| Check for duplicates when adding terms | - | 중복 확인 |
| Delay before showing results | 500ms (기본) | 0-1000ms 범위 |
| Compare boxes view | - | Track changes view / Traditional view |

### Languages 탭
- 최근 사용 5개 언어를 목록 상단에 표시 (개수 변경 가능)
- 고정 언어 세트 설정 가능 (Use these languages)
- 선호 언어 표시 끄기 가능
- 임포트 시 언어 불일치 경고 (끄기 가능)

### Weighted counts 탭
- 매치 카테고리별 가중치 설정 (0%-100%)
- 예: 85-94% 매치 -> 가중치 50% -> 10단어 세그먼트 = 5단어로 계산
- **새 프로젝트에만 적용** (기존 프로젝트 변경 불가)

### Default TM scheme 탭
- 새 TM의 커스텀 필드 정의
- 최대 20개 커스텀 필드
- 타입: Text, Number, Date, Picklist (single), Picklist (multiple)
- Export/Import scheme to/from XML 지원

### Editing time 탭
- Record editing time 체크박스 (기본 ON)
- 번역 에디터에서 시계 아이콘 옆에 현재 세그먼트 작업 시간 표시
- 편집 시간 리포트 생성 가능 (로컬 프로젝트 / 온라인 체크아웃만)

### Proxy settings 탭
- No proxy / Use system settings / Custom proxy settings
- 인증: Integrated / Basic authentication
- 라이선스 활성화용

### Discussion 탭
- memoQ TMS 토론 알림 이메일 활성화/비활성화
- 서버별로 개별 설정 가능
- 토론 알림만 끄기 (프로젝트 관련 이메일은 유지)

---

## 11. Options - Advanced Lookup Settings

### 핵심 동작
**접근**: Options > Advanced lookup settings

### Subsegment Leverage (LSC) 탭
- 전체 세그먼트 매치가 없을 때 부분 매치를 TM/LiveDocs에서 검색
- **Automatic concordance**: TM에서 소스 세그먼트 일부가 전체 유닛으로 존재할 때 제안 (주황색)
- **Fragment-assembled match**: 여러 부분을 조합하여 제안 (보라색)

| 설정 | 기본값 | 설명 |
|------|--------|------|
| Perform LSC lookup | ON | 느린 네트워크에서만 끄기 권장 |
| Min concordance hits | 2 | 최소 출현 횟수 |
| Show short fragments | ON | 전체 TM 유닛 매치면 최소 길이 이하도 표시 |
| Show rare fragments | ON | 전체 TM 유닛 매치면 최소 출현 횟수 이하도 표시 |
| Min length in words (알파벳/한국어) | 3 | |
| Min length in characters (알파벳/한국어) | 16 | 3단어 또는 16자 이상이어야 표시 |
| Min length in Asian chars (중국어/일본어) | 6 | |

### Fragment Assembly Settings 탭

**Matches to include** (빌딩 블록):
| 타입 | 설명 |
|------|------|
| Terms | 용어 번역으로 대체 |
| Non-translatables | 비번역 항목 그대로 유지 (표시만) |
| Numbers | 타겟 언어 숫자 형식으로 대체 |
| Auto-translation rules | 자동 번역 규칙 결과로 대체 |
| Fragments from TMs and corpora | TM/LiveDocs 전체 유닛 매치로 대체 |

**Suggest only 옵션**:
| 옵션 | 동작 |
|------|------|
| Full matches covered by one single hit | 단일 히트로 전체 커버 시만 제안 (사실상 비활성화) |
| Full matches covered by several hits | 전체 100% 커버 시만 제안 |
| Matches with a coverage of at least N% | 기본 50%, 높이면 더 유용한 결과, 낮추면 더 많은 결과 |

**추가 옵션**:
- Delete source text without any match: 미매치 텍스트 삭제 (비권장)
- Do not change the case of terms: 용어집 대소문자 유지
- 겹치는 매치: 세그먼트에서 먼저 시작하는 매치 우선
- 전체 단어 단위 교체, 어미 변경 안 함 (수동 수정 필요)
- Pre-translate에서도 작동 (Pre-translate 창에서 별도 설정 가능)

---

## 12. Options - Spelling and Grammar

### 핵심 동작
**접근**: Options > Spelling and grammar

### Spelling 탭
- 타겟 언어별 맞춤법 검사기 설정
- **2가지 검사 방법**:
  - Curly underlines (입력 중 실시간)
  - Spell checking window (일괄 검사)
- 각각 독립적으로 Microsoft Word / Hunspell 선택 가능

| 엔진 | 조건 |
|------|------|
| **Microsoft Word** (권장) | Word 설치 + 해당 언어 맞춤법 사전 있을 때 |
| **Hunspell** | Word 미설치 또는 해당 언어 사전 없을 때 |

**Hunspell 설정**:
- Look for more dictionaries online -> Download Hunspell dictionaries 창
- Install new Hunspell dictionary from file -> ZIP 패키지에서 설치

**옵션**: Check spelling as you type 체크박스 (기본 ON)

### Grammar 탭
- Microsoft Word 설치 + 해당 언어 문법 검사기 필요
- Check grammar as you type 체크박스 (파란 곡선 밑줄, 성능 영향)
- Check grammar with spelling 체크박스 (Spell checking window에서 함께 검사)

---

## 13. Options - Default Resources

### 핵심 동작
**접근**: Options > Default resources

- 새 프로젝트에 사용할 light resources 설정
- **템플릿이 우선**: 템플릿으로 프로젝트 생성 시 템플릿 설정이 Default resources보다 우선

### 리소스 타입

| 리소스 | 설명 |
|--------|------|
| Segmentation rules | 소스 언어별 세그먼테이션 규칙 |
| QA settings | 품질 보증 설정 |
| Export path rules | 내보내기 경로 규칙 |
| TM settings | 번역 메모리 설정 |
| LiveDocs settings | LiveDocs 설정 |
| Auto-translation rules | 자동 번역 규칙 (일부 언어) |
| Ignore lists | 무시 목록 (사전 설치 없음, 생성 가능) |
| AutoCorrect lists | 자동 수정 목록 (사전 설치 없음, 생성 가능) |
| Web search | 웹 검색 설정 |
| LQA models | Linguistic Quality Assurance 모델 (영어 외 UI 언어는 TMS에서 publish 필요) |
| Font substitution settings | 내보내기 시 폰트 대체 설정 |
| MT settings | 기계 번역 설정 프로필 |

### 관리
- Resource Console과 동일: Create, Delete, Edit, Import (*.mqres), Export, Clone
- 체크박스로 기본 리소스 선택
- 언어 의존 리소스: 언어도 함께 선택 필요 (예: Segmentation rules는 소스 언어에 따라 적용)
- 같은 카테고리/언어에 여러 리소스: 하나만 기본으로 선택 가능

---

## 14. Muses

### 핵심 동작
**접근**: Heavy resource, 로컬 프로젝트에서만 사용 가능

**정의**: Muse는 번역 에디터에서 사용자가 입력할 때 서브세그먼트 수준의 제안을 제공하는 heavy resource

**동작 원리**:
1. 소스/타겟 콘텐츠에서 단일 및 다중 단어 표현을 수집
2. 소스-타겟 간 상관관계(correlation) 식별
3. Predictive typing에서 타겟 표현을 제안

**예시**:
- 수천 세그먼트 코퍼스로 Muse 학습
- 코퍼스에 source="term base", target="Termdatenbank" 존재 (명시적 대응 관계 없음)
- Muse가 상관관계 감지
- 번역 시 소스에 "term base" 등장하면 "Termdatenbank"를 predictive typing으로 제안

### 제약사항
- **로컬 프로젝트 전용** (또는 온라인 프로젝트의 로컬 카피 + 오프라인 TM)
- TM이 성장하면 Muse 재훈련 가능

---

## 15. MT Settings (Machine Translation)

### 핵심 동작
**접근**: Resource Console > MT settings > Edit
또는 Project home > Settings > MT settings
또는 Options > Default resources > MT settings

memoQ 자체는 MT를 수행하지 않음 -> 외부 MT 서비스에 연결

### Built-in MT 서비스 (memoQ 12.2)

| 서비스 |
|--------|
| globalese by memoQ |
| memoQ AGT |
| memoQ pseudo-translation (내장, 무료) |
| Alexa Translations A.I. |
| Altlang MT (Prompsit) |
| Amazon MT |
| Crosslang Gateway MT |
| Custom.MT |
| DeepL |
| eTranslation |
| Google Cloud Translation Basic |
| Google Cloud Translation Advanced |
| Intento (MT 서비스 집약 플러그인) |
| KantanMT |
| Microsoft Azure AI Translator |
| Mirai Translator |
| ModernMT |
| NiuTrans Public MT |
| Pangea MT (Pangeanic) |
| SYSTRAN MT |
| TexTra memoQ |
| Tilde MT |

### Intento 경유 서비스 (50+ 종)
AISA, Alibaba Cloud, Amazon, **Anthropic (Claude 2, 3, 3.5)**, Baidu, CloudTranslation, DeepL (v1/v2), Elia Elhuyar, Globalese, Google Cloud (Adaptive/Advanced/Basic/Vertex/Gemini/PaLM 2), GTCOM, IBM Watson v3, Kakao, Kawamura NMT, Kingsoft AIDAtrans, **Microsoft Azure OpenAI (ChatGPT 3.5-turbo, custom model)**, Microsoft Translator (v2 statistical, v3 neural), Mirai, ModernMT HITL, Naver Cloud/Papago, NiuTrans, **OpenAI (GPT-3.5-Turbo, GPT-4, GPT-4 Turbo, GPT-4o, GPT-4o-mini, custom model)**, Oracle Cloud, Prompsit, PROMT Cloud, RoyalFlush, Rozetta T-400, RWS Language Weaver, SAP (Document/Hub), SDL (Enterprise/Language Cloud), smartMATE, SYSTRAN Translate Pro, Tencent TMT, Tilde MT, Ubiqus NMT, XL8 MT, Yandex Cloud, Youdao Cloud

### Pseudo-translation (내장)
- 목적: 로컬라이제이션 테스트
- 번역 대상인 텍스트가 모두 임포트되었는지 확인
- 번역 후 공간이 충분한지 시뮬레이션 (소스보다 약간 긴 텍스트 생성 가능)
- 알아볼 수 없는(garbled) 텍스트 생성 -> 미임포트 텍스트 식별 용이

### MT Settings 구성

#### Services 탭
- MT 서비스 목록에서 선택 > 클릭으로 활성화 (주황 화살표)
- 각 서비스별 Plugin settings 창에서 API key/인증 정보 입력
- 2개 이상 서비스 동시 설정 가능
- **조건**: 설정 + 활성화 + 현재 프로젝트 언어 쌍 지원 시에만 작동

#### Settings 탭

| 설정 | 옵션 |
|------|------|
| **Pre-translation** 드롭다운 | 사전 번역에 사용할 서비스 선택 |
| **Translation results** | Off / Only if no good TM match / Only if no exact TM match / Always |
| **MatchPatch** 드롭다운 | MatchPatch 기능에 사용할 서비스 선택 |
| **Self-learning MT** 드롭다운 | 적응형 MT 서비스 선택 |

**Translation results 세부**:
- Off: MT 제안 없음
- Only if no good TM match: Best TM 매치가 "Good match threshold" 미만일 때만
- Only if no exact TM match: Best TM 매치가 100% 미만일 때만
- Always: 모든 세그먼트에 MT 제안

**Self-learning MT 피드백 범위**:
- Any user (Translator + Reviewer 1 + Reviewer 2)
- Any reviewer (Reviewer 1 + Reviewer 2)
- Reviewer 2 only
- Only selected groups (그룹 체크박스)
- **주의**: 번역이 인터넷으로 전송됨 -> NDA/기밀 계약 확인 필수

#### AIQE 탭 (AI-based MT Quality Estimation)
- Provider 선택 (라디오 버튼)
- Service base URL 설정
- API key 입력 > Validate 버튼
- 검증 성공 시: Translation results에서 MT 제안에 TM 매치율 대신 AIQE 값 표시
- **TAUS provider**: 커스텀 모델 선택 (taus_linguistic_qe, taus_qe, taus_qe_v2)
- **Compare pre-translations based on COMET_QE**: 여러 MT 서비스 중 최고 COMET 점수 MT 선택 (AIQE 값은 TAUS 모델에서)

### MT Profile 생성
**접근**: Resource Console > MT settings > Create new (또는 Options > MT > Create new)

- 이름 (고유) + 설명 필수
- 로컬 또는 서버에 생성 가능 (Options에서는 로컬만)
- 생성 시 모든 서비스 OFF -> 편집에서 활성화 필요

---

## Options 창 전체 카테고리 목록

| 카테고리 | 요약 |
|----------|------|
| **Default resources** | 새 프로젝트용 기본 리소스 (세그먼테이션, QA, 무시 목록 등) |
| **Appearance** | 폰트, 색상, UI 언어, 리본 커스터마이즈 |
| **Spelling and grammar** | 맞춤법/문법 검사 설정 (Word/Hunspell) |
| **Advanced lookup settings** | 자동 Concordance, Fragment assembly |
| **Keyboard shortcuts** | 단축키 세트 관리 |
| **Locations** | memoQ 폴더 위치 (프로젝트, TM, TB 등). 네트워크 드라이브 금지, 동기화 폴더 비권장 |
| **Updates** | 업데이트 확인 방법 |
| **Terminology plugins** | 외부 용어 리소스 연결 |
| **TM plugins** | 외부 TM 서비스 연결 |
| **External preview tools** | memoQ 외부 프리뷰 도구 |
| **Miscellaneous** | Translation, Import/Export, Lookup results, Languages, Weighted counts, Default TM scheme, Editing time, Proxy, Discussions |
| **Privacy** | 익명 사용 데이터 공유 설정 |

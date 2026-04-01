# memoQ Project Management, Dashboard, Preparation & Analysis Research

> 추출일: 2026-04-01
> 소스: docs.memoq.com/current/en (memoQ 12.2)

---

## A. Project Management

---

### 1. New memoQ Project Wizard

**접근**: Project 리본 > New Project 라벨 클릭 (아이콘 클릭 시 템플릿에서 생성). 또는 메뉴 > New Project

**핵심 동작**:
- 동작: [New Project 클릭] → [마법사 5단계 진행 후 빈 프로젝트 또는 리소스 포함 프로젝트 생성]
- 동작: [어느 단계에서든 Finish 클릭] → [남은 단계 건너뛰고 즉시 프로젝트 생성]
- 동작: [Cancel 클릭] → [Dashboard로 복귀, 프로젝트 미생성]

**마법사 단계**:

**Step 1: 이름, 언어, 기본 상세**
- **Name** (필수): 프로젝트명. 컴퓨터에서 유일해야 함. 나중에 Dashboard에서 이름 변경 가능
- **Source language** (필수): 원본 언어
- **Target language** (필수): 대상 언어
- **Project**: 상위 프로젝트명 (클라이언트가 사용하는 이름). 하나의 Project 안에 여러 memoQ 프로젝트(job) 가능
- **Client**: 고객명
- **Domain**: 문서 장르/주제
- **Subject**: 주제 분야
- **Description**: 프로젝트 설명
- **Project directory**: 프로젝트 저장 폴더 (Browse 버튼으로 변경)
- **Created by**: 생성자 (Windows에서 자동 취득)
- **Created at**: 생성일 (Windows에서 자동 취득)
- **Deadline**: 마감일
- **Record version history for translation documents** 체크박스: 세그먼트 변경 이력 추적, 태그 기능으로 특정 시점 상태 보존
- **Connect to a content source** 체크박스: 파일 폴더 감시 (content connector 필요, 온라인 프로젝트 권장)

**Step 2: 소스 문서 임포트**
- 드래그 앤 드롭 또는 Import / Import with options 사용
- **Import**: Open 대화상자로 문서 선택
- **Import with options**: Open 후 Document import options 대화상자에서 커스터마이즈
- **Remove**: 실수로 추가한 문서 제거
- **Reimport document**: 문서 변경 시 또는 다른 설정으로 재임포트
- Finish 클릭 시 → TM/TB 없이 프로젝트 생성

**Step 3: 번역 메모리(TM) 선택**
- 체크박스로 TM 사용 여부 선택
- **Create/use new**: 새 TM 생성
- **Import from TMX/CSV**: TMX 또는 테이블 파일 임포트
- **Synchronize offline**: 온라인 TM의 로컬 카피를 서버와 동기화
- **Properties**: TM 상세 정보 및 커스텀 필드 편집
- **Register local**: 컴퓨터에 있지만 목록에 안 보이는 TM의 .mtm 파일 등록
- Working TM과 Master TM은 Project home에서 설정 필요
- Finish 클릭 시 → TB 없이 프로젝트 생성

**Step 5: 용어집(TB) 선택**
- 체크박스로 TB 사용 여부 선택
- **Create/use new**: 새 TB 생성
- **Import**: Excel 등 파일 임포트
- **Synchronize offline**: 온라인 TB 동기화
- **Properties**: TB 상세 정보 편집
- **Register local**: .mtb 파일로 수동 등록
- **Set as target for new terms**: 새 용어 기본 저장소 지정
- **Raise rank / Lower rank**: TB 간 우선순위 설정 (매칭 결과 표시 순서에 영향)
- Finish 클릭 → 프로젝트 생성 및 Project home에서 열기

**UI 요소**: 5단계 마법사, Next/Back/Finish/Cancel 버튼

**엣지 케이스/제한**:
- 템플릿 사용을 권장 (이 마법사는 "old way")
- Step 4는 문서에 명시되지 않음 (Step 3과 5 사이)
- 프로젝트명은 컴퓨터에서 고유해야 함

---

### 2. Clone Local Project

**접근**: Dashboard > My Computer 선택 > 프로젝트 선택 > Project 리본 > Clone 버튼

**핵심 동작**:
- 동작: [Clone 클릭] → [Clone local project 대화상자 열림]
- 동작: [OK 클릭] → [동일 설정의 빈 프로젝트 생성 (문서 제외)]
- 동작: [Cancel 클릭] → [복제 없이 닫기]

**UI 요소**: Clone local project 대화상자
- **Name** 텍스트박스: 기본값 = 원본명 + "- clone"
- 체크박스 3개:
  - **Use the same translation memories and term bases**
  - **Use the same corpora**
  - **Use the same light resources**
- OK / Cancel / Help 버튼

**설정 옵션**:
- 각 체크박스를 해제하여 특정 리소스 제외 가능 (예: TM은 유지하되 segmentation rules 제외)

**엣지 케이스/제한**:
- **PM edition 전용**: translator pro에서는 사용 불가
- 패키지에서 생성된 프로젝트나 온라인 프로젝트의 로컬 카피는 복제 불가
- Content-connected 프로젝트 복제 시 연결이 끊어짐
- 새 프로젝트는 빈 로컬 프로젝트로 생성됨 (문서 없음)
- 템플릿 사용을 권장 (더 상세하고 유연한 구성 가능)

---

### 3. Archive Projects Wizard

**접근**: Dashboard > memoQ TMS 연결 > 프로젝트 선택 > Project 리본 > Archive > Archive Selected Projects

**핵심 동작**:
- 동작: [Archive Selected Projects 클릭] → [아카이브 마법사 시작]
- 동작: [OK 클릭] → [백그라운드에서 아카이브 생성, Task tracker 자동 열림]
- 동작: [아카이브 완료] → [프로젝트 목록에서 제거, .mqarch 파일 생성]

**마법사 단계**:

**Page 1: 저장 위치 및 파일명**
- **저장 위치 선택**:
  - 기본: memoQ TMS에 저장 (관리자가 Deployment tool로 폴더 설정)
  - **Archive projects on server and download archives here**: 로컬 컴퓨터에도 저장 (Browse로 폴더 선택)
    - 주의: 로컬 저장 시 Archived projects 목록에서 보이지 않음
- **Archive file name**: 파일명 구성
  - 기본: 프로젝트명 + 현재 날짜/시간
  - **Insert placeholder** 버튼으로 플레이스홀더 삽입:
    - `ProjectName`, `Project`, `Client`, `Domain`, `Subject`
    - `SrcLangIso2`, `SrcLangIso3`, `TrgLangListIso2`, `TrgLangListIso3`
    - `YYYY`, `YY`, `MM`, `DD`, `HH`, `NN`

**Page 2: 내보내기 파일 선택**
- 아카이브에 포함할 파일 선택

**아카이브 포함 내용**: 문서, 사용자/할당 정보, 설정, 리소스 연결 정보

**아카이브 미포함 내용**:
- 리소스 (TM, TB 등) - 별도 백업 필요
- 알림(alerts)
- FirstAccept 정보 (수신자, 작업 거부자)
- 프로젝트 패키지 (handoff, update, delivery)
- 이메일 이력
- 체크아웃 동기화 데이터
- 프로젝트/사용자별 정보 (자동 할당 등)
- 프로젝트 진행 상황 (복원 시 재계산)

**복원 방법**:
- 서버에 저장된 아카이브: Dashboard > Project 리본 > Archive > View Project Archive > 우클릭 > Restore From Archive
- 로컬 저장 아카이브: File Explorer에서 .mqarch 파일 더블클릭 → 복원 서버 선택

**엣지 케이스/제한**:
- Content-connected 프로젝트는 완료 전 아카이브하지 말 것
- 백업(로컬 프로젝트)과 아카이브(온라인 프로젝트)를 혼동하지 말 것
- 자동 아카이브: Server Administrator > Archiving에서 설정 가능 (wrap up 또는 작업 완료 후)

---

### 4. memoQ Backup Wizard

**접근**:
- 외부: 데스크탑 아이콘 또는 Start 메뉴 > "memoQ backup" 검색
- Dashboard: Project 리본 > Back Up 버튼 > 전체 또는 선택 프로젝트

**핵심 동작**:
- 동작: [Back up 클릭] → [.mqbk 파일 생성 (프로젝트 + 리소스 + 설정)]
- 동작: [Restore 클릭] → [.mqbk/.mqbkf 파일에서 복원]
- 동작: [Create a schedule 클릭] → [정기 백업 스케줄 생성]

**기능 탭**:

**Backup 탭: 1회 백업**
- 리소스 타입별 체크박스:
  - 전체 선택 / 일부 선택 (프로젝트에 종속된 리소스) / 미선택
- **Customize**: 리소스 타입별 상세 선택 대화상자
  - 회색 = 프로젝트에 사용 중 (직접 제거 불가)
  - 검정 = 프로젝트에 미사용 (체크박스로 제외 가능)
- **Change** 링크 (Local projects 아래): Reference TM/TB 백업 옵션
  - **Back up reference resources** 대화상자
- 저장 위치: **Browse** 버튼으로 폴더 선택
- **Create a schedule** 버튼: 정기 백업 설정
- **Back up** 버튼: 즉시 백업 시작
- **Cancel** 버튼: 백업 파일/로그 미생성

**Restore 탭: 복원**
- Project 리본 > Restore 또는 마법사에서 Restore 클릭 또는 .mqbk/.mqbkf 파일 더블클릭
- **Browse**로 백업 파일 선택 (.mqbk = 새 형식, .mqbkf = memoQ 9.12 이전 형식)
- **Details** 링크: 리소스 타입별 상세 확인
- 중복 리소스 시 **Do you want to overwrite existing resources?** 대화상자
  - **Content in the backup file** 또는 **Content in memoQ** 선택

**Scheduled backup 탭: 정기 백업**
- **Create a new schedule** 또는 Backup 탭의 **Create a schedule** 버튼
- 설정:
  - 스케줄명
  - 백업 대상 폴더
  - 이전 백업 보관 개수
  - 빈도 및 시간 설정
- 주의: PC 켜져 있고 로그인 상태여야 하며 memoQ 미실행 시에만 동작. 3분 전 경고
- Windows Task Scheduler 사용
- 스케줄별 관리: Edit schedule, Start backup now, Open log, Delete schedule

**Logs 탭**: 이전 백업/복원 이력 (성공/경고/오류 상태)

**Settings 탭**:
- **Run memoQ backup wizard when Windows starts** 체크박스 (기본 해제)
- **Delete logs older than 30 days** 체크박스 (기본 해제)

**엣지 케이스/제한**:
- 로컬 프로젝트 전용 (온라인 프로젝트는 Archive 사용)
- 별도 Windows 앱으로 설치됨

---

### 5. Handoff Wizard

**접근**: Project home > Translations > Assignments 클릭 > 번역자/리뷰어 할당 > Overview > General > Handoff checks > Check project now > Create new handoff

**핵심 동작**:
- 동작: [Create new handoff 클릭] → [핸드오프 마법사 시작]
- 동작: [마법사 완료] → [사용자별 .mqout 패키지 파일 생성]
- 동작: [수신자가 .mqback 파일 반환] → [Receive delivery로 프로젝트 업데이트]

**사전 작업**:
1. Translations에서 각 문서에 Translator / Reviewer 1 / Reviewer 2 이름 입력 (셀 클릭 후 타이핑, Tab으로 확인)
2. 여러 문서 일괄 할당: 문서 선택 > Documents 리본 > Assign > Assign selected documents to users
3. Overview > General > Handoff checks > Check project now으로 할당 확인

**마법사 단계**:

**Step 1: 수신자 및 마감일**
- **Role** 드롭다운: Translator / Reviewer 1 / Reviewer 2
- **Deadline**: 날짜 + 시간
- **Languages to include in handoff**: 대상 언어별 체크박스
- **Users to include in handoff**: 사용자별 체크박스 (사용자 x 언어 = 패키지 수)

**Step 2: 패키지 이름 및 내용**
- **Base package name**: 기본 = 역할코드(T/R1/R2) + 프로젝트명 + 언어코드. 실제 패키지에 사용자명 + 날짜 추가
- **Allow joining and splitting segments** 체크박스 (기본 선택)
- **Include local TMs and TBs**: 로컬 TM의 TMX, TB의 CSV 포함. 온라인 TM/TB는 참조만 포함
- **Include local corpora**: LiveDocs 코퍼스 (바이너리 + XLIFF)
- **Include preview files**: 실시간 미리보기 파일
- **Include skeletons for final export**: 포맷된 번역 내보내기 허용 여부

**Step 3: 검토**
- 생성될 파일 및 패키지 목록 확인
- Back으로 수정, Next로 생성 시작 (수분 소요 가능)

**배포 후 워크플로우**:
1. Overview > Handoff/delivery 탭 > Open folder로 .mqout 파일 접근 → 이메일 전송
2. 수신자가 .mqback 파일 반환
3. Overview > Handoff/delivery > Receive delivery > Open 대화상자에서 .mqback 선택
4. 부분 배달(partial delivery) 가능: Progress 칼럼에서 확인

**변경 처리**:
- 새 문서 추가 또는 할당 변경: 다시 Create new handoff → memoQ가 update 패키지 생성
- 핸드오프 초기화: Handoff/delivery > Clear handoff history (이전 패키지의 delivery 수신 불가)
- 핸드오프 취소: Handoff/delivery > Cancel handoff (이력 보존)
- 프로젝트 업데이트 실패 시: 패키지 압축 해제 후 XLIFF (.xlf/.mqxlz) 파일 수동 임포트

**엣지 케이스/제한**:
- PM edition 필요
- 한 사람이 동일 문서에서 두 역할 불가 (번역자이면서 리뷰어 불가)
- 대상 언어가 여러 개면 핸드오프 체크가 언어별로 분리

---

### 6. Project Home - Overview (PM)

**접근**: Dashboard > 프로젝트 생성/열기 > Project home > Overview

**핵심 동작**:
- 동작: [Overview 클릭] → [General/Reports/Handoff-delivery 탭 표시]

**UI 요소 - General 탭**:
- 프로젝트 기본 정보: 현재 사용자, 마감일, 프로젝트명, 주제, 고객, 도메인
- **Add new target language**: 대상 언어 추가 (Add new target language 대화상자)
  - TB에 새 언어가 없으면 경고 + **Add missing language to the term base(s)** 체크박스
- **remove**: 대상 언어 제거 (오프라인 프로젝트만)
- **Handoff checks** 섹션: Check project now → 할당 보고서 → Create new handoff

**UI 요소 - Handoff/delivery 탭**:
- **Open folder**: 핸드오프 패키지 폴더 열기
- **Receive delivery**: 배달 패키지 수신
- **Publish current project on a server**: Publish project wizard 시작
- **Clear handoff history** / **Cancel handoff**
- **Delivery status** / **Handoff configuration** 상세 확인

**UI 요소 - Reports 탭**:
- **Progress**: 진행 보고서 (세그먼트 상태별 분석)
  - Create new report now > Create progress report 대화상자
  - Show / Hide / Export (CSV) / Delete
- **Analysis**: 분석 보고서 (단어/매치 카운트)
  - Create new report now > Create analysis report 대화상자
  - Show / Hide / Export (CSV) / Delete
- **Change-tracked document**: 변경 추적 보고서 (리뷰어 수정 비교)
  - Reviewer 1 vs translator / Reviewer 2 vs translator / Reviewer 2 vs Reviewer 1
  - Export (HTML)
- **Edit distance statistics**: 편집 거리 보고서
- **Editing time**: 편집 시간 보고서

**엣지 케이스/제한**:
- 템플릿에서 생성된 프로젝트: 자동화 동작 끄기 가능, 템플릿 설정 확인 가능
- Project home은 로컬 프로젝트와 체크아웃 카피 전용

---

### 7. Project Home - Overview (Translator Pro)

**접근**: Dashboard > 프로젝트 생성/열기 > Project home > Overview

**핵심 동작**:
- 동작: [Overview 클릭] → [General/Reports 탭 표시]

**UI 요소 - General 탭**:
- 프로젝트 기본 정보: 현재 사용자, 마감일, 프로젝트명, 주제, 고객, 도메인
- PM 버전과 달리 핸드오프/배포 기능 없음

**UI 요소 - Reports 탭**:
- PM 버전과 동일한 보고서 기능 (Progress, Analysis, Edit distance, Editing time)

**엣지 케이스/제한**:
- 언어 추가/제거, 핸드오프, 서버 퍼블리시 기능 없음

---

## B. Dashboard

---

### 8. Dashboard (PM)

**접근**: Windows에서 memoQ 시작 (PM 라이선스 시 자동 표시)

**핵심 동작**:
- 동작: [memoQ 시작] → [Dashboard 표시, 프로젝트 목록]
- 동작: [프로젝트 더블클릭] → [Project home 열기]
- 동작: [위치 변경] → [My Computer / memoQ TMS 프로젝트 목록 전환]

**주요 기능 영역**:

**프로젝트 생성**:
- 로컬: My Computer 선택 > Project 리본 > New Project (템플릿) 또는 화살표 > New Project (마법사)
- 온라인: TMS 주소 입력 > 연결 > Project 리본 > New Online Project From Template / New Online Project
- 로컬→온라인: 로컬 프로젝트 선택 > Project 리본 > Publish On Server

**프로젝트 상태 아이콘**:
- 번역 미시작 / 프로젝트 빈 상태 / 번역/리뷰 진행 중
- 번역 완료 (번역자 확인) / Reviewer 1 확인 / Reviewer 2 완료
- 모든 작업 완료 (wrapped up)
- 진행바: 마우스 오버 시 숫자로 진행률 표시

**보기 옵션**:
- 기본 1행 뷰 / **Two-row view** 아이콘 (상세 정보)
- **Details** 아이콘: 상세 패널
- **Alerts** 아이콘: 긴급 작업 알림 패널

**온라인 프로젝트 작업**:
- Check Out From Server: 온라인 프로젝트의 로컬 카피 생성
- 자동 동기화 (문서 열기, Synchronize Project, 자동 동기화 토글)

**엣지 케이스/제한**:
- 온라인 프로젝트 생성: Project managers 또는 Administrators 그룹 멤버 필요
- TMS 주소 형식: memoq.company.com 또는 https://lonestar.memoq.com/workyourteams

---

### 9. Dashboard (Translator)

**접근**: Windows에서 memoQ 시작 (Translator 라이선스 시 자동 표시)

**핵심 동작**:
- PM Dashboard와 유사하나 온라인 프로젝트 관리 기능 제외
- 프로젝트 = 3가지 구성요소 (소스 문서, 언어 리소스, 설정) - PM은 4가지 (+ 작업자 목록)

**프로젝트 시작 방법**:
1. **문서 드래그 앤 드롭**: Drop files here 영역에 파일 드래그 → Start translating → Create new project from template
2. **Project 리본 > New Project**: 템플릿에서 생성
3. **템플릿 없이**: Project 리본 화살표 > New Project (마법사)
4. **오른쪽 패널**: Create a new project from a template / without a template

**온라인 작업 체크아웃**:
- 오른쪽 패널 > **Check out a project from a memoQ TMS** 또는 Project 리본 > Check Out From Server
- **memoQ TMS address**: 서버 주소 입력/선택 → 로그인
- 프로젝트 목록 표시 (본인에게 할당된 문서가 있는 프로젝트만)
- **Filter project name or description**: 검색
- 정렬: deadline / name / creation date
- **Project name**: 로컬 카피 이름 (기존 프로젝트와 동일 이름 시 경고 + Open 링크)
- **Project path**: 로컬 저장 경로

**패키지 작업**:
- 오른쪽 패널 > **Translate a package** > .mqout 파일 선택 > Import handoff package 대화상자
  - **Project name** / **Project directory** 설정

**문서 편집**:
- 프로젝트 더블클릭 → Project home → Translations → 문서 더블클릭 또는 우클릭 > Open for Translation
- 작업 중단 시 자동 저장, 재개 시 마지막 세그먼트로 복귀

---

### 10. Dashboard - Project List (Translator)

**접근**: Dashboard 기본 화면

**UI 요소 - 칼럼**:
- **Type**: 프로젝트 유형 (로컬/온라인/체크아웃/패키지/LT)
- **Name**: 프로젝트명
- **Size**: 단어/세그먼트/문자 수 (우클릭 > Base progress on > Characters/Segments/Words)
- **Status**: Not started / Translation in progress / Completed 등
- **Progress**: 색상 진행바 (회색=미시작, 짙은 초록=번역중/완료, 연한 초록=리뷰 시작/완료)
- **Deadline**: 마감일
- **Languages**: 원본 → 대상 (알파벳순, 버블로 전체 표시)
- **Created**: 생성일
- **Last accessed**: 마지막 접근일 (로컬만)
- **Commands**: 마우스 오버 시 아이콘 - Open / Back up / Rename / Archive

**Two-row view 추가 필드**: Sub(주제), Dom(도메인), Cli(고객), Pro(상위 프로젝트)

**네비게이션**:
- 클릭: 선택 / Ctrl+클릭: 다중 선택 / 더블클릭: 열기
- 키보드: 화살표 이동, Enter 열기, 이름 타이핑으로 점프

**정렬**: Sort by 드롭다운 (name, alert, size, status, progress, deadline, languages, created, last accessed) + 오름/내림차순 화살표

**프로젝트 유형 아이콘**:
- 일반 프로젝트 / 템플릿에서 생성 / 핸드오프 패키지에서 임포트 / 온라인 패키지에서 임포트 / 온라인 프로젝트 체크아웃

**상태 아이콘**: 미시작 / 빈 프로젝트 / 진행 중 / 번역 완료 / R1 확인 / R2 완료

---

### 11. PM Dashboard - Project List

**접근**: Dashboard 기본 화면 (PM edition)

**추가 기능 (Translator와 비교)**:

**위치 선택 (Location box)**:
- **My Computer**: 로컬 + 체크아웃 프로젝트
- **memoQ TMS 주소**: 온라인 프로젝트 (주소 입력 → 로그인)
- **Forget login** 링크: 다른 계정으로 재로그인

**추가 칼럼**:
- **Alert**: 주의 필요 프로젝트 (마감 초과 등, 온라인만)
- **Export**: 내보내기 알림 (경고 또는 Export 아이콘)
- **Created by**: 생성자
- **Created on**: 생성일
- **Last modified**: 마지막 수정일

**추가 정렬 기준**: type, total price, project, domain, client, subject, created by, created on, location

**Commands 칼럼 - 로컬**: Open / Back up / Rename / Archive
**Commands 칼럼 - 온라인**: Manage / Check out / Wrap up / Archive

**추가 프로젝트 유형 (온라인)**:
- 온라인 프로젝트 (미시작/진행중) / 온라인 템플릿에서 생성 / Content-connected (템플릿/일반)

**Two-row view 추가 필드**: Subject, Domain, Client, Project

---

### 12. Dashboard - Details Pane (Translator)

**접근**: Dashboard > Details 버튼 클릭 (기본 숨김)

**UI 요소**:
- **Project Data**: Project, Domain, Client, Subject 4개 필드
- **Creation**: 생성자, 생성일 (온라인: 출시일, 마감일)
- **Type**: 프로젝트 유형 (온라인: 워크플로우 상태, 사용자 할당, 템플릿명)
- **Size**: 문서/세그먼트/단어/문자 수 (온라인만)
- **Languages**: 원본/대상 언어
- **Progress**: 진행률 (characters/segments/words 기준)

**하단 명령**:
- **Open**: Project home에서 열기
- **Back up**: memoQ backup wizard 실행

**엣지 케이스**: 여러 프로젝트 선택 시 통합 Progress 표시, Back up 사용 가능

---

### 13. PM Dashboard - Details Pane

**접근**: Dashboard > Details 버튼 클릭 (기본 숨김)

**UI 요소 - 3개 탭 (온라인) / 1개 (로컬)**:

**Project 탭** (로컬 프로젝트 기본):
- Translator Details Pane과 동일: Project Data, Creation, Type, Size, Languages, Progress

**Progress 탭** (온라인):
- 전체 프로젝트 진행률
- 대상 언어별 진행률 (ISO 3자리 코드, 알파벳순)
- 마감 초과 시 경고 아이콘 + Alerts 패널에 알림
- 로컬: 마감일 있을 때만 표시 (패키지/핸드오프 워크플로우 또는 수동 설정)

**Users 탭** (온라인):
- memoQ online project > People 패널의 축약 뷰
- 칼럼: 알림, 사용자명, PM 여부, Progress, Role (T/R1/R2), 언어쌍, 직접/패키지 접근 여부
- 대상 언어별 그룹 → 알파벳순
- FirstAccept/GroupSourcing 사용자: 단어수 대신 표기
- Subvendor 사용자는 그룹 매니저에게만 표시

**Packages 탭** (로컬, 핸드오프 패키지 생성 시만):
- 핸드오프 패키지 정보

**하단 명령 - 온라인**: **Open** (관리 창) / **Reassign** (사용자 변경 마법사)
**하단 명령 - 로컬**: **Open** / **Back up**

**엣지 케이스**: 여러 프로젝트 선택 시 통합 진행률 표시, 느린 프로젝트에 빨간 경고, Open/Back up/Reassign 비활성

---

## C. Preparation & Analysis

---

### 14. Pre-translate and Statistics

**접근**:
- 로컬: Project home 또는 번역 에디터 > Preparation 리본 > Pre-translate
- 온라인: memoQ online project > Translations > 문서 선택 > Statistics/Preparation 리본 > Pre-translate

**핵심 동작**:
- 동작: [Pre-translate 클릭] → [Pre-translate and statistics 대화상자]
- 동작: [설정 후 실행] → [TM/LiveDocs 매치 삽입 + 통계 보고서 생성]

**Scope and lookup 탭 - 범위 선택** (라디오 버튼):
- **Project**: 전체 프로젝트 (다중 대상 언어 시 전부)
- **Active document**: 현재 열린 문서
- **Selected documents**: 선택된 문서 (Project home > Translations에서)
- **From cursor**: 커서 이하 세그먼트
- **Open documents**: 열린 모든 문서
- **Selection**: 선택된 세그먼트
- **Work on views** 체크박스: 뷰의 세그먼트
- 단일 대상 언어만: Translations에서 언어 선택 후 전체 문서 선택

**매치 품질 기준** (라디오 버튼):
- **Exact TM or corpus match with context**: 101%(컨텍스트) 또는 102%(더블 컨텍스트) 매치만
- **Exact TM or corpus match**: 100% 이상 매치
- **Good TM or corpus match**: Good match threshold 이상 (TM 설정에서 정의)
- **Any TM or corpus match**: 최소 매치 임계값(기본 60%) 이상 모두. TM-driven segmentation 해제 필요
- **Use only if there's a single TM or corpus match**: 단일 100%/101%/102% 매치인 경우만

**Fragment Assembly**:
- **Perform fragment assembling** 체크박스
- **Fragment assembly settings** 버튼:
  - **Matches to include**: 용어, 비번역 항목, 숫자, 자동번역 규칙, TM/LiveDocs 프래그먼트 (각각 체크박스)
  - **Suggest only**:
    - Full matches covered by one single hit (사실상 끔)
    - Full matches covered by several hits (전체 소스 커버)
    - Matches with a coverage of at least _%_ (기본 50%)
  - **Delete source text without any match**: 매치 없는 소스 텍스트 삭제
  - **Do not change the case of terms**: 대소문자 변환 방지

**Machine Translation**:
- **Use machine translation if there's no TM match** 체크박스
- MT settings 리소스 필요 (Resource Console > MT settings)

**AI-based Quality Estimation (AIQE)**:
- **Use machine translation with AIQE values** 체크박스
- 여러 MT 서비스 중 세그먼트별 최적 선택
- AIQE 서비스 + MT settings 리소스 필요

**TM-driven Segmentation**:
- **Automatically join and split segments for best match** 체크박스
- 매치 없을 때 다음 세그먼트와 결합 시도 → 실패 시 분할 → 반복
- **Settings** 버튼: TM-driven segmentation settings 대화상자

**리소스 선택**:
- **Select TMs and LiveDocs corpora** 링크 → 체크박스로 개별 선택/해제 (Select all / Deselect all)
- **Select MT and AIQE services** 링크 → 언어별 MT 서비스 드롭다운, AIQE 체크박스

**Confirm and Lock 옵션**:
- Pre-translate 후 자동 confirm/lock
- 버전 저장 후 실행 가능

**템플릿에서 설정 시**:
- 구체적 TM/TB 대신 Working TM / Master TM / Reference TMs / LiveDocs corpora / MT 체크박스

**엣지 케이스/제한**:
- memoQ TMS가 자동 작업 실행 중이면 사전 번역 불가 (잠시 대기 메시지)
- 결과 불만족 시: Clear translations > 설정 변경 > 재실행
- Any TM or corpus match 사용 시 TM-driven segmentation 해제 필수

---

### 15. Create Analysis Report

**접근**: Project home > Overview > Reports 탭 > Analysis > Create new report now
- 온라인: memoQ online project > Reports > Analysis > Create new report now

**핵심 동작**:
- 동작: [Create new report now 클릭] → [Create analysis report 대화상자]
- 동작: [OK 클릭] → [분석 실행, Reports 탭에 결과 추가]
- 동작: [Cancel 클릭] → [Overview로 복귀]

**Analysis options**:
- **Use project TMs and corpora** 체크박스: 프로젝트 내 모든 TM/LiveDocs 세그먼트 조회
- **Calculate homogeneity** 체크박스: 내부 퍼지 유사성 예측 (번역 중 TM 채워지면서 생기는 매치). **단일 번역자만** 사용
- **Include locked rows** 체크박스: 잠긴 세그먼트 포함 여부
- **Repetitions take precedence over 100%** 체크박스: 반복 세그먼트 이중 계산 방지 (일관된 번역 > TM 매치 활용)
- **Cross-file repetitions** 체크박스: 파일 간 반복 인식 (**단일 번역자만** 사용)
- **Include spaces in character counts** 체크박스
- **Tag weight**: word(s) 또는 character(s) 단위 (예: 0.25 words/tag = 4태그당 1단어)

**시나리오별 설정**:

| 시나리오 | Use TMs | Homogeneity | Locked | Rep>100% | Cross-file | Weighted |
|---------|---------|------------|--------|----------|-----------|---------|
| 단일 번역자 | O | O | X | O | O | O |
| 팀 번역 | O | X | X | O | X | O |
| 전체 단어수 | X | X | O | O | X | - |
| 편집자 작업량 | X | X | 상황별 | O | X | - |

**기타 옵션**:
- **Optional comment for report**: 보고서 설명 (여러 보고서 시 필수)
- Trados 2007-like word counts: 구버전 Trados 클라이언트용 (비권장)

**보고서 확인**:
- Reports 탭 > Analysis > show/hide/export(CSV)/delete
- 최신 보고서가 목록 최상단

**엣지 케이스/제한**:
- 자동 실행 가능 (템플릿에서 생성 시)
- 소스 문서 변경 시 재분석 필요

---

### 16. Statistics

**접근**:
- 로컬: 프로젝트 열기 > Documents 리본 > Statistics
- 온라인: memoQ online project > Translations > Preparation 리본 > Statistics

**핵심 동작**:
- 동작: [Statistics 클릭] → [Statistics 대화상자]
- 동작: [Calculate 클릭] → [분석 실행, 하단에 결과 표시]
- 동작: [Export 클릭] → [보고서 파일 저장]

**Scope 선택** (라디오 버튼): Pre-translate와 동일 (Project/Active document/Selected documents/From cursor/Open documents/Selection/Work on views)

**단일 번역자 설정**:
- Project TMs and corpora: O
- Homogeneity: O
- Include locked rows: X
- Repetitions take precedence over 100%: O
- Cross-file repetitions: O
- Show weighted counts: O

**팀 번역자 설정**:
- Project TMs and corpora: O
- Homogeneity: X
- Include locked rows: X
- Repetitions take precedence over 100%: O
- Cross-file repetitions: X
- Show weighted counts: O

**가중 단어수 (Weighted counts)**:
- 매치 카테고리별 가중치 (0%=작업 없음, 100%=처음부터 번역)
- 예: 90% 매치, 10단어, 50% 가중 → 5단어
- 온라인 프로젝트: Server Administrator > Weighted counts에서 설정

**Tag weight**: word(s) 또는 character(s) 단위

**보고서 상세 옵션**:
- **Show results for each file**: 파일별 분리 보고
- **Show counts**: 세그먼트/단어/문자 총계
- **Status report**: 세그먼트 상태 (confirmed/edited/pre-translated/not started)
- **Include target counts**: 대상 텍스트 크기 기반 청구

**Export 형식**:
- **HTML (Reflecting displayed results)**: HTML 파일
- **CSV (Reflecting displayed results)**: CSV
- **CSV (Per-file, TRADOS-compatible)**: 문서당 1행 (구 Trados 스타일)
- **CSV (Per-file, All information)**: Statistics 대화상자와 동일 레이아웃
- CSV 구분자: Tab 권장

**Project TM 생성**:
- **Create Project TM** 체크박스 선택 후 Calculate
- **Project TM** 버튼 > Export Project TM 대화상자:
  - TMX 파일로 저장
  - 기존 TM에 저장
  - 새 TM 생성 후 저장

**결과 구조**:
- **Counts**: 총 세그먼트/단어/문자
- **Analysis**: 매치 유형별 상세 (TM, homogeneity 등)
- TM 수와 설정에 따라 여러 Analysis 섹션

**엣지 케이스/제한**:
- 자동화 가능 (프로젝트 템플릿에서)
- 간단한 분석은 Overview > Reports에서도 가능 (설정 옵션 적음)

---

### 17. Edit Distance Report

**접근**:
- 로컬: Project home > Overview > Reports 탭 > Edit distance statistics > Create new report now
- 온라인: memoQ online project > Reports > Edit distance report > Create new report now

**핵심 동작**:
- 동작: [Create new report now 클릭] → [Edit distance statistics - settings 대화상자]
- 동작: [OK 클릭] → [보고서 생성, Reports 탭에 추가]

**거리 측정 방법**:
- **Levenshtein**: 문자 단위 차이 (작업량 파악에 적합)
- **Fuzzy**: 퍼센트 단위 차이 (분석 보고서와 유사한 퍼지 범위 그룹화)
  - 매치 없이 처음부터 번역 시 거리 = 100%

**번역자 작업 측정**:
- **Inserted matches vs. current translations** 라디오 버튼
- Levenshtein 권장 (대부분 세그먼트가 처음부터 번역되므로)
- 확인된 세그먼트만 계산
- **Show results for each file** 체크박스: 파일별 + 유형별(X-Translated/No match inserted/Machine translated 등) 상세 보고

**리뷰어 작업 측정**:
- **Calculate distance between** 라디오 버튼 + 버전 비교 선택:
  - **Translator > Reviewer 1**: R1 비용/작업량
  - **Translator > Reviewer 2**: 전체 편집 비용 / 번역 품질 개요
  - **Reviewer 1 > Reviewer 2**: R2 비용 / R1 작업 평가
  - **Last delivery > Current text**: 리뷰어 본인 작업량
- Levenshtein: 시간/비용 추정 / Fuzzy: 번역 품질 평가

**기타 옵션**:
- **Optional comment for report**: 보고서 설명
- **Include spaces in character counts**, **Tag weight**
- Trados 2007-like word counts (비권장)

**보고서 확인**: Reports 탭 > Edit distance statistics > show/hide/export(CSV)/delete

**엣지 케이스/제한**:
- 온라인: Inserted matches vs. current translations만 가능 (다른 옵션은 체크아웃 필요)
- 리뷰어 거리는 주로 온라인/패키지 프로젝트 (번역→리뷰 단계 비중첩 필요)
- 시간 측정은 별도 Editing time report 사용

---

### 18. Editing Time Report

**접근**: Project home > Overview > Reports 탭 > Editing time > Create new report now

**핵심 동작**:
- 동작: [Create new report now 클릭] → [편집 시간 보고서 설정 대화상자]
- 동작: [OK 클릭] → [보고서 생성]

**사전 설정 필수**:
- Options > Miscellaneous > Editing time 탭 > **Record editing time when I am working** 체크박스 활성화
- 번역 에디터에서 그리드와 View 패널 사이 오른쪽에 시간 표시

**측정 내용**:
- 세그먼트별, 역할별(Translator/Reviewer 1/Reviewer 2) 편집 시간
- 번역 속도: 시간당 단어(문자) 수 (소스 기준)
- 매치 비율별 그룹화

**용도**:
- 특정 자료 유형의 번역 시간 파악 → 가중치 정교화
- 리뷰 시간 측정 → 번역자 평가 / 대규모 프로젝트 일정 계획

**설정 옵션**:
- **Include spaces in character counts** 체크박스
- **Tag weight**: word(s) 또는 character(s)
- **Optional comment for report**: 보고서 설명
- Trados 2007-like word counts (비권장)

**보고서 확인**: Reports 탭 > Editing time > show/hide/export(CSV)/delete

**엣지 케이스/제한**:
- **온라인 프로젝트에서 동작하지 않음**: 편집 시간이 동기화되지 않음
  - 번역자/리뷰어가 각자 측정 활성화 → 보고서 생성 → PM에게 전송 필요
- 기본적으로 측정 비활성 → 작업 시작 전 활성화 필수

---

### 19. LQA Reports

**접근**: Project home > Translations > Documents 리본 > LQA Reports

**사전 조건**: 프로젝트에 LQA 모델 적용 필요
- Project home > Settings > LQA models 아이콘 > 체크박스 선택
- 문서 임포트 전에 LQA 모델 추가 권장

**지원 표준**: J2450, LISA, TAUS + memoQ 자체 모델

**혼동 주의**: LQA (인간 피드백 기반 품질 보증) vs QA (자동 형식 검사: 용어 일관성, 번역 길이, 인라인 태그 등)

**탭 1: Statistics (통계)**

**Scope** (라디오 버튼): Pre-translate와 동일 7가지 + Work on views + Show results for each file

**그룹화** (라디오 버튼):
- **Categories** (기본): 주요 카테고리별
- **Severities**: 심각도별
- **Show full details**: 모든 오류 유형 목록

**동작**: Calculate 클릭 → 하단에 결과 테이블 표시
- 카테고리/심각도별 오류 수
- **Normalized value**: 해당 오류가 없는 문서 비율 (품질 지표)

**Export**: Export LQA Statistics 대화상자
- **HTML**: 대화상자와 동일한 형태
- **CSV (reflecting current results)**: CSV separator > Tab 권장

**탭 2: Error lists (오류 목록)**

**Scope**: Statistics와 동일

**수신자 선택** (라디오 버튼):
- **PM/마스터 리뷰어**: 단일 파일에 전체 목록
- **Separate files for individual documents**: 문서별 개별 파일

**동작**: Update preview 클릭 → 하단에 오류 목록 + 요약

**Export 형식**:
- **Excel (XLSX)**: 기본 형식
- **HTML**: 개별 번역자에게 피드백 전송용
- Export to file 클릭 → 폴더 선택 (프로젝트명/문서명 기반 파일명)

**엣지 케이스/제한**:
- LQA 모델 없으면 LQA Reports 아이콘 비활성(grayed out)
- LQA 모델은 문서 임포트 전 적용 권장

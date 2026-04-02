import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { completeWizard } from './helpers/test-utils';
import { SEL } from './helpers/selectors';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test.describe('Sprint 5-1: TM 기본 — 생성, 프로젝트 연결', () => {
  test('TM 생성 → IPC로 목록에 표시', async () => {
    const { page } = ctx;

    // IPC로 TM 생성
    const created = await page.evaluate(async () => {
      return window.electronAPI.tm.create({
        name: 'Test TM',
        source_lang: 'ko',
        target_lang: 'en',
        description: '테스트 TM',
        role: 'working',
      });
    });

    expect(created).toBeTruthy();
    expect(created.name).toBe('Test TM');
    expect(created.source_lang).toBe('ko');
    expect(created.target_lang).toBe('en');
    expect(created.role).toBe('working');
    expect(created.entry_count).toBe(0);

    // 목록에서 확인
    const list = await page.evaluate(() => window.electronAPI.tm.list());
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Test TM');
  });

  test('중복 TM 이름 → 에러', async () => {
    const { page } = ctx;

    // 첫 번째 TM 생성
    await page.evaluate(async () => {
      return window.electronAPI.tm.create({
        name: 'Dup TM',
        source_lang: 'ko',
        target_lang: 'en',
      });
    });

    // 같은 이름으로 두 번째 생성 시도 → 에러
    const error = await page.evaluate(async () => {
      try {
        await window.electronAPI.tm.create({
          name: 'Dup TM',
          source_lang: 'ko',
          target_lang: 'en',
        });
        return null;
      } catch (err) {
        return (err as Error).message;
      }
    });

    expect(error).toBeTruthy();
    expect(error).toContain('이미 존재');
  });

  test('프로젝트에 TM 연결/해제', async () => {
    const { page } = ctx;

    // 프로젝트 생성
    await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
    await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
    await page.fill(SEL.NEW_PROJECT_NAME_INPUT, 'TM Test Project');
    await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
    await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=ko`);
    await page.click(SEL.NEW_PROJECT_TARGET_LANG);
    await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=en`);
    await page.click('[data-testid="new-project-next-btn"]');
    await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
    await page.click(SEL.NEW_PROJECT_FINISH_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    // TM 생성
    const tm = await page.evaluate(async () => {
      return window.electronAPI.tm.create({
        name: 'Link Test TM',
        source_lang: 'ko',
        target_lang: 'en',
      });
    });

    // 프로젝트 ID 조회
    const projectId = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      return projects.find((p) => p.name === 'TM Test Project')?.id ?? null;
    });
    expect(projectId).toBeTruthy();

    // TM 연결
    await page.evaluate(
      async ([pid, tmId]) => {
        await window.electronAPI.tm.linkToProject(pid!, tmId, 'working');
      },
      [projectId, tm.id] as const,
    );

    // 프로젝트 TM 목록 확인
    const linkedTms = await page.evaluate(
      async (pid) => window.electronAPI.tm.listByProject(pid!),
      projectId,
    );
    expect(linkedTms.length).toBe(1);
    expect(linkedTms[0].name).toBe('Link Test TM');

    // TM 해제
    await page.evaluate(
      async ([pid, tmId]) => {
        await window.electronAPI.tm.unlinkFromProject(pid!, tmId);
      },
      [projectId, tm.id] as const,
    );

    const afterUnlink = await page.evaluate(
      async (pid) => window.electronAPI.tm.listByProject(pid!),
      projectId,
    );
    expect(afterUnlink.length).toBe(0);
  });

  test('Wizard Step 3에서 TM 생성 + 선택 + Finish', async () => {
    const { page } = ctx;

    // New Project Wizard 시작
    await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
    await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });

    // Step 1: Details 입력
    await page.fill(SEL.NEW_PROJECT_NAME_INPUT, 'Wizard TM Project');
    await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
    await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=ko`);
    await page.click(SEL.NEW_PROJECT_TARGET_LANG);
    await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=en`);

    // Next → Documents
    await page.click(SEL.NEW_PROJECT_NEXT_BTN);
    await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });

    // Next → TM Step
    await page.click(SEL.NEW_PROJECT_NEXT_BTN);
    await page.waitForSelector(SEL.WIZARD_TM_STEP, { timeout: 5000 });

    // TM이 없으므로 empty state 표시
    await expect(page.locator(SEL.WIZARD_TM_EMPTY)).toBeVisible();

    // Create New TM 클릭
    await page.click(SEL.WIZARD_CREATE_TM_BTN);
    await page.waitForSelector(SEL.CREATE_TM_DIALOG, { timeout: 5000 });

    // TM 이름 입력 (Source/Target language는 프로젝트에서 자동 설정)
    await page.fill(`${SEL.CREATE_TM_DIALOG} input[data-testid="create-tm-name-input"]`, 'Wizard TM');

    // Create 클릭
    await page.click(SEL.CREATE_TM_CONFIRM);
    await page.waitForSelector(SEL.CREATE_TM_DIALOG, { state: 'hidden', timeout: 5000 });

    // TM 목록에 표시되고 자동 선택됨
    await expect(page.locator(SEL.WIZARD_TM_LIST)).toBeVisible();

    // Finish
    await page.click(SEL.NEW_PROJECT_FINISH_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    // 프로젝트에 TM이 연결되었는지 확인
    const linkedTms = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      const project = projects.find((p) => p.name === 'Wizard TM Project');
      if (!project) return [];
      return window.electronAPI.tm.listByProject(project.id);
    });

    expect(linkedTms.length).toBe(1);
    expect(linkedTms[0].name).toBe('Wizard TM');
  });

  test('Wizard Step 2에서 Finish → TM 없이 프로젝트 생성', async () => {
    const { page } = ctx;

    // New Project Wizard 시작
    await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
    await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });

    // Step 1: Details
    await page.fill(SEL.NEW_PROJECT_NAME_INPUT, 'No TM Project');
    await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
    await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=ko`);
    await page.click(SEL.NEW_PROJECT_TARGET_LANG);
    await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=en`);

    // Next → Documents → Finish (TM 스킵)
    await page.click(SEL.NEW_PROJECT_NEXT_BTN);
    await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
    await page.click(SEL.NEW_PROJECT_FINISH_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    // 프로젝트 생성 확인
    const projects = await page.evaluate(() => window.electronAPI.project.list());
    const noTmProject = projects.find((p) => p.name === 'No TM Project');
    expect(noTmProject).toBeTruthy();

    // TM 연결 없음 확인
    const linkedTms = await page.evaluate(async (pid) => {
      return window.electronAPI.tm.listByProject(pid);
    }, noTmProject!.id);
    expect(linkedTms.length).toBe(0);
  });

  test('앱 재시작 → TM 유지', async () => {
    const { page, electronApp, userDataDir } = ctx;

    // TM 생성
    await page.evaluate(async () => {
      return window.electronAPI.tm.create({
        name: 'Persist TM',
        source_lang: 'ko',
        target_lang: 'en',
        description: '영속성 테스트',
      });
    });

    // 앱 종료
    await electronApp.close();

    // 같은 userDataDir로 재시작
    const { _electron } = await import('playwright');
    const path = await import('node:path');
    const electronApp2 = await _electron.launch({
      args: ['.', `--user-data-dir=${userDataDir}`],
      cwd: path.resolve(__dirname, '../..'),
      env: { ...process.env, NODE_ENV: 'production' },
    });
    const page2 = await electronApp2.firstWindow();
    await page2.waitForLoadState('domcontentloaded');

    // Dashboard 도달 대기 (Wizard는 이미 완료됨)
    await page2.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 10000 });

    // TM 유지 확인
    const list = await page2.evaluate(() => window.electronAPI.tm.list());
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Persist TM');
    expect(list[0].description).toBe('영속성 테스트');

    await electronApp2.close();

    // ctx를 무효화하여 afterEach에서 이중 종료 방지
    ctx = { ...ctx, electronApp: electronApp2, page: page2 };
  });
});

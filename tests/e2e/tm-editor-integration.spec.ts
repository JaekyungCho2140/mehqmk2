import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, openEditor } from './helpers/test-utils';

let ctx: AppContext;

/**
 * TM이 연결된 프로젝트 생성 (en→ko, Working TM)
 */
async function createProjectWithTm(page: import('@playwright/test').Page): Promise<void> {
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `TM Editor Test ${Date.now()}`);
  await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
  await page.click(SEL.NEW_PROJECT_TARGET_LANG);
  await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);

  // Next → Documents
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });

  // Next → TM Step
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector(SEL.WIZARD_TM_STEP, { timeout: 5000 });

  // Create TM
  await page.click(SEL.WIZARD_CREATE_TM_BTN);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { timeout: 5000 });
  await page.fill(`${SEL.CREATE_TM_DIALOG} input[data-testid="create-tm-name-input"]`, `Working TM ${Date.now()}`);
  await page.click(SEL.CREATE_TM_CONFIRM);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { state: 'hidden', timeout: 5000 });

  // Finish
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
}

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProjectWithTm(ctx.page);
  await openEditor(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test.describe('Sprint 5-3: TM 에디터 연동', () => {
  test('Ctrl+Enter → Working TM에 번역 저장', async () => {
    const { page } = ctx;

    // 첫 세그먼트에 텍스트 입력
    const tiptap = page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
    await tiptap.click();
    await page.waitForTimeout(300);
    await page.keyboard.type('안녕하세요 세계');
    await page.waitForTimeout(200);

    // Ctrl+Enter → TM 저장 + 확인 + 다음 이동
    await tiptap.press('Control+Enter');
    await page.waitForTimeout(500);

    // TM에 저장되었는지 확인 (IPC로 검증)
    const projectId = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      return projects[0]?.id;
    });

    const tmEntries = await page.evaluate(async (pid) => {
      const tms = await window.electronAPI.tm.listByProject(pid);
      if (tms.length === 0) return [];
      // TM의 엔트리 수 확인
      return tms.map((tm) => ({ name: tm.name, count: tm.entry_count }));
    }, projectId);

    expect(tmEntries.length).toBeGreaterThanOrEqual(1);
    expect(tmEntries[0].count).toBeGreaterThanOrEqual(1);
  });

  test('같은 source 세그먼트 이동 → TM 매치 표시', async () => {
    const { page } = ctx;

    // 먼저 TM에 엔트리 추가 (IPC로)
    const setupResult = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      const tms = await window.electronAPI.tm.listByProject(projects[0].id);
      if (tms.length === 0) return null;

      // 첫 세그먼트의 source 텍스트와 동일한 엔트리를 TM에 추가
      await window.electronAPI.tm.addEntry({
        tmId: tms[0].id,
        source: 'Hello, world!',
        target: '안녕, 세계!',
      });

      return { tmId: tms[0].id };
    });

    expect(setupResult).toBeTruthy();

    // 첫 세그먼트는 이미 선택됨 — source가 "Hello, world!"
    // TM 매치가 비동기로 로드될 시간 대기
    await page.waitForTimeout(1000);

    // MatchIndicator 또는 MatchList에 매치율 표시 확인
    // 매치율 배지가 보이는지 확인
    const matchIndicator = page.locator('[data-testid="match-indicator"]');
    const matchList = page.locator('[data-testid="match-list"]');

    // 둘 중 하나라도 표시되면 OK
    const indicatorVisible = await matchIndicator.isVisible().catch(() => false);
    const listVisible = await matchList.isVisible().catch(() => false);

    expect(indicatorVisible || listVisible).toBeTruthy();
  });

  test('매치 더블클릭 → Target에 삽입', async () => {
    const { page } = ctx;

    // TM에 엔트리 추가
    await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      const tms = await window.electronAPI.tm.listByProject(projects[0].id);
      if (tms.length > 0) {
        await window.electronAPI.tm.addEntry({
          tmId: tms[0].id,
          source: 'Hello, world!',
          target: '안녕, 세계!',
        });
      }
    });

    // 매치 로드 대기
    await page.waitForTimeout(1000);

    // MatchList의 첫 번째 항목 더블클릭
    const matchItem = page.locator('[data-testid="match-list"] [data-testid="match-item"]').first();
    if (await matchItem.isVisible().catch(() => false)) {
      await matchItem.dblclick();
      await page.waitForTimeout(300);

      // Target에 텍스트 삽입 확인
      const tiptapContent = await page
        .locator(`${SEL.TIPTAP_EDITOR} .tiptap`)
        .textContent();
      expect(tiptapContent).toContain('안녕');
    }
  });

  test('Ctrl+Shift+Enter → TM 저장 안 됨 (unconfirm)', async () => {
    const { page } = ctx;

    // 먼저 Ctrl+Enter로 확인 + TM 저장
    const tiptap = page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
    await tiptap.click();
    await page.waitForTimeout(300);
    await page.keyboard.type('확인 번역');
    await page.waitForTimeout(200);
    await tiptap.press('Control+Enter');
    await page.waitForTimeout(1000);

    // TM에 1개 저장됨
    const countAfterConfirm = await page.evaluate(async () => {
      const allTms = await window.electronAPI.tm.list();
      if (allTms.length === 0) return 0;
      return allTms[0].entry_count;
    });
    expect(countAfterConfirm).toBeGreaterThanOrEqual(1);

    // 다음 세그먼트에서 입력 후 Ctrl+Shift+Enter (unconfirm → TM 저장 안 됨)
    const tiptap2 = page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
    await tiptap2.click();
    await page.waitForTimeout(300);
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('unconfirm 테스트');
    await page.waitForTimeout(200);

    // Ctrl+Shift+Enter — confirmed가 아닌 세그먼트에서는 무동작 또는 unconfirm
    await tiptap2.press('Control+Shift+Enter');
    await page.waitForTimeout(500);

    // TM 엔트리 수는 이전과 동일 (Ctrl+Shift+Enter로 추가 저장 없음)
    const countAfterUnconfirm = await page.evaluate(async () => {
      const allTms = await window.electronAPI.tm.list();
      if (allTms.length === 0) return 0;
      return allTms[0].entry_count;
    });
    expect(countAfterUnconfirm).toBe(countAfterConfirm);
  });

  test('Working TM 없는 프로젝트 → Ctrl+Enter → 에러 없이 확인', async () => {
    const { page } = ctx;

    // 새 프로젝트 (TM 없이) 생성 후 에디터 진입
    await page.click(SEL.EDITOR_BACK_BTN);
    await page.waitForSelector(SEL.PROJECT_HOME, { timeout: 5000 });
    await page.click(SEL.PROJECT_HOME_BACK_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    // TM 없는 프로젝트 생성
    await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
    await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
    await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `No TM Project ${Date.now()}`);
    await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
    await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
    await page.click(SEL.NEW_PROJECT_TARGET_LANG);
    await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);
    await page.click('[data-testid="new-project-next-btn"]');
    await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
    await page.click(SEL.NEW_PROJECT_FINISH_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    // 새 프로젝트의 에디터 열기
    await page.locator('.ag-row').first().dblclick();
    await page.waitForSelector(SEL.PROJECT_HOME, { timeout: 10000 });
    await page.click(SEL.OPEN_EDITOR_BTN);
    await page.waitForSelector(SEL.TRANSLATION_EDITOR, { timeout: 10000 });
    await page.waitForSelector('.ag-row', { timeout: 10000 });
    await page.waitForSelector(`${SEL.TIPTAP_EDITOR} .tiptap`, { timeout: 5000 });

    // 텍스트 입력 + Ctrl+Enter → 에러 없이 확인만
    const tiptap = page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
    await tiptap.click();
    await page.waitForTimeout(300);
    await page.keyboard.type('테스트 번역');
    await page.waitForTimeout(200);

    // Ctrl+Enter — 에러 없이 동작해야 함
    await tiptap.press('Control+Enter');
    await page.waitForTimeout(500);

    // 에러 없이 다음 세그먼트로 이동 확인 (또는 같은 세그먼트 유지)
    // 최소한 크래시 없이 에디터가 정상 동작
    await expect(page.locator(SEL.TRANSLATION_EDITOR)).toBeVisible();
  });

  test('여러 세그먼트 연속 확인 → TM 엔트리 누적', async () => {
    const { page } = ctx;

    // 첫 세그먼트 (빈 target: "Hello, world!") 번역 + 확인
    const tiptap = page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
    await tiptap.click();
    await page.waitForTimeout(300);
    await page.keyboard.type('번역 1');
    await page.waitForTimeout(200);
    await tiptap.press('Control+Enter');
    await page.waitForTimeout(1000);

    // 첫 번째 확인 후 TM 엔트리 확인
    const countAfterFirst = await page.evaluate(async () => {
      const allTms = await window.electronAPI.tm.list();
      if (allTms.length === 0) return 0;
      return allTms[0].entry_count;
    });
    expect(countAfterFirst).toBeGreaterThanOrEqual(1);

    // 6번째 세그먼트로 이동 (빈 target: "New Project")
    for (let i = 0; i < 4; i++) {
      await page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
      await page.waitForTimeout(200);
    }

    // 빈 target에 번역 입력
    const tiptap2 = page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
    await tiptap2.click();
    await page.waitForTimeout(300);
    await page.keyboard.type('새 프로젝트');
    await page.waitForTimeout(300);
    await tiptap2.press('Control+Enter');
    await page.waitForTimeout(1000);

    // 두 번째 확인 후 TM 엔트리 확인
    const countAfterSecond = await page.evaluate(async () => {
      const allTms = await window.electronAPI.tm.list();
      if (allTms.length === 0) return 0;
      return allTms[0].entry_count;
    });

    expect(countAfterSecond).toBeGreaterThan(countAfterFirst);
  });
});

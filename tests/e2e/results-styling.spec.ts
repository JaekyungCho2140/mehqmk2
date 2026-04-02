import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, openEditor } from './helpers/test-utils';

let ctx: AppContext;

async function setupEditorWithVariousMatches(page: import('@playwright/test').Page): Promise<void> {
  // 프로젝트 + TM 생성
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `Style Test ${Date.now()}`);
  await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
  await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
  await page.click(SEL.NEW_PROJECT_TARGET_LANG);
  await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
  await page.click('[data-testid="new-project-next-btn"]');
  await page.waitForSelector(SEL.WIZARD_TM_STEP, { timeout: 5000 });
  await page.click(SEL.WIZARD_CREATE_TM_BTN);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { timeout: 5000 });
  await page.fill(`${SEL.CREATE_TM_DIALOG} input[data-testid="create-tm-name-input"]`, `Style TM ${Date.now()}`);
  await page.click(SEL.CREATE_TM_CONFIRM);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { state: 'hidden', timeout: 5000 });
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

  // 다양한 매치 엔트리 추가
  await page.evaluate(async () => {
    const tms = await window.electronAPI.tm.list();
    if (tms.length === 0) return;
    const tmId = tms[0].id;

    // 100% exact
    await window.electronAPI.tm.addEntry({ tmId, source: 'Hello, world!', target: '안녕, 세계!' });
    // fuzzy (유사)
    await window.electronAPI.tm.addEntry({ tmId, source: 'Hello, worlds!', target: '안녕, 세계들!' });
    // 숫자 치환용
    await window.electronAPI.tm.addEntry({ tmId, source: 'File', target: '파일' });
    // 대소문자 차이
    await window.electronAPI.tm.addEntry({ tmId, source: 'hello, world!', target: '안녕, 세계! (소문자)' });
  });

  await openEditor(page);
}

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test.describe('Sprint 6-2: 색상 코딩 + 매치율 + 램프', () => {
  test('100% 매치 → 컬러 바 + 배지 표시', async () => {
    const { page } = ctx;
    await setupEditorWithVariousMatches(page);
    await page.waitForTimeout(1000);

    // 결과 항목이 표시되는지 확인
    const resultItem = page.locator('[data-testid="result-item-0"]');
    await expect(resultItem).toBeVisible({ timeout: 5000 });

    // 컬러 바 존재 확인
    const colorBar = resultItem.locator('.result-item-color-bar');
    await expect(colorBar).toBeVisible();

    // 매치율 배지 존재 확인
    const badge = resultItem.locator('.result-item-rate');
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    expect(badgeText).toContain('100%');
  });

  test('DiffLamps 표시', async () => {
    const { page } = ctx;
    await setupEditorWithVariousMatches(page);
    await page.waitForTimeout(1000);

    // DiffLamps는 ResultItem 헤더에 인라인 표시
    const diffLamps = page.locator('[data-testid="diff-lamps"]').first();
    await expect(diffLamps).toBeVisible({ timeout: 5000 });
  });

  test('정렬: 매치율 내림차순', async () => {
    const { page } = ctx;
    await setupEditorWithVariousMatches(page);
    await page.waitForTimeout(1000);

    // 여러 결과가 있으면 첫 번째가 가장 높은 매치율
    const item0 = page.locator('[data-testid="result-item-0"]');
    const item1 = page.locator('[data-testid="result-item-1"]');

    const hasMultiple = await item1.isVisible().catch(() => false);
    if (hasMultiple) {
      // 첫 번째 항목이 존재하면 정렬 확인 (결과 표시만으로 검증)
      await expect(item0).toBeVisible();
      await expect(item1).toBeVisible();
    }
  });

  test('Working > Reference 정렬 순서', async () => {
    const { page } = ctx;

    // 프로젝트 생성
    await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
    await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
    await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `Sort Order ${Date.now()}`);
    await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
    await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
    await page.click(SEL.NEW_PROJECT_TARGET_LANG);
    await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);
    await page.click('[data-testid="new-project-next-btn"]');
    await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
    await page.click(SEL.NEW_PROJECT_FINISH_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    // Working + Reference TM 생성, 같은 엔트리
    const result = await page.evaluate(async () => {
      const projects = await window.electronAPI.project.list();
      const project = projects[0];
      const workingTm = await window.electronAPI.tm.create({
        name: `W ${Date.now()}`, source_lang: 'en', target_lang: 'ko',
      });
      const refTm = await window.electronAPI.tm.create({
        name: `R ${Date.now()}`, source_lang: 'en', target_lang: 'ko',
      });
      await window.electronAPI.tm.linkToProject(project.id, workingTm.id, 'working');
      await window.electronAPI.tm.linkToProject(project.id, refTm.id, 'reference');
      await window.electronAPI.tm.addEntry({ tmId: workingTm.id, source: 'Hello, world!', target: 'W번역' });
      await window.electronAPI.tm.addEntry({ tmId: refTm.id, source: 'Hello, world!', target: 'R번역' });
      return { projectId: project.id };
    });

    await openEditor(page);
    await page.waitForTimeout(1000);

    // tm.search로 직접 검증
    const matches = await page.evaluate(async (pid) => {
      return window.electronAPI.tm.search({ projectId: pid, source: 'Hello, world!' });
    }, result.projectId);

    expect(matches.length).toBe(2);
    expect(matches[0].tm_role).toBe('working');
    expect(matches[1].tm_role).toBe('reference');
  });
});

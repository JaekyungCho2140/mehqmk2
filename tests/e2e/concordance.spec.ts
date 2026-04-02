import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, openEditor } from './helpers/test-utils';

let ctx: AppContext;

async function setupEditorWithTmEntries(page: import('@playwright/test').Page): Promise<void> {
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `Concordance Test ${Date.now()}`);
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
  await page.fill(`${SEL.CREATE_TM_DIALOG} input[data-testid="create-tm-name-input"]`, `Conc TM ${Date.now()}`);
  await page.click(SEL.CREATE_TM_CONFIRM);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { state: 'hidden', timeout: 5000 });
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

  // TM에 다양한 엔트리 추가
  await page.evaluate(async () => {
    const tms = await window.electronAPI.tm.list();
    if (tms.length === 0) return;
    const tmId = tms[0].id;
    await window.electronAPI.tm.addEntry({ tmId, source: 'Hello, world!', target: '안녕, 세계!' });
    await window.electronAPI.tm.addEntry({ tmId, source: 'Hello everyone', target: '안녕하세요 여러분' });
    await window.electronAPI.tm.addEntry({ tmId, source: 'Translation memory', target: '번역 메모리' });
    await window.electronAPI.tm.addEntry({ tmId, source: 'Transport goods', target: '물품 운송' });
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

test.describe('Sprint 6-5: Concordance 검색', () => {
  test('Ctrl+K → Concordance 패널 열림', async () => {
    const { page } = ctx;
    await setupEditorWithTmEntries(page);

    // Ctrl+K
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);

    await expect(page.locator('[data-testid="concordance-panel"]')).toBeVisible({ timeout: 3000 });
  });

  test('검색어 입력 → 결과 표시', async () => {
    const { page } = ctx;
    await setupEditorWithTmEntries(page);

    await page.keyboard.press('Control+k');
    await page.waitForSelector('[data-testid="concordance-panel"]', { timeout: 3000 });

    // "Hello" 검색
    await page.fill('[data-testid="concordance-query"]', 'Hello');
    await page.click('[data-testid="concordance-search-btn"]');
    await page.waitForTimeout(1000);

    // 결과 항목 확인 (최소 1개)
    const item = page.locator('[data-testid="concordance-item-0"]');
    const hasResults = await item.isVisible().catch(() => false);
    expect(hasResults).toBeTruthy();
  });

  test('와일드카드 검색 — "Trans*"', async () => {
    const { page } = ctx;
    await setupEditorWithTmEntries(page);

    await page.keyboard.press('Control+k');
    await page.waitForSelector('[data-testid="concordance-panel"]', { timeout: 3000 });

    await page.fill('[data-testid="concordance-query"]', 'Trans*');
    await page.click('[data-testid="concordance-search-btn"]');
    await page.waitForTimeout(1000);

    // "Translation" + "Transport" 둘 다 매칭
    const item0 = page.locator('[data-testid="concordance-item-0"]');
    const item1 = page.locator('[data-testid="concordance-item-1"]');
    const has0 = await item0.isVisible().catch(() => false);
    const has1 = await item1.isVisible().catch(() => false);
    expect(has0).toBeTruthy();
    expect(has1).toBeTruthy();
  });

  test('TM 비어있을 때 → 일치 없음', async () => {
    const { page } = ctx;
    await setupEditorWithTmEntries(page);

    await page.keyboard.press('Control+k');
    await page.waitForSelector('[data-testid="concordance-panel"]', { timeout: 3000 });

    await page.fill('[data-testid="concordance-query"]', 'zzzznonexistent');
    await page.click('[data-testid="concordance-search-btn"]');
    await page.waitForTimeout(1000);

    // 빈 결과 메시지
    const empty = page.locator('[data-testid="concordance-empty"]');
    await expect(empty).toBeVisible({ timeout: 3000 });
  });

  test('Esc → 패널 닫기', async () => {
    const { page } = ctx;
    await setupEditorWithTmEntries(page);

    await page.keyboard.press('Control+k');
    await page.waitForSelector('[data-testid="concordance-panel"]', { timeout: 3000 });

    // Esc → 닫기
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const visible = await page.locator('[data-testid="concordance-panel"]').isVisible().catch(() => false);
    expect(visible).toBe(false);
  });
});

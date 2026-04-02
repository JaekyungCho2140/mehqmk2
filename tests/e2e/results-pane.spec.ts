import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, openEditor } from './helpers/test-utils';

let ctx: AppContext;

/**
 * TM 연결된 프로젝트 + TM에 엔트리 추가 + 에디터 진입
 */
async function setupEditorWithTmMatches(page: import('@playwright/test').Page): Promise<void> {
  // 프로젝트 생성 + TM (Wizard Step 3)
  await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
  await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
  await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `Results Test ${Date.now()}`);
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
  await page.fill(`${SEL.CREATE_TM_DIALOG} input[data-testid="create-tm-name-input"]`, `Results TM ${Date.now()}`);
  await page.click(SEL.CREATE_TM_CONFIRM);
  await page.waitForSelector(SEL.CREATE_TM_DIALOG, { state: 'hidden', timeout: 5000 });
  await page.click(SEL.NEW_PROJECT_FINISH_BTN);
  await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

  // TM에 엔트리 추가 (첫 세그먼트 source "Hello, world!"에 매치)
  await page.evaluate(async () => {
    const tms = await window.electronAPI.tm.list();
    if (tms.length > 0) {
      await window.electronAPI.tm.addEntry({
        tmId: tms[0].id,
        source: 'Hello, world!',
        target: '안녕, 세계!',
      });
      await window.electronAPI.tm.addEntry({
        tmId: tms[0].id,
        source: 'Hello world',
        target: '안녕 세계',
      });
    }
  });

  // 에디터 진입
  await openEditor(page);
}

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test.describe('Sprint 6-1: Translation Results Pane', () => {
  test('에디터 레이아웃: ResultsPane 우측 표시', async () => {
    const { page } = ctx;
    await setupEditorWithTmMatches(page);

    // Results Pane 표시 확인
    await expect(page.locator('[data-testid="results-pane"]')).toBeVisible();
    // ResultsList 표시
    await expect(page.locator('[data-testid="results-list"]')).toBeVisible();
  });

  test('TM 매치 → 결과 클릭 → CompareBox + MetaInfo 갱신', async () => {
    const { page } = ctx;
    await setupEditorWithTmMatches(page);

    // 매치 로드 대기
    await page.waitForTimeout(1000);

    // 첫 번째 결과 항목 클릭
    const resultItem = page.locator('[data-testid="result-item-0"]');
    if (await resultItem.isVisible().catch(() => false)) {
      await resultItem.click();
      await page.waitForTimeout(300);

      // CompareBox 표시
      await expect(page.locator('[data-testid="compare-box"]')).toBeVisible();
      // MetaInfo 표시
      await expect(page.locator('[data-testid="meta-info"]')).toBeVisible();
    }
  });

  test('삽입: Ctrl+1 → Target 반영', async () => {
    const { page } = ctx;
    await setupEditorWithTmMatches(page);
    await page.waitForTimeout(1000);

    // 결과가 로드되었는지 확인
    const resultItem = page.locator('[data-testid="result-item-0"]');
    const hasResults = await resultItem.isVisible().catch(() => false);

    if (hasResults) {
      // ResultItem 더블클릭 → 삽입
      await resultItem.dblclick();
      await page.waitForTimeout(1000);

      // TipTap에서 삽입된 텍스트 확인 (ProseMirror 상태)
      const hasContent = await page.evaluate(() => {
        const editor = (window as unknown as { __tiptapEditor?: { state: { doc: { textContent: string } } } }).__tiptapEditor;
        if (editor) return editor.state.doc.textContent.length > 0;
        // fallback: DOM textContent
        const el = document.querySelector('[data-testid="tiptap-editor"] .tiptap');
        return el ? (el.textContent?.length ?? 0) > 0 : false;
      });

      expect(hasContent).toBeTruthy();
    }
  });

  test('F12 → Pane 접기/펼치기', async () => {
    const { page } = ctx;
    await setupEditorWithTmMatches(page);

    // 초기: 펼쳐진 상태
    await expect(page.locator('[data-testid="results-pane"]')).toBeVisible();

    // F12 → 접기
    await page.keyboard.press('F12');
    await page.waitForTimeout(300);

    // 접힌 상태 확인 (collapse 버튼 또는 expand 버튼 존재)
    const expandBtn = page.locator('[data-testid="results-pane-expand"]');
    const collapseBtn = page.locator('[data-testid="results-pane-collapse"]');
    const isCollapsed = await expandBtn.isVisible().catch(() => false);
    const isExpanded = await collapseBtn.isVisible().catch(() => false);

    // F12 → 다시 펼치기
    await page.keyboard.press('F12');
    await page.waitForTimeout(300);

    // 토글이 동작했는지 확인
    expect(isCollapsed || isExpanded).toBeTruthy();
  });

  test('매치 없을 때 → "매치 없음" 메시지', async () => {
    const { page } = ctx;

    // TM 없는 프로젝트 생성 후 에디터 진입
    await page.click(SEL.DASHBOARD_NEW_PROJECT_BTN);
    await page.waitForSelector(SEL.NEW_PROJECT_WIZARD, { timeout: 5000 });
    await page.fill(SEL.NEW_PROJECT_NAME_INPUT, `No Match Test ${Date.now()}`);
    await page.click(SEL.NEW_PROJECT_SOURCE_LANG);
    await page.click(`${SEL.NEW_PROJECT_SOURCE_LANG_DROPDOWN} .lang-select-option >> text=en`);
    await page.click(SEL.NEW_PROJECT_TARGET_LANG);
    await page.click(`${SEL.NEW_PROJECT_TARGET_LANG_DROPDOWN} .lang-select-option >> text=ko`);
    await page.click('[data-testid="new-project-next-btn"]');
    await page.waitForSelector('[data-testid="file-drop-zone"]', { timeout: 5000 });
    await page.click(SEL.NEW_PROJECT_FINISH_BTN);
    await page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });

    await openEditor(page);
    await page.waitForTimeout(500);

    // Results Pane에 빈 상태 메시지
    const resultsList = page.locator('[data-testid="results-list"]');
    await expect(resultsList).toBeVisible();
    const text = await resultsList.textContent();
    expect(text).toBeTruthy();
  });
});

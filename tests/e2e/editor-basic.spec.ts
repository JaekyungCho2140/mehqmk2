import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, openEditor } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'EditorTest' });
  await openEditor(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('에디터 진입 — 세그먼트 그리드 표시', async () => {
  await expect(ctx.page.locator(SEL.SEGMENT_GRID)).toBeVisible();
  await expect(ctx.page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20);
});

test('세그먼트 클릭 → EditPanel Source/Target 표시', async () => {
  await ctx.page.locator('.ag-center-cols-container .ag-row[row-index="2"]').click();
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toBeVisible();
  await expect(ctx.page.locator(SEL.TIPTAP_EDITOR)).toBeVisible();
});

test('Target 편집 → Grid 실시간 반영', async () => {
  // 첫 세그먼트 (not-started, 빈 target)
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.click();
  await ctx.page.keyboard.type('Test input');
  await ctx.page.waitForTimeout(200); // debounce
  const targetCell = ctx.page.locator('.ag-row[row-index="0"] .ag-cell[col-id="target"]');
  await expect(targetCell).toContainText('Test input');
});

test('빈 세그먼트 → placeholder 표시', async () => {
  // 세그먼트 1은 빈 target
  const placeholder = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .is-editor-empty`);
  await expect(placeholder).toBeVisible();
});

test('← → Project Home 복귀', async () => {
  await ctx.page.click(SEL.EDITOR_BACK_BTN);
  await expect(ctx.page.locator(SEL.PROJECT_HOME)).toBeVisible({ timeout: 5000 });
});

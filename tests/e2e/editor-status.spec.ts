import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, openEditor } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'StatusTest' });
  await openEditor(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('StatusBox 더블클릭 → Change Status 다이얼로그', async () => {
  await ctx.page.locator('.ag-row[row-index="0"] .ag-cell[col-id="status"]').dblclick();
  await expect(ctx.page.locator(SEL.CHANGE_STATUS_DIALOG)).toBeVisible();

  await ctx.page.locator(`${SEL.CHANGE_STATUS_DIALOG} .dialog-card`).locator('text=Cancel').click();
  await expect(ctx.page.locator(SEL.CHANGE_STATUS_DIALOG)).not.toBeVisible();
});

test('Ctrl+Shift+L → 잠금 토글', async () => {
  // 세그먼트 3 (edited) 으로 이동
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
  await ctx.page.waitForTimeout(200);

  // 잠금: TipTap DOM에서 키 전송
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.click();
  await tiptap.press('Control+Shift+L');
  await ctx.page.waitForTimeout(300);

  // TipTap이 비활성 상태
  await expect(tiptap).toHaveAttribute('contenteditable', 'false');
});

test('locked 세그먼트 → 편집 불가', async () => {
  // 세그먼트 10은 locked (index 9)
  for (let i = 0; i < 9; i++) {
    await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
    await ctx.page.waitForTimeout(50);
  }
  await ctx.page.waitForTimeout(200);

  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await expect(tiptap).toHaveAttribute('contenteditable', 'false');
});

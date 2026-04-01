import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, openEditor } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'ConfirmTest' });
  await openEditor(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('Ctrl+Enter → 확인 + 다음 이동', async () => {
  // 첫 세그먼트에 텍스트 입력
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.click();
  await ctx.page.keyboard.type('Hello translation');
  await ctx.page.waitForTimeout(200);

  // Ctrl+Enter
  await tiptap.press('Control+Enter');

  // 다음 세그먼트로 이동 확인
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Welcome to mehQ');
});

test('빈 Target에서 Ctrl+Enter → 무시', async () => {
  // 첫 세그먼트는 빈 target
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.press('Control+Enter');

  // 여전히 첫 세그먼트 (이동 안 됨)
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Hello, world!');
});

test('locked 세그먼트에서 Ctrl+Enter → 무시', async () => {
  // 세그먼트 10은 locked (index 9)
  for (let i = 0; i < 9; i++) {
    await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
  }
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.press('Control+Enter');

  // locked이므로 이동 안 됨
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Copyright 2026 mehQ');
});

test('연속 Ctrl+Enter → 여러 세그먼트 확인', async () => {
  // 세그먼트 3 (edited, target 있음)으로 이동
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');

  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.press('Control+Enter'); // 세그먼트 3 확인 → 4로 이동
  await tiptap.press('Control+Enter'); // 세그먼트 4 확인 → 5로 이동

  // 세그먼트 5의 source 확인
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Translation memory');
});

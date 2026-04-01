import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, openEditor } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'NavTest' });
  await openEditor(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('Arrow Down → 다음 세그먼트 이동', async () => {
  // 첫 세그먼트에서 시작
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
  // EditPanel Source가 두 번째 세그먼트의 source를 표시
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Welcome to mehQ');
});

test('Ctrl+Home → 첫 세그먼트 / Ctrl+End → 마지막', async () => {
  // Ctrl+End → 마지막 세그먼트
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('Control+End');
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Thank you for using mehQ');

  // Ctrl+Home → 첫 세그먼트
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('Control+Home');
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Hello, world!');
});

test('Tab → 다음 세그먼트', async () => {
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.press('Tab');
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Welcome to mehQ');
});

test('Page Down → 10개 이동', async () => {
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('PageDown');
  // 세그먼트 11 (index 10)의 source
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Project dashboard');
});

test('Shift+Tab → 이전 세그먼트', async () => {
  // 먼저 두 번째로 이동
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.press('Tab');
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Welcome to mehQ');

  // Shift+Tab → 첫 세그먼트로
  await tiptap.press('Shift+Tab');
  await expect(ctx.page.locator(SEL.EDIT_PANEL_SOURCE)).toContainText('Hello, world!');
});

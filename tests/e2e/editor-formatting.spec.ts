import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject, openEditor } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'FormatTest' });
  await openEditor(ctx.page);
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('Bold 적용 — 툴바 버튼', async () => {
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.click();

  // 툴바 Bold 버튼 클릭 후 타이핑
  await ctx.page.click(SEL.TOOLBAR_BOLD);
  await ctx.page.keyboard.type('bold text');
  await ctx.page.waitForTimeout(200);

  const html = await tiptap.innerHTML();
  expect(html).toContain('<strong>');
});

test('Italic 적용 — 툴바 버튼', async () => {
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.click();

  await ctx.page.click(SEL.TOOLBAR_ITALIC);
  await ctx.page.keyboard.type('italic text');
  await ctx.page.waitForTimeout(200);

  const html = await tiptap.innerHTML();
  expect(html).toContain('<em>');
});

test('Source→Target 복사 — Ctrl+Shift+S', async () => {
  // 세그먼트 3 (source: "File menu") 으로 이동
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');
  await ctx.page.locator(SEL.TRANSLATION_EDITOR).press('ArrowDown');

  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.click();
  await tiptap.press('Control+Shift+S');
  await ctx.page.waitForTimeout(200);

  const text = await tiptap.textContent();
  expect(text).toContain('File menu');
});

test('툴바 Bold 활성 상태 표시', async () => {
  const tiptap = ctx.page.locator(`${SEL.TIPTAP_EDITOR} .tiptap`);
  await tiptap.click();

  // Bold 활성화
  await ctx.page.click(SEL.TOOLBAR_BOLD);
  await ctx.page.waitForTimeout(100);
  const boldBtn = ctx.page.locator(SEL.TOOLBAR_BOLD);
  await expect(boldBtn).toHaveClass(/toolbar-btn--active/, { timeout: 2000 });

  // Bold 비활성화
  await ctx.page.click(SEL.TOOLBAR_BOLD);
  await ctx.page.waitForTimeout(100);
  await expect(boldBtn).not.toHaveClass(/toolbar-btn--active/, { timeout: 2000 });
});

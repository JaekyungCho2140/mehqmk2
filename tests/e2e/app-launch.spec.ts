import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('앱이 정상 시작됨', async () => {
  const title = await ctx.page.title();
  expect(title).toBe('mehQ');
});

test('최초 실행 시 Wizard 표시', async () => {
  await ctx.page.waitForSelector(SEL.WIZARD_CONTAINER, { timeout: 10000 });
  const wizard = ctx.page.locator(SEL.WIZARD_CONTAINER);
  await expect(wizard).toBeVisible();
});

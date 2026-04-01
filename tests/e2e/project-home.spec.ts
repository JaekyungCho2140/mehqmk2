import { test, expect } from '@playwright/test';
import { launchApp, closeApp, type AppContext } from './helpers/electron';
import { SEL } from './helpers/selectors';
import { completeWizard, createProject } from './helpers/test-utils';

let ctx: AppContext;

test.beforeEach(async () => {
  ctx = await launchApp();
  await completeWizard(ctx.page);
  await createProject(ctx.page, { name: 'HomeProject', client: 'TestCorp' });
  // Project Home 진입
  await ctx.page.locator('.ag-row').first().dblclick();
  await ctx.page.waitForSelector(SEL.PROJECT_HOME, { timeout: 5000 });
});

test.afterEach(async () => {
  await closeApp(ctx);
});

test('General 탭 정보 표시', async () => {
  await expect(ctx.page.locator(SEL.GENERAL_TAB)).toBeVisible();
  await expect(ctx.page.locator('.general-project-name')).toHaveText('HomeProject');
});

test('탭 전환', async () => {
  // General → Reports
  await ctx.page.click(SEL.TAB_REPORTS);
  await expect(ctx.page.locator(SEL.REPORTS_TAB)).toBeVisible();

  // Reports → Settings
  await ctx.page.click(SEL.TAB_SETTINGS);
  await expect(ctx.page.locator(SEL.SETTINGS_TAB)).toBeVisible();

  // Settings → General
  await ctx.page.click(SEL.TAB_GENERAL);
  await expect(ctx.page.locator(SEL.GENERAL_TAB)).toBeVisible();
});

test('Settings 탭 — 이름 변경', async () => {
  await ctx.page.click(SEL.TAB_SETTINGS);
  await ctx.page.waitForSelector(SEL.SETTINGS_TAB, { timeout: 3000 });

  const nameInput = ctx.page.locator(SEL.SETTINGS_NAME_INPUT);
  await nameInput.clear();
  await nameInput.fill('RenamedProject');
  await ctx.page.click(SEL.SETTINGS_SAVE_BTN);

  // Toast 확인
  await expect(ctx.page.locator(SEL.TOAST)).toBeVisible();
  await expect(ctx.page.locator(SEL.TOAST)).toHaveText('저장되었습니다');

  // Dashboard 복귀 → 변경된 이름 확인
  await ctx.page.click(SEL.PROJECT_HOME_BACK_BTN);
  await ctx.page.waitForSelector(SEL.DASHBOARD_CONTAINER, { timeout: 5000 });
  await expect(ctx.page.locator('.ag-cell-value >> text=RenamedProject')).toBeVisible();
});

test('← 버튼 → Dashboard 복귀', async () => {
  await ctx.page.click(SEL.PROJECT_HOME_BACK_BTN);
  await expect(ctx.page.locator(SEL.DASHBOARD_CONTAINER)).toBeVisible({ timeout: 5000 });
});
